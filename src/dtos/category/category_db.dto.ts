import { ICategoryPayload, IImage, TypedRequestBody } from "../../types";
import { ICategoryDb } from "./category_db.interface";

export class CategoryDbDto implements ICategoryDb {
    public name: string;
    public images: IImage[];
    public shortDescription: string | null;
    public longDescription: string | null;

    public constructor(
        { body, files }: TypedRequestBody<ICategoryPayload>,
    ) {
        this.name = body.name;
        this.shortDescription = body.shortDescription ?? null;
        this.longDescription = body.longDescription ?? null;
        this.images = files && Array.isArray(files) ?
            files.map((image) => ({
                originalname: image.originalname,
                filename: image.filename,
                path: image.path,
            }))
            : [];
    }
}
