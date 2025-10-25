import { DurableObject } from "cloudflare:workers";
import type { Env } from "../types";
import bcrypt from "bcryptjs";

export class AuthDurableObject extends DurableObject<Env> {
    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
    }
    hash(pass: string) {
        return bcrypt.hash(pass, 10);
    }
    compare(pass: string, hash: string) {
        return bcrypt.compare(pass, hash);
    }
}
