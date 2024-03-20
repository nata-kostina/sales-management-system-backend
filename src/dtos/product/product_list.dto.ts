import { Types } from "mongoose";
import { IProduct } from "../../models/product/product.interface";
import { IImage } from "../../types";

export interface IProductListDto {
    id: string;
    name: string;
    image: IImage | null;
}

export class ProductListDto implements IProductListDto {
    public id: string;
    public name: string;
    public image: IImage | null;

    public constructor(model: IProduct & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
        this.image = model.images.length > 0 ? model.images[0] : null;
    }
}
