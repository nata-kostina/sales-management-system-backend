import { Types } from "mongoose";
import { ESaleStatus, ISaleStatus } from "../../models/sale-status/sale-status.interface";

export class SaleStatusDto implements ISaleStatus {
    public id: string;
    public name: ESaleStatus;
    public priority: number;
    public constructor(model: ISaleStatus & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
    }
}
