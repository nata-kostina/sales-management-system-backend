export class ImageDto {
    id;
    originalname;
    filename;
    path;
    constructor(model) {
        this.id = model._id.toString();
        this.filename = model.filename;
        this.originalname = model.originalname;
        this.path = model.path;
    }
}
//# sourceMappingURL=image.dto.js.map