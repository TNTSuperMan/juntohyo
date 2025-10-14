import type { Env as HonoEnv } from "hono";

export interface Bindings {
    VOTES_DB: D1Database;
    ELECTIONS_KV: KVNamespace;
}

export interface Env extends HonoEnv {
    Bindings: Bindings;
}
