import { NextFunction, Response, Request } from "express";
import { ResultFactory, validationResult } from "express-validator";
import { TypedRequestBody, TypedRequestCookies } from "../types";
import { userService } from "../services/user.service";
import { ApiError } from "../exceptions/api.error";

const stringValidationResult: ResultFactory<string> =
    validationResult.withDefaults({
        formatter: (error) => error.msg as string,
    });

class AuthController {
    public async register(
        req: TypedRequestBody<{ email: string; password: string; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        "Validation error",
                        stringValidationResult(req).array(),
                    ),
                );
            }

            const { email, password } = req.body;
            const userData = await userService.register(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 3600000,
                httpOnly: true,
            });
            res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    public async login(
        req: TypedRequestBody<{ email: string; password: string; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        "Validation error",
                        stringValidationResult(req).array(),
                    ),
                );
            }
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 3600000,
                httpOnly: true,
            });
            res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    public async logout(
        req: TypedRequestCookies<{ refreshToken: string; }>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            res.json(token);
        } catch (error) {
            next(error);
        }
    }

    public async refresh(
        req: TypedRequestCookies<{ refreshToken: string; }>,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { refreshToken } = req.cookies;
            console.log({ refreshTokenCookie: refreshToken });
            const userData = await userService.refreshToken(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 3600000,
                httpOnly: true,
            });
            res.json(userData);
        } catch (error) {
            next(error);
        }
    }

    public async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
