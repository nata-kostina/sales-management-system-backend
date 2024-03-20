import { Types } from "mongoose";
import { IImageDto } from "./image.dto.interface";
import { IImage } from "../../types";

export class ImageDto implements IImageDto {
    public id: string;
    public originalname: string;
    public filename: string;
    public path: string;

    public constructor(model: IImage & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.filename = model.filename;
        this.originalname = model.originalname;
        this.path = model.path;
    }
}
