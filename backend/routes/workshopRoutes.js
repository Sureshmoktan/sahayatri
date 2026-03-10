import express from "express";
import {
  createWorkshop,
  getWorkshops,
  getWorkshopById,
  updateWorkshop,
  deleteWorkshop
} from "../controllers/workshopController.js";

const router = express.Router();


router.post("/workshop", createWorkshop);

router.get("/workshop", getWorkshops);

router.get("/workshop/:id", getWorkshopById);

router.put("/workshop/:id", updateWorkshop);

router.delete("/workshop/:id", deleteWorkshop);


export default router;