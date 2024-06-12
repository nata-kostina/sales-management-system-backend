import express from "express";
import { brandController } from "../controllers/brand.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
export const brandRouter = express.Router();
brandRouter.get("/", authMiddleware, brandController.getBrands);
//# sourceMappingURL=brands.router.js.map