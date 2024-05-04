import { ICustomer } from "../../models/customer/customer.interface";
import { TypedRequestBody } from "../../types";

export class CustomerDbDto implements ICustomer {
    public name: string;
    public phone: string;
    public email: string;
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
    public deleted: boolean;
    public constructor(
        { body }: TypedRequestBody<Record<keyof ICustomer, string>>,
    ) {
        console.log("CustomerDbDto: ", body);
        this.name = body.name;
        this.email = body.email;
        this.phone = body.phone;
        this.address = body.address;
        this.country = JSON.parse(body.country);
        this.state = JSON.parse(body.state);
        this.city = JSON.parse(body.city);
        this.deleted = false;
    }
}
