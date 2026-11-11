import {defineDoc as defineKitDoc, type DocDef} from "@repraze/kernelkit/docs";

export {Code} from "@repraze/kernelkit/docs";

export const CATEGORIES = [
    "Foundations",
    "Actions",
    "Inputs",
    "Overlays",
    "Navigation",
    "Data display",
    "Feedback",
    "Layout",
    "Chat",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** A docs page of this site (one per file in src/docs, read statically by docsMetaPlugin). */
export const defineDoc = (doc: DocDef<Category>) => defineKitDoc(doc);

/** The page header's badge for the Base UI primitive a component wraps. */
export const baseUi = (slug: string) => ({label: "Base UI", href: `https://base-ui.com/react/components/${slug}`});
