import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccessibleButton from "../components/AccessibleButton";
import EmergencyButton from "../components/EmergencyButton";
import PhoneInput from "../components/PhoneInput";
import { supabase } from "../lib/supabaseClient";
/* 
 * Moved check inside component
 */

/**
 * Profile Page - User accessibility profile management
 */
const Profile = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center", paddingTop: "3rem" }}>
          <p>Redirecting to login…</p>
        </div>
      </div>
    );
  }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const [profile, setProfile] = useState({
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

  const accessibilityOptions = [
    { id: "wheelchair", label: "Wheelchair User" },
    { id: "walker", label: "Walker/Mobility Aid" },
    { id: "limited-walking", label: "Limited Walking Distance" },
    { id: "blind", label: "Blind/Low Vision" },
    { id: "color-blind", label: "Color Blind" },
    { id: "deaf", label: "Deaf/Hard of Hearing" },
    { id: "hearing-aid", label: "Hearing Aid User" },
    { id: "cognitive", label: "Cognitive/Learning Disability" },
    { id: "anxiety", label: "Anxiety/Sensory Sensitivity" },
    { id: "service-animal", label: "Service Animal" },
  ];

  // LOAD PROFILE
  // LOAD PROFILE
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      // 🔒 Check session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        // Not logged in, let parent/auth listener handle redirect or show check message
        return;
      }

      setLoading(true);
      const currentUser = sessionData.session.user;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // Real error (not just empty result)
          console.error("Error loading profile:", error);
        }

        if (mounted && data) {
          setProfile((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error("Unexpected error loading profile:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [navigate]); // Removed 'user' dependency to rely on getSession for "fresh" check

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleNeed = (id) => {
    setProfile((prev) => ({
      ...prev,
      accessibilityNeeds: prev.accessibilityNeeds.includes(id)
        ? prev.accessibilityNeeds.filter((n) => n !== id)
        : [...prev.accessibilityNeeds, id],
    }));
    setSaved(false);
  };

  // SAVE PROFILE
  const handleSave = async () => {
    setSaving(true);
    setAnnouncement("");

    // Get current user again to be safe
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    if (!currentUser) {
      setAnnouncement("Error: You must be logged in to save.");
      setSaving(false);
      return;
    }

    const updates = {
      id: currentUser.id, // Needed for upsert to know which row
      email: currentUser.email,
      ...profile,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(updates);

    if (!error) {
      setSaved(true);
      setAnnouncement("Profile saved successfully");
    } else {
      console.error(error);
      setAnnouncement("Error saving profile: " + error.message);
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center", paddingTop: "3rem" }}>
          <p>Loading profile…</p>
        </div>
      </div>
    );
  }


  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1>Your Accessibility Profile</h1>

        {/* BASIC INFO */}
        <section className="card">
          <label>Full Name</label>
          <input
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <PhoneInput
            label="Phone"
            value={profile.phone}
            onChange={(val) => handleChange("phone", val)}
          />
        </section>

        {/* ACCESSIBILITY */}
        <section className="card">
          {accessibilityOptions.map((opt) => (
            <label key={opt.id}>
              <input
                type="checkbox"
                checked={profile.accessibilityNeeds.includes(opt.id)}
                onChange={() => toggleNeed(opt.id)}
              />
              {opt.label}
            </label>
          ))}
        </section>

        {/* EMERGENCY */}
        <section className="card">
          <label>Emergency Name</label>
          <input
            value={profile.emergencyContactName}
            onChange={(e) =>
              handleChange("emergencyContactName", e.target.value)
            }
          />

          <PhoneInput
            label="Emergency Phone"
            value={profile.emergencyContactPhone}
            onChange={(val) =>
              handleChange("emergencyContactPhone", val)
            }
          />

          <label>Relation</label>
          <input
            value={profile.emergencyContactRelation}
            onChange={(e) =>
              handleChange("emergencyContactRelation", e.target.value)
            }
          />
        </section>

        {/* MEDICAL */}
        <section className="card">
          <label>Medical Notes</label>
          <textarea
            rows={4}
            value={profile.medicalNotes}
            onChange={(e) => handleChange("medicalNotes", e.target.value)}
          />
        </section>

        <AccessibleButton loading={saving} onClick={handleSave}>
          {saved ? "✓ Saved" : "Save Profile"}
        </AccessibleButton>

        <AccessibleButton
          variant="secondary"
          onClick={() => navigate("/itinerary")}
        >
          Plan Trip →
        </AccessibleButton>

        <EmergencyButton userProfile={profile} />

        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>
    </div>
  );
};

export default Profile;
