export class PaymentDto {
    id;
    name;
    priority;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
        this.priority = model.priority;
    }
}
//# sourceMappingURL=payment.dto.js.map