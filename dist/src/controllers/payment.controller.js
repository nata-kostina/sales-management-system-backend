import { paymentService } from "../services/payment.service";
class PaymentController {
    async getPayment(req, res, next) {
        try {
            const payment = await paymentService.getPayment();
            res.json({ payment });
        }
        catch (error) {
            next(error);
        }
    }
}
export const paymentController = new PaymentController();
//# sourceMappingURL=payment.controller.js.map