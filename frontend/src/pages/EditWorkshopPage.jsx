import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getWorkshopById, updateWorkshop } from "../services/workshopService";

// ── Fix Leaflet default icon broken by webpack ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TYPE_OPTIONS = [
  { value: "bike", label: "Bike", icon: "🏍️" },
  { value: "car", label: "Car", icon: "🚗" },
  { value: "both", label: "Bike & Car", icon: "🔧" },
];

// ── Click anywhere on map to drop pin ──
function LocationPicker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// ── Smoothly fly map to a new position ──
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom() < 13 ? 15 : map.getZoom(), { duration: 1.2 });
    }
  }, [position, map]);
  return null;
}

// ── Free reverse geocoding via Nominatim ──
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.display_name || "";
  } catch {
    return "";
  }
}

export default function EditWorkshopPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    type: "both",
    location: { lat: null, lng: null },
  });

  const [markerPos, setMarkerPos] = useState(null); // [lat, lng] for Leaflet
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const successRef = useRef(null);

  // ── Load existing workshop data ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getWorkshopById(id);
        const lat = data.location?.lat ?? null;
        const lng = data.location?.lng ?? null;
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          type: data.type || "both",
          location: { lat, lng },
        });
        if (lat && lng) setMarkerPos([lat, lng]);
      } catch {
        setError("Failed to load workshop details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Map click: drop pin + reverse geocode address ──
  const handleMapPick = useCallback(async (lat, lng) => {
    const rLat = parseFloat(lat.toFixed(6));
    const rLng = parseFloat(lng.toFixed(6));
    setMarkerPos([rLat, rLng]);
    setForm((prev) => ({ ...prev, location: { lat: rLat, lng: rLng } }));
    setGeocoding(true);
    const address = await reverseGeocode(rLat, rLng);
    setForm((prev) => ({ ...prev, address }));
    setGeocoding(false);
  }, []);

  // ── Use device GPS ──
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await handleMapPick(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setError("Unable to detect location. Please tap the map manually.");
        setLocating(false);
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Workshop name is required.");
    if (!form.phone.trim()) return setError("Phone number is required.");
    if (!form.location.lat || !form.location.lng)
      return setError("Please pin your workshop location on the map.");

    try {
      setSaving(true);
      await updateWorkshop(id, {
        name: form.name,
        phone: form.phone,
        address: form.address,
        type: form.type,
        location: { lat: form.location.lat, lng: form.location.lng },
      });
      setSuccess(true);
      clearTimeout(successRef.current);
      successRef.current = setTimeout(() => navigate("/your-workshop"), 1500);
    } catch {
      setError("Failed to update workshop. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const defaultCenter = markerPos || [30.3753, 69.3451]; // Pakistan fallback

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          <div className="bg-white rounded-3xl border border-blue-100 p-8 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                <div className="h-11 bg-slate-100 rounded-xl" />
              </div>
            ))}
            <div className="h-72 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-12 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/your-workshop")}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 text-sm font-semibold mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to My Workshop
          </button>

          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Edit Workshop</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Update Your Workshop</h1>
          <p className="text-slate-500 text-sm mt-1">Update your details and pin your location on the map.</p>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

          <form onSubmit={handleSubmit} className="p-8 space-y-6">

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-xl px-4 py-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Workshop updated! Redirecting...
              </div>
            )}

            {/* ── Workshop Name ── */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Workshop Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ali Auto Workshop"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-800 font-semibold text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* ── Phone ── */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +92 300 1234567"
                className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-3 text-slate-800 font-semibold text-sm placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* ── Email (read-only) ── */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-500 font-semibold text-sm flex-1 truncate">{form.email}</span>
                <span className="flex-shrink-0 flex items-center gap-1 text-xs bg-slate-200 text-slate-400 font-bold px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Locked
                </span>
              </div>
            </div>

            {/* ── Workshop Type ── */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Workshop Type *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: opt.value }))}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200 active:scale-95
                      ${form.type === opt.value
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md shadow-blue-100"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Map Location Picker ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Workshop Location *
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating || geocoding}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all disabled:opacity-60"
                >
                  {locating ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Detecting...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Use My Location
                    </>
                  )}
                </button>
              </div>

              {/* Hint */}
              <p className="text-xs text-slate-400 mb-2.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tap anywhere on the map to drop a pin on your workshop
              </p>

              {/* Leaflet Map */}
              <div className="rounded-2xl overflow-hidden border-2 border-blue-100 shadow-md" style={{ height: 300 }}>
                <MapContainer
                  center={defaultCenter}
                  zoom={markerPos ? 15 : 6}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onPick={handleMapPick} />
                  {markerPos && (
                    <>
                      <Marker position={markerPos} />
                      <FlyTo position={markerPos} />
                    </>
                  )}
                </MapContainer>
              </div>

              {/* Auto-filled address display */}
              <div className="mt-3 flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-h-[52px]">
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {geocoding ? (
                  <div className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-slate-400 text-sm">Fetching address...</span>
                  </div>
                ) : form.address ? (
                  <p className="text-slate-700 text-sm font-semibold leading-relaxed">{form.address}</p>
                ) : (
                  <p className="text-slate-300 text-sm italic">Address will appear here after pinning location</p>
                )}
              </div>

              {/* Coordinates pill */}
              {form.location.lat && form.location.lng && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {form.location.lat}, {form.location.lng}
                </div>
              )}
            </div>

            {/* ── Buttons ── */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/your-workshop")}
                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || success}
                className="flex-1 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving...
                  </>
                ) : success ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}