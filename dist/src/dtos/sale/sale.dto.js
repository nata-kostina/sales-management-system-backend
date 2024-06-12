import { CustomerDto } from "../customer/customer.dto";
export class SaleDto {
    id;
    reference;
    customer;
    date;
    status;
    payment;
    total;
    paid;
    products;
    constructor(model) {
        this.id = model._id.toString();
        this.reference = model.reference;
        this.date = model.date.getTime();
        this.paid = model.paid;
        this.total = model.total;
        this.status = {
            id: model.status._id.toString(),
            name: model.status.name,
            priority: model.status.priority,
        };
        this.payment = {
            id: model.payment._id.toString(),
            name: model.payment.name,
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
//# sourceMappingURL=sale.dto.js.map