import mongoose, { Schema, Types } from "mongoose";
import { IProduct } from "./product.interface";
import { ICategory } from "../category/category.interface";

const ProductSchema = new mongoose.Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            max: 50,
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        sku: {
            type: String,
        },
        unit: {
            type: Schema.Types.ObjectId,
            ref: "Unit",
        },
        images: {
            type: [
                {
                    originalname: String,
                    filename: String,
                    path: String,
                },
            ],
        },
        description: {
            type: String,
        },
        categories: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Category",
                },
            ],
        },
        deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const Product = mongoose.model("Product", ProductSchema);

export interface PopulatedProduct {
    brand: {
        _id: Types.ObjectId;
        name: string;
    };
    unit: {
        _id: Types.ObjectId;
        name: string;
    };
    categories: (ICategory & { _id: Types.ObjectId; })[];
}
