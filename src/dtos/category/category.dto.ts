import { Types } from "mongoose";
import { ICategoryDto } from "./category.dto.interface";
import { ICategory } from "../../models/category/category.interface";
import { IImage } from "../../types";

export class CategoryDto implements ICategoryDto {
    public id: string;
    public name: string;
    public image: IImage;
    public description: string;

    public constructor(model: ICategory & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
        this.image = model.image;
        this.description = model.description;
    }
}
