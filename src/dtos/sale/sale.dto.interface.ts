import { ISaleStatusDto } from "../sale-status/sale-status.dto.interface";
import { IPaymentDto } from "../payment/payment.dto.interface";
import { ICustomerDto } from "../customer/customer.dto.interface";
import { IImage } from "../../types";

export interface ISaleDto {
    id: string;
    date: number;
    customer: ICustomerDto;
    status: ISaleStatusDto;
    payment: IPaymentDto;
    total: number;
    paid: number;
    products: ISaleProductDto[];
    reference: string;
}

export interface ISaleProductDto {
    id: string;
    name: string;
    image: IImage | null;
    quantity: number;
    price: number;
    total: number;
}

export interface ISaleProductPayload {
    id: string;
    quantity: number;
    price: number;
    total: number;
}
