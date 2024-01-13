import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { categoryController } from "../controllers/category.controller";
import { fileMiddleware } from "../middlewares/file.middleware";

export const categoryRouter = express.Router();

categoryRouter.get("/", authMiddleware, categoryController.getCategories);
categoryRouter.get("/list/", authMiddleware, categoryController.getCategoryList);
categoryRouter.get("/:id", authMiddleware, categoryController.getCategory);
categoryRouter.put("/:id/edit", authMiddleware, fileMiddleware.array("images"), categoryController.editCategory);
categoryRouter.post("/add", authMiddleware, fileMiddleware.array("images"), categoryController.addCategory);
categoryRouter.delete("/", authMiddleware, categoryController.deleteCategory);
