import mongoose from "mongoose";

export interface ISale {
    reference: string;
    date: string;
    customer: mongoose.Types.ObjectId;
    status: mongoose.Types.ObjectId;
    payment: mongoose.Types.ObjectId;
    total: number;
    paid: number;
    products: ISaleProduct[];
}

export interface ISaleProduct {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
}
