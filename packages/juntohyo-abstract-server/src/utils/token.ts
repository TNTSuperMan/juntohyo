import type { Context } from "hono"
import { Jwt } from "hono/utils/jwt"
import type { Env } from "../types"

export const JWT_ALGORITHM: "HS256" = "HS256";

export const generateToken = (c: Context<Env>, election: string) => (
    Jwt.sign({
        election,
    }, c.env.JWT_KEY, JWT_ALGORITHM)
);
