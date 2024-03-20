import mongoose from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new mongoose.Schema<IPayment>(
    {
        name: {
            type: String,
            required: true,
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

export const Payment = mongoose.model("Payment", PaymentSchema);
