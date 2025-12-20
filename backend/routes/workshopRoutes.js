import express from "express"
import { addWorkshop, getWorkshops, deleteWorkshop } from "../controllers/workshopController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", getWorkshops)
router.post("/", protect, addWorkshop)
router.delete("/:id", protect, admin, deleteWorkshop) // Only admin can delete

export default router
