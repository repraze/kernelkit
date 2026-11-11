"use client";

import {Badge} from "@repraze/kernelkit/components/badge";
import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderEyebrow,
    PageHeaderTitle,
} from "@repraze/kernelkit/components/page-header";
import {Pager, PagerLink} from "@repraze/kernelkit/components/pager";
import {SiteAside, SiteLayout, SiteMain, SiteSidebar} from "@repraze/kernelkit/components/site-layout";
import {Toc, TocItem, TocList, TocTitle, useTocActive} from "@repraze/kernelkit/components/toc";
import {ExternalLinkIcon} from "lucide-react";
import type * as React from "react";

import {Demo, type DocEntry, PropsTable, slugify} from "./doc-kit";
import type {DocsIndex} from "./docs-index";

/** A router link to a docs page, used as a `render` element: `(slug) => <Link to="/docs/$slug" params={{slug}} />`. */
export type DocLinkFor = (slug: string) => React.ReactElement;

/** The table of contents of a page: its demos, the notes' sections, then the API. */
export function docToc(doc: DocEntry): {id: string; title: string}[] {
    return [
        ...doc.demos.map((demo) => ({id: slugify(demo.title), title: demo.title})),
        ...(doc.sections ?? []),
        ...(doc.props?.length ? [{id: "api", title: "API"}] : []),
    ];
}

export interface DocPageProps<Category extends string = string> {
    /** The loaded page (`index.loadDoc(slug)`, usually from the route's loader). */
    doc: DocEntry<Category>;
    index: DocsIndex<Category>;
    linkFor: DocLinkFor;
}

/**
 * A docs page in the suite's layout (GUIDELINES §7b): PageHeader (category, source badge, title,
 * description), the demos, the notes, the API tables and the Pager in SiteMain; the Toc in SiteAside.
 */
export function DocPage<Category extends string>({doc, index, linkFor}: DocPageProps<Category>) {
    const {prev, next} = index.neighbours(doc.slug);
    const Notes = doc.notes;
    const sections = docToc(doc);
    const active = useTocActive(sections.map((s) => s.id));

    return (
        <>
            <SiteMain>
                <PageHeader>
                    <PageHeaderEyebrow>
                        <Badge variant="outline">{doc.category}</Badge>
                        {doc.source ? (
                            <Badge
                                variant="secondary"
                                className="font-mono"
                                render={<a href={doc.source.href} target="_blank" rel="noreferrer" />}
                            >
                                {doc.source.label} <ExternalLinkIcon />
                            </Badge>
                        ) : null}
                    </PageHeaderEyebrow>
                    <PageHeaderTitle>{doc.title}</PageHeaderTitle>
                    <PageHeaderDescription>{doc.description}</PageHeaderDescription>
                </PageHeader>

                {doc.demos.map((demo, i) => (
                    <Demo key={demo.title} demo={demo} code={doc.demoSources[i] ?? ""} />
                ))}

                {Notes ? (
                    <div className="flex flex-col gap-4">
                        <Notes />
                    </div>
                ) : null}

                {doc.props?.length ? (
                    <section id="api" className="flex scroll-mt-24 flex-col gap-6">
                        <h2 className="font-heading text-xl font-semibold">API</h2>
                        {doc.props.map((p) => (
                            <PropsTable key={p.component} {...p} />
                        ))}
                    </section>
                ) : null}

                <Pager>
                    {prev ? (
                        <PagerLink direction="previous" render={linkFor(prev.slug)}>
                            {prev.title}
                        </PagerLink>
                    ) : null}
                    {next ? (
                        <PagerLink direction="next" render={linkFor(next.slug)}>
                            {next.title}
                        </PagerLink>
                    ) : null}
                </Pager>
            </SiteMain>
            {sections.length > 1 ? (
                <SiteAside>
                    <Toc>
                        <TocTitle>On this page</TocTitle>
                        <TocList>
                            {sections.map((s) => (
                                <TocItem key={s.id} href={`#${s.id}`} active={s.id === active}>
                                    {s.title}
                                </TocItem>
                            ))}
                        </TocList>
                    </Toc>
                </SiteAside>
            ) : null}
        </>
    );
}

/** The suite's docs layout: SiteLayout with the docs nav in a sticky SiteSidebar, then the page (which adds its Toc). */
export function DocsLayout({nav, children}: {nav: React.ReactNode; children: React.ReactNode}) {
    return (
        <SiteLayout>
            <SiteSidebar>{nav}</SiteSidebar>
            {children}
        </SiteLayout>
    );
}
