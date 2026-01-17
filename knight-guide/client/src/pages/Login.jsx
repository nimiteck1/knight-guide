import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccessibleButton from "../components/AccessibleButton";
import { supabase } from "../lib/supabaseClient";

/**
 * Login Page - Accessible authentication
 */
const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  // 🔑 Ensure profile exists in Supabase
  const ensureProfileExists = async (user) => {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!data) {
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        updated_at: new Date().toISOString(),
        name: "",
        phone: "",
        accessibilityNeeds: [],
        mobilityDetails: "",
        visionDetails: "",
        hearingDetails: "",
        cognitiveDetails: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
        medicalNotes: "",
      });

      if (error) {
        console.error("Error creating profile:", error);
        throw error;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAnnouncement("");

    try {
      if (!isLogin) {
        // 🔹 SIGNUP FLOW
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // Success message
        setAnnouncement("Account created successfully. Please sign in.");
        alert("Account created successfully! Redirecting to login...");

        // Redirect to login view
        setIsLogin(true);
        navigate("/login");
      } else {
        // 🔹 LOGIN FLOW
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setAnnouncement("Login successful. Redirecting to profile.");

        // Redirect to profile
        navigate("/profile");
      }
    } catch (err) {
      setError(err.message);
      setAnnouncement(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "480px" }}>
        <div className="card" style={{ marginTop: "2rem" }}>
          <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {!isLogin && (
              <>
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </>
            )}

            {error && (
              <div style={{ color: "red", marginTop: "0.5rem" }}>
                {error}
              </div>
            )}

            <AccessibleButton
              type="submit"
              loading={loading}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {isLogin ? "Sign In" : "Create Account"}
            </AccessibleButton>
          </form>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <AccessibleButton
              variant="secondary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </AccessibleButton>
          </div>

          <div aria-live="polite" className="sr-only">
            {announcement}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
