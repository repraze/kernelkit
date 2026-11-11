import {fileURLToPath, URL} from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";

// Relative on purpose: the config is loaded by Node, which would resolve the package to its built dist/.
import {
    docsMetaPlugin,
    faviconPlugin,
    spaFallback,
    suiteSourceConditions,
    themeScriptPlugin,
} from "../kernelkit/src/vite/index.ts";
import {markSvg} from "./src/brand/mark.ts";
import {THEME_STORAGE_KEY} from "./src/lib/theme.ts";

// Fixed port so the suite's doc sites run side by side (termicolor 5170, kernelkit 5175, glaze 5180, nullsec 5199).
export default defineConfig({
    base: process.env.BASE_PATH ?? "/",
    server: {port: 5175, strictPort: true},
    preview: {port: 4175, strictPort: true},
    plugins: [
        // the kit is a workspace (a symlink): served from its TypeScript sources, so HMR needs no lib build
        suiteSourceConditions(["@repraze/kernelkit"]),
        docsMetaPlugin(fileURLToPath(new URL("./src/docs", import.meta.url))),
        react(),
        tailwindcss(),
        themeScriptPlugin({storageKey: THEME_STORAGE_KEY}),
        faviconPlugin(markSvg),
        spaFallback(),
    ],
    resolve: {
        alias: {"@": fileURLToPath(new URL("./src", import.meta.url))},
    },
});
