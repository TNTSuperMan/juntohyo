import type { MiddlewareHandler } from "hono";
import type { Env } from "../types";
import { error, ErrorCodes } from "../utils/error";
import { JWT_ALGORITHM } from "../utils/token";
import { Jwt } from "hono/utils/jwt";

export const verifyToken: MiddlewareHandler<Env & { Variables: {
    election: number;
}}, string, {
    in: {
        header: {
            Authorization: string
        }
    },
}> = async (c, next) => {
    const token = c.req.header("Authorization");
    if (!token) {
        return error(c, ErrorCodes.IncorrectRequest);
    }
    const payload = await Jwt.verify(
        token,
        c.env.JWT_KEY,
        JWT_ALGORITHM
    ).catch(() => null);
    
    if (!payload) {
        return error(c, ErrorCodes.IncorrectRequest);
    }

    c.set("election", payload.election as number);
    await next();
}
