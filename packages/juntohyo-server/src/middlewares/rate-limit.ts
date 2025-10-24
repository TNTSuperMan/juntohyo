import type { MiddlewareHandler } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";
import type { Env } from "../types";
import { ClientError, ErrorCodes } from "../utils/client_error";

export const rateLimit = (): MiddlewareHandler<Env> => (
    async (c, next) => {
        const address = getConnInfo(c).remote.address ?? "unknown";
        if (c.req.method === "GET" || c.req.method === "OPTIONS") {
            const { success } = await c.env.GET_RATE_LIMITER.limit({ key: address });
            if (success) {
                return await next();
            }
        } else {
            const { success } = await c.env.POSTY_RATE_LIMITER.limit({ key: address });
            if (success) {
                return await next();
            }
        }
        throw new ClientError(ErrorCodes.TooManyRequest);
    }
);
