import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { paymentController } from "../controllers/payment.controller";

export const paymentRouter = express.Router();

paymentRouter.get("/", authMiddleware, paymentController.getPayment);
