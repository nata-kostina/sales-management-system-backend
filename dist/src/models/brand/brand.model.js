import mongoose from "mongoose";
const BrandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export const Brand = mongoose.model("Brand", BrandSchema);
//# sourceMappingURL=brand.model.js.map