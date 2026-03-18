import API from "../api/axios";
// services/authService.js

// Step 1: send OTP (signup)
export const sendOtp = (fullName, email, password) => {
  return API.post("/auth/signup", { fullName, email, password });
};

// Step 2: verify OTP and create user
export const verifyOtp = (email, otp, fullName, password) => {
  return API.post("/auth/verify-otp", { email, otp, fullName, password });
};

// login (no change)
export const login = (email, password) => API.post("/auth/login", { email, password });

export const forgotPassword = (email)              => API.post("/auth/forgot-password", { email });
export const resetPassword  = (token, password)    => API.post(`/auth/reset-password/${token}`, { password });
