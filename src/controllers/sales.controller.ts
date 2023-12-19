import { NextFunction, Response, Request } from "express";
import { salesService } from "../services/sales.service";
import { Sales } from "../models/sales/sales.model";

class SalesController {
    public async getSales(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let page = Number(req.query.p);
            if (page) {
                page--;
            } else {
                page = 0;
            }
            const salesPerPage = Number(req.query.perPage) || 10;
            const salesData = await salesService.getProducts(
                page * salesPerPage,
                salesPerPage
            );
            const total = await Sales.count();
            res.json({
                sales: salesData,
                page,
                total,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const salesController = new SalesController();
