import { Types } from "mongoose";
import { EPayment, IPayment } from "../../models/payment/payment.interface";
import { IPaymentDto } from "./payment.dto.interface";

export class PaymentDto implements IPaymentDto {
    public id: string;
    public name: EPayment;
    public priority: number;
    public constructor(model: IPayment & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
        this.priority = model.priority;
    }
}
