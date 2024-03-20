import { EPayment } from "../../models/payment/payment.interface";

export interface IPaymentDto {
    id: string;
    name: EPayment;
    priority: number;
}
