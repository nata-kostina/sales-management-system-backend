import express from "express";
import { brandController } from "../controllers/brand.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const brandRouter = express.Router();

brandRouter.get("/", authMiddleware, brandController.getBrands);
brandRouter.get("/list/", authMiddleware, brandController.getBrandList);
