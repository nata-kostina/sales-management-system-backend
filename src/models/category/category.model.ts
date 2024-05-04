import mongoose from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            max: 50,
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
        shortDescription: {
            type: String,
        },
        longDescription: {
            type: String,
        },
        deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const Category = mongoose.model("Category", CategorySchema);
