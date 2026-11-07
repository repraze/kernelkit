import {Button} from "@repraze/kernelkit/components/button";
import {
    Collapsible,
    CollapsibleChevron,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@repraze/kernelkit/components/collapsible";
import {FolderIcon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Collapsible",
    category: "Data display",
    baseUi: "collapsible",
    description: "Shows and hides one region behind a trigger.",
    demos: [
        {
            title: "With chevron",
            component: WithChevron,
            description:
                "The root carries `group/collapsible`; `CollapsibleChevron` sits at the end and rotates 90° while open.",
        },
        {title: "Controlled", component: Controlled},
        {title: "Tree", component: Tree, description: "Nested collapsibles for a file tree."},
    ],
    props: [
        {
            component: "Collapsible",
            rows: [
                {name: "open / defaultOpen", type: "boolean", description: "Controlled / initial state."},
                {name: "onOpenChange", type: "(open: boolean) => void"},
                {name: "disabled", type: "boolean", default: "false"},
            ],
        },
        {
            component: "CollapsibleTrigger",
            rows: [{name: "render", type: "ReactElement", description: "Render as your own button (e.g. `<Button>`)."}],
        },
    ],
});

export function WithChevron() {
    return (
        <Collapsible className="w-80">
            <CollapsibleTrigger render={<Button variant="outline" className="w-full justify-start" />}>
                Environment variables
                <CollapsibleChevron />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="flex flex-col gap-1 px-2.5 pt-2 font-mono text-xs text-muted-foreground">
                    <span>DATABASE_URL=postgres://…</span>
                    <span>REDIS_URL=redis://…</span>
                    <span>LOG_LEVEL=info</span>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function Controlled() {
    const [open, setOpen] = React.useState(true);
    return (
        <Collapsible open={open} onOpenChange={setOpen} className="w-80 rounded-lg border border-border">
            <div className="flex items-center justify-between gap-2 py-1.5 pr-1.5 pl-3">
                <span className="text-sm font-medium">3 failing checks</span>
                <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
                    {open ? "Hide" : "Show"}
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <ul className="flex flex-col gap-1 border-t border-border px-3 py-2 font-mono text-xs">
                    <li className="text-danger">✕ lint · 2 errors</li>
                    <li className="text-danger">✕ test:e2e · timeout</li>
                    <li className="text-danger">✕ typecheck · TS2345</li>
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}

function Folder({name, children, defaultOpen}: {name: string; children: React.ReactNode; defaultOpen?: boolean}) {
    return (
        <Collapsible defaultOpen={defaultOpen}>
            <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="w-full justify-start" />}>
                <FolderIcon className="text-muted-foreground" />
                {name}
                <CollapsibleChevron />
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-3.5 border-l border-border pl-2">{children}</CollapsibleContent>
        </Collapsible>
    );
}

function File({name}: {name: string}) {
    return <div className="px-2.5 py-1 font-mono text-[0.8rem] text-muted-foreground">{name}</div>;
}

export function Tree() {
    return (
        <div className="w-64">
            <Folder name="services" defaultOpen>
                <Folder name="api" defaultOpen>
                    <File name="main.go" />
                    <File name="router.go" />
                </Folder>
                <Folder name="worker">
                    <File name="queue.go" />
                </Folder>
                <File name="docker-compose.yml" />
            </Folder>
        </div>
    );
}
