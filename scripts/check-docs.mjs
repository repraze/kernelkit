// Load every docs page (and its review matrix) on the running dev server and report console errors.
//   node scripts/check-docs.mjs [slug…]
import {existsSync, readdirSync} from "node:fs";
import {homedir} from "node:os";

import {chromium} from "playwright";

const libs = `${homedir()}/.cache/pw-libs/root/usr/lib/x86_64-linux-gnu`;
const env = {...process.env};
if (existsSync(libs)) {
    env.LD_LIBRARY_PATH = [libs, env.LD_LIBRARY_PATH].filter(Boolean).join(":");
}

const docsDir = new URL("../packages/site/src/docs/", import.meta.url).pathname;
const slugs = process.argv.slice(2).length
    ? process.argv.slice(2)
    : readdirSync(docsDir)
          .filter((f) => f.endsWith(".tsx"))
          .map((f) => f.replace(/\.tsx$/, ""));

const browser = await chromium.launch({env});
let failed = 0;
for (const slug of slugs) {
    for (const path of [`/docs/${slug}`, `/review/${slug}`]) {
        const page = await browser.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message.split("\n")[0]));
        page.on("console", (m) => m.type() === "error" && errors.push(m.text().split("\n")[0]));
        await page.goto(`http://localhost:5175${path}`, {waitUntil: "networkidle"});
        await page.waitForTimeout(200);
        const demos = await page.locator("[data-slot=demo-frame], [data-slot=theme-scope]").count();
        if (errors.length || demos === 0) {
            failed++;
            console.log(`✗ ${path} (${demos} demo frames)\n  ${[...new Set(errors)].join("\n  ")}`);
        }
        await page.close();
    }
}
await browser.close();
console.log(failed ? `\n${failed} page(s) with problems` : `all ${slugs.length} docs pages clean`);
process.exit(failed ? 1 : 0);
