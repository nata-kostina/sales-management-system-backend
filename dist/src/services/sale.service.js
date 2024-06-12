import { Types } from "mongoose";
import * as csv from "fast-csv";
import fs from "fs";
import path from "path";
import { SaleDto } from "../dtos/sale/sale.dto";
import { Sale } from "../models/sale/sale.model";
import { SaleStatus } from "../models/sale-status/sales-status.model";
import { SaleStatusDto } from "../dtos/sale-status/sale-status.dto";
import { PaymentDto } from "../dtos/payment/payment.dto";
import { Payment } from "../models/payment/payment.model";
import { createDateForFile, sortByPriority } from "../utils";
import { Customer } from "../models/customer/customer.model";
import { generatedFilesPath } from "../../constants";
class SaleService {
    async getSales(skip, limit, sort, order, reference, customer, email, status, payment) {
        const filter = {};
        if (reference) {
            filter.reference = reference;
        }
        const customersIdsByName = [];
        const customersIdsByEmail = [];
        if (customer) {
            const customers = await Customer.find({ name: { $regex: customer, $options: "i" } });
            customers.forEach((c) => customersIdsByName.push(c._id));
        }
        if (email) {
            const customers = await Customer.find({ email: { $regex: email, $options: "i" } });
            customers.forEach((c) => customersIdsByEmail.push(c._id));
        }
        if (customer || email) {
            filter.customer = { $in: [...customersIdsByName, ...customersIdsByEmail] };
        }
        if (status) {
            filter.status = { $in: status.split(",").map((st) => new Types.ObjectId(st)) };
        }
        if (payment) {
            filter.payment = { $in: payment.split(",").map((st) => new Types.ObjectId(st)) };
        }
        filter.deleted = false;
        const sales = await Sale
            .find(filter)
            .sort(sort !== "customer" && sort !== "email" && sort !== "payment" && sort !== "status" ?
            { [sort]: order === "ascend" ? 1 : -1 } : undefined);
        const total = sales.length;
        const slicedSales = sales.slice(skip, skip + limit);
        // eslint-disable-next-line no-spaced-func
        const populatedDocuments = await Sale.populate(slicedSales, [
            { path: "status", model: "SaleStatus", select: "_id name" },
            { path: "payment", model: "Payment", select: "_id name" },
            { path: "customer", model: "Customer", select: "_id name email phone country state city" },
            { path: "products.product", model: "Product", select: "_id name images" },
        ]);
        const saleDtos = populatedDocuments.map((sale) => new SaleDto(sale));
        if (sort === "customer") {
            const sortedSaleDtos = saleDtos.sort((a, b) => order === "ascend" ?
                a.customer.name.localeCompare(b.customer.name) :
                b.customer.name.localeCompare(a.customer.name));
            return {
                sales: sortedSaleDtos,
                total,
            };
        }
        if (sort === "email") {
            const sortedSaleDtos = saleDtos.sort((a, b) => order === "ascend" ?
                a.customer.email.localeCompare(b.customer.email) :
                b.customer.email.localeCompare(a.customer.email));
            return {
                sales: sortedSaleDtos,
                total,
            };
        }
        if (sort === "payment") {
            const sortedSaleDtos = saleDtos.sort((a, b) => order === "ascend" ?
                a.payment.name.localeCompare(b.payment.name) :
                b.payment.name.localeCompare(a.payment.name));
            return {
                sales: sortedSaleDtos,
                total,
            };
        }
        if (sort === "status") {
            const sortedSaleDtos = saleDtos.sort((a, b) => order === "ascend" ?
                a.status.name.localeCompare(b.status.name) :
                b.status.name.localeCompare(a.status.name));
            return {
                sales: sortedSaleDtos,
                total,
            };
        }
        return {
            sales: saleDtos,
            total,
        };
    }
    async getStatuses() {
        const statuses = await SaleStatus.find();
        const statusesDtos = statuses.sort(sortByPriority).map((status) => new SaleStatusDto(status));
        return statusesDtos;
    }
    async getPayments() {
        const payments = await Payment.find();
        const paymentsDtos = payments.sort(sortByPriority).map((payment) => new PaymentDto(payment));
        return paymentsDtos;
    }
    async getFormOptions() {
        const statuses = await SaleStatus.find();
        const payment = await Payment.find();
        const statusesDtos = statuses.map((status) => new SaleStatusDto(status)).sort(sortByPriority);
        const paymentDtos = payment.map((p) => new PaymentDto(p)).sort(sortByPriority);
        return {
            statuses: statusesDtos,
            payment: paymentDtos,
        };
    }
    async addSale(payload) {
        const lastSale = await Sale.findOne().sort({ createdAt: -1 });
        const reference = lastSale ? (Number.parseInt(lastSale.reference, 10) + 1).toString().padStart(4, "0") : "0001";
        const newSale = await Sale.create({ ...payload, reference });
        const sale = await Sale.findOne({ _id: newSale._id, deleted: false })
            .populate("status", "_id name")
            .populate("payment", "_id name")
            .populate("customer")
            .populate("products.product", "_id name images", "Product");
        const saleDto = new SaleDto(sale);
        return saleDto;
    }
    async getSale(id) {
        const sale = await Sale.findOne({ _id: id, deleted: false })
            .populate("status", "_id name")
            .populate("payment", "_id name")
            .populate("customer")
            .populate("products.product", "_id name images", "Product");
        const saleDto = new SaleDto(sale);
        return saleDto;
    }
    async updateSale(payload, id) {
        const sale = await Sale.findOne({ _id: id, deleted: false });
        await sale.updateOne({ ...payload });
        const updatedSale = await Sale.findOne({ _id: id, deleted: false })
            .populate("status", "_id name")
            .populate("payment", "_id name")
            .populate("customer")
            .populate("products.product", "_id name images", "Product");
        const saleDto = new SaleDto(updatedSale);
        return saleDto;
    }
    async deleteSale(sales) {
        let salesToDelete;
        if (sales && sales.length > 0) {
            salesToDelete = await Sale.find({ _id: { $in: sales }, deleted: false });
        }
        else {
            salesToDelete = await Sale.find({ deleted: false });
        }
        for (const sale of salesToDelete) {
            await Sale.updateOne({ _id: sale._id }, { $set: { deleted: true } });
        }
    }
    async getCsv(sales) {
        const dbData = await Sale.find(sales.length === 0 ? { deleted: false } : { _id: { $in: sales }, deleted: false })
            .populate("status", "name")
            .populate("payment", "name")
            .populate("customer")
            .populate("products.product", "_id name", "Product");
        return new Promise((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `sales_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);
            const data = [];
            for (const sale of dbData) {
                for (const product of sale.products) {
                    data.push({
                        reference: `="${sale.reference}"`,
                        date: sale.date.toISOString(),
                        customerId: sale.customer._id.toString(),
                        customerEmail: sale.customer.email,
                        customerName: sale.customer.name,
                        payment: sale.payment.name,
                        status: sale.status.name,
                        paid: sale.paid,
                        total: sale.total,
                        productId: product._doc.product._id.toString(),
                        productName: product._doc.product.name,
                        pricePerProduct: product._doc.price,
                        quantity: product._doc.quantity,
                    });
                }
            }
            csvFile.write("sep=,\n");
            const csvStream = csv.format({ headers: true });
            csvStream.pipe(csvFile);
            csvStream.on("end", () => {
                csvFile.end(() => resolve(fileName));
            });
            csvStream.on("error", () => reject());
            data.forEach(row => csvStream.write(row));
            csvStream.end();
        });
    }
}
export const saleService = new SaleService();
//# sourceMappingURL=sale.service.js.map