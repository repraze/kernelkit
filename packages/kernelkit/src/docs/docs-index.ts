import type {DocDef, DocEntry} from "./doc-kit";

/** What the nav, search and header need about a docs page, without loading its demos (`virtual:docs-meta`). */
export interface DocMeta<Category extends string = string> {
    slug: string;
    title: string;
    category: Category;
    description: string;
    order?: number;
}

/** A docs file's module: its `doc` and the demo components it exports. */
export type DocModule<Category extends string = string> = {doc: DocDef<Category>} & Record<string, unknown>;

/** What docsMetaPlugin serves for `<file>.tsx?demo-sources`: each top-level declaration's own source. */
export interface DemoSources {
    functions: Record<string, string>;
}

type Glob<T> = Record<string, () => Promise<T>>;

export interface DocsIndexOptions<Category extends string> {
    /** Category order: the sidebar, search groups and pager follow it. */
    categories: readonly Category[];
    /** `import META from "virtual:docs-meta"`. */
    meta: readonly {slug: string; title: string; category: string; description: string; order?: number}[];
    /** `import.meta.glob("../docs/*.tsx")`: each page is its own chunk, loaded when opened. */
    modules: Glob<unknown>;
    /** `import.meta.glob("../docs/*.tsx", {query: "?demo-sources", import: "default"})`. */
    sources: Glob<unknown>;
    /** Where docs pages live, for `slugOf` (default "/docs"). */
    basePath?: string;
}

export interface DocsIndex<Category extends string = string> {
    categories: readonly Category[];
    /** Every page, in category order, then `order`, then title. */
    docs: DocMeta<Category>[];
    bySlug: Map<string, DocMeta<Category>>;
    /** Non-empty categories with their pages, for the sidebar and search. */
    byCategory: {category: Category; docs: DocMeta<Category>[]}[];
    /** Load a page's module and its demos' sources; undefined for an unknown slug. */
    loadDoc(slug: string): Promise<DocEntry<Category> | undefined>;
    /** The pages before and after one, for the Pager. */
    neighbours(slug: string): {prev?: DocMeta<Category>; next?: DocMeta<Category>};
    /** The docs slug in a pathname ("/base/docs/button" → "button"), or undefined outside the docs. */
    slugOf(pathname: string): string | undefined;
}

const slugOfFile = (path: string) => /([^/]+)\.tsx$/.exec(path)?.[1];

/** The site's docs index, from the build-time manifest and the per-page globs. */
export function createDocsIndex<Category extends string>({
    categories,
    meta,
    modules,
    sources,
    basePath = "/docs",
}: DocsIndexOptions<Category>): DocsIndex<Category> {
    const moduleBySlug = new Map(Object.entries(modules).map(([path, load]) => [slugOfFile(path), load]));
    const sourcesBySlug = new Map(Object.entries(sources).map(([path, load]) => [slugOfFile(path), load]));

    const docs = (meta as DocMeta<Category>[]).toSorted(
        (a, b) =>
            categories.indexOf(a.category) - categories.indexOf(b.category) ||
            (a.order ?? 50) - (b.order ?? 50) ||
            a.title.localeCompare(b.title),
    );
    const bySlug = new Map(docs.map((d) => [d.slug, d]));
    const byCategory = categories
        .map((category) => ({category, docs: docs.filter((d) => d.category === category)}))
        .filter((group) => group.docs.length > 0);
    const pathRe = new RegExp(`${basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/([^/]+)`);

    return {
        categories,
        docs,
        bySlug,
        byCategory,
        async loadDoc(slug) {
            const load = moduleBySlug.get(slug);
            const loadSources = sourcesBySlug.get(slug);
            if (!load || !loadSources) {
                return undefined;
            }
            const [mod, demoSources] = (await Promise.all([load(), loadSources()])) as [
                DocModule<Category>,
                DemoSources,
            ];
            // Match demos to their export by identity: function names don't survive minification.
            const exportName = (component: unknown) => Object.keys(mod).find((key) => mod[key] === component) ?? "";
            return {
                ...mod.doc,
                slug,
                demoSources: mod.doc.demos.map((demo) => demoSources.functions[exportName(demo.component)] ?? ""),
            };
        },
        neighbours(slug) {
            const doc = bySlug.get(slug);
            const index = doc ? docs.indexOf(doc) : -1;
            return index < 0 ? {} : {prev: docs[index - 1], next: docs[index + 1]};
        },
        slugOf(pathname) {
            const slug = pathRe.exec(pathname)?.[1];
            return slug && bySlug.has(slug) ? slug : undefined;
        },
    };
}
