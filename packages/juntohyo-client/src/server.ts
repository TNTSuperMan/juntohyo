import { hc } from "hono/client";
import { app } from "juntohyo-abstract-server";

export const server = hc<typeof app>(process.env.SERVER_ORIGIN);
