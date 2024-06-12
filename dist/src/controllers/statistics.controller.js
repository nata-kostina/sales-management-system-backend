import { statisticsService } from "../services/statistics.service";
class StatisticsController {
    async getSalesStatistics(req, res, next) {
        try {
            const data = await statisticsService.getSalesStatistics(req.query.option, req.query.year);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getGeoSalesStatistics(req, res, next) {
        try {
            const data = await statisticsService.getGeoSalesStatistics(req.query.year);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getCategoriesSalesStatistics(req, res, next) {
        try {
            const data = await statisticsService.getCategoriesSalesStatistics(req.query.option, req.query.year);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getBestsellers(req, res, next) {
        try {
            const products = await statisticsService.getBestsellers();
            res.json({ products });
        }
        catch (error) {
            next(error);
        }
    }
    async getGeneralStatistics(req, res, next) {
        try {
            const data = await statisticsService.getGeneralStatistics();
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
}
export const statisticsController = new StatisticsController();
//# sourceMappingURL=statistics.controller.js.map