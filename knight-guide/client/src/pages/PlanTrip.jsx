import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// Import components
import MoodSelector from "../components/plantrip/MoodSelector";
import LocationCard from "../components/plantrip/LocationCard";
import DateRange from "../components/plantrip/DateRange";
import AIOptions from "../components/plantrip/AIOptions";
import Preferences from "../components/plantrip/Preferences";
import GenerateButton from "../components/plantrip/GenerateButton";
import ItineraryResult from "../components/plantrip/ItineraryResult";

/**
 * PlanTrip Page - Desktop Landscape Layout
 * Wide horizontal layout optimized for desktop screens
 */
const PlanTrip = () => {
    // Form state
    const [mood, setMood] = useState("");
    const [location, setLocation] = useState("");
    const [radius, setRadius] = useState(5);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [aiEnabled, setAIEnabled] = useState(true);
    const [crowd, setCrowd] = useState("");
    const [preferences, setPreferences] = useState({
        // Safety & Emergency
        nearHospitals: false,
        showNearestHospital: true,
        emergencyRestStops: false,
        avoidIsolated: true,
        hospitalProximity: "5km",
        // Accessibility & Mobility
        wheelchairFriendly: false,
        avoidStairs: false,
        accessibleRestrooms: false,
        accessibleParking: false,
        serviceAnimal: false,
        strictAccessibility: false,
        // Route & Navigation
        avoidCrowded: false,
        shortestDistance: false,
        smoothPaths: false,
        scenicRoutes: true,
        // Dietary Preferences
        mealPlan: true,
        culinary: false,
        halal: false,
    });
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [error, setError] = useState("");

    // Handlers
    const handlePreferenceChange = (id, checked) => {
        setPreferences((prev) => ({ ...prev, [id]: checked }));
    };

    const handleAdjustRadius = () => {
        const options = [5, 10, 15, 25, 50];
        const currentIndex = options.indexOf(radius);
        const nextIndex = (currentIndex + 1) % options.length;
        setRadius(options[nextIndex]);
    };

    const generateMockItinerary = (location, startDate, endDate, mood, preferences) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);

        const days = [];
        for (let i = 0; i < dayCount; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            const dateStr = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

            days.push({
                day: i + 1,
                title: `Day ${i + 1} - ${dateStr}`,
                activities: [
                    {
                        time: "9:00 AM",
                        activity: `Morning exploration of ${location} - ${mood === "adventure" ? "hiking trails" : mood === "relaxing" ? "peaceful gardens" : "local attractions"}`,
                        accessibility: preferences.wheelchairFriendly ? "Fully wheelchair accessible paths" : "Standard accessibility"
                    },
                    {
                        time: "12:00 PM",
                        activity: `Lunch at accessible restaurant in ${location}`,
                        accessibility: preferences.accessibleRestrooms ? "Accessible restrooms available" : "Restaurant with standard facilities"
                    },
                    {
                        time: "2:00 PM",
                        activity: `Afternoon ${mood === "cultural" ? "museum visit" : mood === "adventure" ? "outdoor activity" : "sightseeing"}`,
                        accessibility: preferences.avoidStairs ? "Ground floor access, elevator available" : "Multiple floors with some stairs"
                    },
                    {
                        time: "6:00 PM",
                        activity: `Evening dining experience with local cuisine`,
                        accessibility: preferences.halal ? "Halal options available" : "Diverse menu options"
                    }
                ]
            });
        }

        return {
            tripSummary: `Your ${dayCount}-day ${mood || "personalized"} trip to ${location}, designed with your accessibility preferences in mind.`,
            accessibilityNotes: `This itinerary has been optimized for: ${[
                preferences.wheelchairFriendly && "wheelchair access",
                preferences.avoidStairs && "minimal stairs",
                preferences.accessibleRestrooms && "accessible restrooms",
                preferences.nearHospitals && "proximity to medical facilities"
            ].filter(Boolean).join(", ") || "general accessibility"}`,
            days
        };
    };

    const handleGeneratePlan = async () => {
        setLoading(true);
        setError("");
        setItinerary(null);

        try {
            // Build user needs context from preferences for the Edge Function
            const userNeedsContext = {
                mobility: {
                    wheelchairAccess: preferences.wheelchairFriendly,
                    avoidStairs: preferences.avoidStairs,
                    accessibleParking: preferences.accessibleParking,
                },
                safety: {
                    nearHospitals: preferences.nearHospitals,
                    hospitalProximity: preferences.hospitalProximity,
                    avoidIsolated: preferences.avoidIsolated,
                },
                dietary: {
                    halal: preferences.halal,
                    mealPlan: preferences.mealPlan,
                },
                other: {
                    serviceAnimal: preferences.serviceAnimal,
                    accessibleRestrooms: preferences.accessibleRestrooms,
                }
            };

            const { data, error: fnError } = await supabase.functions.invoke('generate-itinerary', {
                body: {
                    location,
                    startDate,
                    endDate,
                    mood,
                    userNeedsContext,
                },
            });

            if (fnError) {
                throw fnError;
            }

            if (!data?.success) {
                throw new Error(data?.error || 'Failed to generate itinerary');
            }

            setItinerary(data.itinerary);
        } catch (err) {
            console.error("Edge function failed, using mock:", err);
            // Fallback to mock itinerary
            const mockItinerary = generateMockItinerary(location, startDate, endDate, mood, preferences);
            setItinerary(mockItinerary);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseItinerary = () => {
        setItinerary(null);
    };

    return (
        <div className="page" style={{ padding: "2rem 3rem" }}>
            {/* Header */}
            <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2rem",
                maxWidth: "1400px",
                margin: "0 auto 2rem auto",
            }}>
                <Link
                    to="/"
                    style={{
                        padding: "0.5rem 1rem",
                        color: "var(--color-text-secondary)",
                        textDecoration: "none",
                        fontSize: "1.25rem",
                        marginRight: "1rem",
                    }}
                    aria-label="Go back"
                >
                    ← Back
                </Link>
                <h1 style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    color: "var(--color-text-primary)",
                    margin: 0,
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}>
                    Create Your Trip Plan
                </h1>
            </div>

            {/* Main Grid - Landscape Layout */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1.5fr",
                gap: "2rem",
                maxWidth: "1500px",
                margin: "0 auto",
                alignItems: "start",
            }}>
                {/* Left Column */}
                <div style={{
                    background: "var(--color-bg-glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                }}>
                    <h2 style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--color-text-primary)",
                        marginBottom: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <span>🎯</span> Trip Details
                    </h2>
                    <MoodSelector selectedMood={mood} onMoodChange={setMood} />
                    <LocationCard
                        location={location}
                        radius={radius}
                        onLocationChange={setLocation}
                        onRadiusChange={setRadius}
                        onAdjust={handleAdjustRadius}
                    />
                </div>

                {/* Center Column */}
                <div style={{
                    background: "var(--color-bg-glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                }}>
                    <h2 style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--color-text-primary)",
                        marginBottom: "1.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <span>📅</span> Schedule
                    </h2>
                    <DateRange
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                    <AIOptions
                        aiEnabled={aiEnabled}
                        selectedCrowd={crowd}
                        onAIToggle={setAIEnabled}
                        onCrowdChange={setCrowd}
                    />
                </div>

                {/* Right Column - Preferences with scroll */}
                <div style={{
                    background: "var(--color-bg-glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    maxHeight: "calc(100vh - 180px)",
                }}>
                    <h2 style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        color: "var(--color-text-primary)",
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        flexShrink: 0,
                    }}>
                        <span>⚙️</span> Preferences
                    </h2>
                    {/* Scrollable Preferences Container */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        paddingRight: "0.5rem",
                        marginBottom: "1rem",
                    }}>
                        <Preferences
                            preferences={preferences}
                            onPreferenceChange={handlePreferenceChange}
                        />
                    </div>
                    {/* Sticky Generate Button */}
                    <div style={{
                        flexShrink: 0,
                        paddingTop: "0.75rem",
                        borderTop: "1px solid var(--color-border)",
                    }}>
                        <GenerateButton
                            onClick={handleGeneratePlan}
                            disabled={!location || !startDate || !endDate}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div style={{
                    maxWidth: "1500px",
                    margin: "2rem auto 0 auto",
                    padding: "1rem 1.5rem",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "var(--radius-lg)",
                    color: "#f87171",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button
                        onClick={() => setError("")}
                        style={{
                            marginLeft: "auto",
                            background: "transparent",
                            border: "none",
                            color: "#f87171",
                            cursor: "pointer",
                            fontSize: "1.25rem",
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Itinerary Result */}
            {itinerary && (
                <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
                    <ItineraryResult
                        itinerary={itinerary}
                        location={location}
                        onClose={handleCloseItinerary}
                    />
                </div>
            )}

            {/* Responsive: Stack on smaller screens */}
            <style>{`
        @media (max-width: 1024px) {
          .page > div:last-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .page > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default PlanTrip;
