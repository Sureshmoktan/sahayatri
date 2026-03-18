import { useState } from "react";
import React from "react";
import { submitContact } from "../services/contactService";

const contactMethods = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Call Us Anytime",
    value: "+977 9800-123456",
    sub: "24/7 Emergency Line",
    color: "bg-blue-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email Support",
    value: "help@sahayatri.com",
    sub: "Reply within 2 hours",
    color: "bg-sky-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Head Office",
    value: "Kathmandu, Nepal",
    sub: "New Baneshwor, Ward 10",
    color: "bg-indigo-500",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: "Live Chat",
    value: "Chat with us now",
    sub: "Avg. response: 3 min",
    color: "bg-cyan-500",
  },
];

const faqs = [
  {
    q: "How fast will a mechanic reach me?",
    a: "Our average response time is 15 minutes within city areas. Highway and rural locations may take 25–40 minutes depending on the nearest mechanic's location.",
  },
  {
    q: "Is the service available at night?",
    a: "Yes! We operate 24 hours a day, 7 days a week, 365 days a year — including all public holidays.",
  },
  {
    q: "How do I pay for the service?",
    a: "We accept cash, eSewa, Khalti, and all major bank cards. Pricing is fixed and shown upfront before confirmation.",
  },
  {
    q: "Do you service both cars and bikes?",
    a: "Absolutely. We handle cars, motorcycles, scooters, electric vehicles, and light commercial vehicles.",
  },
  {
    q: "What if the mechanic can't fix the issue on-site?",
    a: "If the issue requires a workshop, we arrange towing to the nearest partner garage at no extra charge.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.message) {
      setError("Name, phone and message are required.");
      return;
    }

    try {
      setLoading(true);
      await submitContact(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 pt-20 pb-32">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-16 -left-12 w-52 h-52 rounded-full bg-white/5" />
        <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-sky-400/20" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
            <span className="text-sky-100 text-xs font-semibold tracking-widest uppercase">We're Here for You</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white leading-none tracking-tight mb-5">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-white">
              Touch
            </span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto leading-relaxed">
            Broken down? Have a question? Want to join our team?
            Drop us a message or call — we respond fast, always.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80V40C240 0 480 80 720 40C960 0 1200 80 1440 40V80H0Z" fill="#eff6ff" />
          </svg>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="max-w-6xl mx-auto px-6 -mt-2 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((c, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-blue-100 p-5 shadow-md hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {c.icon}
              </div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-1">{c.label}</p>
              <p className="text-slate-900 font-bold text-base leading-tight">{c.value}</p>
              <p className="text-blue-500 text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + MAP ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-start">

        {/* ── FORM ── */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-50 p-8">
          {!submitted ? (
            <>
              <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-2">Send a Message</p>
              <h2 className="text-3xl font-black text-slate-900 mb-6">How Can We Help?</h2>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 mb-5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Name + Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 text-sm font-semibold mb-1.5">Full Name <span className="text-red-400">*</span></label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ramesh Thapa"
                      className="w-full border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all duration-200 placeholder-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-sm font-semibold mb-1.5">Phone <span className="text-red-400">*</span></label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all duration-200 placeholder-slate-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-600 text-sm font-semibold mb-1.5">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className="w-full border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all duration-200 placeholder-slate-300"
                  />
                </div>

                {/* Service type */}
                <div>
                  <label className="block text-slate-600 text-sm font-semibold mb-1.5">Service Needed</label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className="w-full border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-700 text-sm outline-none transition-all duration-200 bg-white"
                  >
                    <option value="">Select a service...</option>
                    <option>Emergency Roadside Repair</option>
                    <option>Tyre Change</option>
                    <option>Battery Jump Start</option>
                    <option>Engine Diagnosis</option>
                    <option>Towing Service</option>
                    <option>General Enquiry</option>
                    <option>Join as Mechanic</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-slate-600 text-sm font-semibold mb-1.5">Message <span className="text-red-400">*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your issue or question..."
                    className="w-full border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 text-sm outline-none transition-all duration-200 placeholder-slate-300 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Sending...
                    </>
                  ) : "Send Message →"}
                </button>

                <p className="text-slate-400 text-xs text-center">
                  We typically reply within 2 hours during business hours.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Message Sent!</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                Thanks, <span className="font-semibold text-blue-600">{form.name}</span>! We've received your message and will get back to you very soon.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", phone: "", email: "", service: "", message: "" });
                  setError("");
                }}
                className="border-2 border-blue-200 hover:border-blue-500 text-blue-600 font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
              >
                Send Another
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT SIDE: Map + Hours ── */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-50 overflow-hidden">
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-300/60" />
              <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-blue-300/60" />
              <div className="absolute left-2/3 top-0 bottom-0 w-1 bg-blue-200/60" />
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-blue-200/40" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-300 border-4 border-white">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="mt-2 bg-white rounded-lg px-3 py-1.5 shadow-lg border border-blue-100 text-xs font-bold text-blue-700">
                  SahaYatri HQ
                </div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-slate-900 font-bold">New Baneshwor, Kathmandu</p>
              <p className="text-slate-500 text-sm mt-1">Ward 10, Bagmati Province, Nepal</p>
              <a href="#" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold mt-3 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-50 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-900 font-bold">Working Hours</p>
                <p className="text-slate-400 text-xs">Emergency line is always open</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                ["Monday – Friday", "8:00 AM – 8:00 PM", true],
                ["Saturday", "9:00 AM – 6:00 PM", true],
                ["Sunday", "10:00 AM – 4:00 PM", false],
                ["Emergency Line", "24 / 7", true],
              ].map(([day, time, open]) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-slate-600 text-sm">{day}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${open ? "text-slate-900" : "text-slate-400"}`}>{time}</span>
                    {day === "Emergency Line" && (
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-sky-500 rounded-3xl p-6 text-white">
            <p className="font-bold text-lg mb-1">Follow Our Journey</p>
            <p className="text-blue-100 text-sm mb-5">Stay updated on tips, rescues & team stories.</p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "YouTube", "Twitter"].map((s) => (
                <button key={s} className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 hover:scale-105">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-2">Quick Answers</p>
            <h2 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-sky-400" />
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i ? "border-blue-300 shadow-md shadow-blue-100" : "border-slate-200"}`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className={`font-semibold text-sm md:text-base transition-colors ${openFaq === i ? "text-blue-600" : "text-slate-800"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300 ${openFaq === i ? "bg-blue-600 rotate-45" : "bg-blue-50"}`}>
                    <svg className={`w-4 h-4 transition-colors ${openFaq === i ? "text-white" : "text-blue-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-500 text-sm leading-relaxed border-t border-blue-50 pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}