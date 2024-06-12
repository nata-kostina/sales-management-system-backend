export class BrandDto {
    id;
    name;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
    }
}
//# sourceMappingURL=brand.dto.js.map