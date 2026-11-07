import {Spinner} from "kernelkit/components/spinner";
import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceDescription,
    TraceIcon,
    TraceLine,
    TraceTitle,
} from "kernelkit/components/trace";
import {CheckIcon, CircleDashedIcon, FileTextIcon, GlobeIcon, SearchIcon, TerminalIcon, XIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Trace",
    category: "Chat",
    description:
        "The assistant's working steps (tool calls, searches, reads), as quiet one-line entries that can fold away under a summary.",
    baseUi: "collapsible",
    order: 3,
    demos: [
        {title: "Steps", component: Steps, layout: "start"},
        {
            title: "Status",
            component: Status,
            layout: "start",
            description: "`running` shimmers the title, `error` turns the line danger, `pending` dims it.",
        },
        {
            title: "Collapsible",
            component: Collapsed,
            layout: "start",
            description: "Fold the steps under a summary line. The content gets a guide line on the left.",
        },
        {
            title: "Clickable steps",
            component: Clickable,
            layout: "start",
            description: "Wrap a line in a button or link to open its details; it lifts to foreground on hover.",
        },
    ],
    props: [
        {
            component: "TraceLine",
            rows: [
                {
                    name: "status",
                    type: '"running" | "error" | "pending"',
                    description: "Omit for a finished step.",
                },
            ],
        },
        {
            component: "TraceCollapsible",
            rows: [
                {name: "defaultOpen", type: "boolean", default: "false"},
                {
                    name: "open / onOpenChange",
                    type: "boolean / (open) => void",
                    description: "Controlled mode: pass both together.",
                },
            ],
        },
    ],
});

export function Steps() {
    return (
        <Trace>
            <TraceLine>
                <TraceIcon>
                    <SearchIcon />
                </TraceIcon>
                <TraceTitle>Searched the codebase for retryPolicy</TraceTitle>
                <TraceDescription>6 files</TraceDescription>
            </TraceLine>
            <TraceLine>
                <TraceIcon>
                    <FileTextIcon />
                </TraceIcon>
                <TraceTitle>Read src/queue/worker.ts</TraceTitle>
                <TraceDescription>L120-188</TraceDescription>
            </TraceLine>
            <TraceLine>
                <TraceIcon>
                    <GlobeIcon />
                </TraceIcon>
                <TraceTitle>Fetched status.example.com</TraceTitle>
                <TraceDescription>1.4s</TraceDescription>
            </TraceLine>
        </Trace>
    );
}

export function Status() {
    return (
        <Trace>
            <TraceLine>
                <TraceIcon>
                    <CheckIcon className="text-success" />
                </TraceIcon>
                <TraceTitle>npm run build</TraceTitle>
                <TraceDescription>18.2s</TraceDescription>
            </TraceLine>
            <TraceLine status="error">
                <TraceIcon>
                    <XIcon />
                </TraceIcon>
                <TraceTitle>npm test: 2 failed</TraceTitle>
                <TraceDescription>exit 1</TraceDescription>
            </TraceLine>
            <TraceLine status="running">
                <TraceIcon>
                    <Spinner />
                </TraceIcon>
                <TraceTitle>Re-running failed specs</TraceTitle>
            </TraceLine>
            <TraceLine status="pending">
                <TraceIcon>
                    <CircleDashedIcon />
                </TraceIcon>
                <TraceTitle>Deploy to staging</TraceTitle>
            </TraceLine>
        </Trace>
    );
}

export function Collapsed() {
    return (
        <div className="flex flex-col gap-4">
            <TraceCollapsible defaultOpen>
                <TraceCollapsibleTrigger>
                    <TraceLine>
                        <TraceTitle>Ran 3 commands</TraceTitle>
                        <TraceDescription>9.6s</TraceDescription>
                    </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                    <Trace>
                        <TraceLine>
                            <TraceIcon>
                                <TerminalIcon />
                            </TraceIcon>
                            <TraceTitle>git log --oneline -5</TraceTitle>
                        </TraceLine>
                        <TraceLine>
                            <TraceIcon>
                                <TerminalIcon />
                            </TraceIcon>
                            <TraceTitle>git bisect run npm test</TraceTitle>
                        </TraceLine>
                        <TraceLine>
                            <TraceIcon>
                                <TerminalIcon />
                            </TraceIcon>
                            <TraceTitle>git show a41c9e2 --stat</TraceTitle>
                        </TraceLine>
                    </Trace>
                </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible>
                <TraceCollapsibleTrigger>
                    <TraceLine status="error">
                        <TraceTitle>Migration check failed</TraceTitle>
                    </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                    Column <code className="font-mono">users.tenant_id</code> is NOT NULL but 312 rows have no value.
                </TraceCollapsibleContent>
            </TraceCollapsible>
        </div>
    );
}

export function Clickable() {
    return (
        <Trace>
            <button type="button">
                <TraceLine>
                    <TraceIcon>
                        <FileTextIcon />
                    </TraceIcon>
                    <TraceTitle>Read logs/api-2026-11-06.log</TraceTitle>
                    <TraceDescription>2,048 lines</TraceDescription>
                </TraceLine>
            </button>
            <a href="#clickable-steps">
                <TraceLine>
                    <TraceIcon>
                        <GlobeIcon />
                    </TraceIcon>
                    <TraceTitle>Opened grafana: p99 latency</TraceTitle>
                </TraceLine>
            </a>
        </Trace>
    );
}
