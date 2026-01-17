import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import { supabase, isSupabaseConfigured } from "./lib/supabaseClient";

// Styles
import "./styles/accessibility.css";

// Components
import VoiceReader from "./components/VoiceReader";

// Pages
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PlanTrip from "./pages/PlanTrip";

import Map from "./pages/Map";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import SignLanguage from "./pages/SignLanguage";
import WellnessDashboard from "./pages/WellnessDashboard";
import ExplorePackages from "./pages/ExplorePackages";

/**
 * Navigation Component
 */
const Navigation = ({ user, userName }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "700",
            fontSize: "1.25rem",
            color: "var(--color-primary)",
            textDecoration: "none",
            zIndex: 102,
          }}
        >
          <img
            src="/logo.jpg"
            alt="Knight Guide Logo"
            style={{ height: "40px", width: "auto" }}
          />
          Knight Guide
        </Link>

        {/* Mobile Menu Button - Visible only on small screens via CSS/Media Query logic usually, 
            but for React we can handle inline or rely on the class */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          style={{
            display: "none", // Overridden by media query
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "var(--color-text-primary)",
          }}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop / Mobile Links Wrapper */}
        <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>

          {/* These links only show when user is logged in */}
          {user && (
            <>
              <Link
                to="/itinerary"
                className={`nav-link ${isActive("/itinerary") ? "active" : ""}`}
                aria-current={isActive("/itinerary") ? "page" : undefined}
              >
                Plan Trip
              </Link>
              <Link
                to="/explore-packages"
                className={`nav-link ${isActive("/explore-packages") ? "active" : ""}`}
                aria-current={isActive("/explore-packages") ? "page" : undefined}
              >
                Explore Packages
              </Link>
            </>
          )}
          <Link
            to="/map"
            className={`nav-link ${isActive("/map") ? "active" : ""}`}
            aria-current={isActive("/map") ? "page" : undefined}
          >
            Map
          </Link>
          <Link
            to="/volunteer"
            className={`nav-link ${isActive("/volunteer") ? "active" : ""}`}
            aria-current={isActive("/volunteer") ? "page" : undefined}
          >
            Volunteer
          </Link>
          <Link
            to="/sign-language"
            className={`nav-link ${isActive("/sign-language") ? "active" : ""}`}
            aria-current={isActive("/sign-language") ? "page" : undefined}
          >
            Sign Language
          </Link>
          <Link
            to="/wellness"
            className={`nav-link ${isActive("/wellness") ? "active" : ""}`}
            aria-current={isActive("/wellness") ? "page" : undefined}
          >
            Wellness
          </Link>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {/* Round Profile Section - Clickable to go to Profile page */}
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  textDecoration: "none",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-md)",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
                aria-label="Go to your profile"
              >
                {/* Profile Avatar */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark, #6366f1))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    fontWeight: "700",
                    color: "#fff",
                    textTransform: "uppercase",
                    boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {(userName || user.email || "U").charAt(0)}
                </div>
                {/* Name and Email */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--color-text-primary)",
                      lineHeight: "1.2",
                    }}
                  >
                    {userName || "User"}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: "1.2",
                    }}
                  >
                    {user.email}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => supabase.auth.signOut()}
                style={{
                  background: "transparent",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`nav-link ${isActive("/login") ? "active" : ""}`}
              aria-current={isActive("/login") ? "page" : undefined}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

/**
 * Home Page Component - Modern Dark Theme
 */
const Home = () => {
  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div className="hero">
          <h1
            className="hero-title animate-fadeIn"
            style={{
              display: "block",
              textAlign: "center",
              fontSize: "2.5rem",
              fontWeight: 800,
              margin: "0.5rem 0",
            }}
          >
            Knight Guide
          </h1>
          <p
            className="hero-subtitle animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            Your accessibility-first AI travel companion. Plan trips tailored to
            your unique needs with intelligent recommendations.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              marginBottom: "3rem",
            }}
            className="animate-fadeIn"
          >
            <Link
              to="/profile"
              className="btn btn-primary"
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              🚀 Get Started
            </Link>
            <Link
              to="/itinerary"
              className="btn btn-secondary"
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}
            >
              ✨ Plan a Trip
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">4.5:1</div>
            <div className="stat-label">Contrast Ratio</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Keyboard Accessible</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">WCAG</div>
            <div className="stat-label">2.2 AA Compliant</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">AI</div>
            <div className="stat-label">Powered Planning</div>
          </div>
        </div>

        {/* Feature Cards - All Clickable */}
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.75rem",
            fontWeight: "700",
            marginBottom: "2rem",
            marginTop: "3rem",
          }}
        >
          Everything You Need
        </h2>

        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {/* Plan Trip Card */}
          <Link
            to="/itinerary"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <span className="feature-icon">🎯</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              AI Trip Planning
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Generate personalized itineraries based on your accessibility
              needs. Smart recommendations for accessible venues.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Plan Now →
            </span>
          </Link>

          {/* Map Card */}
          <Link
            to="/map"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <span className="feature-icon">🗺️</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              Accessibility Map
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Find accessible locations with real-time scores. Filter by
              wheelchair access, hearing loops, braille signage.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Explore Map →
            </span>
          </Link>

          {/* Profile Card */}
          <Link
            to="/profile"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <span className="feature-icon">🆘</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              Emergency Alert
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              One-tap emergency alerts with your location and medical
              information. Safety first, always.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Set Up Profile →
            </span>
          </Link>

          {/* Voice Card - Uses VoiceReader component visible on page */}
          <div
            className="feature-card"
            onClick={() => {
              const voiceBtn = document.querySelector(".voice-btn");
              if (voiceBtn) voiceBtn.click();
            }}
            style={{ cursor: "pointer" }}
          >
            <span className="feature-icon">🔊</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              Voice Assistance
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Built-in text-to-speech reads any content aloud. Adjustable speed
              and voice selection.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Try Voice Reader →
            </span>
          </div>

          {/* Volunteer Card */}
          <Link
            to="/volunteer"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <span className="feature-icon">🤝</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              Volunteer Hub
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Join our community of accessibility guardians. Verify locations
              and earn rewards.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Join Mission →
            </span>
          </Link>

          {/* Sign Language Card */}
          <Link
            to="/sign-language"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <span className="feature-icon">🤟</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              Sign Language
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Text-to-Sign converter and interpretation resources to bridge
              communication gaps.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Start Translating →
            </span>
          </Link>

          {/* Explore Packages Card */}
          <Link
            to="/explore-packages"
            className="feature-card"
            style={{ textDecoration: "none" }}
          >
            <span className="feature-icon">🌍</span>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "var(--color-text-primary)",
              }}
            >
              Explore Packages
            </h3>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Discover curated travel packages with accessibility features for
              your next adventure.
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1rem",
                color: "var(--color-primary-light)",
                fontWeight: "600",
                fontSize: "0.875rem",
              }}
            >
              Browse Packages →
            </span>
          </Link>
        </div>

        {/* CTA Section */}
        <div
          style={{
            marginTop: "4rem",
            padding: "3rem",
            background: "var(--color-bg-glass)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
            }}
          >
            Ready to Travel Accessibly?
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
            }}
          >
            Set up your accessibility profile once, and we'll personalize every
            trip recommendation for you.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/profile" className="btn btn-primary">
              Create Your Profile
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes and fetch user profile
  useEffect(() => {
    // If Supabase is not configured, skip auth check and show the app
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Running in demo mode without authentication.');
      setLoading(false);
      return;
    }

    // Check initial session first with a timeout
    const checkSession = async () => {
      try {
        // Add timeout to prevent infinite loading if Supabase is unreachable
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );

        const sessionPromise = supabase.auth.getSession();
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("name")
              .eq("id", currentUser.id)
              .single();
            setUserName(profile?.name || "");
          } catch (e) {
            console.error("Error fetching profile:", e);
          }
        }
      } catch (e) {
        console.error("Error checking session:", e);
        // Continue loading the app even if session check fails
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes for future updates
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Fetch user's name from profile
      if (currentUser) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("id", currentUser.id)
            .single();
          setUserName(profile?.name || "");
        } catch (e) {
          console.error("Error fetching profile:", e);
        }
      } else {
        setUserName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="status"
      >
        <div style={{ textAlign: "center" }}>
          <span
            className="loading-spinner"
            style={{ display: "block", margin: "0 auto 1rem" }}
          />
          <p>Loading Knight Guide...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* Skip to main content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navigation user={user} userName={userName} />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login supabase={supabase} />} />
          <Route path="/profile" element={<Profile user={user} supabase={supabase} />} />
          <Route
            path="/itinerary"
            element={user ? <PlanTrip /> : <Navigate to="/login" replace />}
          />
          <Route path="/map" element={<Map user={user} supabase={supabase} />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/sign-language" element={<SignLanguage />} />
          <Route path="/wellness" element={<WellnessDashboard />} />
          <Route
            path="/explore-packages"
            element={user ? <ExplorePackages /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Voice Reader - available on all pages */}
      <VoiceReader />

      {/* Footer */}
      <footer className="footer">
        <p className="footer-tagline">
          Knight Guide - Accessibility is not a feature. It is the floor.
        </p>
        <p>
          WCAG 2.2 AA Compliant • Keyboard Accessible • Screen Reader Friendly
        </p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
