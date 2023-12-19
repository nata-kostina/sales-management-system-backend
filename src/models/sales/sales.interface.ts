import { Schema } from "mongoose";

export enum ISalesStatus {
    Paid = "Paid",
    Unpaid = "Unpaid",
    Refunded = "Refunded",
    Canceled = "Canceled",
}

export interface ISales {
    date: string;
    status: ISalesStatus;
    total: number;
    paid: number;
    customer: {
        id: Schema.Types.ObjectId;
        name: string;
    };
}
