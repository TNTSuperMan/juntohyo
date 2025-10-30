import { bench, run } from "mitata";

import bcrypt from "../../juntohyo-server/node_modules/bcryptjs";

const key_str = "SECRET_HASH_KEY_X5gP05wW398ekqlWvp";
const ip_str = "114.514.1919.810";
const encoder = new TextEncoder();

const genPass = (len: number) => {
    const buf_len = len / (4 / 3);
    return Buffer.from(crypto.getRandomValues(new Uint8Array(buf_len))).toBase64();
}

const passes128 = Array(128).fill(0).map(()=>genPass(128));
const passes64 = Array(128).fill(0).map(()=>genPass(64));

bench("encode+importkey", async () => {
    const keybin = encoder.encode(key_str);
    const k = await crypto.subtle.importKey(
        "raw",
        keybin,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    return k;
});

bench("encode+importkey+hash", async () => {
    const keybin = encoder.encode(key_str);
    const ipbin = encoder.encode(ip_str);
    const k = await crypto.subtle.importKey(
        "raw",
        keybin,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const hash = await crypto.subtle.sign("HMAC", k, ipbin);
    return hash;
});

bench("128 hash", async () => {
    return await bcrypt.hash(passes128.pop()??(()=>{throw new Error("NO")})(), 10);
})

bench("64 hash", async () => {
    return await bcrypt.hash(passes64.pop()??(()=>{throw new Error("NO")})(), 10);
})

await run();
