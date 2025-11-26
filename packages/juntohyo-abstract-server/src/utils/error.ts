import type { Context } from "hono";
import type { ClientErrorStatusCode } from "hono/utils/http-status";

export const enum ErrorCodes {
    BadRequest = "BAD_REQUEST",
    IncorrectRequest = "INCORRECT_REQUEST",
    ServerError = "SERVER_ERROR",
    InvalidTurnstile = "INVALID_TURNSTILE",
    ConflictID = "CONFLICT_ID",
    TooManyRequest = "TOO_MANY_REQUEST",
}

export type ErrorStatus<T extends ErrorCodes> =
    T extends ErrorCodes.BadRequest ? 400 :
    T extends ErrorCodes.IncorrectRequest ? 404 :
    T extends ErrorCodes.ServerError ? 500 :
    T extends ErrorCodes.InvalidTurnstile ? 400 :
    T extends ErrorCodes.ConflictID ? 500 :
    T extends ErrorCodes.TooManyRequest ? 429 :
    never;

const ErrorCodeToStatus = <T extends ErrorCodes>(code: T): ErrorStatus<T> => {
    switch (code) {
        case ErrorCodes.BadRequest:       return 400 as any;
        case ErrorCodes.IncorrectRequest: return 404 as any;
        case ErrorCodes.ServerError:      return 500 as any;
        case ErrorCodes.InvalidTurnstile: return 400 as any;
        case ErrorCodes.ConflictID:       return 500 as any;
        case ErrorCodes.TooManyRequest:   return 429 as any;
    }
}

export const error = <T extends ErrorCodes>(c: Context, code: T) => {
    return c.json({
        error: code,
    }, ErrorCodeToStatus(code));
}
