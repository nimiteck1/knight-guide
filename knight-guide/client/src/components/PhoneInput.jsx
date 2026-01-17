import React, { useState, useEffect } from "react";

const countryCodes = [
    { code: "+1", country: "USA/Canada" },
    { code: "+91", country: "India" },
    { code: "+44", country: "UK" },
    { code: "+61", country: "Australia" },
    { code: "+81", country: "Japan" },
    { code: "+49", country: "Germany" },
    { code: "+33", country: "France" },
    { code: "+86", country: "China" },
    { code: "+971", country: "UAE" },
    // Add more as needed
];

const PhoneInput = ({ value, onChange, label, required = false }) => {
    const [code, setCode] = useState("+91"); // Default to India or reasonable default
    const [number, setNumber] = useState("");

    // Parse initial value
    useEffect(() => {
        if (value) {
            // enhanced parsing logic could go here
            // For now, simple check if it starts with one of our codes
            const foundCode = countryCodes.find((c) => value.startsWith(c.code));
            if (foundCode) {
                setCode(foundCode.code);
                setNumber(value.slice(foundCode.code.length).trim());
            } else {
                setNumber(value);
            }
        } else {
            setNumber("");
        }
    }, [value]); // Be careful with loop if onChange updates value which updates this...

    // Actually, controlled components are tricky with split fields.
    // Better approach: maintain internal state only for UI, but sync with `value` prop carefully.
    // Or simpler: Just render the view based on props, and onChange emits the combination.

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setCode(newCode);
        onChange(`${newCode} ${number}`);
    };

    const handleNumberChange = (e) => {
        const newNumber = e.target.value;
        setNumber(newNumber); // Local update for responsiveness
        onChange(`${code} ${newNumber}`); // Propagate full value
    };

    return (
        <div className="phone-input-group">
            <label>{label}</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                    value={code}
                    onChange={handleCodeChange}
                    style={{
                        width: "80px",
                        padding: "0.5rem",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-card)",
                        color: "black",
                    }}
                >
                    {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.code} ({c.country})
                        </option>
                    ))}
                </select>
                <input
                    type="tel"
                    value={number}
                    onChange={handleNumberChange}
                    placeholder="123 456 7890"
                    required={required}
                    style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-card)",
                        color: "var(--color-text-primary)",
                    }}
                />
            </div>
        </div>
    );
};

export default PhoneInput;
