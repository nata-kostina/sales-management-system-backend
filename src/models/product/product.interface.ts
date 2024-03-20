import mongoose, { Schema } from "mongoose";
import { IImage } from "../../types";

export interface IProduct {
    name: string;
    sku: string | null;
    brand: Schema.Types.ObjectId | null;
    price: number;
    quantity: number;
    images: (IImage & { _id: mongoose.Types.ObjectId; })[];
    unit: Schema.Types.ObjectId | null;
    description: string | null;
    categories: Schema.Types.ObjectId[];
}
