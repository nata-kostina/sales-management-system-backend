import mongoose from "mongoose";

export interface ISale {
    reference: string;
    date: Date;
    customer: mongoose.Types.ObjectId;
    status: mongoose.Types.ObjectId;
    payment: mongoose.Types.ObjectId;
    total: number;
    paid: number;
    products: ISaleProduct[];
    deleted: boolean;
}

export interface ISaleProduct {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    total: number;
}

export interface ISaleCsvItem {
    reference: string;
    date: string;
    status: string;
    payment: string;
    total: number;
    paid: number;
    customerId: string;
    customerName: string;
    customerEmail: string;
    productId: string;
    productName: string;
    pricePerProduct: number;
    quantity: number;
}
