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
    src: string;
    name: string;
}
