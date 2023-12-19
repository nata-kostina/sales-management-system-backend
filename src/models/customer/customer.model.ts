import mongoose from "mongoose";
import { ICustomer } from "./customer.interface";

const CustomerSchema = new mongoose.Schema<ICustomer>(
    {
        name: {
            type: String,
            required: true,
        },
        country: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Customer = mongoose.model("Customer", CustomerSchema);
