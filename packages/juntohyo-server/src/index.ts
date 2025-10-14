import { Hono } from "hono";
import type { Bindings, Env } from "./types";

const app = new Hono<Env>();

app.get("/hello", (c) => c.text("Hey! It's Juntohyo's server!"));

const handler: ExportedHandler<Bindings> = {
    fetch: app.fetch,
};

export default handler;
