import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { categoryController } from "../controllers/category.controller";
import { uploadsMiddleware } from "../middlewares/uploads.middleware";

export const categoryRouter = express.Router();

categoryRouter.get("/", authMiddleware, categoryController.getCategories);
categoryRouter.get("/list/", authMiddleware, categoryController.getCategoryList);
categoryRouter.post("/get-csv", authMiddleware, categoryController.getCsv);
categoryRouter.get("/:id", authMiddleware, categoryController.getCategory);
categoryRouter.put("/:id/edit", authMiddleware, uploadsMiddleware.array("images"), categoryController.editCategory);
categoryRouter.post("/add", authMiddleware, uploadsMiddleware.array("images"), categoryController.addCategory);
categoryRouter.delete("/", authMiddleware, categoryController.deleteCategory);
