import asyncHandler from "../utils/asyncHandler.js";
import { verifyOtpService, loginService, forgotPasswordService, resetPasswordService } from "../services/auth.service.js";
import { MESSAGES } from "../constants/messages.js";
import { HTTP } from "../constants/httpStatus.js";

/* ---------------- SIGNUP ---------------- */
export const signup = (req, res) => {
  res.status(HTTP.OK).json({ message: MESSAGES.OTP_SENT });
};

/* ---------------- VERIFY OTP & CREATE USER ---------------- */
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(HTTP.BAD_REQUEST).json({ message: "Email and OTP are required" });
  }

  const user = await verifyOtpService({ email, otp });

  res.status(HTTP.CREATED).json({
    message: MESSAGES.SIGNUP_SUCCESS,
    user,
  });
});

/* ---------------- LOGIN ---------------- */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(HTTP.BAD_REQUEST).json({ message: "Email and password are required" });
  }

  const result = await loginService({ email, password });

  res.status(HTTP.OK).json({
    message: MESSAGES.LOGIN_SUCCESS,
    ...result,
  });
});


export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(HTTP.BAD_REQUEST).json({ message: "Email is required" });

  await forgotPasswordService(email);

  // Always return success — don't reveal if email exists
  res.status(HTTP.OK).json({
    message: "If this email exists, a reset link has been sent.",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(HTTP.BAD_REQUEST).json({ message: "Password must be at least 6 characters" });
  }

  await resetPasswordService(token, password);

  res.status(HTTP.OK).json({ message: "Password reset successful. You can now login." });
});