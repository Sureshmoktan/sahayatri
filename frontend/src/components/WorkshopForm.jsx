import React, { useEffect, useRef } from "react";

const WorkshopForm = ({
  formData,
  errors,
  handleChange,
  handleSubmit,
  handleMapClick,
  loading,
  addressLoading,
  userEmail,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // ── Init Leaflet map ──
  useEffect(() => {
    if (mapInstanceRef.current) return;

    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [27.7172, 85.324],
      zoom: 13,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: L.divIcon({
            className: "",
            html: `<div style="
              width:36px;height:36px;
              background:linear-gradient(135deg,#2563eb,#0ea5e9);
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:3px solid white;
              box-shadow:0 4px 14px rgba(37,99,235,0.5)
            "></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          }),
        }).addTo(map);
      }

      handleMapClick(lat, lng);
    });

    mapInstanceRef.current = map;
  }, []);

  // ── Sync marker when lat/lng changes ──
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    const { lat, lng } = formData.location;
    if (!lat || !lng) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
    }
    mapInstanceRef.current.setView([lat, lng], 14);
  }, [formData.location.lat, formData.location.lng]);

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-12 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Workshop Registration</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">Add Your Workshop</h1>
          <p className="text-slate-500 mt-2 text-base">Register your mechanic workshop so customers can find you on the road.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200/60 border border-blue-100 overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

          <div className="p-8">

            {/* API error */}
            {errors?.api && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.api}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Name + Phone ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                    Workshop Name <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all duration-200 ${errors?.name ? "border-red-300 bg-red-50" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"}`}>
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <input
                      type="text"
                      name="name"
                      placeholder="Ram Auto Workshop"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      className="flex-1 outline-none text-slate-800 text-sm bg-transparent placeholder-slate-300 disabled:opacity-50"
                    />
                  </div>
                  {errors?.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all duration-200 ${errors?.phone ? "border-red-300 bg-red-50" : "border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"}`}>
                    <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+977 98XXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      className="flex-1 outline-none text-slate-800 text-sm bg-transparent placeholder-slate-300 disabled:opacity-50"
                    />
                  </div>
                  {errors?.phone && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.phone}</p>}
                </div>
              </div>

              {/* ── Email (read-only, auto from logged-in user) ── */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5 flex items-center gap-2">
                  Contact Email
                  <span className="text-xs font-normal text-blue-500 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    Auto-filled from your account
                  </span>
                </label>
                <div className="flex items-center gap-3 border border-blue-200 bg-blue-50/70 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="flex-1 text-slate-600 text-sm">
                    {userEmail || "Loading..."}
                  </span>
                  <svg className="w-4 h-4 text-blue-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-xs mt-1.5">This email is linked to your account and cannot be changed here.</p>
              </div>

              {/* ── Workshop Type ── */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Workshop Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "bike", label: "Bike", icon: "🏍️" },
                    { value: "car", label: "Car", icon: "🚗" },
                    { value: "both", label: "Both", icon: "🔧" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col items-center gap-2 border-2 rounded-xl py-4 cursor-pointer transition-all duration-200 ${
                        formData.type === opt.value
                          ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <input type="radio" name="type" value={opt.value} checked={formData.type === opt.value} onChange={handleChange} className="sr-only" />
                      <span className="text-2xl">{opt.icon}</span>
                      <span className={`text-sm font-bold ${formData.type === opt.value ? "text-blue-600" : "text-slate-600"}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
                {errors?.type && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.type}</p>}
              </div>

              {/* ── Map Section ── */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">
                  Pin Your Location <span className="text-red-400">*</span>
                </label>
                <p className="text-slate-400 text-xs mb-3 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Click anywhere on the map — address, latitude & longitude will be fetched automatically
                </p>

                <div className={`rounded-2xl overflow-hidden border-2 transition-all duration-200 ${errors?.location ? "border-red-300" : "border-slate-200"}`}>
                  <div ref={mapRef} style={{ height: "320px", width: "100%" }} />
                </div>

                <div className="mt-3 space-y-2">
                  {/* Address */}
                  <div className={`flex items-start gap-3 border rounded-xl px-4 py-3 transition-all duration-200 ${formData.address ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-0.5">Address</p>
                      {addressLoading ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <span className="text-blue-400 text-xs">Fetching address...</span>
                        </div>
                      ) : (
                        <p className={`text-sm font-medium truncate ${formData.address ? "text-slate-700" : "text-slate-300"}`}>
                          {formData.address || "Click the map to auto-fill"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Lat + Lng */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-all duration-200 ${formData.location.lat ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Lat</span>
                      <span className={`text-sm font-mono ${formData.location.lat ? "text-slate-700" : "text-slate-300"}`}>
                        {formData.location.lat ? formData.location.lat.toFixed(6) : "—"}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 transition-all duration-200 ${formData.location.lng ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-slate-50"}`}>
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Lng</span>
                      <span className={`text-sm font-mono ${formData.location.lng ? "text-slate-700" : "text-slate-300"}`}>
                        {formData.location.lng ? formData.location.lng.toFixed(6) : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {errors?.location && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.location}</p>}
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 active:scale-95 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 text-base disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Saving Workshop...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Workshop
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopForm;