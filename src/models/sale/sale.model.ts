import mongoose, { Schema, Types } from "mongoose";
import { ISale } from "./sale.interface";
import { ICustomer } from "../customer/customer.interface";
import { IImage } from "../../types";

const SalesSchema = new mongoose.Schema<ISale>(
    {
        reference: {
            type: String,
            required: true,
            unique: true,
        },
        date: {
            type: Date,
            required: true,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            required: true,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: "SaleStatus",
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
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        products: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                    total: {
                        type: Number,
                        required: true,
                    },
                },
            ],
            required: true,
        },
        deleted: { type: Boolean, default: false, required: true },
    },
    {
        timestamps: true,
    },
);

export const Sale = mongoose.model("Sale", SalesSchema);

export interface PopulatedSale {
    payment: {
        _id: Types.ObjectId;
        name: string;
        priority: number;
    };
    status: {
        _id: Types.ObjectId;
        name: string;
        priority: number;
    };
    customer: ICustomer & { _id: Types.ObjectId; };
    products: PopulatedSaleProduct[];
}

export interface PopulatedSaleProduct extends Document {
    _doc: {
        product: {
            _id: mongoose.Types.ObjectId;
            name: string;
            images: IImage[];
        };
        quantity: number;
        price: number;
        total: number;
    };
}

export interface PopulatedCsvSaleProduct extends Document {
    _doc: {
        product: {
            _id: mongoose.Types.ObjectId;
            name: string;
        };
        quantity: number;
        price: number;
    };
}
