import type { Context } from "hono";
import type { Env } from "../types";
import { encoder } from "./text";

const hexReg = /[0-9a-f]{2}/g;

export const calcHashes = async <T extends string[]>(c: Context<Env>, inputs: T): Promise<{ [key in keyof T]: Uint8Array<ArrayBuffer> }> => {
    const key = await crypto.subtle.importKey(
        "raw",
        new Uint8Array(c.env.HASH_KEY.match(hexReg)!.map(b => parseInt(b, 16))),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const hashes = (await Promise.all(inputs.map(input =>
        crypto.subtle.sign("HMAC", key, encoder.encode(input))
    ))).map(arrbuf => new Uint8Array(arrbuf));
    return hashes as any;
}
