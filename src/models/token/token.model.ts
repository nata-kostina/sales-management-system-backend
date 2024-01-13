import mongoose, { Schema } from "mongoose";
import { IToken } from "./token.interface";

const TokenSchema = new mongoose.Schema<IToken>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Token = mongoose.model("Token", TokenSchema);
