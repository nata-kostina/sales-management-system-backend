export class ProductDbDto {
    name;
    sku;
    brand;
    price;
    quantity;
    images;
    unit;
    description;
    categories;
    deleted;
    constructor({ body, files }) {
        this.name = body.name;
        this.brand = body.brand ?? null;
        this.price = +body.price;
        this.quantity = +body.quantity;
        this.unit = body.unit ?? null;
        this.sku = body.sku ?? null;
        this.description = body.description ?? null;
        this.deleted = false;
        this.categories = body.categories ? JSON.parse(body.categories) : [];
        this.images = files && Array.isArray(files) ?
            files.map(({ originalname, filename, path }) => ({
                originalname,
                filename,
                path,
            }))
            : [];
    }
}
//# sourceMappingURL=product_db.dto.js.map