import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar at top */}
      <Navbar />

      {/* Main content grows */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}