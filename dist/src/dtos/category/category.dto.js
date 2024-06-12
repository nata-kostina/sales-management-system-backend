export class CategoryDto {
    id;
    name;
    images;
    shortDescription;
    longDescription;
    deleted = false;
    constructor(model) {
        this.id = model._id.toString();
        this.name = model.name;
        this.images = model.images;
        this.shortDescription = model.shortDescription;
        this.longDescription = model.longDescription;
    }
}
//# sourceMappingURL=category.dto.js.map