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
                id: {
                    type: Number,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
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
            required: true,
        },
        city: {
            type: {
                id: {
                    type: Number,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            },
            required: true,
        },
        state: {
            type: {
                id: {
                    type: Number,
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
            },
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        deleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export const Customer = mongoose.model("Customer", CustomerSchema);
