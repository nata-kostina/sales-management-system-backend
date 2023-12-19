import { Types } from "mongoose";
import { IUserDto } from "./user.dto.interface";
import { IUser } from "../../models/user/user.interface";

export class UserDto implements IUserDto {
    public email: string;
    public id: string;

    public constructor(model: IUser & { _id: Types.ObjectId; }) {
        this.email = model.email;
        this.id = model._id.toString();
    }
}
