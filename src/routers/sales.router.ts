import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { salesController } from "../controllers/sales.controller";

export const salesRouter = express.Router();

salesRouter.get("/", authMiddleware, salesController.getSales);

// productsRouter.post("/create", authMiddleware, productsController.create);
