/// <reference types="node" />
/**
 * Vite plugins shared by the suite's sites (Node-side: no React, nothing here reaches the browser).
 *
 * ```ts
 * import {docsMetaPlugin, faviconPlugin, spaFallback, suiteSourceConditions, themeScriptPlugin} from "@repraze/kernelkit/vite";
 * ```
 *
 * `vite` is only imported for its types; `typescript` is loaded lazily by docsMetaPlugin / extractFunction.
 */
import {lstatSync, readdirSync, readFileSync} from "node:fs";
import {copyFile} from "node:fs/promises";
import {createRequire} from "node:module";
import {dirname, join, resolve} from "node:path";

import type TS from "typescript";
import type {Plugin} from "vite";

import {themeScript, type ThemeState} from "../provider/theme.ts";

// ─── theme script ───────────────────────────────────────────────────────────────────────────────

export interface ThemeScriptPluginOptions {
    /** The ThemeProvider's `storageKey`. */
    storageKey: string;
    /** The ThemeProvider's `defaultTheme`. */
    defaults?: Partial<ThemeState>;
    /** The comment in index.html replaced by the script (default `<!-- kernelkit:theme-script -->`). */
    marker?: string;
    /** Script source run first, in the same tag (a migration of an older storage format). */
    prelude?: string;
}

/**
 * Inline the kit's pre-paint theme script into index.html, so the stored mode, contrast, accent and radius
 * apply before first paint. Replaces the marker comment, or goes first in <head> when there is none.
 */
export function themeScriptPlugin({
    storageKey,
    defaults,
    marker = "<!-- kernelkit:theme-script -->",
    prelude,
}: ThemeScriptPluginOptions): Plugin {
    const source = [prelude, themeScript({storageKey, defaults})].filter(Boolean).join("\n");
    return {
        name: "kernelkit-theme-script",
        transformIndexHtml: (html) =>
            html.includes(marker)
                ? html.replace(marker, `<script>${source}</script>`)
                : {html, tags: [{tag: "script", children: source, injectTo: "head-prepend"}]},
    };
}

// ─── favicon ────────────────────────────────────────────────────────────────────────────────────

/**
 * Serve (dev) and emit (build) `favicon.svg` from the brand mark's SVG, so the icon never drifts from the
 * logo. Link it with `href="%BASE_URL%favicon.svg"` so it works under a Pages base path.
 */
export function faviconPlugin(svg: string | (() => string), fileName = "favicon.svg"): Plugin {
    const source = typeof svg === "function" ? svg() : svg;
    return {
        name: "kernelkit-favicon",
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url?.split("?")[0]?.endsWith(`/${fileName}`)) {
                    res.setHeader("Content-Type", "image/svg+xml");
                    res.end(source);
                    return;
                }
                next();
            });
        },
        generateBundle() {
            this.emitFile({type: "asset", fileName, source});
        },
    };
}

// ─── SPA fallback ───────────────────────────────────────────────────────────────────────────────

/** GitHub Pages has no SPA rewrites: copy index.html to 404.html so deep links load the app. */
export function spaFallback(): Plugin {
    return {
        name: "kernelkit-spa-fallback",
        apply: "build",
        async writeBundle({dir}) {
            if (dir) {
                await copyFile(join(dir, "index.html"), join(dir, "404.html"));
            }
        },
    };
}

// ─── linked suite packages ──────────────────────────────────────────────────────────────────────

/** Is `node_modules/<name>` a symlink (npm link, a workspace), looking up from `root`? */
function isLinked(name: string, root: string): boolean {
    for (let dir = resolve(root); ; dir = dirname(dir)) {
        try {
            return lstatSync(join(dir, "node_modules", name)).isSymbolicLink();
        } catch {
            // not installed here: look in the parent
        }
        if (dirname(dir) === dir) {
            return false;
        }
    }
}

export interface SuiteSourceOptions {
    /** Packages with React contexts to keep as one copy when a linked package brings its own (default below). */
    dedupe?: string[];
    /** The exports condition pointing at TypeScript sources (default "@repraze/source"). */
    condition?: string;
}

const DEDUPE = ["react", "react-dom", "@base-ui/react", "cmdk", "lucide-react"];

/**
 * For each suite package (`@repraze/kernelkit`…) that is symlinked into node_modules (`npm link`, a
 * workspace): serve it from its TypeScript sources (its `@repraze/source` exports condition), unbundled,
 * so edits there hot-reload; dedupe React-context packages, since a linked package sits outside this tree.
 * Installed from npm: nothing changes, its built dist is used and pre-bundled like any dependency.
 */
export function suiteSourceConditions(packages: string[], options: SuiteSourceOptions = {}): Plugin {
    const {dedupe = DEDUPE, condition = "@repraze/source"} = options;
    return {
        name: "kernelkit-suite-source-conditions",
        enforce: "pre",
        config(config) {
            const linked = packages.filter((name) => isLinked(name, config.root ?? process.cwd()));
            if (!linked.length) {
                return undefined;
            }
            return {
                resolve: {conditions: [condition, ...DEFAULT_CLIENT_CONDITIONS], dedupe},
                optimizeDeps: {exclude: linked},
            };
        },
    };
}

/** Vite's `defaultClientConditions`, inlined so this module needs no runtime import of vite. */
const DEFAULT_CLIENT_CONDITIONS = ["module", "browser", "development|production"];

// ─── docs manifest and demo sources ─────────────────────────────────────────────────────────────

const require = createRequire(import.meta.url);
let typescript: typeof TS | undefined;
/** TypeScript, loaded on first use (the sites already have it): only docs sites pay for it. */
const ts = () => (typescript ??= require("typescript") as typeof TS);

