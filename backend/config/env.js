
import dotenv from "dotenv";
dotenv.config(); // ✅ load .env inside this file

export const ENV = {
  PORT:         process.env.PORT         || 5000,
  MONGO_URI:    process.env.MONGO_URI,
  JWT_SECRET:   process.env.JWT_SECRET,
  EMAIL_USER:   process.env.EMAIL_USER,
  EMAIL_PASS:   process.env.EMAIL_PASS,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  NODE_ENV:     process.env.NODE_ENV     || "development",
};