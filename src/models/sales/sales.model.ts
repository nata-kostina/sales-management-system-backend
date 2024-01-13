import mongoose, { Schema } from "mongoose";
import { ISales, ISalesStatus } from "./sales.interface";

const SalesSchema = new mongoose.Schema<ISales>(
    {
        date: {
            type: String,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        paid: {
            type: Number,
            required: true,
        },
        customer: {
            id: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
        },
        status: {
            type: String,
            enum: ISalesStatus,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Sales = mongoose.model("Sale", SalesSchema);
