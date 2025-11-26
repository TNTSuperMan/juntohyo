import { app } from "../../juntohyo-abstract-server/src";

export { AuthDurableObject } from "./durable_object";

const handler: ExportedHandler<Env> = {
    fetch: app.fetch,
};

export default handler;
