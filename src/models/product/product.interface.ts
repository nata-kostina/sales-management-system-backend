import mongoose from "mongoose";
import { IImage } from "../../types";

export interface IProduct {
    name: string;
    sku: string | null;
    brand: mongoose.Types.ObjectId | null;
    price: number;
    quantity: number;
    images: (IImage & { _id: mongoose.Types.ObjectId; })[];
    unit: mongoose.Types.ObjectId | null;
    description: string | null;
    categories: mongoose.Types.ObjectId[];
    deleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IProductCsvItem = Record<string, any> & {
    name: string;
    sku: string;
    brand: string;
    price: number;
    quantity: number;
    unit: string;
    description: string;
};
