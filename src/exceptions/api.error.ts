interface IApiError extends Error {
    status: number;
    errors: string[];
}

export class ApiError extends Error implements IApiError {
    public status: number;
    public errors: string[];

    public constructor(status: number, message: string, errors: string[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    public static UnauthorizedError(): IApiError {
        return new ApiError(401, "The user is not authorized");
    }

    public static BadRequest(
        message: string,
        errors: string[] = []
    ): IApiError {
        return new ApiError(400, message, errors);
    }
}
