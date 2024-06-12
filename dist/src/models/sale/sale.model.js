import mongoose, { Schema } from "mongoose";
const SalesSchema = new mongoose.Schema({
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        required: true,
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: "SaleStatus",
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    paid: {
        type: Number,
        required: true,
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                total: {
                    type: Number,
                    required: true,
                },
            },
        ],
        required: true,
    },
    deleted: { type: Boolean, default: false, required: true },
}, {
    timestamps: true,
});
export const Sale = mongoose.model("Sale", SalesSchema);
//# sourceMappingURL=sale.model.js.map