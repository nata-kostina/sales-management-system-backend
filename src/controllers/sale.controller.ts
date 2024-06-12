import { NextFunction, Response, Request } from "express";
import { saleService } from "../services/sale.service";
import { ISalePayload, TypedRequestBody, TypedRequestParams } from "../types";
import { ISaleDto } from "../dtos/sale/sale.dto.interface";
import { SaleDbDto } from "../dtos/sale/sale_db.dto";

class SaleController {
    public async getSales(
        req: TypedRequestParams<ISaleDto & { email: string; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const salesPerPage = Number(req.query.perPage) || 10;

            const { sales, total } = await saleService.getSales(
                page * salesPerPage,
                salesPerPage,
                req.query.sort,
                req.query.order,
                req.query.reference,
                req.query.customer,
                req.query.email,
                req.query.status,
                req.query.payment,
            );

            res.json({
                sales,
                page,
                total,
            });
        } catch (error) {
            next(error);
        }
    }

    public async getFormOptions(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { statuses, payment } = await saleService.getFormOptions();
            res.json({ statuses, payment });
        } catch (error) {
            next(error);
        }
    }

    public async addSale(
        req: TypedRequestBody<ISalePayload>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const saleDb = new SaleDbDto(req.body);
            const sale = await saleService.addSale(saleDb);
            res.json({ sale });
        } catch (error) {
            next(error);
        }
    }

    public async getSale(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const sale = await saleService.getSale(id);
            res.json({ sale });
        } catch (error) {
            next(error);
        }
    }

    public async editSale(
        req: TypedRequestBody<ISalePayload>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const saleDb = new SaleDbDto(req.body);
            const sale = await saleService.updateSale(saleDb, id);
            res.json({ sale });
        } catch (error) {
            next(error);
        }
    }

    public async deleteSale(
        req: TypedRequestBody<{ items?: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            await saleService.deleteSale(req.body.items);
            res.json();
        } catch (error) {
            next(error);
        }
    }

    public async getCsv(
        req: TypedRequestBody<{ items: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const fileName = await saleService.getCsv(req.body.items);
            res.setHeader("Content-Type", "text/csv");
            res.download(fileName, (err) => {
                if (err) {
                    res.sendStatus(500);
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export const saleController = new SaleController();
