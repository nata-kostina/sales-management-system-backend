import mongoose from "mongoose";
import { IUser } from "./user.interface";

const UserSchema = new mongoose.Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 8,
            max: 15,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", UserSchema);
