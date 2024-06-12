export class SaleStatusDto {
    id;
    name;
    priority;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
    }
}
//# sourceMappingURL=sale-status.dto.js.map