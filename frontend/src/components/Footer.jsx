import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-12 pb-6 px-6 md:px-20">
      <div className="md:flex md:justify-between md:items-start mb-8">
        {/* About */}
        <div className="mb-8 md:mb-0 md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Sahayarti</h2>
          <p className="text-gray-200">
            Your trusted travel companion for roadside assistance. Connect with nearby workshops quickly and reliably.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0 md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-gray-200 transition">Home</a>
            </li>
            <li>
              <a href="/about" className="hover:text-gray-200 transition">About</a>
            </li>
            <li>
              <a href="/gallery" className="hover:text-gray-200 transition">Gallery</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-gray-200 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold mb-4">Contact</h2>
          <p>Email: support@sahayarti.com</p>
          <p>Phone: +977-123456789</p>

          <div className="flex mt-4 gap-4">
            <a href="#" className="hover:text-gray-200 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-gray-200 transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-gray-200 transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-gray-200 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-600 pt-4 text-center text-gray-200">
        © {new Date().getFullYear()} Sahayarti. All rights reserved.
      </div>
    </footer>
  );
}
