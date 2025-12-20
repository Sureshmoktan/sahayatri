import axios from "axios";
import React, { useState, useEffect } from "react";

function WorkshopForm() {
  const [formData, setFormData] = useState({
    name: "",
    type: "bike",
    lat: "27.7172",
    lng: "85.3240"
  });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
const token = loggedInUser?.token;



  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const initMap = () => {
    // Initialize map centered on Kathmandu
    const L = window.L;
    const newMap = L.map("map").setView([27.7172, 85.3240], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors'
    }).addTo(newMap);

    // Add initial marker
    const newMarker = L.marker([27.7172, 85.3240], {
      draggable: true
    }).addTo(newMap);

    // Update form when marker is dragged
    newMarker.on("dragend", function(e) {
      const position = e.target.getLatLng();
      setFormData(prev => ({
        ...prev,
        lat: position.lat.toFixed(6),
        lng: position.lng.toFixed(6)
      }));
    });

    // Add click event to map
    newMap.on("click", function(e) {
      const { lat, lng } = e.latlng;
      newMarker.setLatLng([lat, lng]);
      setFormData(prev => ({
        ...prev,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6)
      }));
    });

    setMap(newMap);
    setMarker(newMarker);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update marker position when lat/lng inputs change
    if ((name === "lat" || name === "lng") && marker && map) {
      const lat = name === "lat" ? parseFloat(value) : parseFloat(formData.lat);
      const lng = name === "lng" ? parseFloat(value) : parseFloat(formData.lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        marker.setLatLng([lat, lng]);
        map.setView([lat, lng]);
      }
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const workshopData = {
    name: formData.name,
    type: formData.type,
    location: {
      lat: Number(formData.lat),
      lng: Number(formData.lng)
    }
  };

  try {
    const res = await axios.post(
      "http://localhost:5000/api/workshops",
      workshopData, // ⬅ send directly (NOT wrapped)
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response:", res.data);
    alert("Workshop added successfully!");

    setFormData({
      name: "",
      type: "bike",
      lat: "27.7172",
      lng: "85.3240",
    });

    if (marker && map) {
      marker.setLatLng([27.7172, 85.3240]);
      map.setView([27.7172, 85.3240]);
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Failed to add workshop");
  }
};


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Map Section */}
      <div className="w-full lg:w-1/2 h-96 lg:h-screen relative">
        <div id="map" className="w-full h-full"></div>
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          <p className="text-sm text-gray-600">Click or drag marker to select location</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Workshop
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Workshop Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter workshop name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Workshop Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              required
            >
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Latitude
            </label>
            <input
              type="number"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 27.7172"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Longitude
            </label>
            <input
              type="number"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              step="any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 85.3240"
              required
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Workshop
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkshopForm;