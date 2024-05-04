import { IImage, IProductPayload, TypedRequestBody } from "../../types";
import { IProductDb } from "./product_db.interface";

export class ProductDbDto implements IProductDb {
    public name: string;
    public sku: string;
    public brand: string | null;
    public price: number;
    public quantity: number;
    public images: IImage[];
    public unit: string | null;
    public description: string | null;
    public categories: string[];
    public deleted: boolean;

    public constructor(
        { body, files }: TypedRequestBody<IProductPayload>,
    ) {
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
