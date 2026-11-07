import {CATEGORIES, type DocDef, type DocEntry, extractFunction} from "@/lib/doc-kit";

type DocModule = {doc: DocDef} & Record<string, unknown>;

const modules = import.meta.glob<DocModule>("../docs/*.tsx", {eager: true});
const sources = import.meta.glob<string>("../docs/*.tsx", {eager: true, query: "?raw", import: "default"});

export const DOCS: DocEntry[] = Object.entries(modules)
    .map(([path, mod]) => {
        const source = sources[path] ?? "";
        // Match demos to their export by identity: function names don't survive minification.
        const exportName = (component: unknown) => Object.keys(mod).find((key) => mod[key] === component) ?? "";
        return {
            ...mod.doc,
            slug: path.replace(/^.*\/(.+)\.tsx$/, "$1"),
            source,
            demoSources: mod.doc.demos.map((demo) => extractFunction(source, exportName(demo.component))),
        };
    })
    .sort(
        (a, b) =>
            CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) ||
            (a.order ?? 50) - (b.order ?? 50) ||
            a.title.localeCompare(b.title),
    );

export const DOCS_BY_SLUG = new Map(DOCS.map((d) => [d.slug, d]));

export const DOCS_BY_CATEGORY = CATEGORIES.map((category) => ({
    category,
    docs: DOCS.filter((d) => d.category === category),
})).filter((group) => group.docs.length > 0);
