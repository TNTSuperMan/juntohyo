import { app } from "../app";
import { verifyToken } from "../utils/authentication";
import { hexToBinary } from "../utils/id_convert";

app.get("/elections/:id/votes", async (c) => {
    const id = c.req.param("id");
    await verifyToken(c, c.req.header("Authorization") ?? "", id);

    const query_result = await c.env.VOTES_DB
        .prepare("SELECT choice, COUNT(*) AS count FROM votes WHERE election = ? GROUP BY choice ORDER BY choice;")
        .bind(hexToBinary(id))
        .all();
    
    const response = Object.fromEntries(query_result.results.map(e => [e.choice, e.count]));

    return c.json(response);
});
