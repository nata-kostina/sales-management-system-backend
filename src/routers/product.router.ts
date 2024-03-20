import express from "express";
import { productController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";

export const productRouter = express.Router();

productRouter.get("/", authMiddleware, productController.getProducts);
productRouter.get("/list", authMiddleware, productController.getProductsList);
productRouter.get("/:id", authMiddleware, productController.getProduct);
productRouter.put("/:id/edit", authMiddleware, fileMiddleware.array("images"), productController.editProduct);
productRouter.post("/add", authMiddleware, fileMiddleware.array("images"), productController.addProduct);
productRouter.delete("/", authMiddleware, productController.deleteProduct);
productRouter.get("/form-options/list", authMiddleware, productController.getFormOptions);
