import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { unitController } from "../controllers/unit.controller";

export const unitRouter = express.Router();

unitRouter.get("/", authMiddleware, unitController.getUnits);
