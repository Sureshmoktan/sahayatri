import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="bg-blue-50 min-h-screen py-16 px-6 md:px-20 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Have a question, need support, or want to collaborate? Reach out to us and we'll get back to you quickly.
        </p>
      </div>

      <div className="md:flex md:gap-12">
        {/* Contact Info */}
        <div className="md:w-1/2 mb-12 md:mb-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-2xl transition">
            <FaEnvelope className="text-blue-500 text-3xl" />
            <div>
              <h3 className="font-semibold text-blue-600 mb-1">Email</h3>
              <p>support@sahayarti.com</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-2xl transition">
            <FaPhone className="text-blue-500 text-3xl" />
            <div>
              <h3 className="font-semibold text-blue-600 mb-1">Phone</h3>
              <p>+977-123456789</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center gap-4 hover:shadow-2xl transition">
            <FaMapMarkerAlt className="text-blue-500 text-3xl" />
            <div>
              <h3 className="font-semibold text-blue-600 mb-1">Address</h3>
              <p>Kathmandu, Nepal</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:w-1/2 bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                placeholder="Your Message"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={5}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-3 rounded-full hover:bg-blue-600 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
