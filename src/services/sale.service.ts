import { FilterQuery, Types } from "mongoose";
import { SaleDto } from "../dtos/sale/sale.dto";
import { ISale } from "../models/sale/sale.interface";
import { PopulatedSaleProduct, Sale } from "../models/sale/sale.model";
import { ISaleStatus } from "../models/sale-status/sale-status.interface";
import { IPayment } from "../models/payment/payment.interface";
import { ICustomer } from "../models/customer/customer.interface";
import { SaleStatus } from "../models/sale-status/sales-status.model";
import { SaleStatusDto } from "../dtos/sale-status/sale-status.dto";
import { PaymentDto } from "../dtos/payment/payment.dto";
import { Payment } from "../models/payment/payment.model";
import { sortByPriority } from "../utils";
import { Customer } from "../models/customer/customer.model";
import { ISaleDbDto } from "../dtos/sale/sale_db.dto.interface";

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
            // filter.reference = { $regex: reference, $options: "i" };
            filter.reference = reference;
        }
        const customersIdsByName: Types.ObjectId[] = [];
        const customersIdsByEmail: Types.ObjectId[] = [];
        if (customer) {
            const customers = await Customer.find({ name: { $regex: customer, $options: "i" } });
            customers.forEach((customer) => customersIdsByName.push(customer._id));
            // filter.customer = { $in: customerIds };
        }
        if (email) {
            const customers = await Customer.find({ email: { $regex: email, $options: "i" } });
            customers.forEach((customer) => customersIdsByEmail.push(customer._id));
            // filter.customer = { $in: customerIds };
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
        // if (sku) {
        //     filter.sku = { $regex: sku };
        // }
        // if (brand) {
        //     filter.brand = { $all: brand.split(",").map((c) => new Types.ObjectId(c)) };
        // }
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
        // populatedDocuments.forEach((doc) => console.log(doc));
        // console.log({ populatedDocuments });

        // console.log(...(populatedDocuments[1].products));
        // console.log([...populatedDocuments[0].products]);
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
        const sale = await Sale.findOne({ _id: newSale._id })
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
        const sale = await Sale.findOne({ _id: id })
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
        const sale = await Sale.findOne({ _id: id });
        await sale.updateOne({ ...payload });
        const updatedSale = await Sale.findOne({ _id: id })
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

    public async deleteSale(sales: string[]): Promise<void> {
        await Sale.deleteMany({ _id: { $in: sales } });
    }
}

export const saleService = new SaleService();
