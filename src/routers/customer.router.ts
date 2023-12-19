import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { customerController } from "../controllers/customer.controller";

export const customerRouter = express.Router();

customerRouter.get("/", authMiddleware, customerController.getCustomers);

// productsRouter.post("/create", authMiddleware, productsController.create);
