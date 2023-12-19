import { Types } from "mongoose";
import { IUnitDto } from "./unit.dto.interface";
import { IUnit } from "../../models/unit/unit.interface";

export class UnitDto implements IUnitDto {
    public id: string;
    public name: string;

    public constructor(model: IUnit & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
    }
}
