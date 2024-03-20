import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { saleController } from "../controllers/sale.controller";
import { fileMiddleware } from "../middlewares/file.middleware";

export const saleRouter = express.Router();

saleRouter.get("/", authMiddleware, saleController.getSales);
saleRouter.get("/statuses", authMiddleware, saleController.getStatuses);
saleRouter.get("/payments", authMiddleware, saleController.getPayments);
saleRouter.get("/form-options/list", authMiddleware, saleController.getFormOptions);
saleRouter.post("/add", authMiddleware, fileMiddleware.fields([]), saleController.addSale);
saleRouter.get("/:id", authMiddleware, saleController.getSale);
saleRouter.put("/:id/edit", authMiddleware, fileMiddleware.fields([]), saleController.editSale);
saleRouter.delete("/", authMiddleware, saleController.deleteSale);
