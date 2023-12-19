import { Schema } from "mongoose";
import { IImage } from "../../types";

export interface IProduct {
    name: string;
    sku: string;
    brand: Schema.Types.ObjectId;
    price: number;
    quantity: number;
    images: IImage[];
    unit: Schema.Types.ObjectId;
    description: string;
    categories: Schema.Types.ObjectId[];
}
