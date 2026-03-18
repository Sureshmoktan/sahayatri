import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllUsers,
  getAllWorkshops,
  deleteUser,
  deleteWorkshop,
} from "../services/adminService";
import { getAllContacts, markAsRead } from "../services/contactService";

const NAV = [
  {
    key: "overview", label: "Overview",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  },
  {
    key: "workshops", label: "Workshops",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
  {
    key: "users", label: "Users",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    key: "messages", label: "Messages",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
];

const TYPE_ICONS = { bike: "🏍️", car: "🚗", both: "🔧" };
const TYPE_LABELS = { bike: "Bike", car: "Car", both: "Bike & Car" };

// ── Delete Modal ──
function DeleteModal({ target, onConfirm, onCancel, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !deleting && onCancel()} />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-red-100 px-8 py-8 max-w-sm w-full text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 to-rose-500" />
        <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-1">Delete {target}?</h2>
        <p className="text-slate-500 text-sm mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={deleting} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold py-2.5 rounded-xl shadow-md active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 transition">
            {deleting
              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
              : "Yes, Delete"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ label, value, icon, color, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-50/60 p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${color}`}>{icon}</div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value ?? "—"}</p>
      <p className="text-slate-500 text-sm font-semibold">{label}</p>
      {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── Skeleton ──
function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5 animate-pulse space-y-2">
      <div className="h-4 w-1/3 bg-slate-100 rounded" />
      <div className="h-3 w-1/2 bg-slate-100 rounded" />
      <div className="h-3 w-2/3 bg-slate-100 rounded" />
    </div>
  );
}

// ── Search Input ──
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white border border-blue-100 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingW, setLoadingW] = useState(true);
  const [loadingU, setLoadingU] = useState(true);
  const [loadingM, setLoadingM] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [wsSearch, setWsSearch] = useState("");
  const [uSearch, setUSearch] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [msgFilter, setMsgFilter] = useState("all"); // all | unread | read
  const [expandedMsg, setExpandedMsg] = useState(null);
  const adminName = localStorage.getItem("userName") || "Admin";

  const unreadCount = messages.filter((m) => !m.isRead).length;

  // ── Fetch all data ──
  const fetchAll = useCallback(async () => {
    try {
      setLoadingW(true);
      setLoadingU(true);
      setLoadingM(true);
      const [ws, us, msgs] = await Promise.all([
        getAllWorkshops(),
        getAllUsers(),
        getAllContacts(),
      ]);
      setWorkshops(ws.data || ws);
      setUsers(us.data || us);
      setMessages(msgs.data || msgs);
    } catch {
      setError("Failed to load data. Make sure you are logged in as admin.");
    } finally {
      setLoadingW(false);
      setLoadingU(false);
      setLoadingM(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Handle delete ──
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === "workshop") {
        await deleteWorkshop(deleteTarget.id);
        setWorkshops((prev) => prev.filter((w) => w._id !== deleteTarget.id));
      } else {
        await deleteUser(deleteTarget.id);
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch {
      setError("Failed to delete. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Handle mark as read ──
  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setMessages((prev) =>
        prev.map((m) => m._id === id ? { ...m, isRead: true } : m)
      );
    } catch {
      setError("Failed to mark as read.");
    }
  };

  const filteredWs = workshops.filter((w) =>
    w.name?.toLowerCase().includes(wsSearch.toLowerCase()) ||
    w.email?.toLowerCase().includes(wsSearch.toLowerCase())
  );

  const filteredUs = users.filter((u) =>
    u.fullName?.toLowerCase().includes(uSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(uSearch.toLowerCase())
  );

  const filteredMsgs = messages
    .filter((m) => msgFilter === "all" ? true : msgFilter === "unread" ? !m.isRead : m.isRead)
    .filter((m) =>
      m.name?.toLowerCase().includes(msgSearch.toLowerCase()) ||
      m.email?.toLowerCase().includes(msgSearch.toLowerCase()) ||
      m.message?.toLowerCase().includes(msgSearch.toLowerCase())
    );

  // ── Sidebar ──
  const SidebarContent = () => (
    <aside className="flex flex-col h-full bg-white border-r border-blue-100">
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />
      <div className="px-6 py-5 border-b border-blue-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-200">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">Saha<span className="text-blue-600">Yatri</span></p>
            <p className="text-xs text-slate-400 font-semibold">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150
              ${activeTab === key ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`}
          >
            {icon}
            {label}
            {/* Unread badge on Messages */}
            {key === "messages" && unreadCount > 0 && (
              <span className={`ml-auto text-xs font-black px-2 py-0.5 rounded-full ${activeTab === key ? "bg-white text-blue-600" : "bg-red-500 text-white"}`}>
                {unreadCount}
              </span>
            )}
            {activeTab === key && key !== "messages" && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-blue-50 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-800 truncate">{adminName}</p>
            <p className="text-xs text-blue-500 font-bold">Administrator</p>
          </div>
        </div>
        <button
          onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("userName"); navigate("/login"); }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-blue-50 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 flex-col flex-shrink-0 relative z-10 shadow-xl shadow-blue-100/40">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 flex flex-col z-50 shadow-2xl"><SidebarContent /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">

        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-blue-100 px-6 py-4 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-blue-100 border border-blue-200 rounded-full px-3 py-1 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-600 text-xs font-bold tracking-widest uppercase">Admin</span>
              </div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                {NAV.find((n) => n.key === activeTab)?.label}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {workshops.length} workshops · {users.length} users · {unreadCount} unread
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={users.length} sub="Registered accounts" color="bg-blue-50 border-blue-100 text-blue-500"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
                <StatCard label="Total Workshops" value={workshops.length} sub="Registered workshops" color="bg-sky-50 border-sky-100 text-sky-500"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
                <StatCard label="Unread Messages" value={unreadCount} sub="Contact form submissions" color="bg-amber-50 border-amber-100 text-amber-500"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                <StatCard label="Car Workshops" value={workshops.filter((w) => w.type === "car" || w.type === "both").length} sub="Car & multi-service" color="bg-emerald-50 border-emerald-100 text-emerald-500" icon={<span className="text-2xl">🚗</span>} />
              </div>

              {/* Recent workshops */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900 text-sm">Recently Registered Workshops</h2>
                  <button onClick={() => setActiveTab("workshops")} className="text-xs text-blue-500 font-bold hover:text-blue-700 transition">View all →</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {loadingW ? [1,2,3].map((i) => <div key={i} className="px-6 py-3"><Skeleton /></div>)
                    : workshops.slice(0, 5).map((ws) => (
                      <div key={ws._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-blue-50/40 transition">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg flex-shrink-0">{TYPE_ICONS[ws.type]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{ws.name}</p>
                          <p className="text-xs text-slate-400 truncate">{ws.email}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-mono hidden sm:block">
                          {new Date(ws.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    ))}
                  {!loadingW && workshops.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No workshops yet.</p>}
                </div>
              </div>

              {/* Recent messages */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900 text-sm">Recent Messages</h2>
                  <button onClick={() => setActiveTab("messages")} className="text-xs text-blue-500 font-bold hover:text-blue-700 transition">View all →</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {loadingM ? [1,2,3].map((i) => <div key={i} className="px-6 py-3"><Skeleton /></div>)
                    : messages.slice(0, 5).map((m) => (
                      <div key={m._id} className={`flex items-center gap-4 px-6 py-3.5 hover:bg-blue-50/40 transition ${!m.isRead ? "bg-amber-50/30" : ""}`}>
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                          {m.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{m.name}</p>
                          <p className="text-xs text-slate-400 truncate">{m.message}</p>
                        </div>
                        {!m.isRead && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />}
                      </div>
                    ))}
                  {!loadingM && messages.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No messages yet.</p>}
                </div>
              </div>

              {/* Recent users */}
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-black text-slate-900 text-sm">Recently Joined Users</h2>
                  <button onClick={() => setActiveTab("users")} className="text-xs text-blue-500 font-bold hover:text-blue-700 transition">View all →</button>
                </div>
                <div className="divide-y divide-slate-50">
                  {loadingU ? [1,2,3].map((i) => <div key={i} className="px-6 py-3"><Skeleton /></div>)
                    : users.slice(0, 5).map((u) => (
                      <div key={u._id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-blue-50/40 transition">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                          {u.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{u.fullName}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${u.isVerified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                          {u.isVerified ? "Verified" : "Pending"}
                        </span>
                      </div>
                    ))}
                  {!loadingU && users.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No users yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── WORKSHOPS TAB ── */}
          {activeTab === "workshops" && (
            <div className="space-y-4">
              <SearchInput value={wsSearch} onChange={setWsSearch} placeholder="Search by name or email..." />
              {loadingW
                ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} />)}</div>
                : filteredWs.length === 0
                  ? <div className="text-center py-16 text-slate-400"><span className="text-4xl mb-3 block">🔧</span><p className="font-semibold">No workshops found</p></div>
                  : <div className="space-y-3">
                      {filteredWs.map((ws) => (
                        <div key={ws._id} className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
                          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-400" />
                          <div className="p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl flex-shrink-0">{TYPE_ICONS[ws.type]}</div>
                                <div>
                                  <h3 className="font-black text-slate-900 text-sm">{ws.name}</h3>
                                  <p className="text-xs text-slate-400 mt-0.5">{ws.email}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs bg-blue-50 border border-blue-100 text-blue-600 font-bold px-2.5 py-1 rounded-full">{TYPE_LABELS[ws.type]}</span>
                                    <span className="text-xs text-slate-400 font-medium">📞 {ws.phone}</span>
                                    {ws.address && <span className="text-xs text-slate-400 font-medium truncate max-w-xs">📍 {ws.address}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => window.open(`https://www.google.com/maps?q=${ws.location?.lat},${ws.location?.lng}`, "_blank")}
                                  className="flex items-center gap-1.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-xs px-3 py-2 rounded-xl transition active:scale-95">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                  Map
                                </button>
                                <button onClick={() => setDeleteTarget({ type: "workshop", id: ws._id, name: ws.name })}
                                  className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs px-3 py-2 rounded-xl transition active:scale-95">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300 mt-3 font-mono">
                              Registered {new Date(ws.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
              }
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <SearchInput value={uSearch} onChange={setUSearch} placeholder="Search by name or email..." />
              {loadingU
                ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} />)}</div>
                : filteredUs.length === 0
                  ? <div className="text-center py-16 text-slate-400"><span className="text-4xl mb-3 block">👤</span><p className="font-semibold">No users found</p></div>
                  : <div className="space-y-3">
                      {filteredUs.map((u) => (
                        <div key={u._id} className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
                          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-400" />
                          <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-md shadow-blue-200">
                                {u.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-sm">{u.fullName}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                                <p className="text-xs text-slate-300 font-mono mt-1">
                                  Joined {new Date(u.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${u.isVerified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                                {u.isVerified ? "✓ Verified" : "⏳ Pending"}
                              </span>
                              <button onClick={() => setDeleteTarget({ type: "user", id: u._id, name: u.fullName })}
                                className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs px-3 py-2 rounded-xl transition active:scale-95">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
              }
            </div>
          )}

          {/* ── MESSAGES TAB ── */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <SearchInput value={msgSearch} onChange={setMsgSearch} placeholder="Search by name, email or message..." />
                </div>
                <div className="flex gap-2">
                  {["all", "unread", "read"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setMsgFilter(f)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                        msgFilter === f
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-white border border-blue-100 text-slate-500 hover:text-blue-600 hover:border-blue-200"
                      }`}
                    >
                      {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
                    </button>
                  ))}
                </div>
              </div>

              {loadingM
                ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} />)}</div>
                : filteredMsgs.length === 0
                  ? <div className="text-center py-16 text-slate-400"><span className="text-4xl mb-3 block">📭</span><p className="font-semibold">No messages found</p></div>
                  : <div className="space-y-3">
                      {filteredMsgs.map((m) => (
                        <div
                          key={m._id}
                          className={`bg-white rounded-2xl border shadow-md overflow-hidden transition-all duration-200 ${
                            !m.isRead ? "border-amber-200 shadow-amber-50" : "border-blue-100"
                          }`}
                        >
                          <div className={`h-1 w-full ${!m.isRead ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-blue-600 via-sky-400 to-blue-400"}`} />
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0 ${!m.isRead ? "bg-gradient-to-br from-amber-400 to-orange-400" : "bg-gradient-to-br from-slate-400 to-slate-500"}`}>
                                  {m.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-black text-slate-900 text-sm">{m.name}</p>
                                    {!m.isRead && (
                                      <span className="text-xs bg-amber-100 text-amber-600 border border-amber-200 font-bold px-2 py-0.5 rounded-full">New</span>
                                    )}
                                    {m.service && (
                                      <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 font-bold px-2 py-0.5 rounded-full">{m.service}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 mt-0.5">
                                    {m.email && <p className="text-xs text-slate-400 truncate">{m.email}</p>}
                                    {m.phone && <p className="text-xs text-slate-400">📞 {m.phone}</p>}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-slate-300 font-mono hidden sm:block">
                                  {new Date(m.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                                {!m.isRead && (
                                  <button
                                    onClick={() => handleMarkAsRead(m._id)}
                                    className="flex items-center gap-1.5 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-xs px-3 py-2 rounded-xl transition active:scale-95"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Mark Read
                                  </button>
                                )}
                                <button
                                  onClick={() => setExpandedMsg(expandedMsg === m._id ? null : m._id)}
                                  className="flex items-center gap-1.5 border border-blue-200 text-blue-500 hover:bg-blue-50 font-bold text-xs px-3 py-2 rounded-xl transition active:scale-95"
                                >
                                  {expandedMsg === m._id ? "Hide" : "View"}
                                </button>
                              </div>
                            </div>

                            {/* Expanded message */}
                            {expandedMsg === m._id && (
                              <div className="mt-4 pt-4 border-t border-slate-100">
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Message</p>
                                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                  {m.message}
                                </p>
                                {m.isRead && (
                                  <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Marked as read
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
              }
            </div>
          )}

        </main>
      </div>

      {deleteTarget && (
        <DeleteModal
          target={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}