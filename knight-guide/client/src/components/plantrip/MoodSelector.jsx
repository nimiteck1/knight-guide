import React from "react";

/**
 * MoodSelector Component - Dark Theme
 * Pill-style buttons for selecting trip mood (single selection)
 */
const MoodSelector = ({ selectedMood, onMoodChange }) => {
    const moods = [
        { id: "nature", label: "Nature", emoji: "🌲" },
        { id: "party", label: "Party", emoji: "🎉" },
        { id: "beach", label: "Beach", emoji: "🏖️" },
    ];

    return (
        <section style={{ marginBottom: "1.5rem" }}>
            <h3 style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                marginBottom: "0.75rem",
                fontWeight: "500"
            }}>
                Choose your Mood
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {moods.map((mood) => (
                    <button
                        key={mood.id}
                        type="button"
                        onClick={() => onMoodChange(mood.id)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.625rem 1.25rem",
                            borderRadius: "9999px",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            border: "2px solid",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: selectedMood === mood.id
                                ? "var(--gradient-primary)"
                                : "var(--color-bg-glass)",
                            color: selectedMood === mood.id
                                ? "#fff"
                                : "var(--color-text-primary)",
                            borderColor: selectedMood === mood.id
                                ? "transparent"
                                : "var(--color-border)",
                            boxShadow: selectedMood === mood.id
                                ? "0 4px 15px rgba(99, 102, 241, 0.4)"
                                : "none",
                        }}
                        aria-pressed={selectedMood === mood.id}
                    >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

export default MoodSelector;
