import mongoose from "mongoose";
import { IUnit } from "./unit.interface";

const UnitSchema = new mongoose.Schema<IUnit>(
    {
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export const Unit = mongoose.model("Unit", UnitSchema);
