import mongoose from "mongoose";
import { ApiError } from "../../exceptions/api.error";
export class SaleDbDto {
    date;
    customer;
    status;
    payment;
    total;
    paid;
    products;
    deleted;
    constructor(data) {
        this.date = new Date(+data.date);
        this.customer = new mongoose.Types.ObjectId(data.customer);
        this.payment = new mongoose.Types.ObjectId(data.payment);
        this.status = new mongoose.Types.ObjectId(data.status);
        this.total = +data.total;
        this.paid = +data.paid;
        this.products = this.parseProducts(data.products);
        this.deleted = false;
    }
    parseProducts(data) {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData)) {
            const products = [];
            for (const product of parsedData) {
                if (this.isProduct(product)) {
                    products.push({ product: product.id, price: product.price, quantity: product.quantity, total: product.total });
                }
                else {
                    throw ApiError.BadRequest("Invalid payload. Invalid format for a product.");
                }
            }
            return products;
        }
        throw ApiError.BadRequest("Invalid payload. The field 'products' is not an array.");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isProduct(data) {
        return data.id !== undefined &&
            data.price !== undefined &&
            data.quantity !== undefined &&
            data.total !== undefined;
    }
}
//# sourceMappingURL=sale_db.dto.js.map