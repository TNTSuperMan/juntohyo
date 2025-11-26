import type { Context } from "hono"
import { Jwt } from "hono/utils/jwt"
import type { Env } from "../types"
import { ClientError, ErrorCodes } from "./client_error";

const JWT_ALGORITHM: "HS256" = "HS256";

export const generateToken = (c: Context<Env>, election: string) => (
    Jwt.sign({
        election,
    }, c.env.JWT_KEY, JWT_ALGORITHM)
);

export const verifyToken = async (c: Context<Env>, token: string, election: string): Promise<void> => {
    const payload = await Jwt.verify(
        token,
        c.env.JWT_KEY,
        JWT_ALGORITHM
    ).catch(() => null);

    if(!payload) {
        throw new ClientError(ErrorCodes.IncorrectRequest);
    } else if(payload.election !== election) {
        throw new ClientError(ErrorCodes.IncorrectRequest);
    }
}
