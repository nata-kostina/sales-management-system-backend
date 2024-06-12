import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    priority: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});
export const Payment = mongoose.model("Payment", PaymentSchema);
//# sourceMappingURL=payment.model.js.map