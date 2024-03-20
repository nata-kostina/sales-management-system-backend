import { ISale } from "../../models/sale/sale.interface";

export type ISaleDbDto = Omit<ISale, "reference" | "products"> & { products: ISaleProductDbDto[]; };

export interface ISaleProductDbDto {
    product: string;
    quantity: number;
    price: number;
    total: number;
}
