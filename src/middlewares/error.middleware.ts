/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api.error";

export function errorMiddleware(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    console.log("errorMiddleware: ", err);
    if (err instanceof ApiError) {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
        return;
    }
    res.status(500).json({ message: "Unexpected error" });
}
