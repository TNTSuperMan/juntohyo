import UnpluginTypia from "@ryoppippi/unplugin-typia/bun";
import { build, env } from "bun";

await build({
    entrypoints: ["./src/index.ts"],
    plugins: [UnpluginTypia({ cache: env.NODE_ENV !== "production" })],
    outdir: "./dist",
    target: "browser",
    minify: env.NODE_ENV === "production",
    external: ["cloudflare:workers"],
    define: {
        "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV ?? "development"),
    },
    env: "inline",
    sourcemap: env.NODE_ENV === "production" ? "none" : "linked",
});
