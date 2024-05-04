import { IImage } from "../../types";

export interface IProductDb {
    name: string;
    sku: string;
    brand: string | null;
    price: number;
    quantity: number;
    images: IImage[];
    unit: string | null;
    description: string | null;
    categories: string[];
    deleted: boolean;
}
