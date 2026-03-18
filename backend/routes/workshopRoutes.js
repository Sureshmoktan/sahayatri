import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createWorkshop,
  getWorkshops,
  getMyWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop,
} from "../controllers/workshop.controller.js"; // ← updated filename

const router = express.Router();

router.get("/workshops",          getWorkshops);              // public
router.get("/workshops/my",       verifyToken, getMyWorkshops); // owner only
router.get("/workshops/:id",      getWorkshopById);           // public
router.post("/workshops",         verifyToken, createWorkshop); // owner only
router.put("/workshops/:id",      verifyToken, updateWorkshop); // owner or admin
router.delete("/workshops/:id",   verifyToken, deleteWorkshop); // owner or admin

export default router;