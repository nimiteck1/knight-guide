import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * ItineraryResult Component - Dark Theme
 * Displays the AI-generated travel itinerary with accessibility information
 */
const ItineraryResult = ({ itinerary, location, onClose, onSave }) => {
    const [expandedDay, setExpandedDay] = useState(0);
    const [saving, setSaving] = useState(false);
    const printRef = useRef();
    const navigate = useNavigate();

    if (!itinerary) return null;

    const { tripSummary, accessibilityNotes, days } = itinerary;

    const toggleDay = (dayIndex) => {
        setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex);
    };

    // Handle Save Itinerary
    const handleSave = () => {
        setSaving(true);

        // Create package from itinerary
        const savedPackage = {
            id: Date.now(),
            Package_Name: `${location || "Custom"} Trip`,
            Destination: location || "Custom Location",
            Country: "Custom",
            Duration_Days: days?.length || 1,
            Price_USD: 0, // User-generated itinerary
            Accommodation_Type: "Various",
            Transport_Mode: "Various",
            Season: "All",
            Accessibility_Level: "Custom",
            Description: tripSummary || "Custom generated itinerary",
            Rating: 0,
            Available_Slots: 1,
            Guide_Included: false,
            Category: "My Itineraries",
            Discount_Percent: 0,
            Meals_Included: false,
            isUserGenerated: true,
            itinerary: itinerary,
            accessibilityNotes: accessibilityNotes,
            createdAt: new Date().toISOString(),
            image: `https://source.unsplash.com/400x300/?${encodeURIComponent(location || "travel")}`,
        };

        // Get existing saved itineraries
        const existing = JSON.parse(localStorage.getItem("savedItineraries") || "[]");
        existing.unshift(savedPackage);
        localStorage.setItem("savedItineraries", JSON.stringify(existing));

        // Callback and navigate
        if (onSave) onSave(savedPackage);

        setTimeout(() => {
            setSaving(false);
            navigate("/explore-packages");
        }, 500);
    };

    // Handle Share as PDF
    const handleShare = () => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${location || "Travel"} Itinerary - Knight Guide</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        padding: 40px;
                        color: #1f2937;
                        line-height: 1.6;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #6366f1;
                    }
                    .header h1 {
                        color: #6366f1;
                        font-size: 28px;
                        margin-bottom: 10px;
                    }
                    .header p {
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .summary {
                        background: #f3f4f6;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                    }
                    .summary h2 {
                        color: #4f46e5;
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                    .accessibility {
                        background: #ecfdf5;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                        border-left: 4px solid #10b981;
                    }
                    .accessibility h2 {
                        color: #059669;
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                    .day {
                        margin-bottom: 25px;
                        page-break-inside: avoid;
                    }
                    .day-header {
                        background: #6366f1;
                        color: white;
                        padding: 12px 20px;
                        border-radius: 8px 8px 0 0;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    .day-number {
                        background: white;
                        color: #6366f1;
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                    }
                    .day-title {
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .activities {
                        border: 1px solid #e5e7eb;
                        border-top: none;
                        border-radius: 0 0 8px 8px;
                        padding: 15px;
                    }
                    .activity {
                        display: flex;
                        gap: 15px;
                        padding: 12px 0;
                        border-bottom: 1px solid #f3f4f6;
                    }
                    .activity:last-child {
                        border-bottom: none;
                    }
                    .time {
                        color: #6366f1;
                        font-weight: 600;
                        min-width: 80px;
                    }
                    .activity-details {
                        flex: 1;
                    }
                    .activity-name {
                        margin-bottom: 5px;
                    }
                    .activity-access {
                        color: #059669;
                        font-size: 13px;
                        background: #ecfdf5;
                        padding: 4px 8px;
                        border-radius: 4px;
                        display: inline-block;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #9ca3af;
                        font-size: 12px;
                        padding-top: 20px;
                        border-top: 1px solid #e5e7eb;
                    }
                    @media print {
                        body { padding: 20px; }
                        .day { page-break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✨ ${location || "Travel"} Itinerary</h1>
                    <p>Generated by Knight Guide - Your Accessibility-First Travel Companion</p>
                </div>
                
                ${tripSummary ? `
                <div class="summary">
                    <h2>📋 Trip Overview</h2>
                    <p>${tripSummary}</p>
                </div>
                ` : ''}
                
                ${accessibilityNotes ? `
                <div class="accessibility">
                    <h2>♿ Accessibility Notes</h2>
                    <p>${accessibilityNotes}</p>
                </div>
                ` : ''}
                
                ${days?.map(day => `
                <div class="day">
                    <div class="day-header">
                        <div class="day-number">${day.day}</div>
                        <div class="day-title">${day.title}</div>
                    </div>
                    <div class="activities">
                        ${day.activities?.map(act => `
                        <div class="activity">
                            <div class="time">${act.time}</div>
                            <div class="activity-details">
                                <div class="activity-name">${act.activity}</div>
                                ${act.accessibility ? `<span class="activity-access">♿ ${act.accessibility}</span>` : ''}
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                `).join('')}
                
                <div class="footer">
                    <p>Generated on ${new Date().toLocaleDateString()} by Knight Guide</p>
                    <p>Accessibility is not a feature. It is the floor.</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
    };

    return (
        <div style={{
            marginTop: "2rem",
            background: "var(--color-bg-glass)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            padding: "2rem",
            animation: "fadeIn 0.3s ease-out",
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
            }}>
                <div>
                    <h2 style={{
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <span>✨</span> Your {location || ""} Itinerary
                    </h2>
                    <p style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "0.875rem",
                        marginTop: "0.5rem",
                    }}>
                        {days?.length || 0} days of accessible adventures
                    </p>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)",
                        color: "var(--color-text-secondary)",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.15)";
                        e.target.style.color = "var(--color-text-primary)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.1)";
                        e.target.style.color = "var(--color-text-secondary)";
                    }}
                >
                    ✕ Close
                </button>
            </div>

            {/* Trip Summary */}
            {tripSummary && (
                <div style={{
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.25rem",
                    marginBottom: "1rem",
                }}>
                    <h3 style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#a78bfa",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <span>📋</span> Trip Overview
                    </h3>
                    <p style={{
                        color: "var(--color-text-primary)",
                        fontSize: "0.9375rem",
                        lineHeight: "1.6",
                        margin: 0,
                    }}>
                        {tripSummary}
                    </p>
                </div>
            )}

            {/* Accessibility Notes */}
            {accessibilityNotes && (
                <div style={{
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.25rem",
                    marginBottom: "1.5rem",
                }}>
                    <h3 style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#34d399",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}>
                        <span>♿</span> Accessibility Notes
                    </h3>
                    <p style={{
                        color: "var(--color-text-primary)",
                        fontSize: "0.9375rem",
                        lineHeight: "1.6",
                        margin: 0,
                    }}>
                        {accessibilityNotes}
                    </p>
                </div>
            )}

            {/* Days */}
            <div ref={printRef} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {days?.map((day, dayIndex) => (
                    <div
                        key={dayIndex}
                        style={{
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {/* Day Header - Clickable */}
                        <button
                            onClick={() => toggleDay(dayIndex)}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "1rem 1.25rem",
                                background: expandedDay === dayIndex
                                    ? "rgba(99, 102, 241, 0.1)"
                                    : "transparent",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                            }}>
                                <span style={{
                                    background: "var(--gradient-primary)",
                                    color: "white",
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    borderRadius: "var(--radius-md)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "700",
                                    fontSize: "1rem",
                                }}>
                                    {day.day}
                                </span>
                                <div style={{ textAlign: "left" }}>
                                    <h4 style={{
                                        color: "var(--color-text-primary)",
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                        margin: 0,
                                    }}>
                                        {day.title}
                                    </h4>
                                    <p style={{
                                        color: "var(--color-text-tertiary)",
                                        fontSize: "0.8125rem",
                                        margin: "0.25rem 0 0 0",
                                    }}>
                                        {day.activities?.length || 0} activities planned
                                    </p>
                                </div>
                            </div>
                            <span style={{
                                color: "var(--color-text-secondary)",
                                fontSize: "1.25rem",
                                transform: expandedDay === dayIndex ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease",
                            }}>
                                ▼
                            </span>
                        </button>

                        {/* Activities - Collapsible */}
                        {expandedDay === dayIndex && (
                            <div style={{
                                padding: "0 1.25rem 1.25rem 1.25rem",
                                borderTop: "1px solid var(--color-border)",
                            }}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem",
                                    marginTop: "1rem",
                                }}>
                                    {day.activities?.map((activity, actIndex) => (
                                        <div
                                            key={actIndex}
                                            style={{
                                                display: "flex",
                                                gap: "1rem",
                                                padding: "1rem",
                                                background: "rgba(255, 255, 255, 0.02)",
                                                borderRadius: "var(--radius-md)",
                                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                            }}
                                        >
                                            {/* Time */}
                                            <div style={{
                                                minWidth: "70px",
                                                color: "#818cf8",
                                                fontSize: "0.875rem",
                                                fontWeight: "600",
                                                paddingTop: "0.125rem",
                                            }}>
                                                {activity.time}
                                            </div>

                                            {/* Activity Details */}
                                            <div style={{ flex: 1 }}>
                                                <p style={{
                                                    color: "var(--color-text-primary)",
                                                    fontSize: "0.9375rem",
                                                    margin: 0,
                                                    lineHeight: "1.5",
                                                }}>
                                                    {activity.activity}
                                                </p>
                                                {activity.accessibility && (
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem",
                                                        marginTop: "0.5rem",
                                                        padding: "0.375rem 0.75rem",
                                                        background: "rgba(16, 185, 129, 0.1)",
                                                        border: "1px solid rgba(16, 185, 129, 0.2)",
                                                        borderRadius: "var(--radius-sm)",
                                                        width: "fit-content",
                                                    }}>
                                                        <span style={{ fontSize: "0.75rem" }}>♿</span>
                                                        <span style={{
                                                            color: "#34d399",
                                                            fontSize: "0.8125rem",
                                                        }}>
                                                            {activity.accessibility}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--color-border)",
            }}>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        flex: 1,
                        padding: "0.875rem 1.5rem",
                        background: saving ? "rgba(99, 102, 241, 0.5)" : "var(--gradient-primary)",
                        border: "none",
                        borderRadius: "var(--radius-lg)",
                        color: "white",
                        fontWeight: "600",
                        fontSize: "0.9375rem",
                        cursor: saving ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        if (!saving) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(99, 102, 241, 0.3)";
                        }
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    {saving ? "💾 Saving..." : "💾 Save Itinerary"}
                </button>
                <button
                    onClick={handleShare}
                    style={{
                        flex: 1,
                        padding: "0.875rem 1.5rem",
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        color: "var(--color-text-primary)",
                        fontWeight: "600",
                        fontSize: "0.9375rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                    }}
                >
                    📤 Share as PDF
                </button>
            </div>

            {/* Fade-in animation */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ItineraryResult;
