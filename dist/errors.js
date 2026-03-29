export class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        // This line is a lifesaver for custom errors in Node.js/TS
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
export class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}
export class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
