import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import workshopRoutes from "./routes/workshopRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config()

// -------------------------
// Connect to MongoDB
// -------------------------
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected ✅: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB Connection Error ❌: ${error.message}`)
    process.exit(1) // Exit process with failure
  }
}

connectDB()

// -------------------------
// Express app setup
// -------------------------
const app = express()
app.use(
  cors({
    origin: "http://localhost:5173", // your React app URL
    credentials: true,               // allow cookies / auth headers
  })
)

app.use(express.json())

// -------------------------
// Routes
// -------------------------
app.use("/api/auth", authRoutes)
app.use("/api/workshops", workshopRoutes)
app.use("/api/admin", adminRoutes)

// -------------------------
// Test DB connection route
// -------------------------
app.get("/test-db", async (req, res) => {
  try {
    res.json({ message: "Backend connected to MongoDB!" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
