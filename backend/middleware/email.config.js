import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export const otpStore = {};

export const sendOtpMiddleware = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[cleanEmail] = {
      fullName,
      passwordHash,
      code: otp,
      expires: Date.now() + 10 * 60 * 1000
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"SahaYatri" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: "Email Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>This code expires in 10 minutes.</p>
      `
    });

    console.log("OTP SENT:", otp);

    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email sending failed" });
  }
};