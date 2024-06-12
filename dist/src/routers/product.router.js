import express from "express";
import { productController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadsMiddleware } from "../middlewares/uploads.middleware";
export const productRouter = express.Router();
productRouter.get("/", authMiddleware, productController.getProducts);
productRouter.get("/list", authMiddleware, productController.getProductsList);
productRouter.post("/add", authMiddleware, uploadsMiddleware.array("images"), productController.addProduct);
productRouter.post("/get-csv", authMiddleware, productController.getCsv);
productRouter.get("/:id", authMiddleware, productController.getProduct);
productRouter.put("/:id/edit", authMiddleware, uploadsMiddleware.array("images"), productController.editProduct);
productRouter.delete("/", authMiddleware, productController.deleteProducts);
productRouter.get("/form-options/list", authMiddleware, productController.getFormOptions);
//# sourceMappingURL=product.router.js.map