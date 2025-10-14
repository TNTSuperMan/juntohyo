import type { Env as HonoEnv } from "hono";

export interface Bindings {
    VOTES_DB: D1Database;
    ELECTIONS_KV: KVNamespace;
    HASH_KEY: string;
}

export interface Env extends HonoEnv {
    Bindings: Bindings;
}
