import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AddWorkshopPage from "./pages/AddWorkshopPage.jsx";
import YourWorkshopPage from "./pages/YourWorkshopPage.jsx";
import EditWorkshopPage from "./pages/EditWorkshopPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

const App = () => {
  return (
    <Layout>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} /> 

        <Route path="/add-workshop" element={<AddWorkshopPage />} />
        <Route path="/your-workshop" element={<YourWorkshopPage />} />
        <Route path="/edit-workshop/:id" element={<EditWorkshopPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </Layout>
  );
};

export default App;