import UnpluginTypia from "@ryoppippi/unplugin-typia/bun";
import { build } from "bun";

await build({
    entrypoints: ["./src/index.ts"],
    plugins: [UnpluginTypia()],
    outdir: "./dist",
    target: "browser",
    minify: process.env.NODE_ENV === "production",
    external: ["cloudflare:workers"],
    define: {
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    },
    env: "inline",
    sourcemap: process.env.NODE_ENV === "production" ? "none" : "linked",
});
