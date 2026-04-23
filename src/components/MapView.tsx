import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "600px",
};

const DEFAULT_CENTER = {
    lat: 12.9716,
    lng: 77.5946,
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Debug (remove later)
console.log("MAP KEY:", API_KEY ? "✅ loaded" : "❌ undefined");

export default function MapView({ volunteers, needs, assignments }) {
    // 🔴 Handle missing API key
    if (!API_KEY) {
        return (
            <div style={{
                color: "#ef4444",
                padding: "2rem",
                border: "2px dashed #ef4444",
                borderRadius: "8px",
                textAlign: "center",
                fontFamily: "monospace",
            }}>
                <h3 style={{ margin: "0 0 0.5rem" }}>⚠️ Google Maps API Key Not Loaded</h3>
                <p style={{ margin: 0 }}>
                    Ensure <code>.env</code> exists at the project root with:<br />
                    <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code><br />
                    Then restart the dev server.
                </p>
            </div>
        );
    }

    // 🟡 Filter valid coordinates
    const validVolunteers = volunteers.filter(v => v.lat && v.lng);
    const validNeeds = needs.filter(n => n.lat && n.lng);

    // 🔵 Dynamic center (first available point)
    const center = validVolunteers[0]
        ? { lat: validVolunteers[0].lat, lng: validVolunteers[0].lng }
        : validNeeds[0]
            ? { lat: validNeeds[0].lat, lng: validNeeds[0].lng }
            : DEFAULT_CENTER;

    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={11}
            >

                {/* 🔵 Volunteers (Blue markers) */}
                {validVolunteers.map(v => (
                    <Marker
                        key={`v-${v.id}`}
                        position={{ lat: v.lat, lng: v.lng }}
                        icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        label={{
                            text: "V",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    />
                ))}

                {/* 🔴 Needs (Red markers) */}
                {validNeeds.map(n => (
                    <Marker
                        key={`n-${n.id}`}
                        position={{ lat: n.lat, lng: n.lng }}
                        icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        label={{
                            text: "N",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    />
                ))}

                {/* 🟣 Assignment lines */}
                {assignments.map(a => {
                    const vol = volunteers.find(v => v.id === a.volunteerId);
                    const need = needs.find(n => n.id === a.needId);

                    if (!vol?.lat || !need?.lat) return null;

                    return (
                        <Polyline
                            key={a.id}
                            path={[
                                { lat: vol.lat, lng: vol.lng },
                                { lat: need.lat, lng: need.lng },
                            ]}
                            options={{
                                strokeColor: "#2a9d8f",
                                strokeOpacity: 0.8,
                                strokeWeight: 3,
                            }}
                        />
                    );
                })}

            </GoogleMap>
        </LoadScript>
    );
}