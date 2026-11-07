import {Link, useParams} from "@tanstack/react-router";
import {Badge} from "kernelkit/components/badge";
import {Button} from "kernelkit/components/button";
import {ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon} from "lucide-react";

import {Demo, PropsTable, slugify} from "@/lib/doc-kit";
import {DOCS, DOCS_BY_SLUG} from "@/lib/docs-index";
import {NotFound} from "@/pages/not-found";

export function DocPage() {
    const {slug} = useParams({from: "/docs/$slug"});
    const doc = DOCS_BY_SLUG.get(slug);
    if (!doc) {
        return <NotFound />;
    }
    const index = DOCS.indexOf(doc);
    const prev = DOCS[index - 1];
    const next = DOCS[index + 1];
    const Notes = doc.notes;

    return (
        <div className="mx-auto flex max-w-4xl gap-10">
            <article className="flex min-w-0 flex-1 flex-col gap-10">
                <header className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                            {doc.category}
                        </Badge>
                        {doc.baseUi ? (
                            <Badge
                                variant="secondary"
                                className="font-mono"
                                render={
                                    <a
                                        href={`https://base-ui.com/react/components/${doc.baseUi}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    />
                                }
                            >
                                Base UI <ExternalLinkIcon />
                            </Badge>
                        ) : null}
                    </div>
                    <h1 className="font-mono text-3xl font-semibold tracking-tight">{doc.title}</h1>
                    <p className="text-lg text-muted-foreground">{doc.description}</p>
                </header>

                {doc.demos.map((demo, i) => (
                    <Demo key={demo.title} demo={demo} code={doc.demoSources[i] ?? ""} />
                ))}

                {Notes ? (
                    <div className="flex flex-col gap-4">
                        <Notes />
                    </div>
                ) : null}

                {doc.props?.length ? (
                    <div className="flex flex-col gap-6">
                        <h2 className="font-mono text-xl font-semibold">API</h2>
                        {doc.props.map((p) => (
                            <PropsTable key={p.component} {...p} />
                        ))}
                    </div>
                ) : null}

                <nav className="flex justify-between border-t pt-6">
                    {prev ? (
                        <Button
                            variant="outline"
                            nativeButton={false}
                            render={<Link to="/docs/$slug" params={{slug: prev.slug}} />}
                        >
                            <ArrowLeftIcon data-icon="inline-start" /> {prev.title}
                        </Button>
                    ) : (
                        <span />
                    )}
                    {next ? (
                        <Button
                            variant="outline"
                            nativeButton={false}
                            render={<Link to="/docs/$slug" params={{slug: next.slug}} />}
                        >
                            {next.title} <ArrowRightIcon data-icon="inline-end" />
                        </Button>
                    ) : null}
                </nav>
            </article>
            {doc.demos.length > 1 ? (
                <aside className="sticky top-24 hidden h-fit w-44 shrink-0 xl:block">
                    <h4 className="mb-2 font-mono text-xs text-muted-foreground uppercase">On this page</h4>
                    <ul className="flex flex-col gap-1.5 text-sm">
                        {doc.demos.map((demo) => (
                            <li key={demo.title}>
                                <a
                                    href={`#${slugify(demo.title)}`}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {demo.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </aside>
            ) : null}
        </div>
    );
}
