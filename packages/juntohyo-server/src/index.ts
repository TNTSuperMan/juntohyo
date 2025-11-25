import { app } from "./app";
import type { Bindings } from "./types";

export { AuthDurableObject } from "./durable-objects/auth";

const handler: ExportedHandler<Bindings> = {
    fetch: app.fetch,
};

export default handler;
