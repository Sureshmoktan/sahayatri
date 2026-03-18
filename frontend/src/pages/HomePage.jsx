import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useNavigate } from "react-router-dom";
import { getNearbyWorkshops } from "../services/workshopService";

// ── Fix Leaflet default icon ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const workshopIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const nearestIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function RecenterMap({ center }) {
  const map = useMap();
  map.flyTo(center, map.getZoom(), { duration: 1.2 });
  return null;
}

function RoutingControl({ from, to }) {
  const map = useMap();
  React.useEffect(() => {
    if (!from || !to) return;
    const control = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: { styles: [{ color: "#2563eb", weight: 5, opacity: 0.85 }] },
      createMarker: () => null,
    }).addTo(map);
    return () => map.removeControl(control);
  }, [from, to, map]);
  return null;
}

// ── Top 3 Overlay inside map ──
function NearbyOverlay({ workshops, userLocation, onShowPath, onBook }) {
  const [collapsed, setCollapsed] = useState(false);
  const MEDALS = ["🥇", "🥈", "🥉"];
  const TYPE_ICONS = { bike: "🏍️", car: "🚗", both: "🔧" };

  return (
    <div
      className="absolute top-3 left-3 z-[1000] w-72"
      style={{ pointerEvents: "all" }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-blue-100 shadow-xl shadow-blue-100/60 overflow-hidden">
        {/* Header */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />
        <div
          className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-blue-50/50 transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-black text-slate-800">Nearest Workshops</p>
            <span className="text-xs bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">
              Top 3
            </span>
          </div>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Workshop list */}
        {!collapsed && (
          <div className="divide-y divide-slate-50">
            {workshops.map((ws, i) => (
              <div key={ws._id} className="px-4 py-3 hover:bg-blue-50/30 transition">
                <div className="flex items-start gap-2.5">
                  {/* Medal + type */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                    <span className="text-base">{MEDALS[i]}</span>
                    <span className="text-xs">{TYPE_ICONS[ws.type]}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-black text-slate-800 truncate">{ws.name}</p>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {ws.distance.toFixed(1)}km
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">📞 {ws.phone}</p>

                    {/* Buttons */}
                    <div className="flex gap-1.5 mt-2">
                      <button
                        onClick={() => onShowPath(ws)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 py-1.5 rounded-lg transition active:scale-95"
                      >
                        🗺️ Route
                      </button>
                      {/* <button
                        onClick={() => onBook(ws)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 py-1.5 rounded-lg transition active:scale-95"
                      >
                        📋 Book
                      </button> */}
                      <button
                        onClick={() => window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${ws.location.lat},${ws.location.lng}&travelmode=driving`,
                          "_blank"
                        )}
                        className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 py-1.5 rounded-lg transition active:scale-95"
                      >
                        📍 GMaps
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const TYPE_ICONS = { bike: "🏍️", car: "🚗", both: "🔧" };

const FEATURES = [
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    color: "bg-blue-50 border-blue-100 text-blue-500",
    title: "Real-Time Location",
    desc: "Uses your GPS to instantly find workshops closest to where you are right now.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    color: "bg-sky-50 border-sky-100 text-sky-500",
    title: "Community Driven",
    desc: "Workshop owners register directly — keeping listings fresh, accurate, and local.",
  },
  {
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    color: "bg-emerald-50 border-emerald-100 text-emerald-500",
    title: "Mobile First",
    desc: "Designed for riders on the go — fast, responsive, works on any device.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState([27.7172, 85.324]);
  const [center, setCenter] = useState([27.7172, 85.324]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [located, setLocated] = useState(false);
  const [error, setError] = useState("");
  const [routeTo, setRouteTo] = useState(null);
  const [nearbyTop3, setNearbyTop3] = useState([]);

  const handleFindWorkshops = async () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = [latitude, longitude];
        setUserLocation(newLocation);
        setCenter(newLocation);
        setLocated(true);
        try {
          const data = await getNearbyWorkshops();
          setWorkshops(data);
          const sorted = [...data]
            .map((ws) => ({
              ...ws,
              distance: getDistance(latitude, longitude, ws.location.lat, ws.location.lng),
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3);
          setNearbyTop3(sorted);
        } catch {
          setError("Failed to fetch workshops. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Could not get your location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  const handleShowPath = (ws) => {
    setRouteTo([ws.location.lat, ws.location.lng]);
    setCenter([ws.location.lat, ws.location.lng]);
  };

  const handleBookService = (ws) => {
    navigate(`/book-service/${ws._id}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-sky-200/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-14">

        {/* ── Hero ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Real-Time Workshop Finder</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4">
            Stranded? We've got <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">
              you covered.
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
            Find nearby bike & car workshops instantly using your real-time location.
          </p>

          <button
            onClick={handleFindWorkshops}
            disabled={loading}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 active:scale-95 disabled:opacity-70 text-base"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Finding your location...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Find Nearby Workshops
              </>
            )}
          </button>

          {error && (
            <div className="inline-flex items-center gap-2 mt-4 bg-red-50 border border-red-200 text-red-500 text-sm font-medium px-4 py-2.5 rounded-xl">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* ── Map Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/60 border border-blue-100 overflow-hidden mb-12">
          <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

          {/* Map header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-sm font-bold text-slate-700">Live Map</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />You
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                Workshops ({workshops.length})
              </span>
              {nearbyTop3.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  Top 3
                </span>
              )}
              {routeTo && (
                <button
                  onClick={() => setRouteTo(null)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-500 border border-red-200 px-2 py-0.5 rounded-lg transition"
                >
                  ✕ Clear Route
                </button>
              )}
              {located && (
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Located
                </span>
              )}
            </div>
          </div>

          {/* Leaflet Map */}
          <div style={{ height: 520 }} className="relative">
            <MapContainer
              center={center}
              zoom={13}
              scrollWheelZoom
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <RecenterMap center={center} />

              {/* Routing */}
              {routeTo && located && (
                <RoutingControl from={userLocation} to={routeTo} />
              )}

              {/* User marker */}
              <Marker position={userLocation} icon={userIcon}>
                <Popup>
                  <div className="text-center font-semibold text-blue-600">📍 Your Location</div>
                </Popup>
              </Marker>

              {/* Workshop markers */}
              {workshops.map((ws) => {
                const isTop3 = nearbyTop3.some((t) => t._id === ws._id);
                return (
                  <Marker
                    key={ws._id}
                    position={[ws.location.lat, ws.location.lng]}
                    icon={isTop3 ? nearestIcon : workshopIcon}
                  >
                    <Popup minWidth={200}>
                      <div className="min-w-[190px]">
                        {/* Top 3 badge */}
                        {isTop3 && (
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-xs bg-amber-100 text-amber-600 border border-amber-200 font-bold px-2 py-0.5 rounded-full">
                              ⭐ Top 3 Nearest
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-lg">{TYPE_ICONS[ws.type]}</span>
                          <p className="font-black text-slate-800 text-sm">{ws.name}</p>
                        </div>
                        <p className="text-slate-500 text-xs mb-0.5">📞 {ws.phone}</p>
                        {ws.address && <p className="text-slate-400 text-xs mb-2">📍 {ws.address}</p>}

                        {/* Distance */}
                        {located && (
                          <p className="text-xs font-bold text-blue-600 mb-3">
                            📏 {getDistance(userLocation[0], userLocation[1], ws.location.lat, ws.location.lng).toFixed(1)} km away
                          </p>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-1.5 mb-1.5">
                          <button
                            onClick={() => handleShowPath(ws)}
                            className="flex-1 flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-lg transition active:scale-95"
                          >
                            🗺️ Route
                          </button>
                          <button
                            onClick={() => handleBookService(ws)}
                            className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition active:scale-95"
                          >
                            📋 Book
                          </button>
                        </div>
                        {/* Google Maps button */}
                        <button
                          onClick={() => window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${ws.location.lat},${ws.location.lng}&travelmode=driving`,
                            "_blank"
                          )}
                          className="w-full flex items-center justify-center gap-1.5 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 text-xs font-bold py-2 rounded-lg transition active:scale-95"
                        >
                          <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="G" />
                          Open in Google Maps
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* ── Top 3 Overlay inside map ── */}
              {nearbyTop3.length > 0 && (
                <NearbyOverlay
                  workshops={nearbyTop3}
                  userLocation={userLocation}
                  onShowPath={handleShowPath}
                  onBook={handleBookService}
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* ── Why SahaYatri ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Why SahaYatri</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Built for riders, by riders</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/60 p-6 hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-0.5 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${color}`}>{icon}</div>
              <h3 className="text-base font-black text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}