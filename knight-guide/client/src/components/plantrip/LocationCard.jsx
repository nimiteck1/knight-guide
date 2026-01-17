import React from "react";

/**
 * LocationCard Component - Dark Theme
 * Location input with radius selector - Editable with light placeholder
 */
const LocationCard = ({ location, radius, onLocationChange, onRadiusChange, onAdjust }) => {
    return (
        <section style={{ marginBottom: "1.5rem" }}>
            {/* Location Section */}
            <h3 style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.75rem",
                fontWeight: "500"
            }}>
                Location
            </h3>
            <div style={{
                background: "var(--color-bg-glass)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.25rem",
                marginBottom: "1rem",
                transition: "border-color 0.2s ease",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ color: "var(--color-text-secondary)", fontSize: "1.25rem" }}>📍</span>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder="Enter your location..."
                        style={{
                            flex: 1,
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "var(--color-text-primary)",
                            fontWeight: "500",
                            fontSize: "1rem",
                        }}
                    />
                </div>
            </div>

            {/* Find Place Within Section */}
            <h3 style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.75rem",
                fontWeight: "500"
            }}>
                Find Place Within
            </h3>
            <div style={{
                background: "var(--color-bg-glass)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem 1.25rem",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ color: "var(--color-text-secondary)", fontSize: "1.25rem" }}>⊕</span>
                        <span style={{ color: "var(--color-text-primary)", fontWeight: "500" }}>{radius} mi</span>
                    </div>
                    <button
                        type="button"
                        onClick={onAdjust}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--color-primary-light)",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            cursor: "pointer",
                            padding: "0.5rem",
                            transition: "color 0.2s ease",
                        }}
                    >
                        Adjust
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LocationCard;
