import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LandingPage() {
  const { workshops } = useSelector((state) => state.workshop);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map
      mapRef.current = L.map("map", {
        center: [27.7172, 85.324], // Kathmandu as default
        zoom: 13,
        scrollWheelZoom: false,
      });

      // Tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // Remove old markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    // Add workshop markers
    workshops.forEach((ws) => {
      if (ws.location?.lat && ws.location?.lng) {
        L.marker([ws.location.lat, ws.location.lng], {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [25, 25],
          }),
        })
          .addTo(mapRef.current)
          .bindPopup(`<b>${ws.name}</b><br/>Type: ${ws.type}`);
      }
    });
  }, [workshops]);

  const handleFindMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current.setView([latitude, longitude], 15);

          L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
              iconSize: [35, 35],
            }),
          })
            .addTo(mapRef.current)
            .bindPopup("📍 You are here")
            .openPopup();
        },
        () => alert("Unable to fetch your location.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      {/* Map */}
      <div
        id="map"
        className="w-full max-w-5xl h-[70vh] rounded-lg shadow-lg"
      />

      {/* Button below map */}
      <div className="mt-6">
        <button
          onClick={handleFindMe}
          className="bg-blue-900 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-800 hover:scale-105 transition"
        >
          Find Me
        </button>
      </div>
    </div>
  );
}
