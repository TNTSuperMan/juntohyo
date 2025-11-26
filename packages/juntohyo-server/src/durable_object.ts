import { DurableObject } from "cloudflare:workers";
import { hash, compare } from "bcryptjs-webcrypto";
import type { AuthDurableObjectInterface } from "../../juntohyo-abstract-server/src/types";

export class AuthDurableObject extends DurableObject<Env> implements AuthDurableObjectInterface {
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
