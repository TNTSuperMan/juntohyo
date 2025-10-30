import typia from "typia";
import { app } from "../../app";
import { typiaValidator } from "@hono/typia-validator";
import { handleValidation } from "../../utils/handle_validation";
import { verifyTurnstile } from "../../utils/turnstile";
import { ClientError, ErrorCodes } from "../../utils/client_error";
import type { Election } from "../../types";
import { hash } from "../../utils/password";

interface Option {
    /**
     * @maxLength 128
     */
    name: string;
}

interface PostElectionsBody {
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

    "cf-turnstile-response": string;
}

const postElectionsBodyValidator = typia.createValidate<PostElectionsBody>();

app.post("/elections",
    typiaValidator("json", postElectionsBodyValidator, handleValidation),
    async (c) => {
        const body = c.req.valid("json");
        
        await verifyTurnstile(c, body["cf-turnstile-response"]);

        const uuid = crypto.randomUUID();
        if (await c.env.ELECTIONS_KV.get(uuid)) {
            console.log(`**お知らせ** UUIDが衝突しました!!!! ${uuid}`);
            throw new ClientError(ErrorCodes.ConflictUUID);
        }

        const election: Election = {
            uuid,
            title: body.title,
            description: body.description,
            options: body.options,
            password: body.password ? await hash(c, body.password) : null,
        }

        await c.env.ELECTIONS_KV.put(uuid, JSON.stringify(election));
        
        return c.json({ success: true }, 201);
    }
);
