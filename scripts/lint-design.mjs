// Mechanical checks for GUIDELINES.md (§1 tokens, §3 shape, §7 API). Usage: node scripts/lint-design.mjs [file…]
import {readdirSync, readFileSync} from "node:fs";
import {join} from "node:path";

const src = new URL("../packages/kernelkit/src/", import.meta.url).pathname;
// the components, and the docs and site-shell modules built from them
const files = process.argv.slice(2).length
    ? process.argv.slice(2)
    : ["components", "docs", "site"].flatMap((sub) =>
          readdirSync(join(src, sub), {recursive: true})
              .filter((f) => String(f).endsWith(".tsx"))
              .map((f) => join(src, sub, String(f))),
      );

const RULES = [
    [/\brounded-full\b/, "§3 use rounded-pill (squares at radius-none)"],
    [/\brounded(-[trblse]{1,2})?-\[(?!inherit)[^\]]*\]/, "§3 no arbitrary radius, use the scale"],
    [/\b(ring|border|outline|divide)-foreground\/\d+/, "§1 lines use border/input tokens, not foreground alpha"],
    [/#[0-9a-fA-F]{3,8}\b(?![\w-])/, "§1 no hex colors"],
    [/\b(text|bg|border|ring|fill|stroke)-(white|black)\b/, "§1 no white/black, use roles"],
    [
        /\b(text|bg|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/,
        "§1 no Tailwind palette colors",
    ],
    [/oklch\(/, "§1 no raw oklch"],
    [/hover:bg-muted(?![\w-])/, "§1 hover wash is bg-hover"],
    [
        /\bdark:(?:(?:data|aria)-[\w[\]=-]+:)?bg-input|\bdark:(?:data|aria)-[\w[\]=-]+:bg-/,
        "§1 mode-prefixed state background outranks hover: use bg-field* tokens or pair with dark:hover",
    ],
];

let problems = 0;
for (const file of files) {
    const src = readFileSync(file, "utf8");
    const rel = file.replace(src, "");
    if (file.includes("/src/components/") && !/^"use client";/.test(src)) {
        console.log(`${rel}:1  §7 missing "use client"`);
        problems++;
    }
    src.split("\n").forEach((line, i) => {
        for (const [re, msg] of RULES) {
            if (re.test(line) && !line.includes("lint-design-ignore")) {
                console.log(`${rel}:${i + 1}  ${msg}  →  ${line.match(re)[0]}`);
                problems++;
            }
        }
    });
}
console.log(problems ? `\n${problems} problem(s)` : "design lint: clean");
process.exit(problems ? 1 : 0);
