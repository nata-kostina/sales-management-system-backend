import { Request } from "express";

export interface TypedRequestBody<T> extends Request {
    body: T;
}
export interface TypedRequestCookies<T> extends Request {
    cookies: T;
}

export interface ITokenPayload {
    id: string;
    email: string;
}

export interface IImage {
    originalname: string;
    filename: string;
    path: string;
}

export type TypedRequestParams<T extends object> = Request<{}, {}, {}, {
    perPage: string;
    page: string;
    sort?: keyof T;
    order?: "ascend" | "descend";
    name?: string;
    categories?: string;
    sku?: string;
    brand?: string;
}>;

export interface IProductPayload {
    name: string;
    brand?: string;
    unit?: string;
    sku?: string;
    price: string;
    quantity: string;
    categories?: string;
    description?: string;
}
