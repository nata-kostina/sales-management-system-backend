import { NextFunction, Response, Request } from "express";
import { ICustomer } from "../models/customer/customer.interface";
import { TypedRequestBody, TypedRequestParams } from "../types";
import { customerService } from "../services/customer.service";
import { CustomerDbDto } from "../dtos/customer/customer_db.dto";

class CustomerController {
    public async getCustomers(
        req: TypedRequestParams<ICustomer>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const customersPerPage = Number(req.query.perPage) || 10;

            const { customers, total } = await customerService.getCustomers(
                page * customersPerPage,
                customersPerPage,
                req.query.sort,
                req.query.order,
                req.query.name,
                req.query.email,
                req.query.country,
                req.query.state,
                req.query.city,
                req.query.phone,
            );

            res.json({
                customers,
                page,
                total,
            });
        } catch (error) {
            next(error);
        }
    }

    public async getCustomer(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const customer = await customerService.getCustomer(id);
            res.json({ customer });
        } catch (error) {
            next(error);
        }
    }

    public async editCustomer(
        req: TypedRequestBody<ICustomer>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.params.id;
            const customer = await customerService.updateCustomer(req.body, id);
            res.json({ customer });
        } catch (error) {
            next(error);
        }
    }

    public async addCustomer(
        req: TypedRequestBody<Record<keyof ICustomer, string>>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const dto = new CustomerDbDto(req);
            const customer = await customerService.addCustomer(dto);
            res.json({ customer });
        } catch (error) {
            next(error);
        }
    }

    public async deleteCustomer(
        req: TypedRequestBody<{ customers: string[]; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            await customerService.deleteCustomer(req.body.customers);
            res.json();
        } catch (error) {
            next(error);
        }
    }
}

export const customerController = new CustomerController();
