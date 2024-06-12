export class CategoryDbDto {
    name;
    images;
    shortDescription;
    longDescription;
    deleted;
    constructor({ body, files }) {
        this.name = body.name;
        this.shortDescription = body.shortDescription ?? null;
        this.longDescription = body.longDescription ?? null;
        this.deleted = false;
        this.images = files && Array.isArray(files) ?
            files.map((image) => ({
                originalname: image.originalname,
                filename: image.filename,
                path: image.path,
            }))
            : [];
    }
}
//# sourceMappingURL=category_db.dto.js.map