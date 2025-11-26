import typia from "typia";
import { typiaValidator } from "@hono/typia-validator";
import { handleValidation } from "../utils/handle_validation";
import { verifyTurnstile } from "../middlewares/turnstile";
import { error, ErrorCodes } from "../utils/error";
import type { Election, Env } from "../types";
import { compare } from "../utils/password";
import { generateToken } from "../utils/token";
import { Hono } from "hono";

export interface LoginBody {
    /**
     * @maxLength 22
     */
    election: string;

    /**
     * @maxLength 128
     */
    password: string;
}

const loginBodyValidator = typia.createValidate<LoginBody>();

export const loginRoute = new Hono<Env>().post("/login",
    verifyTurnstile,
    typiaValidator("json", loginBodyValidator, handleValidation),
    async (c) => {
        const body = c.req.valid("json");

        const raw_election = await c.env.ELECTIONS_KV.get(body.election);
        if(!raw_election) {
            return error(c, ErrorCodes.IncorrectRequest);
        }
        const election = JSON.parse(raw_election) as Election;

        if(!election.password) {
            return error(c, ErrorCodes.IncorrectRequest);
        }
        if(!await compare(c, body.password, election.password)) {
            return error(c, ErrorCodes.IncorrectRequest);
        }
        const token = await generateToken(c, body.election);
        return c.json({ token });
    }
);
