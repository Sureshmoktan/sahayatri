import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { otpStore } from "../middleware/email.config.js";


// after OTP sent
export const signup = async (req, res) => {
  res.status(200).json({
    message: "OTP sent to email. Please verify."
  });
};


// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const data = otpStore[cleanEmail];

    if (!data) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (data.expires < Date.now()) {
      delete otpStore[cleanEmail];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (data.code !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.create({
      fullName: data.fullName,
      email: cleanEmail,
      password: data.passwordHash,
      isVerified: true
    });

    delete otpStore[cleanEmail];

    res.status(201).json({
      message: "Signup successful",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// LOGIN
export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }

};