import {Avatar, AvatarFallback} from "kernelkit/components/avatar";
import {Badge} from "kernelkit/components/badge";
import {Button} from "kernelkit/components/button";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "kernelkit/components/hover-card";
import {GitCommitHorizontalIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Hover Card",
    category: "Overlays",
    baseUi: "preview-card",
    description: "A preview of a linked resource, shown on hover or focus. Never put the only path to an action in it.",
    order: 6,
    demos: [
        {title: "Commit preview", component: CommitPreview},
        {title: "Service preview", component: ServicePreview, description: "`side` and `align` work like Popover."},
    ],
    props: [
        {
            component: "HoverCardTrigger",
            rows: [
                {name: "delay", type: "number", default: "600", description: "ms before opening."},
                {name: "closeDelay", type: "number", default: "300"},
            ],
        },
        {
            component: "HoverCardContent",
            rows: [
                {name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"'},
                {name: "align", type: '"start" | "center" | "end"', default: '"center"'},
            ],
        },
    ],
});

export function CommitPreview() {
    return (
        <p className="text-sm text-muted-foreground">
            Fixed in{" "}
            <HoverCard>
                <HoverCardTrigger
                    href="#commit"
                    className="font-mono text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                    a41c9e2
                </HoverCardTrigger>
                <HoverCardContent className="w-96">
                    <div className="flex gap-3">
                        <Avatar>
                            <AvatarFallback>MK</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="font-heading text-sm font-medium">
                                fix(scheduler): respect node taints
                            </span>
                            <span className="text-xs text-muted-foreground">
                                mkovacs committed 2 hours ago · 4 files, +62 −18
                            </span>
                            <span className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                                <GitCommitHorizontalIcon className="size-3.5" /> a41c9e2 on main
                            </span>
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
            , released in 4.12.0.
        </p>
    );
}

export function ServicePreview() {
    return (
        <HoverCard>
            <HoverCardTrigger render={<Button variant="link" />}>@api-gateway</HoverCardTrigger>
            <HoverCardContent side="right" align="start">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-sm font-medium">api-gateway</span>
                        <Badge variant="soft" color="success">
                            Healthy
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Edge router for every public endpoint.</p>
                    <dl className="grid grid-cols-3 gap-2 border-t border-border pt-2 text-xs">
                        <div>
                            <dt className="text-muted-foreground">p95</dt>
                            <dd className="font-mono">84ms</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">rps</dt>
                            <dd className="font-mono">12.4k</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">errors</dt>
                            <dd className="font-mono">0.02%</dd>
                        </div>
                    </dl>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
