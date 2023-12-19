import mongoose from "mongoose";
import { IBrand } from "./brand.interface";

const BrandSchema = new mongoose.Schema<IBrand>(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Brand = mongoose.model("Brand", BrandSchema);
