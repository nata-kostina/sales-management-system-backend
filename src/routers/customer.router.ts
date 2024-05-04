import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { customerController } from "../controllers/customer.controller";
import { uploadsMiddleware } from "../middlewares/uploads.middleware";

export const customerRouter = express.Router();

customerRouter.get("/", authMiddleware, customerController.getCustomers);
customerRouter.get("/list", authMiddleware, customerController.getCustomersList);
customerRouter.post("/get-csv", authMiddleware, customerController.getCsv);
customerRouter.get("/:id", authMiddleware, customerController.getCustomer);
customerRouter.put("/:id/edit", authMiddleware, uploadsMiddleware.fields([]), customerController.editCustomer);
customerRouter.post("/add", authMiddleware, uploadsMiddleware.fields([]), customerController.addCustomer);
customerRouter.delete("/", authMiddleware, customerController.deleteCustomer);
