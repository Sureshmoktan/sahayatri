import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  submitContact,
  getAllContacts,
  markAsRead,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/contact",           submitContact);                    // public
router.get("/contact",            verifyToken, isAdmin, getAllContacts); // admin only
router.patch("/contact/:id/read", verifyToken, isAdmin, markAsRead);    // admin only

export default router;