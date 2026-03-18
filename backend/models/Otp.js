import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email:        { type: String, required: true, lowercase: true },
  fullName:     { type: String, required: true },        // ✅ Added
  passwordHash: { type: String, required: true },        // ✅ Added
  otpHash:      { type: String, required: true },
  expiresAt:    { type: Date,   required: true },
  attempts:     { type: Number, default: 0 }
});

export default mongoose.model("Otp", otpSchema);