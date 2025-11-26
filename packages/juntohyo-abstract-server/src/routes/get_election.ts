import { Hono } from "hono";
import type { Election, Env } from "../types";
import { error, ErrorCodes } from "../utils/error";

export const getElectionRoute = new Hono<Env>().get("/elections/:id", async (c) => {
    const raw_election = await c.env.ELECTIONS_KV.get(c.req.param("id"));
    if(!raw_election) {
        return error(c, ErrorCodes.IncorrectRequest);
    }
    const election = JSON.parse(raw_election) as Election;
    return c.json({
        title: election.title,
        description: election.description,
        options: election.options,
    });
});
