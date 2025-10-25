import type { Context } from "hono";
import type { Env } from "../types";

const DO_NAME = "auth";

export const hash = (c: Context<Env>, pass: string): Promise<string> => {
    const stub = c.env.AUTH_DO.getByName(DO_NAME);
    return stub.hash(pass);
}

export const compare = (c: Context<Env>, pass: string, hash: string): Promise<boolean> => {
    const stub = c.env.AUTH_DO.getByName(DO_NAME);
    return stub.compare(pass, hash);
}
