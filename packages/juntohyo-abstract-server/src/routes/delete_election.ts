import { Hono } from "hono";
import { verifyToken } from "../middlewares/token";
import { hexToBinary } from "../utils/id_convert";
import type { Env } from "../types";
import { verifyTurnstile } from "../middlewares/turnstile";
import { error, ErrorCodes } from "../utils/error";

export const deleteElectionRoute = new Hono<Env>().delete("/elections/:id",
    verifyTurnstile,
    verifyToken,
    async (c) => {
        const id = c.req.param("id");
        if (c.var.election !== parseInt(id)) {
            return error(c, ErrorCodes.IncorrectRequest);
        }

        await c.env.ELECTIONS_KV.delete(id);
        
        const blob_id = hexToBinary(id);

        await c.env.VOTES_DB.prepare("DELETE FROM votes WHERE election = ?;").bind(blob_id).run();

        return c.body(null, 204);
    }
);
