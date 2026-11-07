import {Bubble, BubbleContent, BubbleGroup, BubbleReactions} from "@repraze/kernelkit/components/bubble";
import {Message, MessageContent} from "@repraze/kernelkit/components/message";
import {CheckIcon, ThumbsUpIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Bubble",
    category: "Chat",
    description:
        "The rounded container around a chat turn, with a tighter corner pointing at the speaker. Users get a filled bubble; assistants usually go ghost.",
    order: 2,
    demos: [
        {
            title: "Variants",
            component: Variants,
            layout: "start",
            description:
                "`secondary` is the recommended user bubble: it reads the same under every accent. `default` uses the primary fill.",
        },
        {
            title: "Alignment",
            component: Alignment,
            layout: "start",
            description: "The tail follows `align`, or the parent `<Message align>`.",
        },
        {title: "Group", component: Group, layout: "start"},
        {
            title: "Clickable",
            component: Clickable,
            layout: "start",
            description: "Render the content as a button or link: it gets the variant hover and the focus ring.",
        },
        {title: "Reactions", component: Reactions, layout: "start"},
    ],
    props: [
        {
            component: "Bubble",
            rows: [
                {
                    name: "variant",
                    type: '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"',
                    default: '"default"',
                    description: "`tinted` is the accent tint with foreground text; `ghost` drops the bubble entirely.",
                },
                {name: "align", type: '"start" | "end"', default: '"start"', description: "Side and tail corner."},
            ],
        },
        {
            component: "BubbleContent",
            rows: [
                {
                    name: "render",
                    type: "ReactElement",
                    description: "Render as `<button>` or `<a>` for a clickable bubble.",
                },
            ],
        },
        {
            component: "BubbleReactions",
            rows: [
                {name: "side", type: '"top" | "bottom"', default: '"bottom"'},
                {name: "align", type: '"start" | "end"', default: '"end"'},
            ],
        },
    ],
});

export function Variants() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-3">
            <Bubble>
                <BubbleContent>default: deploy finished in 42s</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
                <BubbleContent>secondary: can you tail the worker logs?</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
                <BubbleContent>muted: 3 pods restarted in the last hour</BubbleContent>
            </Bubble>
            <Bubble variant="tinted">
                <BubbleContent>tinted: suggested fix ready for review</BubbleContent>
            </Bubble>
            <Bubble variant="outline">
                <BubbleContent>outline: draft, not sent yet</BubbleContent>
            </Bubble>
            <Bubble variant="ghost">
                <BubbleContent>ghost: the assistant answers in plain text, no bubble.</BubbleContent>
            </Bubble>
            <Bubble variant="destructive">
                <BubbleContent>destructive: request failed, rate limit exceeded (429)</BubbleContent>
            </Bubble>
        </div>
    );
}

export function Alignment() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-3">
            <Bubble variant="muted">
                <BubbleContent>Build #4182 is queued behind two jobs.</BubbleContent>
            </Bubble>
            <Bubble variant="secondary" align="end">
                <BubbleContent>Cancel the older ones.</BubbleContent>
            </Bubble>
            <Message align="end">
                <MessageContent>
                    <Bubble>
                        <BubbleContent>Inside a Message with align=end, no prop needed.</BubbleContent>
                    </Bubble>
                </MessageContent>
            </Message>
        </div>
    );
}

export function Group() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-4">
            <BubbleGroup>
                <Bubble variant="muted">
                    <BubbleContent>Migration 0042 applied.</BubbleContent>
                </Bubble>
                <Bubble variant="muted">
                    <BubbleContent>Backfilling 1.2M rows, ETA 4 min.</BubbleContent>
                </Bubble>
            </BubbleGroup>
            <BubbleGroup>
                <Bubble variant="secondary" align="end">
                    <BubbleContent>Ping me when it is done.</BubbleContent>
                </Bubble>
                <Bubble variant="secondary" align="end">
                    <BubbleContent>And pause the cron meanwhile.</BubbleContent>
                </Bubble>
            </BubbleGroup>
        </div>
    );
}

export function Clickable() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-3">
            <Bubble variant="outline">
                <BubbleContent render={<button type="button" />}>Show the full stack trace</BubbleContent>
            </Bubble>
            <Bubble variant="secondary">
                <BubbleContent render={<a href="#clickable" />}>Open run #4182 in CI</BubbleContent>
            </Bubble>
        </div>
    );
}

export function Reactions() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-8 py-2">
            <Bubble variant="muted">
                <BubbleContent>Rollback complete, error rate back to 0.02%.</BubbleContent>
                <BubbleReactions>
                    <ThumbsUpIcon className="size-3.5 text-muted-foreground" />
                    <span className="font-mono tabular-nums">2</span>
                </BubbleReactions>
            </Bubble>
            <Bubble variant="secondary" align="end">
                <BubbleContent>Nice, closing the incident.</BubbleContent>
                <BubbleReactions align="start">
                    <CheckIcon className="size-3.5 text-success" aria-label="Resolved" />
                </BubbleReactions>
            </Bubble>
        </div>
    );
}
