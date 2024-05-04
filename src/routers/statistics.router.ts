import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { statisticsController } from "../controllers/statistics.controller";

export const statisticsRouter = express.Router();

statisticsRouter.get("/sales", authMiddleware, statisticsController.getSalesStatistics);
statisticsRouter.get("/geo", authMiddleware, statisticsController.getGeoSalesStatistics);
statisticsRouter.get("/categories", authMiddleware, statisticsController.getCategoriesSalesStatistics);
statisticsRouter.get("/bestsellers", authMiddleware, statisticsController.getBestsellers);
statisticsRouter.get("/general", authMiddleware, statisticsController.getGeneralStatistics);
