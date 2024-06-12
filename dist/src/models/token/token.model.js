import mongoose, { Schema } from "mongoose";
const TokenSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
export const Token = mongoose.model("Token", TokenSchema);
//# sourceMappingURL=token.model.js.map