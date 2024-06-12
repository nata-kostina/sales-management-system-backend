import mongoose from "mongoose";
const UnitSchema = new mongoose.Schema({
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
export const Unit = mongoose.model("Unit", UnitSchema);
//# sourceMappingURL=unit.model.js.map