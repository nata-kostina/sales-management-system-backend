import { Types } from "mongoose";
import { ICategoryDto } from "./category.dto.interface";
import { ICategory } from "../../models/category/category.interface";
import { IImage } from "../../types";

export class CategoryDto implements ICategoryDto {
    public id: string;
    public name: string;
    public images: IImage[];
    public shortDescription: string;
    public longDescription: string;
    public deleted = false;

    public constructor(model: ICategory & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
        this.images = model.images;
        this.shortDescription = model.shortDescription;
        this.longDescription = model.longDescription;
    }
}
