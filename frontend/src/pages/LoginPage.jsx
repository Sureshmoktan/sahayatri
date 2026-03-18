import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import { login } from "../services/authService";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await login(formData.email, formData.password);

      // ✅ Store token and name
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.fullName);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // ← ADD THIS


      // ✅ Full page redirect so Navbar re-reads localStorage
      window.location.href = "/";
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginForm
      formData={formData}
      errors={errors}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};

export default LoginPage;