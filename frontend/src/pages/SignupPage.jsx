import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OtpModal from "../components/OtpModel";
import { sendOtp, verifyOtp } from "../services/authService";
import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const countdownRef = useRef(null);

  // Start countdown when success modal appears
  useEffect(() => {
    if (!showSuccess) return;

    setCountdown(6);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownRef.current);
  }, [showSuccess]);

  // ✅ Clears the error for a field as soon as the user starts typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await sendOtp(formData.fullName, formData.email, formData.password);
      setShowOtp(true);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (otp) => {
    try {
      await verifyOtp(formData.email, otp, formData.fullName, formData.password);
      setShowOtp(false);
      setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
      setShowSuccess(true); // ✅ show success modal
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Step 3: Resend OTP
  const handleResendOtp = async () => {
    try {
      await sendOtp(formData.fullName, formData.email, formData.password);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleGoToLogin = () => {
    clearInterval(countdownRef.current);
    navigate("/login");
  };

  return (
    <>
      <SignupForm
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />

      {showOtp && (
        <OtpModal
          email={formData.email}
          onVerify={handleVerifyOtp}
          onClose={() => setShowOtp(false)}
          onResend={handleResendOtp}
        />
      )}

      {/* ── SUCCESS MODAL ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm" />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-blue-200/60 border border-blue-100 overflow-hidden">

            {/* Top accent bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400" />

            <div className="p-8 flex flex-col items-center text-center">

              {/* Animated checkmark */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-blue-100">
                <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Text */}
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                🎉 Congratulations!
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-1">
                Your account has been created successfully.
              </p>
              <p className="text-slate-400 text-sm mb-6">
                You can now log in and get help on the road.
              </p>

              {/* Countdown ring */}
              <div className="relative w-14 h-14 mb-6">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 24}`}
                    strokeDashoffset={`${2 * Math.PI * 24 * (1 - countdown / 6)}`}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-blue-600 font-black text-lg">
                  {countdown}
                </span>
              </div>

              <p className="text-slate-400 text-xs mb-6">
                Redirecting to login in{" "}
                <span className="text-blue-600 font-bold">{countdown}s</span>
              </p>

              {/* Login button */}
              <button
                onClick={handleGoToLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-95"
              >
                Go to Login →
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPage;