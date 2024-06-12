import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    images: {
        type: [
            {
                originalname: {
                    type: String,
                    required: true,
                },
                filename: {
                    type: String,
                    required: true,
                },
                path: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    shortDescription: {
        type: String,
    },
    longDescription: {
        type: String,
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});
export const Category = mongoose.model("Category", CategorySchema);
//# sourceMappingURL=category.model.js.map