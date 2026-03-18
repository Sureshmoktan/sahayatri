import { useState } from "react";
import React from "react";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1632823471565-1ecdf5c6da1e?w=600&q=80",
    title: "Roadside Engine Repair",
    description: "Expert mechanic diagnosing engine trouble on the highway",
    tag: "Car Repair",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1599256871679-6a8b1c0d0a21?w=600&q=80",
    title: "Tyre Change on the Go",
    description: "Quick tyre swap keeping you back on the road fast",
    tag: "Tyre Service",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    title: "Bike Breakdown Fix",
    description: "Motorcycle mechanic repairing a stranded bike roadside",
    tag: "Bike Repair",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80",
    title: "Under the Hood",
    description: "Deep inspection and repair of car engine components",
    tag: "Engine Work",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?w=600&q=80",
    title: "Oil & Fluid Check",
    description: "On-spot oil change and fluid top-up services",
    tag: "Maintenance",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80",
    title: "Emergency Breakdown",
    description: "Fast response to get your vehicle moving again",
    tag: "Emergency",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80",
    title: "Scooter Street Service",
    description: "Two-wheeler repair right where you need it most",
    tag: "Scooter",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
    title: "Brake System Repair",
    description: "Critical brake repairs ensuring your safety on the road",
    tag: "Safety",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80",
    title: "Night Rescue Service",
    description: "24/7 roadside assistance even after dark",
    tag: "24/7 Service",
  },
];

const tagColors = {
  "Car Repair": "bg-blue-600",
  "Tyre Service": "bg-sky-500",
  "Bike Repair": "bg-indigo-500",
  "Engine Work": "bg-blue-700",
  "Maintenance": "bg-cyan-600",
  "Emergency": "bg-red-500",
  "Scooter": "bg-purple-500",
  "Safety": "bg-teal-600",
  "24/7 Service": "bg-blue-500",
};

export default function GalleryPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* HERO SECTION */}
      <section className="relative h-[85vh] min-h-[520px] flex items-center justify-center overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80"
          alt="Mechanic working"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-blue-50/20 to-slate-50" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

          <div className="inline-flex items-center gap-2 bg-white/80 border border-blue-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-blue-600 text-xs font-semibold tracking-widest uppercase">
              On-Road Rescue Squad
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-none tracking-tight mb-6">
            We Fix You{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
              Anywhere
            </span>
          </h1>

          <p className="text-slate-700 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Stranded on the highway? Our certified mechanics rush to your location —
            cars, bikes, scooters, any time of day or night.
          </p>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
            {[["500+", "Mechanics"], ["4.9★", "Rating"], ["15 min", "Avg. Response"], ["24/7", "Available"]].map(
              ([val, label]) => (
                <div key={label} className="bg-white/70 rounded-2xl px-5 py-3 shadow-sm">
                  <p className="text-2xl font-black text-blue-600">{val}</p>
                  <p className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* GALLERY */}
      <section className="px-4 md:px-10 lg:px-20 pb-24">

        <div className="text-center mb-14">
          <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-2">
            Real Work · Real People
          </p>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            Our Mechanics in Action
          </h2>

          <div className="mt-5 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-1"
              onMouseEnter={() => setHovered(img.id)}
              onMouseLeave={() => setHovered(null)}
            >

              <div className="relative h-56 overflow-hidden">
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <span className={`absolute top-3 left-3 ${tagColors[img.tag]} text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full`}>
                  {img.tag}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-slate-900 font-bold text-lg group-hover:text-blue-600">
                  {img.title}
                </h3>

                <p className="text-slate-500 text-sm mt-1.5">
                  {img.description}
                </p>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                    View Detail →
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
}