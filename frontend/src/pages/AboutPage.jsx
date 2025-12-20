import React from "react";
import { FaTools, FaMapMarkerAlt, FaUsers, FaShieldAlt, FaClock, FaCarSide } from "react-icons/fa";


export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen font-sans text-gray-800">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
          About Sahayarti
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md">
          Your ultimate travel companion. When the unexpected happens, Sahayarti connects you instantly to trusted workshops nearby.
        </p>
      </div>

      {/* Who We Are */}
      <div className="py-20 px-6 md:px-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-700">
          Who We Are
        </h2>
        <div className="md:flex md:gap-12 items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src="https://images.unsplash.com/photo-1581091215360-9df19ec6a0e1?auto=format&fit=crop&w=800&q=80"
              alt="Workshop"
              className="rounded-xl shadow-xl w-full object-cover transform hover:scale-105 transition duration-500"
            />
          </div>
          <div className="md:w-1/2 space-y-4 text-lg leading-relaxed">
            <p>
              At <span className="font-semibold text-blue-600">Sahayarti</span>, we believe no journey should be disrupted by vehicle problems. Our mission is to make roadside assistance fast, reliable, and stress-free.
            </p>
            <p>
              We empower travelers and workshop owners alike, creating a trusted network where help is always just a click away. From flat tires to engine troubles, we’ve got you covered.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      {/* Why Choose Us */}
<div className="bg-blue-50 py-20 px-6 md:px-20">
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-700">
    Why Choose Us
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
    <div className="bg-white p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <FaMapMarkerAlt className="text-blue-400 mx-auto mb-4 text-5xl" />
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Nearby Workshops</h3>
      <p>Locate trusted workshops near your current location instantly.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <FaTools className="text-blue-400 mx-auto mb-4 text-5xl" />
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Trusted Services</h3>
      <p>All workshops are verified and rated to ensure high-quality service.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <FaUsers className="text-blue-400 mx-auto mb-4 text-5xl" />
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Community Driven</h3>
      <p>We connect drivers and workshop owners to foster a reliable support network.</p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div className="bg-white p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <FaShieldAlt className="text-blue-400 mx-auto mb-4 text-5xl" />
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Safe & Secure</h3>
      <p>All user data and workshop info are securely stored with privacy in mind.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <FaClock className="text-blue-400 mx-auto mb-4 text-5xl" />
      <h3 className="text-xl font-semibold mb-3 text-blue-600">24/7 Assistance</h3>
      <p>Access workshops anytime, day or night, for uninterrupted travel support.</p>
    </div>

    <div className="bg-white p-8 rounded-3xl text-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <FaCarSide className="text-blue-400 mx-auto mb-4 text-5xl" />
      <h3 className="text-xl font-semibold mb-3 text-blue-600">Multi-Vehicle Support</h3>
      <p>Whether it’s a car, bike, or both, find workshops equipped to help every vehicle type.</p>
    </div>
  </div>
</div>

      

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">
          Ready for a worry-free journey?
        </h2>
        <p className="mb-6 max-w-2xl mx-auto text-lg md:text-xl drop-shadow-sm">
          Join Sahayarti today and access trusted workshops anytime, anywhere.
        </p>
        
      </div>
    </div>
  );
}
