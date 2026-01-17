import React from "react";

/**
 * AIOptions Component - Dark Theme (Compact for landscape)
 * AI toggle switch and crowd selection pills
 */
const AIOptions = ({ aiEnabled, selectedCrowd, onAIToggle, onCrowdChange }) => {
    const crowds = [
        { id: "kids", label: "Kid's Friendly" },
        { id: "family", label: "Family" },
        { id: "friends", label: "Friends" },
    ];

    return (
        <section style={{ marginBottom: "1rem" }}>
            {/* AI Day Plan Toggle */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                padding: "0.875rem 1rem",
                background: "var(--color-bg-elevated)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
            }}>
                <span style={{ color: "var(--color-text-primary)", fontWeight: "500", fontSize: "0.9375rem" }}>AI Day Plan</span>
                <button
                    type="button"
                    role="switch"
                    aria-checked={aiEnabled}
                    onClick={() => onAIToggle(!aiEnabled)}
                    style={{
                        position: "relative",
                        width: "52px",
                        height: "28px",
                        borderRadius: "9999px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                        background: aiEnabled
                            ? "var(--gradient-primary)"
                            : "var(--color-bg-secondary)",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            top: "3px",
                            left: aiEnabled ? "27px" : "3px",
                            width: "22px",
                            height: "22px",
                            background: "#fff",
                            borderRadius: "50%",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                            transition: "left 0.2s ease",
                        }}
                    />
                </button>
            </div>

            {/* Choose your Crowd */}
            <h3 style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.625rem",
                fontWeight: "500"
            }}>
                Choose your Crowd
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {crowds.map((crowd) => (
                    <button
                        key={crowd.id}
                        type="button"
                        onClick={() => onCrowdChange(crowd.id)}
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "9999px",
                            fontSize: "0.8125rem",
                            fontWeight: "500",
                            border: "2px solid",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: selectedCrowd === crowd.id
                                ? "var(--gradient-primary)"
                                : "transparent",
                            color: selectedCrowd === crowd.id
                                ? "#fff"
                                : "var(--color-text-primary)",
                            borderColor: selectedCrowd === crowd.id
                                ? "transparent"
                                : "var(--color-border)",
                            boxShadow: selectedCrowd === crowd.id
                                ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                                : "none",
                        }}
                        aria-pressed={selectedCrowd === crowd.id}
                    >
                        {crowd.label}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default AIOptions;
