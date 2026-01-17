// src/pages/PlanTrip.tsx
import { useState } from "react"

export default function PlanTrip() {
    const [start, setStart] = useState("")
    const [destination, setDestination] = useState("")

    const handlePlanTrip = () => {
        console.log("Start:", start)
        console.log("Destination:", destination)
    }

    return (
        <div className="min-h-screen p-6">
            <h1 className="text-2xl font-bold mb-6">Plan Your Trip</h1>

            <div className="max-w-md space-y-4">
                <input
                    type="text"
                    placeholder="Start location"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <input
                    type="text"
                    placeholder="Destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full border rounded-md p-2"
                />

                <button
                    onClick={handlePlanTrip}
                    className="w-full bg-black text-white rounded-md p-2"
                >
                    Plan Trip
                </button>
            </div>
        </div>
    )
}
