import { NextFunction, Response, Request } from "express";
import { statisticsService } from "../services/statistics.service";
import { IGetGeneralSalesStatisticsRequest, IGetSalesStatisticsRequest } from "../types";

class StatisticsController {
    public async getSalesStatistics(
        req: IGetSalesStatisticsRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const data = await statisticsService.getSalesStatistics(req.query.option, req.query.year);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    public async getGeoSalesStatistics(
        req: IGetSalesStatisticsRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const data = await statisticsService.getGeoSalesStatistics(req.query.year);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    public async getCategoriesSalesStatistics(
        req: IGetSalesStatisticsRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const data = await statisticsService.getCategoriesSalesStatistics(req.query.option, req.query.year);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    public async getBestsellers(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const products = await statisticsService.getBestsellers();
            res.json({ products });
        } catch (error) {
            next(error);
        }
    }

    public async getGeneralStatistics(
        req: IGetGeneralSalesStatisticsRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const data = await statisticsService.getGeneralStatistics(req.query.tz);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

export const statisticsController = new StatisticsController();
