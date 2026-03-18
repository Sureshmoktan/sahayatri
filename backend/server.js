import dotenv from "dotenv";
dotenv.config(); // ✅ FIRST

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes     from "./routes/authRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
import adminRoutes    from "./routes/adminRoutes.js";
import userRoutes     from "./routes/userRoutes.js";
import contactRoutes  from "./routes/contactRoutes.js";

import { ENV } from "./config/env.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true,
}));

mongoose.connect(ENV.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api", authRoutes);
app.use("/api", workshopRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  const status  = err.status  || 500;
  const message = err.message || "Server Error";
  res.status(status).json({ message });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});