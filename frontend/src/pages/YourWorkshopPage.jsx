import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getMyWorkshops, deleteWorkshop } from "../services/workshopService";

const TYPE_ICONS = { bike: "🏍️", car: "🚗", both: "🔧" };
const TYPE_LABELS = { bike: "Bike", car: "Car", both: "Bike & Car" };

export default function YourWorkshopPage() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [shareToast, setShareToast] = useState("");
  const toastRef = useRef(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const data = await getMyWorkshops();
        setWorkshops(data);
      } catch (err) {
        setError("Failed to load workshops. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteWorkshop(deleteId);
      setWorkshops((prev) => prev.filter((w) => w._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError("Failed to delete workshop. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = (workshop) => {
    const text = `${workshop.name}\n📞 ${workshop.phone}\n📍 ${workshop.address}\nhttps://maps.google.com/?q=${workshop.location?.lat},${workshop.location?.lng}`;
    if (navigator.share) {
      navigator.share({ title: workshop.name, text });
    } else {
      navigator.clipboard.writeText(text);
      showToast("Workshop details copied to clipboard!");
    }
  };

  const showToast = (msg) => {
    setShareToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setShareToast(""), 3000);
  };

  const handleViewOnMap = (workshop) => {
    const url = `https://www.google.com/maps?q=${workshop.location?.lat},${workshop.location?.lng}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="h-5 w-40 bg-blue-200 rounded-full mb-4 animate-pulse" />
            <div className="h-9 w-64 bg-slate-200 rounded-xl mb-2 animate-pulse" />
            <div className="h-4 w-48 bg-slate-100 rounded-full animate-pulse" />
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-8 animate-pulse space-y-4">
            <div className="h-6 w-2/3 bg-slate-200 rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
            <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
            <div className="h-4 w-1/2 bg-slate-100 rounded-lg" />
            <div className="flex gap-3 pt-4">
              <div className="flex-1 h-11 bg-slate-100 rounded-xl" />
              <div className="flex-1 h-11 bg-slate-100 rounded-xl" />
            </div>
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

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">My Workshop</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">Your Workshop</h1>
          <p className="text-slate-500 text-sm mt-1">
            {workshops.length > 0
              ? "Manage your registered workshop"
              : "You haven't registered a workshop yet"}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-6">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Empty State ── */}
        {workshops.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100/60 border border-blue-100 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />
            <div className="px-8 py-16 text-center">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="w-28 h-28 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center">
                  <span className="text-5xl">🔧</span>
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center text-sm">
                  ❓
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-3">
                You haven't registered a workshop yet
              </h2>
              <p className="text-slate-500 text-base mb-2 max-w-sm mx-auto">
                Would you like to register a new one?
              </p>
              <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
                Get discovered by customers on the road who need help nearby.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/add-workshop")}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all duration-200 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Yes, Register Now
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        ) : (

          // ── Workshop Card (big, full width, single) ──
          <div className="space-y-5">
            {workshops.map((workshop) => (
              <div
                key={workshop._id}
                className="bg-white rounded-3xl shadow-xl shadow-blue-100/60 border border-blue-100 overflow-hidden"
              >
                {/* Top color bar */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

                <div className="p-8">

                  {/* ── Name + Type Badge ── */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 leading-tight">{workshop.name}</h2>
                      <p className="text-slate-400 text-sm mt-1">
                        Registered {new Date(workshop.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span className="flex-shrink-0 flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-bold px-4 py-2 rounded-full">
                      <span className="text-lg">{TYPE_ICONS[workshop.type]}</span>
                      <span>{TYPE_LABELS[workshop.type]}</span>
                    </span>
                  </div>

                  {/* ── Info Grid ── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                    {/* Phone */}
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Phone</p>
                        <p className="text-slate-800 font-bold text-sm">{workshop.phone}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Email</p>
                        <p className="text-slate-800 font-bold text-sm truncate">{workshop.email}</p>
                      </div>
                    </div>

                    {/* Address */}
                    {workshop.address && (
                      <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 sm:col-span-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Address</p>
                          <p className="text-slate-800 font-bold text-sm">{workshop.address}</p>
                        </div>
                      </div>
                    )}

                    {/* Coordinates */}
                    <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100 sm:col-span-2">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-0.5">GPS Coordinates</p>
                        <p className="text-slate-800 font-bold text-sm font-mono">
                          {workshop.location?.lat?.toFixed(6)}, {workshop.location?.lng?.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">

                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/edit-workshop/${workshop._id}`)}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-blue-200 transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>

                    {/* View on Map */}
                    <button
                      onClick={() => handleViewOnMap(workshop)}
                      className="flex items-center justify-center gap-2 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-sm py-3 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Map
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => handleShare(workshop)}
                      className="flex items-center justify-center gap-2 border border-violet-200 text-violet-600 hover:bg-violet-50 font-bold text-sm py-3 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(workshop._id)}
                      className="flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-sm py-3 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !deleting && setDeleteId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl border border-red-100 px-8 py-8 max-w-sm w-full text-center overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />

            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-2">Delete Workshop?</h2>
            <p className="text-slate-500 text-sm mb-6">
              This action cannot be undone. The workshop will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-100 transition-all duration-200 active:scale-95 disabled:opacity-80 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Deleting...
                  </>
                ) : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Toast ── */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-2">
          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {shareToast}
        </div>
      )}
    </div>
  );
}