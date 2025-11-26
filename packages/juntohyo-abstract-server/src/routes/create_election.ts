import typia from "typia";
import { typiaValidator } from "@hono/typia-validator";
import { handleValidation } from "../utils/handle_validation";
import { verifyTurnstile } from "../middlewares/turnstile";
import { error, ErrorCodes } from "../utils/error";
import type { Election, Env } from "../types";
import { hash } from "../utils/password";
import { generateToken } from "../utils/token";
import { binaryToHex } from "../utils/id_convert";
import { Hono } from "hono";

interface Option {
    /**
     * @maxLength 128
     */
    name: string;
}

export interface PostElectionsBody {
    /**
     * @maxLength 128
     */
    title: string;
    /**
     * @maxLength 1024
     */
    description: string;
    /**
     * @maxItems 16
     */
    options: Option[];

    /**
     * @maxLength 128
     */
    password: string | null;
}

const postElectionsBodyValidator = typia.createValidate<PostElectionsBody>();

export const createElectionRoute = new Hono<Env>().post("/elections",
    verifyTurnstile,
    typiaValidator("json", postElectionsBodyValidator, handleValidation),
    async (c) => {
        const body = c.req.valid("json");

        const id = binaryToHex(crypto.getRandomValues(new Uint8Array(16)));
        if (await c.env.ELECTIONS_KV.get(id)) {
            return error(c, ErrorCodes.ConflictID);
        }

        const election: Election = {
            title: body.title,
            description: body.description,
            options: body.options,
            password: body.password ? await hash(c, body.password) : null,
        }

        await c.env.ELECTIONS_KV.put(id, JSON.stringify(election));

        const token = await generateToken(c, id);
        
        return c.json({ success: true, id, token }, 201);
    }
);
