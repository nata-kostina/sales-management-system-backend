import { NextFunction, Response, Request } from "express";
import { productService } from "../services/product.service";
import { Customer } from "../models/customer/customer.model";

class CustomerController {
    public async getCustomers(
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
            const customersPerPage = Number(req.query.perPage) || 10;
            const customersData = await productService.getProducts(
                page * customersPerPage,
                customersPerPage
            );
            const total = await Customer.count();
            res.json({
                customers: customersData,
                page,
                total,
            });
        } catch (error) {
            next(error);
        }
    }
}

export const customerController = new CustomerController();
