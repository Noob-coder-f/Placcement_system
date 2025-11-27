import express from "express";
import { createOrder, verifyPayment } from "../controller/PaymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// protected routes – intern must be logged in
router.post("/payments/create-order", authMiddleware, createOrder);
router.post("/payments/verify", authMiddleware, verifyPayment);

export default router;
