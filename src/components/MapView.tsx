import { useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow, MarkerClusterer } from "@react-google-maps/api";
import type { Volunteer, Need, Assignment } from "../types";

const containerStyle = {
    width: "100%",
    height: "600px",
};

const DEFAULT_CENTER = {
    lat: 12.9716,
    lng: 77.5946,
};

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface MapViewProps {
    volunteers: Volunteer[];
    needs: Need[];
    assignments: Assignment[];
}

export default function MapView({ volunteers, needs, assignments }: MapViewProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: API_KEY,
    });

    const [activeMarker, setActiveMarker] = useState<{ type: 'volunteer' | 'need', id: string } | null>(null);

    // 🟡 Filter valid coordinates
    const validVolunteers = useMemo(() => volunteers.filter(v => v.lat && v.lng), [volunteers]);
    const validNeeds = useMemo(() => needs.filter(n => n.lat && n.lng), [needs]);

    // 🔵 Dynamic center (first available point)
    const center = useMemo(() => validVolunteers[0]
        ? { lat: validVolunteers[0].lat, lng: validVolunteers[0].lng }
        : validNeeds[0]
            ? { lat: validNeeds[0].lat, lng: validNeeds[0].lng }
            : DEFAULT_CENTER, [validVolunteers, validNeeds]);

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

    if (loadError) {
        return <div className="p-4 text-red-500 text-center font-medium bg-red-50 rounded-lg">Error loading Google Maps API</div>;
    }

    if (!isLoaded) {
        return (
            <div className="w-full h-[600px] bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="text-gray-400 font-medium">Loading Map...</div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={11}
            onClick={() => setActiveMarker(null)}
        >
            <MarkerClusterer options={{
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            }}>
                {(clusterer) => (
                    <>
                        {/* 🔵 Volunteers (Blue markers) */}
                        {validVolunteers.map(v => (
                            <Marker
                                key={`v-${v.id}`}
                                position={{ lat: v.lat!, lng: v.lng! }}
                                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                clusterer={clusterer}
                                onClick={() => setActiveMarker({ type: 'volunteer', id: v.id })}
                            >
                                {activeMarker?.type === 'volunteer' && activeMarker.id === v.id && (
                                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                        <div className="p-1 max-w-[200px] text-black">
                                            <h3 className="font-bold text-gray-800 text-sm">{v.name}</h3>
                                            <p className="text-xs text-gray-600 mt-1">
                                                <strong>Skills:</strong> {v.skills.join(', ')}
                                            </p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        ))}

                        {/* 🔴 Needs (Red markers) */}
                        {validNeeds.map(n => (
                            <Marker
                                key={`n-${n.id}`}
                                position={{ lat: n.lat!, lng: n.lng! }}
                                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                clusterer={clusterer}
                                onClick={() => setActiveMarker({ type: 'need', id: n.id })}
                            >
                                {activeMarker?.type === 'need' && activeMarker.id === n.id && (
                                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                        <div className="p-1 max-w-[200px] text-black">
                                            <h3 className="font-bold text-gray-800 text-sm">{n.title}</h3>
                                            <p className="text-xs text-gray-600 mt-1">
                                                <strong>Urgency:</strong> <span className={
                                                    n.urgency === 'High' ? 'text-red-600 font-bold' :
                                                    n.urgency === 'Medium' ? 'text-orange-500 font-bold' : 'text-green-600 font-bold'
                                                }>{n.urgency}</span>
                                            </p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        ))}
                    </>
                )}
            </MarkerClusterer>

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
    );
}