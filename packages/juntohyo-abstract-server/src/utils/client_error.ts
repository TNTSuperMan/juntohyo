import type { ClientErrorStatusCode } from "hono/utils/http-status";

export const enum ErrorCodes {
    BadRequest = "BAD_REQUEST",
    IncorrectRequest = "INCORRECT_REQUEST",
    ServerError = "SERVER_ERROR",
    InvalidTurnstile = "INVALID_TURNSTILE",
    ConflictID = "CONFLICT_ID",
    TooManyRequest = "TOO_MANY_REQUEST",
}

const ErrorCodeToStatus = (code: ErrorCodes): ClientErrorStatusCode | 500 => {
    switch (code) {
        case ErrorCodes.BadRequest: return 400;
        case ErrorCodes.IncorrectRequest: return 404;
        case ErrorCodes.ServerError:return 500;
        case ErrorCodes.InvalidTurnstile: return 400;
        case ErrorCodes.ConflictID: return 500;
        case ErrorCodes.TooManyRequest: return 429;
    }
}

export class ClientError extends Error {
    status: ClientErrorStatusCode | 500;

    constructor(code: ErrorCodes) {
        super(code);
        this.status = ErrorCodeToStatus(code);
    }
}
