import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"));

app.use("/api", authRoutes);
app.use("/api", workshopRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});