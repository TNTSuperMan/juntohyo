import { bench, run } from "mitata";

const key_str = "SECRET_HASH_KEY_X5gP05wW398ekqlWvp";
const ip_str = "114.514.1919.810";
const encoder = new TextEncoder();

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

await run();
