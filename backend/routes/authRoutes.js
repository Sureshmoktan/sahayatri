import express from "express";
import { sendOtpMiddleware } from "../middleware/email.config.js";
import { signup, verifyOtp, login } from "../controllers/authControllers.js";

const router = express.Router();


router.post("/auth/signup", sendOtpMiddleware, signup);

router.post("/auth/verify-otp", verifyOtp);

router.post("/auth/login", login);

export default router;