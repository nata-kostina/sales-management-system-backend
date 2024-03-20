import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { salesStatuses } from "../controllers/saleStatus.controller";

export const saleStatusesRouter = express.Router();

saleStatusesRouter.get("/", authMiddleware, salesStatuses.getSaleStatuses);
