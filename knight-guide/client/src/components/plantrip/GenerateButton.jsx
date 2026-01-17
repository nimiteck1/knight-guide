import React from "react";

/**
 * GenerateButton Component - Dark Theme (for landscape layout)
 * Primary CTA button for generating the trip plan
 */
const GenerateButton = ({ onClick, disabled, loading }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className="btn btn-primary"
            style={{
                width: "100%",
                padding: "1rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "var(--radius-lg)",
                opacity: (disabled || loading) ? 0.5 : 1,
                cursor: (disabled || loading) ? "not-allowed" : "pointer",
            }}
        >
            {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <span className="loading-spinner" style={{ width: "18px", height: "18px" }} />
                    Generating...
                </span>
            ) : (
                "🚀 Generate Plan"
            )}
        </button>
    );
};

export default GenerateButton;
