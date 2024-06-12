import mongoose from "mongoose";
import { IUser } from "./user.interface";

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const User = mongoose.model("User", UserSchema);
