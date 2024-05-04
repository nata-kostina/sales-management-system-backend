import { FilterQuery, Types } from "mongoose";
import * as csv from "fast-csv";
import fs from "fs";
import path from "path";
import { SaleDto } from "../dtos/sale/sale.dto";
import { ISale, ISaleCsvItem } from "../models/sale/sale.interface";
import { PopulatedCsvSaleProduct, PopulatedSaleProduct, Sale } from "../models/sale/sale.model";
import { ISaleStatus } from "../models/sale-status/sale-status.interface";
import { IPayment } from "../models/payment/payment.interface";
import { ICustomer } from "../models/customer/customer.interface";
import { SaleStatus } from "../models/sale-status/sales-status.model";
import { SaleStatusDto } from "../dtos/sale-status/sale-status.dto";
import { PaymentDto } from "../dtos/payment/payment.dto";
import { Payment } from "../models/payment/payment.model";
import { createDateForFile, sortByPriority } from "../utils";
import { Customer } from "../models/customer/customer.model";
import { ISaleDbDto } from "../dtos/sale/sale_db.dto.interface";
import { generatedFilesPath } from "../../constants";

class SaleService {
    public async getSales(
        skip: number,
        limit: number,
        sort?: Partial<keyof (SaleDto & { email: string; })>,
        order?: "ascend" | "descend",
        reference?: string,
        customer?: string,
        email?: string,
        status?: string,
        payment?: string,
    ): Promise<{ sales: SaleDto[]; total: number; }> {
        const filter: FilterQuery<ISale> = {};
        if (reference) {
            filter.reference = reference;
        }
        const customersIdsByName: Types.ObjectId[] = [];
        const customersIdsByEmail: Types.ObjectId[] = [];
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
        console.log("sort: ", sort);
        console.log("order === 'ascend' ? 1 : -1: ", order === "ascend" ? 1 : -1);
        const sales = await Sale
            .find(filter)
            .sort({ [sort]: order === "ascend" ? 1 : -1 });
        const total = sales.length;
        const slicedSales = sales.slice(skip, skip + limit);
        // eslint-disable-next-line no-spaced-func
        const populatedDocuments = await Sale.populate<{
            status: ISaleStatus & { _id: Types.ObjectId; };
            payment: IPayment & { _id: Types.ObjectId; };
            customer: ICustomer & { _id: Types.ObjectId; };
            products: PopulatedSaleProduct[];
        }>(slicedSales, [
            { path: "status", model: "SaleStatus", select: "_id name" },
            { path: "payment", model: "Payment", select: "_id name" },
            { path: "customer", model: "Customer", select: "_id name email phone" },
            { path: "products.product", model: "Product", select: "_id name images" },
        ]);

        const saleDtos: SaleDto[] = populatedDocuments.map(
            (sale) => new SaleDto(sale),
        );
        return {
            sales: saleDtos,
            total,
        };
    }

    public async getStatuses(): Promise<SaleStatusDto[]> {
        const statuses = await SaleStatus.find();
        const statusesDtos: SaleStatusDto[] = statuses.sort(sortByPriority).map((status) => new SaleStatusDto(status));
        return statusesDtos;
    }

    public async getPayments(): Promise<PaymentDto[]> {
        const payments = await Payment.find();
        const paymentsDtos: PaymentDto[] = payments.sort(sortByPriority).map((payment) => new PaymentDto(payment));
        return paymentsDtos;
    }

    public async getFormOptions(): Promise<{
        statuses: SaleStatusDto[];
        payment: PaymentDto[];
    }> {
        const statuses = await SaleStatus.find();
        const payment = await Payment.find();

        const statusesDtos: SaleStatusDto[] = statuses.map((status) => new SaleStatusDto(status)).sort(sortByPriority);
        const paymentDtos: PaymentDto[] = payment.map((p) => new PaymentDto(p)).sort(sortByPriority);
        return {
            statuses: statusesDtos,
            payment: paymentDtos,
        };
    }

    public async addSale(payload: ISaleDbDto): Promise<SaleDto> {
        const lastSale = await Sale.findOne().sort({ createdAt: -1 });
        const reference = lastSale ? (Number.parseInt(lastSale.reference, 10) + 1).toString().padStart(4, "0") : "0001";
        const newSale = await Sale.create({ ...payload, reference });
        const sale = await Sale.findOne({ _id: newSale._id, deleted: false })
            .populate<{
                status: ISaleStatus & { _id: Types.ObjectId; };
            }>("status", "_id name")
            .populate<{
                payment: IPayment & { _id: Types.ObjectId; };
            }>("payment", "_id name")
            .populate<{
                customer: ICustomer & { _id: Types.ObjectId; };
            }>("customer")
            .populate<{
                products: PopulatedSaleProduct[];
            }>("products.product", "_id name images", "Product");
        const saleDto = new SaleDto(sale);
        return saleDto;
    }

    public async getSale(id?: string): Promise<SaleDto> {
        const sale = await Sale.findOne({ _id: id, deleted: false })
            .populate<{
                status: ISaleStatus & { _id: Types.ObjectId; };
            }>("status", "_id name")
            .populate<{
                payment: IPayment & { _id: Types.ObjectId; };
            }>("payment", "_id name")
            .populate<{
                customer: ICustomer & { _id: Types.ObjectId; };
            }>("customer")
            .populate<{
                products: PopulatedSaleProduct[];
            }>("products.product", "_id name images", "Product");
        const saleDto = new SaleDto(sale);
        return saleDto;
    }

    public async updateSale(
        payload: ISaleDbDto,
        id: string,
    ): Promise<SaleDto> {
        const sale = await Sale.findOne({ _id: id, deleted: false });
        await sale.updateOne({ ...payload });
        const updatedSale = await Sale.findOne({ _id: id, deleted: false })
            .populate<{
                status: ISaleStatus & { _id: Types.ObjectId; };
            }>("status", "_id name")
            .populate<{
                payment: IPayment & { _id: Types.ObjectId; };
            }>("payment", "_id name")
            .populate<{
                customer: ICustomer & { _id: Types.ObjectId; };
            }>("customer")
            .populate<{
                products: PopulatedSaleProduct[];
            }>("products.product", "_id name images", "Product");

        const saleDto: SaleDto = new SaleDto(updatedSale);
        return saleDto;
    }

    public async deleteSale(sales?: string[]): Promise<void> {
        let salesToDelete;

        if (sales && sales.length > 0) {
            salesToDelete = await Sale.find({ _id: { $in: sales }, deleted: false });
        } else {
            salesToDelete = await Sale.find({ deleted: false });
        }

        for (const sale of salesToDelete) {
            await Sale.updateOne({ _id: sale._id }, { $set: { deleted: true } });
        }
    }

    public async getCsv(sales: string[]): Promise<string> {
        const dbData = await Sale.find(sales.length === 0 ? { deleted: false } : { _id: { $in: sales }, deleted: false })
            .populate<{
                status: ISaleStatus & { _id: Types.ObjectId; };
            }>("status", "name")
            .populate<{
                payment: IPayment & { _id: Types.ObjectId; };
            }>("payment", "name")
            .populate<{
                customer: ICustomer & { _id: Types.ObjectId; };
            }>("customer")
            .populate<{
                products: PopulatedCsvSaleProduct[];
            }>("products.product", "_id name", "Product");
        return new Promise<string>((resolve, reject) => {
            const fileName = path.join(generatedFilesPath, `sales_data_${createDateForFile()}.csv`);
            const csvFile = fs.createWriteStream(fileName);

            const data: ISaleCsvItem[] = [];
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
