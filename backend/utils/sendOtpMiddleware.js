import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Otp from "../models/Otp.js";

export const sendOtpMiddleware = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "loaded" : "MISSING");

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2️⃣ Handle existing OTP
    const existingOtp = await Otp.findOne({ email: cleanEmail });
    if (existingOtp) {
      if (existingOtp.expiresAt < new Date()) {
        await Otp.deleteOne({ email: cleanEmail });
      } else {
        return res.status(400).json({
          message: "OTP already sent. Please check your email or wait for it to expire."
        });
      }
    }

    // 3️⃣ Generate OTP and hash everything
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const passwordHash = await bcrypt.hash(password, 10);

    // 4️⃣ ✅ Send email FIRST before saving to DB
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    try {
      await transporter.sendMail({
        from: `"SahaYatri" <${process.env.EMAIL_USER}>`,
        to: cleanEmail,
        subject: "Email Verification OTP",
        html: `
          <h2>Email Verification</h2>
          <p>Your OTP is: <b>${otp}</b></p>
          <p>This code expires in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError.message);
      return res.status(500).json({ message: "Email sending failed. Please try again." });
    }

    // 5️⃣ ✅ Only save to DB after email succeeds
    await Otp.create({
      email: cleanEmail,
      fullName,
      passwordHash,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    console.log("OTP SENT:", otp); // Remove in production
    next();

  } catch (error) {
    console.error("sendOtpMiddleware error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};