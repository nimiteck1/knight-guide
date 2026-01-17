import React from "react";

/**
 * Enhanced Preferences Component - Grouped Subsections
 * Four categories: Safety, Accessibility, Route, and Dietary
 */
const Preferences = ({ preferences, onPreferenceChange }) => {
    // Checkbox component for reusability
    const Checkbox = ({ id, label, checked }) => (
        <label
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                cursor: "pointer",
                padding: "0.625rem 0",
            }}
        >
            <div style={{ position: "relative" }}>
                <input
                    type="checkbox"
                    id={id}
                    checked={checked || false}
                    onChange={(e) => onPreferenceChange(id, e.target.checked)}
                    style={{
                        position: "absolute",
                        opacity: 0,
                        width: 0,
                        height: 0,
                    }}
                />
                <div
                    style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: "2px solid",
                        borderColor: checked ? "var(--color-primary)" : "var(--color-border)",
                        background: checked ? "var(--gradient-primary)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                >
                    {checked && (
                        <svg style={{ width: "12px", height: "12px", color: "#fff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
            <span style={{ color: "var(--color-text-primary)", fontSize: "0.875rem", fontWeight: "500" }}>
                {label}
            </span>
        </label>
    );

    // Toggle component for strict modes
    const Toggle = ({ id, label, checked }) => (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.625rem 0",
        }}>
            <span style={{ color: "var(--color-text-primary)", fontSize: "0.875rem", fontWeight: "500" }}>
                {label}
            </span>
            <button
                type="button"
                role="switch"
                aria-checked={checked || false}
                onClick={() => onPreferenceChange(id, !checked)}
                style={{
                    position: "relative",
                    width: "44px",
                    height: "24px",
                    borderRadius: "9999px",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s ease",
                    background: checked ? "var(--gradient-primary)" : "var(--color-bg-secondary)",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: "2px",
                        left: checked ? "22px" : "2px",
                        width: "20px",
                        height: "20px",
                        background: "#fff",
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        transition: "left 0.2s ease",
                    }}
                />
            </button>
        </div>
    );

    // Dropdown component
    const Dropdown = ({ id, label, value, options }) => (
        <div style={{ padding: "0.625rem 0" }}>
            <label style={{
                display: "block",
                color: "var(--color-text-secondary)",
                fontSize: "0.75rem",
                marginBottom: "0.375rem",
                fontWeight: "500",
            }}>
                {label}
            </label>
            <select
                id={id}
                value={value || options[0].value}
                onChange={(e) => onPreferenceChange(id, e.target.value)}
                style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    background: "var(--color-bg-elevated)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--color-text-primary)",
                    fontSize: "0.875rem",
                    outline: "none",
                    cursor: "pointer",
                }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: "#1a1a2e" }}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );

    // Subsection wrapper
    const Subsection = ({ icon, title, children }) => (
        <div style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            marginBottom: "1rem",
        }}>
            <h4 style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.9375rem",
                fontWeight: "600",
                color: "var(--color-text-primary)",
                marginBottom: "0.75rem",
                paddingBottom: "0.625rem",
                borderBottom: "1px solid var(--color-border)",
            }}>
                <span>{icon}</span> {title}
            </h4>
            <div>{children}</div>
        </div>
    );

    return (
        <section>
            {/* Safety & Emergency */}
            <Subsection icon="🏥" title="Safety & Emergency">
                <Checkbox id="nearHospitals" label="Prefer routes near hospitals" checked={preferences.nearHospitals} />
                <Checkbox id="showNearestHospital" label="Always show nearest hospital" checked={preferences.showNearestHospital} />
                <Checkbox id="emergencyRestStops" label="Include emergency rest stops" checked={preferences.emergencyRestStops} />
                <Checkbox id="avoidIsolated" label="Avoid isolated or poorly lit areas" checked={preferences.avoidIsolated} />
                <Dropdown
                    id="hospitalProximity"
                    label="Hospital Proximity Range"
                    value={preferences.hospitalProximity}
                    options={[
                        { value: "2km", label: "2 km" },
                        { value: "5km", label: "5 km" },
                        { value: "10km", label: "10 km" },
                    ]}
                />
            </Subsection>

            {/* Accessibility & Mobility */}
            <Subsection icon="♿" title="Accessibility & Mobility">
                <Checkbox id="wheelchairFriendly" label="Wheelchair-friendly routes" checked={preferences.wheelchairFriendly} />
                <Checkbox id="avoidStairs" label="Avoid stairs and steep slopes" checked={preferences.avoidStairs} />
                <Checkbox id="accessibleRestrooms" label="Accessible restrooms along route" checked={preferences.accessibleRestrooms} />
                <Checkbox id="accessibleParking" label="Accessible parking nearby" checked={preferences.accessibleParking} />
                <Checkbox id="serviceAnimal" label="Service-animal friendly places" checked={preferences.serviceAnimal} />
                <Toggle id="strictAccessibility" label="Strict accessibility only" checked={preferences.strictAccessibility} />
            </Subsection>

            {/* Route & Navigation */}
            <Subsection icon="🚶" title="Route & Navigation">
                <Checkbox id="avoidCrowded" label="Avoid crowded routes" checked={preferences.avoidCrowded} />
                <Checkbox id="shortestDistance" label="Shortest walking distance" checked={preferences.shortestDistance} />
                <Checkbox id="smoothPaths" label="Smooth / less bumpy paths" checked={preferences.smoothPaths} />
                <Checkbox id="scenicRoutes" label="Scenic and calm routes" checked={preferences.scenicRoutes} />
            </Subsection>

            {/* Dietary Preferences (existing) */}
            <Subsection icon="🍽️" title="Dietary Preferences">
                <Checkbox id="mealPlan" label="Add my Meal Plan" checked={preferences.mealPlan} />
                <Checkbox id="culinary" label="Plan culinary experiences" checked={preferences.culinary} />
                <Checkbox id="halal" label="Halal Meals" checked={preferences.halal} />
            </Subsection>
        </section>
    );
};

export default Preferences;
