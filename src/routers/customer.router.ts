import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { customerController } from "../controllers/customer.controller";
import { fileMiddleware } from "../middlewares/file.middleware";

export const customerRouter = express.Router();

customerRouter.get("/", authMiddleware, customerController.getCustomers);
customerRouter.get("/list", authMiddleware, customerController.getCustomersList);
customerRouter.get("/:id", authMiddleware, customerController.getCustomer);
customerRouter.put("/:id/edit", authMiddleware, fileMiddleware.fields([]), customerController.editCustomer);
customerRouter.post("/add", authMiddleware, fileMiddleware.fields([]), customerController.addCustomer);
customerRouter.delete("/", authMiddleware, customerController.deleteCustomer);
