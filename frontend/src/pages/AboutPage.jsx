import { useState } from "react";
import React from "react";

const team = [
  {
    name: "Ramesh Thapa",
    role: "Chief Mechanic & Founder",
    exp: "18 yrs experience",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
    bio: "Started fixing bikes at 16, now leads a team of 50+ certified mechanics across the valley.",
  },
  {
    name: "Sita Karki",
    role: "Operations Manager",
    exp: "10 yrs experience",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    bio: "Ensures every rescue mission is dispatched within minutes. The backbone of our 24/7 service.",
  },
  {
    name: "Bikash Rai",
    role: "Senior Auto Electrician",
    exp: "12 yrs experience",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    bio: "Specializes in modern EV and hybrid diagnostics. No electrical fault is too complex for Bikash.",
  },
  {
    name: "Priya Shrestha",
    role: "Customer Experience Lead",
    exp: "7 yrs experience",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    bio: "Makes sure every customer feels cared for — from first call to final fix.",
  },
];

const values = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lightning Fast",
    desc: "Average 15-minute response time. We know every minute stranded feels like an hour.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Certified & Trusted",
    desc: "Every mechanic is government-certified with background verification and insurance coverage.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Always Available",
    desc: "Day, night, holiday or monsoon — our dispatch center never sleeps.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Transparent Pricing",
    desc: "Fixed rates, no hidden charges. You know the cost before we touch your vehicle.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Valley-Wide Coverage",
    desc: "500+ mechanics across all major roads and highways. Wherever you are, we're close.",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Customer First",
    desc: "4.9★ average rating from 12,000+ happy customers. We don't stop until you're satisfied.",
  },
];

const milestones = [
  { year: "2015", event: "Founded with 3 mechanics and a dream" },
  { year: "2017", event: "Expanded to 50 mechanics, launched mobile app" },
  { year: "2019", event: "10,000th successful roadside rescue" },
  { year: "2021", event: "Added EV & hybrid vehicle support" },
  { year: "2023", event: "500+ mechanics, valley-wide 24/7 coverage" },
  { year: "2025", event: "Launched real-time GPS mechanic tracking" },
];

export default function AboutPage() {
  const [activeTeam, setActiveTeam] = useState(null);

  return (
    <div className="min-h-screen bg-blue-50 font-sans">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 pt-20 pb-32">

        {/* Background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-10 -left-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-40 rounded-full bg-blue-800/30 blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
            <span className="text-sky-100 text-xs font-semibold tracking-widest uppercase">Our Story</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
            Built for the{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-white">
                Road Ahead
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-300 to-transparent rounded-full" />
            </span>
          </h1>

          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            We started with a simple belief — no one should feel helpless on the road. 
            Today, we're the valley's most trusted on-road mechanic service, 
            available 24/7, rain or shine.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-5">
            {[["500+", "Mechanics"], ["12K+", "Happy Customers"], ["4.9★", "App Rating"], ["8 yrs", "In Service"]].map(([val, label]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[110px]">
                <p className="text-3xl font-black text-white">{val}</p>
                <p className="text-sky-200 text-xs uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80V40C240 0 480 80 720 40C960 0 1200 80 1440 40V80H0Z" fill="#eff6ff" />
          </svg>
        </div>
      </section>

      {/* ── MISSION SPLIT ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-3">Who We Are</p>
          <h2 className="text-4xl font-black text-slate-900 leading-tight mb-5">
            More Than a Repair Service — <span className="text-blue-600">We're Your Road Partner</span>
          </h2>
          <p className="text-slate-600 leading-relaxed mb-5">
            Founded in 2015 by a team of passionate mechanics, we set out to solve 
            one of the most stressful experiences a driver faces — being stranded with 
            a broken-down vehicle and no help in sight.
          </p>
          <p className="text-slate-600 leading-relaxed mb-8">
            We built a network of certified, vetted mechanics who can reach you wherever 
            you are — highway, city street, or mountain road — and get you back moving fast. 
            No overcharging. No guesswork. Just honest, fast, quality work.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:scale-105">
              Join Our Team
            </button>
            <button className="border-2 border-blue-200 hover:border-blue-400 text-blue-600 font-semibold px-6 py-3 rounded-xl transition-all duration-200">
              Our Services
            </button>
          </div>
        </div>

        {/* Image collage */}
        <div className="relative h-80 md:h-96">
          <img
            src="https://images.unsplash.com/photo-1632823471565-1ecdf5c6da1e?w=500&q=80"
            alt="Mechanic at work"
            className="absolute top-0 left-0 w-2/3 h-3/4 object-cover rounded-2xl shadow-xl border-4 border-white"
          />
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
            alt="Bike repair"
            className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover rounded-2xl shadow-xl border-4 border-white"
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
            ✦ Trusted since 2015
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-2">What Drives Us</p>
            <h2 className="text-4xl font-black text-slate-900">Our Core Values</h2>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-sky-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200 cursor-default"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-100 group-hover:bg-white/20 flex items-center justify-center text-blue-600 group-hover:text-white transition-all duration-300 mb-4">
                  {v.icon}
                </div>
                <h3 className="text-slate-900 group-hover:text-white font-bold text-lg mb-2 transition-colors duration-300">
                  {v.title}
                </h3>
                <p className="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed transition-colors duration-300">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mb-2">Our Journey</p>
          <h2 className="text-4xl font-black text-slate-900">Milestones That Made Us</h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-sky-400" />
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-sky-400 to-blue-100" />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <div key={i} className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <div className={`inline-block bg-white border border-blue-100 rounded-2xl px-5 py-4 shadow-md hover:shadow-blue-100 hover:border-blue-300 transition-all duration-200`}>
                    <p className="text-blue-600 font-black text-2xl">{m.year}</p>
                    <p className="text-slate-700 text-sm mt-1">{m.event}</p>
                  </div>
                </div>

                {/* Dot */}
                <div className="relative z-10 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-50 shadow-lg shadow-blue-200 flex-shrink-0" />

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sky-200 text-xs font-bold tracking-widest uppercase mb-2">The People Behind It</p>
            <h2 className="text-4xl font-black text-white">Meet Our Team</h2>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-sky-300 to-white" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onMouseEnter={() => setActiveTeam(i)}
                onMouseLeave={() => setActiveTeam(null)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />

                  {/* Bio overlay */}
                  <div className={`absolute inset-0 bg-blue-900/90 flex items-center justify-center p-4 transition-opacity duration-300 ${activeTeam === i ? "opacity-100" : "opacity-0"}`}>
                    <p className="text-blue-100 text-sm text-center leading-relaxed">{member.bio}</p>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-bold text-base">{member.name}</h3>
                  <p className="text-sky-300 text-xs mt-0.5">{member.role}</p>
                  <span className="inline-block mt-2 bg-white/15 text-sky-200 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {member.exp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-100 p-12">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Stuck on the Road?
            </h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Don't wait. Our team is ready to come to you right now — just one tap away.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-200 hover:scale-105 text-lg">
                🔧 Book a Mechanic Now
              </button>
              <button className="border-2 border-blue-200 hover:border-blue-500 text-blue-600 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-lg">
                📞 Call Us Directly
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}