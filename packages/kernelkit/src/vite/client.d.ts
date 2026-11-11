// Ambient types for docsMetaPlugin's modules: add "@repraze/kernelkit/vite/client" to tsconfig `types`.

declare module "virtual:docs-meta" {
    const meta: {slug: string; title: string; category: string; description: string; order?: number}[];
    export default meta;
}

declare module "*?demo-sources" {
    const sources: {functions: Record<string, string>};
    export default sources;
}
