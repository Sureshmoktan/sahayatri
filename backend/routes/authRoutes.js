import express from "express";
import { sendOtpMiddleware } from "../utils/sendOtpMiddleware.js";
import { signup, verifyOtp, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/auth/signup", sendOtpMiddleware, signup);

router.post("/auth/verify-otp", verifyOtp);

router.post("/auth/login", login);


router.post("/auth/forgot-password",        forgotPassword);
router.post("/auth/reset-password/:token",  resetPassword);

export default router;