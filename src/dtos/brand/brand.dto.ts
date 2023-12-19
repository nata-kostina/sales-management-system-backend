import { Types } from "mongoose";
import { IBrandDto } from "./brand.dto.interface";
import { IBrand } from "../../models/brand/brand.interface";

export class BrandDto implements IBrandDto {
    public id: string;
    public name: string;

    public constructor(model: IBrand & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
    }
}
