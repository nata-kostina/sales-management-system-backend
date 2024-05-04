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
            unique: false,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: "Payment",
            required: true,
            unique: false,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: "SaleStatus",
            required: true,
            unique: false,
        },
        total: {
            type: Number,
            required: true,
            unique: false,
        },
        paid: {
            type: Number,
            required: true,
            unique: false,
        },
        customer: {
            type: Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
            unique: false,
        },
        products: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                        unique: false,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        unique: false,
                    },
                    price: {
                        type: Number,
                        required: true,
                        unique: false,
                    },
                    total: {
                        type: Number,
                        required: true,
                        unique: false,
                    },
                },
            ],
            required: true,
            unique: false,
        },
        deleted: { type: Boolean, default: false },
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
