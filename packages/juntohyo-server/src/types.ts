import type { Env as HonoEnv } from "hono";
import type { AuthDurableObject } from "./durable-objects/auth";

export interface Bindings {
    VOTES_DB: D1Database;
    ELECTIONS_KV: KVNamespace;
    HASH_KEY: string;
    TURNSTILE_SECRET: string;
    GET_RATE_LIMITER: RateLimit;
    POSTY_RATE_LIMITER: RateLimit;
    AUTH_DO: DurableObjectNamespace<AuthDurableObject>;
}

export interface Env extends HonoEnv {
    Bindings: Bindings;
}

export interface Option {
    name: string;
}

export interface Election {
    uuid: string;
    title: string;
    description: string;
    options: Option[];
}
