import mongoose from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema = new mongoose.Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        image: {
            type: {
                originalname: String,
                filename: String,
                path: String,
            },
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Category = mongoose.model("Category", CategorySchema);
