import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "kernelkit/components/pagination";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Pagination",
    category: "Navigation",
    description: "Moves between pages of a long list: logs, builds, audit events.",
    demos: [
        {title: "Default", component: Default},
        {
            title: "Controlled",
            component: Controlled,
            description:
                "Previous is `aria-disabled` on the first page; the current page is outlined and `aria-current`.",
        },
        {title: "Compact", component: Compact, description: '`size="icon-sm"` links for dense tables.'},
    ],
    props: [
        {
            component: "PaginationLink",
            rows: [
                {
                    name: "isActive",
                    type: "boolean",
                    default: "false",
                    description: 'The current page: outline + `aria-current="page"`.',
                },
                {name: "size", type: "Button size", default: '"icon"'},
                {
                    name: "render",
                    type: "ReactElement",
                    default: "<a />",
                    description: "Element to render as (e.g. a router link).",
                },
            ],
        },
        {
            component: "PaginationPrevious / PaginationNext",
            rows: [{name: "text", type: "string", default: '"Previous" / "Next"', description: "Hidden below `sm`."}],
        },
    ],
});

export function Default() {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">48</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export function Controlled() {
    const total = 5;
    const [page, setPage] = React.useState(1);
    const go = (p: number) => (event: React.MouseEvent) => {
        event.preventDefault();
        setPage(Math.min(total, Math.max(1, p)));
    };
    return (
        <div className="flex flex-col items-center gap-3">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" aria-disabled={page === 1} onClick={go(page - 1)} />
                    </PaginationItem>
                    {Array.from({length: total}, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink href="#" isActive={p === page} onClick={go(p)}>
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext href="#" aria-disabled={page === total} onClick={go(page + 1)} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <span className="font-mono text-xs text-muted-foreground">
                events {(page - 1) * 50 + 1}–{page * 50} of {total * 50}
            </span>
        </div>
    );
}

export function Compact() {
    return (
        <Pagination>
            <PaginationContent>
                {[1, 2, 3, 4].map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink href="#" size="icon-sm" isActive={p === 1} className="font-mono text-xs">
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
}
