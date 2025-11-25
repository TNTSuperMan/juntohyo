import { DurableObject } from "cloudflare:workers";
import type { Env } from "../types";
import { hash, compare } from "bcryptjs-webcrypto";

export class AuthDurableObject extends DurableObject<Env> {
    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
    }
    hash(pass: string) {
        return hash(pass, 10);
    }
    compare(pass: string, hash: string) {
        return compare(pass, hash);
    }
}
