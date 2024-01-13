import { Schema } from "mongoose";
import { IImage } from "../../types";

export interface IProduct {
    name: string;
    sku: string | null;
    brand: Schema.Types.ObjectId | null;
    price: number;
    quantity: number;
    images: IImage[];
    unit: Schema.Types.ObjectId | null;
    description: string | null;
    categories: Schema.Types.ObjectId[];
}
