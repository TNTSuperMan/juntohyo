import { typiaValidator } from "@hono/typia-validator";
import typia from "typia";
import { handleValidation } from "../utils/handle_validation";
import { verifyTurnstile } from "../middlewares/turnstile";
import { error, ErrorCodes } from "../utils/error";
import { type Env, type Election } from "../types";
import { getConnInfo } from "hono/cloudflare-workers";
import { calcHashes } from "../utils/hash";
import { hexToBinary } from "../utils/id_convert";
import { Hono } from "hono";

export interface VoteBody {
    choice: number;
}

const voteBodyValidator = typia.createValidate<VoteBody>();

export const voteRoute = new Hono<Env>().post("/elections/:id/votes",
    verifyTurnstile,
    typiaValidator("json", voteBodyValidator, handleValidation),
    async (c) => {
        const body = c.req.valid("json");

        const raw_election = await c.env.ELECTIONS_KV.get(c.req.param("id"));
        if(!raw_election) {
            return error(c, ErrorCodes.IncorrectRequest);
        }
        const election_id = hexToBinary(c.req.param("id"));
        const election = JSON.parse(raw_election) as Election;

        if(election.options.length <= body.choice) {
            return error(c, ErrorCodes.IncorrectRequest);
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
            return error(c, ErrorCodes.ServerError);
        }
    }
);
