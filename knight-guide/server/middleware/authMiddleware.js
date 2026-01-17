import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase Client initialized successfully');
} else {
    console.warn('Supabase credentials not found. Auth middleware will use demo mode.');
}

/**
 * Authentication middleware
 * Verifies Supabase JWT tokens for protected routes
 */
export async function authMiddleware(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Demo mode: allow requests without auth in development
            if (process.env.NODE_ENV !== 'production') {
                req.user = {
                    id: 'demo-user',
                    email: 'demo@knight-guide.app',
                    demoMode: true
                };
                return next();
            }

            return res.status(401).json({
                error: 'No authorization token provided',
                code: 'MISSING_TOKEN'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verify token with Supabase
        if (supabase) {
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error) throw error;

            req.user = {
                id: user.id,
                email: user.email,
                emailVerified: user.email_confirmed_at,
                demoMode: false
            };
        } else {
            // Demo mode fallback
            if (process.env.NODE_ENV !== 'production') {
                req.user = {
                    id: 'demo-user',
                    email: 'demo@knight-guide.app',
                    demoMode: true
                };
            } else {
                return res.status(503).json({
                    error: 'Authentication service unavailable',
                    code: 'AUTH_SERVICE_UNAVAILABLE'
                });
            }
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);

        // Map Supabase errors if needed
        return res.status(401).json({
            error: 'Invalid token',
            code: 'INVALID_TOKEN',
            details: error.message
        });
    }
}

/**
 * Optional auth middleware - doesn't require auth but adds user if available
 */
export async function optionalAuthMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ') && supabase) {
            const token = authHeader.split('Bearer ')[1];
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (!error && user) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    demoMode: false
                };
            }
        }
    } catch (error) {
        // Ignore auth errors for optional auth
        console.log('Optional auth skipped:', error.message);
    }

    next();
}

export default authMiddleware;
