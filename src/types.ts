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
} & Record<Partial<keyof T>, string>>;

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

export interface ICategoryPayload {
    name: string;
    shortDescription?: string;
    longDescription?: string;
}

export interface ISalePayload {
    date: string;
    customer: string;
    status: string;
    payment: string;
    total: string;
    paid: string;
    products: string;
}

export enum SaleStatisticsOption {
    ByMonth = "byMonth",
    ByYear = "byYear",
}

export type SaleStatisticsData = [period: string, amount: number][];
export type SaleStatisticsByCategoriesData = Array<Array<string | number>>;

export interface IGetSalesStatisticsResponse {
    data: SaleStatisticsData;
    minDate: Date;
    maxDate: Date;
}

export interface IGetSalesStatisticsByCategoriesResponse {
    data: SaleStatisticsByCategoriesData;
    minDate: Date;
    maxDate: Date;
}

export type IGetSalesStatisticsRequest = Request<{}, {}, {}, {
    option: string;
    year: string | null;
} & Record<string, string>>;

export interface IGetGeneralStatisticsResponse {
    total: number;
    monthly: {
        amount: number;
        change: number;
    };
    weekly: {
        amount: number;
        change: number;
    };
}
