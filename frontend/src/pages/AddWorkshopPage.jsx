import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WorkshopForm from "../components/WorkshopForm";
import { createWorkshop } from "../services/workshopService";

const AddWorkshopPage = () => {
  const navigate = useNavigate();
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // ── Read user email from localStorage (set at login) ──
  const userEmail = localStorage.getItem("userEmail") || localStorage.getItem("email") || "";

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: { lat: 0, lng: 0 },
    type: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── Countdown + auto-navigate after success ──
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!showSuccess) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [showSuccess]);

  // ── Navigate when countdown hits 0, outside of setState ──
  useEffect(() => {
    if (countdown === 0) {
      navigate("/my-workshops");
    }
  }, [countdown]);

  // ── Load Leaflet CSS + JS dynamically ──
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // ── Reverse geocode lat/lng → address ──
  const fetchAddress = async (lat, lng) => {
    try {
      setAddressLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();

      const a = data.address || {};
      const parts = [
        a.road || a.pedestrian || a.footway,
        a.neighbourhood || a.suburb || a.village,
        a.city || a.town || a.county,
        a.state,
        a.country,
      ].filter(Boolean);

      const address = parts.join(", ") || data.display_name || "";
      setFormData((prev) => ({ ...prev, address }));
      setErrors((prev) => ({ ...prev, address: "" }));
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleMapClick = (lat, lng) => {
    setFormData((prev) => ({ ...prev, location: { lat, lng } }));
    setErrors((prev) => ({ ...prev, location: "" }));
    fetchAddress(lat, lng);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workshop name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.type) {
      newErrors.type = "Please select a workshop type";
    }

    if (formData.location.lat === 0 && formData.location.lng === 0) {
      newErrors.location = "Please pin your location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        location: {
          lat: formData.location.lat,
          lng: formData.location.lng,
        },
        type: formData.type,
      };

      await createWorkshop(payload);
      setShowSuccess(true); // ✅ show success modal
    } catch (err) {
      console.log("Backend error:", err.response?.data);
      setErrors({
        api: err.response?.data?.message || "Failed to create workshop. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Leaflet loading screen ──
  if (!leafletLoaded) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-slate-500 text-sm font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <WorkshopForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleMapClick={handleMapClick}
        loading={loading}
        addressLoading={addressLoading}
        userEmail={userEmail}
      />

      {/* ── Success Modal ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

          {/* Modal card */}
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-300/40 border border-blue-100 px-8 py-10 max-w-md w-full text-center overflow-hidden">

            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

            {/* Confetti blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-100/60 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-sky-100/60 blur-2xl pointer-events-none" />

            {/* Success icon */}
            <div className="relative flex items-center justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-200">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Ring pulse */}
              <div className="absolute w-20 h-20 rounded-full border-4 border-blue-300 animate-ping opacity-30" />
            </div>

            {/* Text */}
            <h2 className="text-2xl font-black text-slate-900 mb-2">Congratulations! 🎉</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-1">
              Your workshop has been successfully created.
            </p>
            <p className="text-slate-400 text-sm mb-6">
              Customers on the road can now find and contact you.
            </p>

            {/* Workshop name badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <span className="text-lg">🔧</span>
              <span className="text-blue-700 font-bold text-sm">{formData.name}</span>
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <svg className="w-4 h-4 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-slate-400 text-sm">
                Redirecting to your workshops in{" "}
                <span className="font-bold text-blue-500">{countdown}s</span>
              </p>
            </div>

            {/* Go now button */}
            <button
              onClick={() => navigate("/your-workshop")}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 active:scale-95"
            >
              Go to My Workshops →
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AddWorkshopPage;