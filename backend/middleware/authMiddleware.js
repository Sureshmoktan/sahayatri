import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { otpStore } from "../middleware/email.config.js";



// This controller is called after OTP is sent
export const signupController = async (req, res) => {
  try {
    // Here, you could just tell the frontend OTP is sent
    res.status(200).json({ message: "OTP sent to email. Please verify to complete signup." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtpAndCreateUser = async (req, res) => {
  try {
    const { email, otp } = req.body; // frontend sends { email, otp }

    if (!email || !otp) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const otpData = otpStore[email];
    if (!otpData) return res.status(400).json({ message: "No OTP found. Please signup first." });

    if (otpData.expires < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if (otpData.code !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // OTP verified → create user
    const newUser = await User.create({
      name: otpData.fullName, // fixed: use fullName
      email,
      password: otpData.passwordHash,
      isVerified: true,
    });

    // Clean up OTP store
    delete otpStore[email];

    res.status(200).json({
      message: "Signup successful! Email verified.",
      user: { name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!user || !isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🔥 CREATE TOKEN
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // remove password
    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};