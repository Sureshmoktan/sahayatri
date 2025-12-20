import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterOwner() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.fullName,
        email: form.email,
        password: form.password,
      });

      console.log("✅ Registered:", res.data);
      // Open modal on success
      setIsModalOpen(true);
    } catch (err) {
      console.error("❌ Registration error:", err.response?.data);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-blue-400">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Register Owner
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg"
          >
            Register
          </button>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-700">
              🎉 Congratulations!
            </h2>
            <p className="mb-6">You have successfully registered.</p>
            <button
              onClick={handleModalClose}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
