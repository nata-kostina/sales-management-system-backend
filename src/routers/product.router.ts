import express from "express";
import { productController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const productRouter = express.Router();

productRouter.get("/", authMiddleware, productController.getProducts);
productRouter.get("/:id", authMiddleware, productController.getProduct);
productRouter.put("/:id/edit", authMiddleware, productController.editProduct);
productRouter.post("/add", authMiddleware, productController.addProduct);
productRouter.delete("/:id/delete", authMiddleware, productController.deleteProduct);
productRouter.get("/form-options/list", authMiddleware, productController.getFormOptions);
