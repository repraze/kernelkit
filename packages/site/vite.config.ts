import {copyFile} from "node:fs/promises";
import {join} from "node:path";
import {fileURLToPath, URL} from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defaultClientConditions, defineConfig, type Plugin} from "vite";

// Relative on purpose: the config is loaded by Node, which resolves the package to its built dist/.
import {themeScript} from "../kernelkit/src/provider/theme.ts";
import {docsMeta} from "./plugins/docs-meta.ts";
import {markSvg} from "./src/brand/mark.ts";

/** Inline the pre-paint theme script so the stored mode/accent/radius apply before first paint. */
function themeScriptPlugin(): Plugin {
    return {
        name: "kernelkit-theme-script",
        transformIndexHtml: (html) =>
            html.replace(
                "<!-- kernelkit:theme-script -->",
                `<script>${themeScript({storageKey: "kernelkit-docs-theme"})}</script>`,
            ),
    };
}

/** favicon.svg from the brand mark, so the icon never drifts from the logo. */
function faviconPlugin(): Plugin {
    const svg = markSvg();
    return {
        name: "kernelkit-favicon",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.endsWith("/favicon.svg")) {
                    res.setHeader("Content-Type", "image/svg+xml");
                    res.end(svg);
                    return;
                }
                next();
            });
        },
        generateBundle() {
            this.emitFile({type: "asset", fileName: "favicon.svg", source: svg});
        },
    };
}

/** GitHub Pages has no SPA rewrites: serve the app for unknown paths so deep links work. */
function spaFallback(): Plugin {
    return {
        name: "spa-404-fallback",
        apply: "build",
        async writeBundle({dir}) {
            if (dir) {
                await copyFile(join(dir, "index.html"), join(dir, "404.html"));
            }
        },
    };
}

// Fixed port so the suite's doc sites run side by side (termicolor 5170, kernelkit 5175, nullsec 5199).
export default defineConfig({
    base: process.env.BASE_PATH ?? "/",
    server: {port: 5175, strictPort: true},
    preview: {port: 4175, strictPort: true},
    plugins: [
        docsMeta(fileURLToPath(new URL("./src/docs", import.meta.url))),
        react(),
        tailwindcss(),
        themeScriptPlugin(),
        faviconPlugin(),
        spaFallback(),
    ],
    resolve: {
        alias: {"@": fileURLToPath(new URL("./src", import.meta.url))},
        // Use the lib's TypeScript sources (exports condition "@repraze/source"), so HMR needs no lib build.
        conditions: ["@repraze/source", ...defaultClientConditions],
    },
});
