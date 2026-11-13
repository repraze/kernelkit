import {Badge} from "@repraze/kernelkit/components/badge";
import {
    Timeline,
    TimelineContent,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    TimelineTime,
    TimelineTitle,
} from "@repraze/kernelkit/components/timeline";
import type {Color} from "@repraze/kernelkit/lib/color";
import {GitCommitIcon, GitMergeIcon, GitPullRequestIcon, RocketIcon, TriangleAlertIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Timeline",
    category: "Data display",
    description:
        "A vertical list of events: a dot or icon per item, joined by a line. Activity feeds, deploy history, logs.",
    demos: [
        {title: "Activity", component: Activity, description: "Marker colors carry the status; the title says it too."},
        {
            title: "With icons",
            component: WithIcons,
            description: "Children of `TimelineMarker` turn the dot into an icon ring.",
        },
        {
            title: "Dense log",
            component: DenseLog,
            description: '`size="sm"` with a `TimelineTime` first in each item: a time column, like a terminal log.',
        },
    ],
    props: [
        {
            component: "Timeline",
            rows: [
                {
                    name: "size",
                    type: '"sm" | "default"',
                    default: '"default"',
                    description: "`sm`: 20px rows, `text-xs`.",
                },
            ],
        },
        {
            component: "TimelineMarker",
            rows: [
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: '"neutral"',
                },
                {name: "children", type: "ReactNode", description: "An icon: the marker becomes a ringed icon."},
            ],
        },
        {component: "TimelineTime", rows: [{name: "dateTime", type: "string", description: "Machine-readable time."}]},
    ],
});

const EVENTS: {title: string; time: string; description: string; color: Color}[] = [
    {
        title: "Deployed to production",
        time: "2m ago",
        description: "v2.14.0 rolled out to 3 regions.",
        color: "success",
    },
    {
        title: "Health check degraded",
        time: "18m ago",
        description: "p95 latency above 800ms in eu-west.",
        color: "warning",
    },
    {title: "Build failed", time: "1h ago", description: "Type error in src/api/routes.ts:42.", color: "danger"},
    {title: "Preview ready", time: "1h ago", description: "feat/streaming built in 48s.", color: "info"},
    {title: "Branch created", time: "3h ago", description: "feat/streaming from main.", color: "neutral"},
];

export function Activity() {
    return (
        <Timeline className="w-full max-w-sm">
            {EVENTS.map((e) => (
                <TimelineItem key={e.title}>
                    <TimelineMarker color={e.color} />
                    <TimelineContent>
                        <TimelineTitle>
                            {e.title}
                            <TimelineTime>{e.time}</TimelineTime>
                        </TimelineTitle>
                        <TimelineDescription>{e.description}</TimelineDescription>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}

export function WithIcons() {
    return (
        <Timeline className="w-full max-w-sm">
            <TimelineItem>
                <TimelineMarker color="primary">
                    <RocketIcon />
                </TimelineMarker>
                <TimelineContent>
                    <TimelineTitle>
                        Released v2.14.0 <Badge variant="soft">latest</Badge>
                    </TimelineTitle>
                    <TimelineTime dateTime="2026-11-12">Nov 12, 2026</TimelineTime>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineMarker color="purple">
                    <GitMergeIcon />
                </TimelineMarker>
                <TimelineContent>
                    <TimelineTitle>Merged PR 482 into main</TimelineTitle>
                    <TimelineDescription>Streaming responses for the chat endpoint.</TimelineDescription>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineMarker color="warning">
                    <TriangleAlertIcon />
                </TimelineMarker>
                <TimelineContent>
                    <TimelineTitle>Review requested changes</TimelineTitle>
                    <TimelineDescription>2 comments on the retry logic.</TimelineDescription>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineMarker color="green">
                    <GitPullRequestIcon />
                </TimelineMarker>
                <TimelineContent>
                    <TimelineTitle>Opened PR 482</TimelineTitle>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineMarker>
                    <GitCommitIcon />
                </TimelineMarker>
                <TimelineContent>
                    <TimelineTitle>3 commits pushed</TimelineTitle>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    );
}

const LOG: {time: string; color: Color; text: string}[] = [
    {time: "14:02:11", color: "neutral", text: "Cloning repository@a3f9c21"},
    {time: "14:02:13", color: "neutral", text: "Installing dependencies (412 packages)"},
    {time: "14:02:41", color: "info", text: "Running build: vite build"},
    {time: "14:03:02", color: "warning", text: "Chunk index.js is 612 kB after minification"},
    {time: "14:03:05", color: "success", text: "Build completed in 24.1s"},
    {time: "14:03:09", color: "success", text: "Deployed to https://app.example.dev"},
];

export function DenseLog() {
    return (
        <Timeline size="sm" className="w-full max-w-md rounded-xl border border-border bg-card p-3">
            {LOG.map((l) => (
                <TimelineItem key={l.time}>
                    <TimelineTime className="w-14">{l.time}</TimelineTime>
                    <TimelineMarker color={l.color} />
                    <TimelineContent>
                        <TimelineTitle>{l.text}</TimelineTitle>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
}
