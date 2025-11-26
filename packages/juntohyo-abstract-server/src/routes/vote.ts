import { typiaValidator } from "@hono/typia-validator";
import typia from "typia";
import { handleValidation } from "../utils/handle_validation";
import { verifyTurnstile } from "../utils/turnstile";
import { ClientError, ErrorCodes } from "../utils/client_error";
import { type Env, type Election } from "../types";
import { getConnInfo } from "hono/cloudflare-workers";
import { calcHashes } from "../utils/hash";
import { hexToBinary } from "../utils/id_convert";
import { Hono } from "hono";

export interface VoteBody {
    choice: number;
    "cf-turnstile-response": string;
}

const voteBodyValidator = typia.createValidate<VoteBody>();

export const voteRoute = new Hono<Env>().post("/elections/:id/votes",
    typiaValidator("json", voteBodyValidator, handleValidation),
    async (c) => {
        const body = c.req.valid("json");

        await verifyTurnstile(c, body["cf-turnstile-response"]);

        const raw_election = await c.env.ELECTIONS_KV.get(c.req.param("id"));
        if(!raw_election) {
            throw new ClientError(ErrorCodes.IncorrectRequest);
        }
        const election_id = hexToBinary(c.req.param("id"));
        const election = JSON.parse(raw_election) as Election;

        if(election.options.length <= body.choice) {
            throw new ClientError(ErrorCodes.IncorrectRequest);
        }

        const ip_address = getConnInfo(c).remote.address ?? "unknown";
        const [ip_hash] = await calcHashes(c, [ip_address] as const);

        const insert_result = await c.env.VOTES_DB
            .prepare("INSERT INTO votes (election, choice, ip_hash) VALUES (?, ?, ?)")
            .bind(election_id, body.choice, ip_hash)
            .run();
        
        if(insert_result.success) {
            return c.json({ success: true }, 201);
        } else {
            throw new ClientError(ErrorCodes.ServerError);
        }
    }
);
