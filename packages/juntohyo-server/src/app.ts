import { Hono } from "hono";
import type { Env } from "./types";
import { ClientError, ErrorCodes } from "./utils/client_error";

export const app = new Hono<Env>();

app.onError((err, c) => {
    if (err instanceof ClientError) {
        return c.json({
            error: err.message,
        }, err.status);
    } else {
        return c.json({
            error: ErrorCodes.ServerError,
        }, 500);
    }
});
