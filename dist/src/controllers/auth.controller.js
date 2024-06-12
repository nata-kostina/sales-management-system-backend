import { validationResult } from "express-validator";
import { userService } from "../services/user.service";
import { ApiError } from "../exceptions/api.error";
const stringValidationResult = validationResult.withDefaults({
    formatter: (error) => error.msg,
});
class AuthController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", stringValidationResult(req).array()));
            }
            const { email, password } = req.body;
            const userData = await userService.register(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 3600000,
                httpOnly: true,
            });
            res.json(userData);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", stringValidationResult(req).array()));
            }
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 3600000,
                httpOnly: true,
            });
            res.json(userData);
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie("refreshToken");
            res.json(token);
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refreshToken(refreshToken);
            res.cookie("refreshToken", userData.refreshToken, {
                maxAge: 2592000,
                httpOnly: true,
            });
            res.json(userData);
        }
        catch (error) {
            next(error);
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers();
            res.json(users);
        }
        catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map