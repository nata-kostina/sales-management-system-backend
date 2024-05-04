import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { saleController } from "../controllers/sale.controller";
import { uploadsMiddleware } from "../middlewares/uploads.middleware";

export const saleRouter = express.Router();

saleRouter.get("/", authMiddleware, saleController.getSales);
saleRouter.get("/statuses", authMiddleware, saleController.getStatuses);
saleRouter.get("/payments", authMiddleware, saleController.getPayments);
saleRouter.get("/form-options/list", authMiddleware, saleController.getFormOptions);
saleRouter.post("/add", authMiddleware, uploadsMiddleware.fields([]), saleController.addSale);
saleRouter.post("/get-csv", authMiddleware, saleController.getCsv);
saleRouter.get("/:id", authMiddleware, saleController.getSale);
saleRouter.put("/:id/edit", authMiddleware, uploadsMiddleware.fields([]), saleController.editSale);
saleRouter.delete("/", authMiddleware, saleController.deleteSale);
