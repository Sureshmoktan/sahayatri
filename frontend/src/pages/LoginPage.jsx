import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { login } from "../redux/slices/authSlice"; // use the 'login' action, not 'setUser'
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // handle input field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // login request handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ send credentials to backend
      const res = await axios.post("http://localhost:5000/api/auth/login", form, {
        withCredentials: true, // include cookies if your backend uses them
      });

      console.log(res,"res")

      // ✅ handle backend response
      const userData = res.data.user || res.data; // adjust depending on your API response
      dispatch(login(userData)); // store user info in redux

      // ✅ optional: persist user to localStorage for auto login
      localStorage.setItem("user", JSON.stringify(userData));

      alert(res.data.message || "Login successful!");
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("❌ Login error:", err.response?.data);
      alert(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold transition ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
