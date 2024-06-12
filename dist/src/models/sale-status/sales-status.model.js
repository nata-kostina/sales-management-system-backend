import mongoose from "mongoose";
const SaleStatusSchema = new mongoose.Schema({
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
export const SaleStatus = mongoose.model("SaleStatus", SaleStatusSchema);
//# sourceMappingURL=sales-status.model.js.map