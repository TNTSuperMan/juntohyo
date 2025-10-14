import { Hono } from "hono";
import type { Env } from "./env";

const app = new Hono<{ Bindings: Env }>();

app.get("/hello", (c) => c.text("Hey! It's Juntohyo's server!"));

const handler: ExportedHandler<Env> = {
    fetch: app.fetch,
};

export default handler;
