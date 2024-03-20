import { NextFunction, Response, Request } from "express";
import { saleStatusesService } from "../services/saleStatuses.service";

class SaleStatusesController {
    public async getSaleStatuses(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const statuses = await saleStatusesService.getSaleStatuses();
            res.json({ statuses });
        } catch (error) {
            next(error);
        }
    }
}

export const salesStatuses = new SaleStatusesController();
