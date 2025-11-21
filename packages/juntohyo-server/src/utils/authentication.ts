import type { Context } from "hono"
import { Jwt } from "hono/utils/jwt"
import type { Env } from "../types"

const JWT_ALGORITHM: "HS256" = "HS256";

export const generateToken = (c: Context<Env>, election: string) => (
    Jwt.sign({
        election,
    }, c.env.JWT_KEY, JWT_ALGORITHM)
);

export const verifyToken = async (c: Context<Env>, token: string, election: string): Promise<boolean> => {
    const payload = await Jwt.verify(
        token,
        c.env.JWT_KEY,
        JWT_ALGORITHM
    ).catch(() => null);

    if(!payload) {
        return false;
    } else {
        return payload.election === election;
    }
}
