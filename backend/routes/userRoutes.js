import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  getAllUsers,      // ✅ add this
  getSingleUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users",        verifyToken, isAdmin, getAllUsers);  // ✅ admin only
router.get("/users/:id",    verifyToken, getSingleUser);         // self or admin
router.put("/users/:id",    verifyToken, updateUser);            // self or admin
router.delete("/users/:id", verifyToken, deleteUser);            // self or admin

export default router;