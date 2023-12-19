import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api.error";
import { tokenService } from "../services/token.service";

interface TypedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export function authMiddleware(
    req: TypedRequest,
    res: Response,
    next: NextFunction
): void {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(" ")[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}
