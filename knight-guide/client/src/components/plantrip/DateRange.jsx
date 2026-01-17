import React from "react";

/**
 * DateRange Component - Dark Theme
 * Start and end date pickers with calendar icons
 */
const DateRange = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    const inputStyle = {
        width: "100%",
        background: "var(--color-bg-glass)",
        backdropFilter: "blur(20px)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "1rem 1.25rem",
        paddingRight: "3rem",
        color: "var(--color-text-primary)",
        fontWeight: "500",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s ease",
        colorScheme: "dark",
    };

    return (
        <section style={{ marginBottom: "1.5rem" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
            }}>
                {/* Start Date */}
                <div>
                    <label style={{
                        display: "block",
                        fontSize: "0.875rem",
                        color: "var(--color-text-secondary)",
                        marginBottom: "0.5rem",
                        fontWeight: "500"
                    }}>
                        Start Date
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            style={inputStyle}
                        />
                        <span style={{
                            position: "absolute",
                            right: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--color-text-secondary)",
                            pointerEvents: "none",
                            fontSize: "1.25rem",
                        }}>
                            📅
                        </span>
                    </div>
                </div>

                {/* End Date */}
                <div>
                    <label style={{
                        display: "block",
                        fontSize: "0.875rem",
                        color: "var(--color-text-secondary)",
                        marginBottom: "0.5rem",
                        fontWeight: "500"
                    }}>
                        End Date
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            style={inputStyle}
                        />
                        <span style={{
                            position: "absolute",
                            right: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--color-text-secondary)",
                            pointerEvents: "none",
                            fontSize: "1.25rem",
                        }}>
                            📅
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DateRange;
