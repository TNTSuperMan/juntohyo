import typia from "typia";
import { app } from "../app";
import { typiaValidator } from "@hono/typia-validator";
import { handleValidation } from "../utils/handle_validation";
import { verifyTurnstile } from "../utils/turnstile";
import { ClientError, ErrorCodes } from "../utils/client_error";
import type { Election } from "../types";
import { compare } from "../utils/password";
import { generateToken } from "../utils/authentication";

interface LoginBody {
    /**
     * @maxLength 22
     */
    election: string;

    /**
     * @maxLength 128
     */
    password: string;

    "cf-turnstile-response": string;
}

const loginBodyValidator = typia.createValidate<LoginBody>();

app.post("/login",
    typiaValidator("json", loginBodyValidator, handleValidation),
    async (c) => {
        const body = c.req.valid("json");

        await verifyTurnstile(c, body["cf-turnstile-response"]);

        const raw_election = await c.env.ELECTIONS_KV.get(body.election);
        if(!raw_election) {
            throw new ClientError(ErrorCodes.IncorrectRequest);
        }
        const election = JSON.parse(raw_election) as Election;

        if(!election.password) {
            throw new ClientError(ErrorCodes.IncorrectRequest);
        }
        if(!await compare(c, body.password, election.password)) {
            throw new ClientError(ErrorCodes.IncorrectRequest);
        }
        const token = await generateToken(c, body.election);
        return c.json({ token });
    }
);