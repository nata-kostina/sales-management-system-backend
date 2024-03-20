import { Types } from "mongoose";
import { ISaleDto, ISaleProductDto } from "./sale.dto.interface";
import { ISale } from "../../models/sale/sale.interface";
import { ISaleStatusDto } from "../sale-status/sale-status.dto.interface";
import { ICustomerDto } from "../customer/customer.dto.interface";
import { IPaymentDto } from "../payment/payment.dto.interface";
import { PopulatedSale } from "../../models/sale/sale.model";
import { ESaleStatus } from "../../models/sale-status/sale-status.interface";
import { EPayment } from "../../models/payment/payment.interface";
import { CustomerDto } from "../customer/customer.dto";

export class SaleDto implements ISaleDto {
    public id: string;
    public reference: string;
    public customer: ICustomerDto;
    public date: string;
    public status: ISaleStatusDto;
    public payment: IPaymentDto;
    public total: number;
    public paid: number;
    public products: ISaleProductDto[];

    public constructor(model: Omit<ISale & { _id: Types.ObjectId; }, "customer" | "status" | "payment" | "products"> &
    PopulatedSale) {
        this.id = model._id.toString();
        this.reference = model.reference;
        this.date = model.date;
        this.paid = model.paid;
        this.total = model.total;
        this.status = {
            id: model.status._id.toString(),
            name: model.status.name as ESaleStatus,
            priority: model.status.priority,
        };
        this.payment = {
            id: model.payment._id.toString(),
            name: model.payment.name as EPayment,
            priority: model.payment.priority,
        };
        this.customer = new CustomerDto(model.customer);
        this.products = [];
        this.products = model.products.length === 0 ? [] : model.products.map((el) => {
            const productData = el._doc;
            return ({
                price: productData.price,
                quantity: productData.quantity,
                total: productData.total,
                id: productData.product._id.toString(),
                image: productData.product.images.length > 0 ? productData.product.images[0] : null,
                name: productData.product.name,
            });
        });
    }
}
