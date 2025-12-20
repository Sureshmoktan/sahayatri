import express from "express"
import Owner from "../models/User.js"
import Workshop from "../models/Workshop.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

// Get all owners and workshops
router.get("/all", protect, admin, async (req, res) => {
  const workshops = await Workshop.find().populate("owner", "fullName email")
  const owners = await Owner.find().select("-password")
  res.json({ workshops, owners })
})

// Delete owner and their workshop
router.delete("/owners/:id", protect, admin, async (req, res) => {
  const owner = await Owner.findByIdAndDelete(req.params.id)
  await Workshop.findOneAndDelete({ owner: owner._id })
  res.json({ message: "Owner and workshop deleted", owner })
})

export default router
