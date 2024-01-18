import mongoose from "mongoose";
import { ICustomer } from "./customer.interface";

const CustomerSchema = new mongoose.Schema<ICustomer>(
    {
        name: {
            type: String,
            required: true,
        },
        country: {
            type: {
                id: Number,
                name: String,
            },
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            unique: true,
            required: true,
        },
        city: {
            type: {
                id: Number,
                name: String,
            },
            required: true,
        },
        state: {
            type: {
                id: Number,
                name: String,
            },
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Customer = mongoose.model("Customer", CustomerSchema);
