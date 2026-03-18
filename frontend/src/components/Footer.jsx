import React from 'react'
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-blue-100 overflow-hidden">

      {/* Top gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-blue-500" />

      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Background blobs */}
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sky-100/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* ── Brand ── */}
          <div className="md:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow duration-200">
                <svg className="w-4.5 h-4.5 text-white w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Saha<span className="text-blue-600">Yatri</span>
              </span>
            </Link>

            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Find nearby workshops, add your services, and get help on the road — all in one place.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { href: "https://facebook.com", icon: <FaFacebookF size={13} />, label: "Facebook" },
                { href: "https://twitter.com", icon: <FaTwitter size={13} />, label: "Twitter" },
                { href: "https://instagram.com", icon: <FaInstagram size={13} />, label: "Instagram" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md hover:shadow-blue-200 transition-all duration-200 active:scale-95"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-600 to-sky-400" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Quick Links</h3>
            </div>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact Us" },
                { to: "/gallery", label: "Gallery" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium group transition-colors duration-150"
                  >
                    <svg className="w-3 h-3 text-blue-300 group-hover:text-blue-500 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-150">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Info ── */}
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-1.5 h-4 rounded-full bg-gradient-to-b from-blue-600 to-sky-400" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Contact</h3>
            </div>
            <ul className="space-y-3">
              {[
                { icon: <FaPhone size={12} />, text: "+977 9800-000-000", color: "bg-blue-50 border-blue-100 text-blue-500" },
                { icon: <FaEnvelope size={12} />, text: "support@sahayatri.com", color: "bg-sky-50 border-sky-100 text-sky-500" },
                { icon: <FaMapMarkerAlt size={12} />, text: "Kathmandu, Nepal", color: "bg-emerald-50 border-emerald-100 text-emerald-500" },
              ].map(({ icon, text, color }) => (
                <li key={text} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${color}`}>
                    {icon}
                  </div>
                  <span className="text-slate-500 text-sm font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} <span className="text-blue-500 font-bold">SahaYatri</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 text-xs font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}