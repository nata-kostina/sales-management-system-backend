import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { categoryController } from "../controllers/category.controller";

export const categoryRouter = express.Router();

categoryRouter.get("/", authMiddleware, categoryController.getCategories);

// productsRouter.post("/create", authMiddleware, productsController.create);
