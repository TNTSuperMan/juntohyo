import UnpluginTypia from "@ryoppippi/unplugin-typia/bun";
import { build } from "bun";

await build({
    entrypoints: ["./src/index.ts"],
    plugins: [UnpluginTypia()],
    outdir: "./dist",
    target: "browser",
    minify: true,
    external: ["cloudflare:workers"],
    define: {
        "process.env.NODE_ENV": `"production"`
    },
});
