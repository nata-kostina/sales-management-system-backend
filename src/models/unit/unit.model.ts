import mongoose from "mongoose";
import { IUnit } from "./unit.interface";

const UnitSchema = new mongoose.Schema<IUnit>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        priority: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Unit = mongoose.model("Unit", UnitSchema);
