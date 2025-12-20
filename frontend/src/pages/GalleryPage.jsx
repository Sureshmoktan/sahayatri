import React from "react";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1581091215360-9df19ec6a0e1?auto=format&fit=crop&w=800&q=80", caption: "Reliable Workshop" },
  { src: "https://images.unsplash.com/photo-1581091012184-7a2c6e25b27f?auto=format&fit=crop&w=800&q=80", caption: "Flat Tire Assistance" },
  { src: "https://images.unsplash.com/photo-1608889179108-d49f5a42c7b7?auto=format&fit=crop&w=800&q=80", caption: "Expert Mechanics" },
  { src: "https://images.unsplash.com/photo-1616497920756-cafefb5d05b3?auto=format&fit=crop&w=800&q=80", caption: "24/7 Service" },
  { src: "https://images.unsplash.com/photo-1593784992944-15217f7c9e3e?auto=format&fit=crop&w=800&q=80", caption: "Vehicle Repairs" },
  { src: "https://images.unsplash.com/photo-1605902711622-cfb43c4436b5?auto=format&fit=crop&w=800&q=80", caption: "Emergency Help" },
];

export default function GalleryPage() {
  return (
    <div className="bg-blue-50 min-h-screen py-16 px-6 md:px-20 font-sans text-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">Gallery</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Explore our workshops, services, and moments helping travelers on the road.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryImages.map((img, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <img
              src={img.src}
              alt={img.caption}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white text-center font-semibold text-lg">
              {img.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
