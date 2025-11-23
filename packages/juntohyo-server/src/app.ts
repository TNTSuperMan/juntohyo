import { Hono } from "hono";
import type { Env } from "./types";
import { ClientError, ErrorCodes } from "./utils/client_error";
import { rateLimit } from "./middlewares/rate-limit";
import { cors } from "hono/cors";

export const app = new Hono<Env>();

app.use(rateLimit());
app.use(cors({
    origin: process.env.ORIGIN!,
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests", "Authorization", "Content-Type"],
    allowMethods: ["POST", "GET", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 3600,
    credentials: false,
}));

app.onError((err, c) => {
    if (err instanceof ClientError) {
        return c.json({
            error: err.message,
        }, err.status);
    } else {
        console.error(err);
        return c.json({
            error: ErrorCodes.ServerError,
        }, 500);
    }
});
