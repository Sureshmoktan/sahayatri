import express from "express";
import {
  getAllUsers,
  getAllWorkshops,
  deleteUser,
  adminDeleteWorkshop,
} from "../controllers/admin.controller.js"; // ← updated filename
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get("/users",           getAllUsers);
router.delete("/users/:id",    deleteUser);
router.get("/workshops",       getAllWorkshops);
router.delete("/workshops/:id", adminDeleteWorkshop);

export default router;