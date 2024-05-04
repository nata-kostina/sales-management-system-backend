import { Types } from "mongoose";
import { ICustomer } from "../../models/customer/customer.interface";
import { ICustomerDto } from "./customer.dto.interface";

export class CustomerDto implements ICustomerDto {
    public id: string;
    public email: string;
    public name: string;
    public phone: string;
    public country: {
        id: number;
        name: string;
    };

    public state: {
        id: number;
        name: string;
    };

    public city: {
        id: number;
        name: string;
    };

    public address: string;

    public constructor(model: ICustomer & { _id: Types.ObjectId; }) {
        this.id = model._id.toString();
        this.name = model.name;
        this.email = model.email;
        this.country = {
            id: model.country.id,
            name: model.country.name,
        };
        this.state = {
            id: model.state.id,
            name: model.state.name,
        };
        this.phone = model.phone;
        this.city = {
            id: model.city.id,
            name: model.city.name,
        };
        this.address = model.address;
    }
}
