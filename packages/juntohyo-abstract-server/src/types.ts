import type { DurableObjectNamespace, D1Database, KVNamespace, RateLimit, Rpc } from "../node_modules/@cloudflare/workers-types/index.ts";
import type { Env as HonoEnv } from "hono";

export interface AuthDurableObjectInterface extends Rpc.DurableObjectBranded {
    hash(pass: string): Promise<string>;
    compare(pass: string, hash: string): Promise<boolean>;
}

export interface Bindings {
    AUTH_DO: DurableObjectNamespace<AuthDurableObjectInterface>;
    VOTES_DB: D1Database;
    ELECTIONS_KV: KVNamespace;
    GET_RATE_LIMITER: RateLimit;
    POSTY_RATE_LIMITER: RateLimit;
    
    TURNSTILE_SECRET: string;
    HASH_KEY: string;
    JWT_KEY: string;
}

export interface Env extends HonoEnv {
    Bindings: Bindings;
}

export interface AnyEnv extends Env {
    Variables?: any;
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
