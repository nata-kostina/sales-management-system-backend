import { Schema, Types } from "mongoose";
import { ISalesDto } from "./sales.dto.interface";
import { ISales, ISalesStatus } from "../../models/sales/sales.interface";

export class SalesDto implements ISalesDto {
    public id: string;
    public date: string;
    public status: ISalesStatus;
    public total: number;
    public paid: number;
    public customer: {
        id: Schema.Types.ObjectId;
        name: string;
    };

    public constructor(model: ISales & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.date = model.date;
        this.paid = model.paid;
        this.total = model.total;
        this.status = model.status;
        this.customer = { ...model.customer };
    }
}
