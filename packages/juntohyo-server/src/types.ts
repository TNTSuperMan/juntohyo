import type { Env as HonoEnv } from "hono";
import type { AuthDurableObject } from "./durable-objects/auth";

export interface Bindings {
    AUTH_DO: DurableObjectNamespace<AuthDurableObject>;
    VOTES_DB: D1Database;
    ELECTIONS_KV: KVNamespace;
    GET_RATE_LIMITER: RateLimit;
    POSTY_RATE_LIMITER: RateLimit;
    
    TURNSTILE_SECRET: string;
    HASH_KEY: string;
}

export interface Env extends HonoEnv {
    Bindings: Bindings;
}

export interface Option {
    name: string;
}

export interface Election {
    title: string;
    description: string;
    options: Option[];
    password: string | null;
}
