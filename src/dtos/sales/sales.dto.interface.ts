import { Schema } from "mongoose";
import { ISalesStatus } from "../../models/sales/sales.interface";

export interface ISalesDto {
    id: string;
    date: string;
    status: ISalesStatus;
    total: number;
    paid: number;
    customer: {
        id: Schema.Types.ObjectId;
        name: string;
    };
}