/** Static value of a string/number expression: literals, no-substitution templates, "a" + "b". */
function literal(node: TS.Expression): string | number | undefined {
    const t = ts();
    if (t.isStringLiteral(node) || t.isNoSubstitutionTemplateLiteral(node)) {
        return node.text;
    }
    if (t.isNumericLiteral(node)) {
        return Number(node.text);
    }
    if (t.isParenthesizedExpression(node)) {
        return literal(node.expression);
    }
    if (t.isBinaryExpression(node) && node.operatorToken.kind === t.SyntaxKind.PlusToken) {
        const a = literal(node.left);
        const b = literal(node.right);
        return a !== undefined && b !== undefined ? `${a}${b}` : undefined;
    }
    return undefined;
}

/** What `virtual:docs-meta` lists per page. */
export interface DocsMetaEntry {
    slug: string;
    title: string;
    category: string;
    description: string;
    order?: number;
}

/** A docs page's manifest entry, read from its `defineDoc({...})` call without running it. */
export function readDocMeta(file: string, slug: string, source = readFileSync(file, "utf8")): DocsMetaEntry {
    const t = ts();
    const sf = t.createSourceFile(file, source, t.ScriptTarget.Latest, true);
    let meta: DocsMetaEntry | undefined;
    const visit = (node: TS.Node) => {
        if (
            !meta &&
            t.isCallExpression(node) &&
            t.isIdentifier(node.expression) &&
            node.expression.text === "defineDoc" &&
            node.arguments[0] &&
            t.isObjectLiteralExpression(node.arguments[0])
        ) {
            const props: Record<string, string | number | undefined> = {};
            for (const p of node.arguments[0].properties) {
                if (t.isPropertyAssignment(p) && t.isIdentifier(p.name)) {
                    props[p.name.text] = literal(p.initializer);
                }
            }
            if (typeof props.title !== "string" || typeof props.category !== "string") {
                throw new Error(`${file}: defineDoc needs literal "title" and "category" (read at build time)`);
            }
            meta = {
                slug,
                title: props.title,
                category: props.category,
                description: typeof props.description === "string" ? props.description : "",
                ...(typeof props.order === "number" ? {order: props.order} : {}),
            };
        }
        t.forEachChild(node, visit);
    };
    visit(sf);
    if (!meta) {
        throw new Error(`${file}: no defineDoc({...}) call found`);
    }
    return meta;
}

/** Each top-level function or const of a file, by name, as written (without `export `). */
export function extractFunctions(source: string, fileName = "doc.tsx"): Record<string, string> {
    const t = ts();
    const sf = t.createSourceFile(fileName, source, t.ScriptTarget.Latest, true, t.ScriptKind.TSX);
    const out: Record<string, string> = {};
    const text = (node: TS.Node) => source.slice(node.getStart(sf), node.getEnd()).replace(/^export /, "");
    for (const statement of sf.statements) {
        if (t.isFunctionDeclaration(statement) && statement.name) {
            out[statement.name.text] = text(statement);
        } else if (t.isVariableStatement(statement)) {
            for (const decl of statement.declarationList.declarations) {
                if (t.isIdentifier(decl.name)) {
                    out[decl.name.text] = text(statement);
                }
            }
        }
    }
    return out;
}

/**
 * A demo's own source: its declaration from `export function Name` (or `export const Name`) to its
 * closing brace, parsed with TypeScript, so code after it (a `Notes()` helper, constants) stays out.
 */
export function extractFunction(source: string, name: string): string {
    return extractFunctions(source)[name] ?? "";
}

const META_ID = "virtual:docs-meta";
const META_RESOLVED = `\0${META_ID}`;
const SOURCES_QUERY = "demo-sources";

/**
 * The docs build step, for `@repraze/kernelkit/docs`:
 * - `virtual:docs-meta`: title, category, description and order of every page in `docsDir`, read
 *   statically from its `defineDoc({...})` call, so the nav and search don't pull every page's demos into
 *   the main bundle;
 * - `<page>.tsx?demo-sources`: `{functions}`, each demo's own source for its Code tab (see extractFunction).
 *
 * Types: add `@repraze/kernelkit/vite/client` to the site's tsconfig `types`.
 */
export function docsMetaPlugin(docsDir: string): Plugin {
    const dir = resolve(docsDir);
    return {
        name: "kernelkit-docs-meta",
        enforce: "pre",
        resolveId: (id) => (id === META_ID ? META_RESOLVED : undefined),
        load(id) {
            if (id === META_RESOLVED) {
                const files = readdirSync(dir).filter((f) => f.endsWith(".tsx"));
                const metas = files.map((f) => {
                    const file = join(dir, f);
                    this.addWatchFile(file);
                    return readDocMeta(file, f.replace(/\.tsx$/, ""));
                });
                return `export default ${JSON.stringify(metas)};`;
            }
            const [file = "", query = ""] = id.split("?");
            if (query.split("&").includes(SOURCES_QUERY)) {
                this.addWatchFile(file);
                const functions = extractFunctions(readFileSync(file, "utf8"), file);
                return {code: `export default ${JSON.stringify({functions})};`, moduleType: "js"};
            }
            return undefined;
        },
        // a docs page added, removed or retitled → refresh the manifest
        handleHotUpdate({file, server}) {
            if (file.startsWith(dir)) {
                const mod = server.moduleGraph.getModuleById(META_RESOLVED);
                if (mod) {
                    server.moduleGraph.invalidateModule(mod);
                }
            }
        },
    };
}
