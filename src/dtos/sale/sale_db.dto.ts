import mongoose from "mongoose";
import { ISalePayload } from "../../types";
import { ApiError } from "../../exceptions/api.error";
import { ISaleDbDto, ISaleProductDbDto } from "./sale_db.dto.interface";
import { ISaleProductPayload } from "./sale.dto.interface";

export class SaleDbDto implements ISaleDbDto {
    public date: string;
    public customer: mongoose.Types.ObjectId;
    public status: mongoose.Types.ObjectId;
    public payment: mongoose.Types.ObjectId;
    public total: number;
    public paid: number;
    public products: ISaleProductDbDto[];
    public constructor(data: ISalePayload) {
        this.date = data.date;
        this.customer = new mongoose.Types.ObjectId(data.customer);
        this.payment = new mongoose.Types.ObjectId(data.payment);
        this.status = new mongoose.Types.ObjectId(data.status);
        this.total = +data.total;
        this.paid = +data.paid;
        this.products = this.parseProducts(data.products);
    }

    private parseProducts(data: string): ISaleProductDbDto[] {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
            console.log("typeof parsedData[0]: ", typeof parsedData[0]);
            console.log("typeof parsedData[0]: ", typeof parsedData[0].price);
            const products: ISaleProductDbDto[] = [];
            for (const product of parsedData) {
                if (this.isProduct(product)) {
                    products.push({ product: product.id, price: product.price, quantity: product.quantity, total: product.total });
                } else {
                    throw ApiError.BadRequest("Invalid payload. Invalid format for a product.");
                }
            }
            return products;
        }
        throw ApiError.BadRequest("Invalid payload. The field 'products' is not an array.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private isProduct(data: any): data is ISaleProductPayload {
        return (data as ISaleProductPayload).id !== undefined &&
            (data as ISaleProductPayload).price !== undefined &&
            (data as ISaleProductPayload).quantity !== undefined &&
            (data as ISaleProductPayload).total !== undefined;
    }
}
