import express from "express";
import {  purchasePlan,
  verifyPayment,
  getCurrentPlan,
  getPaymentHistory } from "../controller/PaymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

// protected routes – intern must be logged in
router.post("/payments/purchase", authMiddleware, purchasePlan);
router.post("/payments/verify", authMiddleware, verifyPayment);
router.get("/payments/current-plan", authMiddleware, getCurrentPlan);
router.get("/payments/history", authMiddleware, getPaymentHistory);

export default router;
