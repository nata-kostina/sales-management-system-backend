import express from "express";
import { check } from "express-validator";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

export const authRouter = express.Router();

authRouter.post(
    "/registration",
    [
        check("email", "Incorrect email").isEmail(),
        check(
            "password",
            "Password must be at least 8 characters long and must not be greater than 15 characters",
        ).isLength({ min: 3, max: 15 }),
    ],
    authController.register,
);

authRouter.post(
    "/login",
    [
        check("email", "Incorrect email").isEmail(),
        check(
            "password",
            "Password must be at least 8 characters long and must not be greater than 15 characters",
        ).isLength({ min: 3, max: 15 }),
    ],
    authController.login,
);

authRouter.post("/logout", authController.logout);

authRouter.get("/refresh", authController.refresh);

authRouter.get("/users", authMiddleware, authController.getUsers);
