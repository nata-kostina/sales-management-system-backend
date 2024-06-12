export class ProductListDto {
    id;
    name;
    image;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
        this.image = model.images.length > 0 ? model.images[0] : null;
    }
}
//# sourceMappingURL=product_list.dto.js.map