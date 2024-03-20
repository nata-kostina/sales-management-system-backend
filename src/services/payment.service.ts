import { PaymentDto } from "../dtos/payment/payment.dto";
import { Payment } from "../models/payment/payment.model";
import { sortByPriority } from "../utils";

class PaymentService {
    public async getPayment(): Promise<PaymentDto[]> {
        const payment = await Payment.find();
        const paymentDtos: PaymentDto[] = payment.sort(sortByPriority).map(
            (status) => new PaymentDto(status),
        );
        return [...paymentDtos];
    }
}

export const paymentService = new PaymentService();
