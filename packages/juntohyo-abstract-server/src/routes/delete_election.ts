import { Hono } from "hono";
import { verifyToken } from "../utils/authentication";
import { hexToBinary } from "../utils/id_convert";
import type { Env } from "../types";

export const deleteElectionRoute = new Hono<Env>().delete("/elections/:id", async (c) => {
    const id = c.req.param("id")
    await verifyToken(c, c.req.header("Authorization") ?? "", id);

    await c.env.ELECTIONS_KV.delete(id);
    
    const blob_id = hexToBinary(id);

    await c.env.VOTES_DB.prepare("DELETE FROM votes WHERE election = ?;").bind(blob_id).run();

    return c.body(null, 204);
});
