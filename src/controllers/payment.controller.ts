import { NextFunction, Response, Request } from "express";
import { paymentService } from "../services/payment.service";

class PaymentController {
    public async getPayment(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const payment = await paymentService.getPayment();
            res.json({ payment });
        } catch (error) {
            next(error);
        }
    }
}

export const paymentController = new PaymentController();
