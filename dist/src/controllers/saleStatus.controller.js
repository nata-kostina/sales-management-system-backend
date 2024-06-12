import { saleStatusesService } from "../services/saleStatuses.service";
class SaleStatusesController {
    async getSaleStatuses(req, res, next) {
        try {
            const statuses = await saleStatusesService.getSaleStatuses();
            res.json({ statuses });
        }
        catch (error) {
            next(error);
        }
    }
}
export const salesStatuses = new SaleStatusesController();
//# sourceMappingURL=saleStatus.controller.js.map