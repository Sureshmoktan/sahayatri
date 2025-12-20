import React from "react"
import { useDispatch } from 'react-redux'

import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LandingPage from './pages/LandingPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import WorkshopForm from "./pages/WorkshopForm.jsx"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/workshop" element={<WorkshopForm />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
