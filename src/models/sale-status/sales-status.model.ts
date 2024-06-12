import mongoose from "mongoose";
import { ISaleStatus } from "./sale-status.interface";

const SaleStatusSchema = new mongoose.Schema<ISaleStatus>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        priority: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const SaleStatus = mongoose.model("SaleStatus", SaleStatusSchema);
