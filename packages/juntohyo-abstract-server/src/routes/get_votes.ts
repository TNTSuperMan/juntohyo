import { Hono } from "hono";
import { verifyToken } from "../middlewares/token";
import { hexToBinary } from "../utils/id_convert";
import type { Env } from "../types";
import { error, ErrorCodes } from "../utils/error";

export const getVotesRoute = new Hono<Env>().get("/elections/:id/votes",
    verifyToken,
    async (c) => {
        const id = c.req.param("id");
        if (c.var.election !== parseInt(id)) {
            return error(c, ErrorCodes.IncorrectRequest);
        }

        const query_result = await c.env.VOTES_DB
            .prepare("SELECT choice, COUNT(*) AS count FROM votes WHERE election = ? GROUP BY choice ORDER BY choice;")
            .bind(hexToBinary(id))
            .all();
        
        const response = Object.fromEntries(query_result.results.map(e => [e.choice, e.count]));

        return c.json(response);
    }
);
