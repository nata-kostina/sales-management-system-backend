import { ApiError } from "../exceptions/api.error";
export function errorMiddleware(err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        res.status(err.status).json({
            message: err.message,
            errors: err.errors,
        });
        return;
    }
    res.status(500).json({ message: "Unexpected error" });
}
//# sourceMappingURL=error.middleware.js.map