import { PaymentDto } from "../dtos/payment/payment.dto";
import { Payment } from "../models/payment/payment.model";
import { sortByPriority } from "../utils";
class PaymentService {
    async getPayment() {
        const payment = await Payment.find();
        const paymentDtos = payment.sort(sortByPriority).map((status) => new PaymentDto(status));
        return [...paymentDtos];
    }
}
export const paymentService = new PaymentService();
//# sourceMappingURL=payment.service.js.map