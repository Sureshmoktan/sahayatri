import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import generateToken from "../utils/generateToken.js";
import { ROLES } from "../constants/roles.js";
import { MESSAGES } from "../constants/messages.js";
import crypto from "crypto";


/* ---------------- VERIFY OTP & CREATE USER ---------------- */
export const verifyOtpService = async ({ email, otp }) => {
  const cleanEmail = email.trim().toLowerCase();
  const otpEntry = await Otp.findOne({ email: cleanEmail });

  if (!otpEntry) {
    throw { status: 400, message: MESSAGES.OTP_NOT_FOUND };
  }

  if (otpEntry.expiresAt < new Date()) {
    await Otp.deleteOne({ email: cleanEmail });
    throw { status: 400, message: MESSAGES.OTP_EXPIRED };
  }

  if (otpEntry.attempts >= 5) {
    await Otp.deleteOne({ email: cleanEmail });
    throw { status: 400, message: MESSAGES.OTP_TOO_MANY_ATTEMPTS };
  }

  await Otp.updateOne({ email: cleanEmail }, { $inc: { attempts: 1 } });

  const isValid = await bcrypt.compare(otp, otpEntry.otpHash);
  if (!isValid) {
    throw {
      status: 400,
      message: `Invalid OTP. ${4 - otpEntry.attempts} attempts remaining.`,
    };
  }

  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    await Otp.deleteOne({ email: cleanEmail });
    throw { status: 400, message: MESSAGES.USER_ALREADY_EXISTS };
  }

  const user = await User.create({
    fullName: otpEntry.fullName,
    email: cleanEmail,
    password: otpEntry.passwordHash,
    isVerified: true,
  });

  await Otp.deleteOne({ email: cleanEmail });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
  };
};

/* ---------------- LOGIN ---------------- */
export const loginService = async ({ email, password }) => {
  const cleanEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: cleanEmail });
  if (!user) {
    throw { status: 400, message: MESSAGES.INVALID_CREDENTIALS };
  }

  if (!user.isVerified) {
    throw { status: 403, message: MESSAGES.EMAIL_NOT_VERIFIED };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 400, message: MESSAGES.INVALID_CREDENTIALS };
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};



// ⭐ Forgot Password — generate token and send email
export const forgotPasswordService = async (email) => {
  const cleanEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  // Don't reveal if user exists or not (security)
  if (!user) return;

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken   = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
  await user.save();

  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset Your SahaYatri Password",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e2e8f0;border-radius:16px">
        <h2 style="color:#1d4ed8">Reset Your Password</h2>
        <p style="color:#64748b">You requested a password reset. Click the button below to set a new password.</p>
        <a href="${resetUrl}"
          style="display:inline-block;margin:20px 0;padding:12px 28px;background:#2563eb;color:white;font-weight:bold;border-radius:10px;text-decoration:none">
          Reset Password
        </a>
        <p style="color:#94a3b8;font-size:13px">This link expires in <strong>15 minutes</strong>.</p>
        <p style="color:#94a3b8;font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

// ⭐ Reset Password — verify token and update password
export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:   hashedToken,
    resetPasswordExpires: { $gt: new Date() }, // not expired
  });

  if (!user) {
    throw { status: 400, message: "Reset link is invalid or has expired." };
  }

  user.password             = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken   = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};