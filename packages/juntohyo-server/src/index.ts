import { app } from "./app";
import type { Bindings } from "./types";

export { AuthDurableObject } from "./durable-objects/auth";

import "./routes";

app.get("/hello", (c) => c.text("Hey! It's Juntohyo's server!"));

const handler: ExportedHandler<Bindings> = {
    fetch: app.fetch,
};

export default handler;
