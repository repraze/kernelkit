import {fileURLToPath, URL} from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import {themeScript} from "kernelkit/theme";
import {defineConfig, type Plugin} from "vite";

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

// Fixed port so the suite's doc sites run side by side (termicolor 5170, kernelkit 5175, nullsec 5199).
export default defineConfig({
    base: process.env.BASE_PATH ?? "/",
    server: {port: 5175, strictPort: true},
    preview: {port: 4175, strictPort: true},
    plugins: [react(), tailwindcss(), themeScriptPlugin()],
    resolve: {
        alias: {"@": fileURLToPath(new URL("./src", import.meta.url))},
    },
});
