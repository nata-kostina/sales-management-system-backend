import { customerService } from "../services/customer.service";
import { CustomerDbDto } from "../dtos/customer/customer_db.dto";
class CustomerController {
    async getCustomers(req, res, next) {
        try {
            let page = Number(req.query.page);
            if (!page) {
                page = 0;
            }
            const customersPerPage = Number(req.query.perPage) || 10;
            const { customers, total } = await customerService.getCustomers(page * customersPerPage, customersPerPage, req.query.sort, req.query.order, req.query.name, req.query.email, req.query.country, req.query.state, req.query.city, req.query.phone);
            res.json({
                customers,
                page,
                total,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getCustomer(req, res, next) {
        try {
            const id = req.params.id;
            const customer = await customerService.getCustomer(id);
            res.json({ customer });
        }
        catch (error) {
            next(error);
        }
    }
    async editCustomer(req, res, next) {
        try {
            const id = req.params.id;
            const dto = new CustomerDbDto(req);
            const customer = await customerService.updateCustomer(dto, id);
            res.json({ customer });
        }
        catch (error) {
            next(error);
        }
    }
    async addCustomer(req, res, next) {
        try {
            const dto = new CustomerDbDto(req);
            const customer = await customerService.addCustomer(dto);
            res.json({ customer });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCustomer(req, res, next) {
        try {
            await customerService.deleteCustomer(req.body.items);
            res.json();
        }
        catch (error) {
            next(error);
        }
    }
    async getCustomersList(req, res, next) {
        try {
            const { customers } = await customerService.getCustomersList(req.query.name);
            res.json({ customers });
        }
        catch (error) {
            next(error);
        }
    }
    async getCsv(req, res, next) {
        try {
            const fileName = await customerService.getCsv(req.body.items);
            res.setHeader("Content-Type", "text/csv");
            res.download(fileName, (err) => {
                if (err) {
                    res.sendStatus(500);
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
export const customerController = new CustomerController();
//# sourceMappingURL=customer.controller.js.map