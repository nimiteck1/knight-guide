import React from "react";

/**
 * ItineraryResult Component - Displays AI-generated travel itinerary
 * Dark theme with expandable day sections
 */
const ItineraryResult = ({ itinerary, onClose }) => {
    if (!itinerary) return null;

    // Handle raw text response (parsing failed)
    if (itinerary.rawItinerary) {
        return (
            <div style={{
                marginTop: "2rem",
                background: "var(--color-bg-glass)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                padding: "2rem",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "var(--color-text-primary)", margin: 0 }}>
                        🗺️ Your Travel Itinerary
                    </h2>
                    {onClose && (
                        <button onClick={onClose} style={{
                            background: "transparent",
                            border: "1px solid var(--color-border)",
                            color: "var(--color-text-secondary)",
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-md)",
                            cursor: "pointer",
                        }}>
                            ✕ Close
                        </button>
                    )}
                </div>
                <pre style={{
                    whiteSpace: "pre-wrap",
                    color: "var(--color-text-primary)",
                    fontSize: "0.9rem",
                    lineHeight: "1.6",
                }}>
                    {itinerary.rawItinerary}
                </pre>
            </div>
        );
    }

    return (
        <div style={{
            marginTop: "2rem",
            background: "var(--color-bg-glass)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "2rem",
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{
                        fontSize: "1.75rem",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                        margin: "0 0 0.5rem 0",
                        background: "var(--gradient-primary)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        🗺️ {itinerary.tripTitle || "Your Travel Itinerary"}
                    </h2>
                    {itinerary.summary && (
                        <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: "1rem" }}>
                            {itinerary.summary}
                        </p>
                    )}
                </div>
                {onClose && (
                    <button onClick={onClose} style={{
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-secondary)",
                        padding: "0.5rem 1rem",
                        borderRadius: "var(--radius-md)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}>
                        ✕ Close
                    </button>
                )}
            </div>

            {/* Days */}
            {itinerary.days && itinerary.days.map((day, dayIndex) => (
                <div key={dayIndex} style={{
                    marginBottom: "1.5rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginBottom: "1rem",
                    }}>
                        <span style={{
                            background: "var(--gradient-primary)",
                            color: "#fff",
                            padding: "0.5rem 1rem",
                            borderRadius: "var(--radius-md)",
                            fontWeight: "700",
                            fontSize: "0.875rem",
                        }}>
                            Day {day.dayNumber}
                        </span>
                        <span style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                            {day.date}
                        </span>
                        {day.theme && (
                            <span style={{
                                color: "var(--color-primary-light)",
                                fontSize: "0.875rem",
                                fontWeight: "500",
                            }}>
                                • {day.theme}
                            </span>
                        )}
                    </div>

                    {/* Activities */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {day.activities && day.activities.map((activity, actIndex) => (
                            <div key={actIndex} style={{
                                display: "grid",
                                gridTemplateColumns: "80px 1fr",
                                gap: "1rem",
                                paddingLeft: "0.5rem",
                                borderLeft: "2px solid var(--color-primary)",
                            }}>
                                <span style={{
                                    color: "var(--color-primary-light)",
                                    fontWeight: "600",
                                    fontSize: "0.875rem",
                                }}>
                                    {activity.time}
                                </span>
                                <div>
                                    <h4 style={{
                                        color: "var(--color-text-primary)",
                                        fontWeight: "600",
                                        fontSize: "1rem",
                                        margin: "0 0 0.25rem 0",
                                    }}>
                                        {activity.title}
                                    </h4>
                                    <p style={{
                                        color: "var(--color-text-secondary)",
                                        fontSize: "0.875rem",
                                        margin: "0 0 0.5rem 0",
                                    }}>
                                        {activity.description}
                                    </p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.75rem" }}>
                                        {activity.location && (
                                            <span style={{
                                                background: "rgba(139, 92, 246, 0.15)",
                                                color: "var(--color-primary-light)",
                                                padding: "0.25rem 0.5rem",
                                                borderRadius: "var(--radius-sm)",
                                            }}>
                                                📍 {activity.location}
                                            </span>
                                        )}
                                        {activity.duration && (
                                            <span style={{
                                                background: "rgba(59, 130, 246, 0.15)",
                                                color: "#60a5fa",
                                                padding: "0.25rem 0.5rem",
                                                borderRadius: "var(--radius-sm)",
                                            }}>
                                                ⏱️ {activity.duration}
                                            </span>
                                        )}
                                        {activity.accessibilityNotes && (
                                            <span style={{
                                                background: "rgba(34, 197, 94, 0.15)",
                                                color: "#4ade80",
                                                padding: "0.25rem 0.5rem",
                                                borderRadius: "var(--radius-sm)",
                                            }}>
                                                ♿ {activity.accessibilityNotes}
                                            </span>
                                        )}
                                    </div>
                                    {activity.tips && (
                                        <p style={{
                                            color: "var(--color-text-secondary)",
                                            fontSize: "0.8rem",
                                            fontStyle: "italic",
                                            margin: "0.5rem 0 0 0",
                                        }}>
                                            💡 {activity.tips}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* Travel Tips */}
            {itinerary.travelTips && itinerary.travelTips.length > 0 && (
                <div style={{
                    marginTop: "1.5rem",
                    padding: "1.25rem",
                    background: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                }}>
                    <h3 style={{ color: "#60a5fa", fontSize: "1rem", fontWeight: "600", margin: "0 0 0.75rem 0" }}>
                        💡 Travel Tips
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--color-text-secondary)" }}>
                        {itinerary.travelTips.map((tip, i) => (
                            <li key={i} style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Accessibility Highlights */}
            {itinerary.accessibilityHighlights && itinerary.accessibilityHighlights.length > 0 && (
                <div style={{
                    marginTop: "1rem",
                    padding: "1.25rem",
                    background: "rgba(34, 197, 94, 0.1)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid rgba(34, 197, 94, 0.2)",
                }}>
                    <h3 style={{ color: "#4ade80", fontSize: "1rem", fontWeight: "600", margin: "0 0 0.75rem 0" }}>
                        ♿ Accessibility Highlights
                    </h3>
                    <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "var(--color-text-secondary)" }}>
                        {itinerary.accessibilityHighlights.map((item, i) => (
                            <li key={i} style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Emergency Info */}
            {itinerary.emergencyInfo && (
                <div style={{
                    marginTop: "1rem",
                    padding: "1.25rem",
                    background: "rgba(239, 68, 68, 0.1)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                }}>
                    <h3 style={{ color: "#f87171", fontSize: "1rem", fontWeight: "600", margin: "0 0 0.75rem 0" }}>
                        🚨 Emergency Information
                    </h3>
                    <div style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
                        {itinerary.emergencyInfo.nearestHospital && (
                            <p style={{ margin: "0 0 0.5rem 0" }}>
                                🏥 <strong>Nearest Hospital:</strong> {itinerary.emergencyInfo.nearestHospital}
                            </p>
                        )}
                        {itinerary.emergencyInfo.emergencyNumber && (
                            <p style={{ margin: 0 }}>
                                📞 <strong>Emergency:</strong> {itinerary.emergencyInfo.emergencyNumber}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItineraryResult;
