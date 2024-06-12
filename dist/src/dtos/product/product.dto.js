import { ImageDto } from "../image/image.dto";
export class ProductDto {
    id;
    name;
    brand;
    unit;
    sku;
    price;
    quantity;
    images;
    categories;
    description;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
        this.brand = model.brand ? {
            id: model.brand._id.toString(),
            name: model.brand.name,
        } : null;
        this.price = model.price;
        this.images = model.images.map((image) => new ImageDto(image));
        this.quantity = model.quantity;
        this.sku = model.sku;
        this.unit = model.unit ? {
            id: model.unit._id.toString(),
            name: model.unit.name,
        } : null;
        this.description = model.description;
        this.categories = model.categories.map(({ _id, shortDescription, longDescription, images, name }) => ({
            id: _id.toString(),
            name,
            shortDescription,
            longDescription,
            images,
        }));
    }
}
//# sourceMappingURL=product.dto.js.map