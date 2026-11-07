import {Bubble, BubbleContent} from "kernelkit/components/bubble";
import {Button} from "kernelkit/components/button";
import {Input} from "kernelkit/components/input";
import {Message, MessageContent, MessageFooter} from "kernelkit/components/message";
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "kernelkit/components/message-scroller";
import {ArrowUpIcon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Message Scroller",
    category: "Chat",
    description:
        "The scrolling log behind a chat: starts at the latest turn, follows new messages, and offers a jump button when you scroll away.",
    order: 5,
    demos: [
        {
            title: "Conversation",
            component: Conversation,
            layout: "start",
            description:
                "Scroll up and the jump-to-end button appears. Send a message: with `autoScroll` the log follows it.",
        },
        {
            title: "Jump to start",
            component: JumpToStart,
            layout: "start",
            description: 'A second button with `direction="start"` scrolls back to the first turn.',
        },
    ],
    props: [
        {
            component: "MessageScrollerProvider",
            rows: [
                {
                    name: "autoScroll",
                    type: "boolean",
                    default: "false",
                    description: "Follow new messages while at the end.",
                },
                {
                    name: "defaultScrollPosition",
                    type: '"start" | "end" | "last-anchor"',
                    default: '"end"',
                    description: "Where the log opens. `last-anchor` opens on the last `scrollAnchor` item.",
                },
                {
                    name: "scrollEdgeThreshold",
                    type: "number",
                    default: "8",
                    description: "px from an edge that counts as at it.",
                },
            ],
        },
        {
            component: "MessageScrollerItem",
            rows: [
                {
                    name: "messageId",
                    type: "string",
                    description: "Needed for `scrollToMessage` and visibility tracking.",
                },
                {
                    name: "scrollAnchor",
                    type: "boolean",
                    default: "false",
                    description: "When added, scroll so this item sits at the top (a new user turn).",
                },
            ],
        },
        {
            component: "MessageScrollerButton",
            rows: [
                {name: "direction", type: '"start" | "end"', default: '"end"'},
                {name: "variant / size", type: "Button props", default: '"outline" / "icon-sm"'},
            ],
        },
    ],
});

interface Turn {
    id: string;
    role: "user" | "assistant";
    text: string;
}

const seed: Turn[] = [
    {id: "1", role: "user", text: "p99 latency on /checkout jumped from 180ms to 1.2s at 09:40."},
    {
        id: "2",
        role: "assistant",
        text: "The jump lines up with deploy 2.31.5. Its diff adds a synchronous call to the fraud service inside the request path.",
    },
    {id: "3", role: "user", text: "Is the fraud service itself slow?"},
    {
        id: "4",
        role: "assistant",
        text: "Its own p99 is 950ms since 09:38. The connection pool is capped at 10 and every checkout waits for a slot.",
    },
    {id: "5", role: "user", text: "Options?"},
    {
        id: "6",
        role: "assistant",
        text: "Short term: raise the pool to 50 and add a 300ms timeout with a fail-open path. Long term: move the check to the async order pipeline.",
    },
    {id: "7", role: "user", text: "Do the short-term fix."},
    {
        id: "8",
        role: "assistant",
        text: "Opened PR #2291: pool size 50, timeout 300ms, fail-open behind the FRAUD_FAIL_OPEN flag. CI is running.",
    },
];

function Turns({turns}: {turns: Turn[]}) {
    return turns.map((turn) => (
        <MessageScrollerItem key={turn.id} messageId={turn.id} scrollAnchor={turn.role === "user"}>
            <Message align={turn.role === "user" ? "end" : "start"}>
                <MessageContent>
                    <Bubble variant={turn.role === "user" ? "secondary" : "ghost"}>
                        <BubbleContent>{turn.text}</BubbleContent>
                    </Bubble>
                </MessageContent>
            </Message>
        </MessageScrollerItem>
    ));
}

export function Conversation() {
    const [turns, setTurns] = React.useState(seed);
    const [draft, setDraft] = React.useState("");
    const send = (event: React.FormEvent) => {
        event.preventDefault();
        if (!draft.trim()) {
            return;
        }
        const id = String(turns.length + 1);
        setTurns([
            ...turns,
            {id, role: "user", text: draft},
            {id: `${id}a`, role: "assistant", text: "On it: checking the latest CI run for PR #2291."},
        ]);
        setDraft("");
    };
    return (
        <div className="flex h-96 w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-background">
            <MessageScrollerProvider autoScroll>
                <MessageScroller className="flex-1">
                    <MessageScrollerViewport>
                        <MessageScrollerContent className="p-4">
                            <Turns turns={turns} />
                        </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton />
                </MessageScroller>
            </MessageScrollerProvider>
            <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
                <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about the incident…"
                    aria-label="Message"
                />
                <Button type="submit" size="icon" aria-label="Send">
                    <ArrowUpIcon />
                </Button>
            </form>
        </div>
    );
}

export function JumpToStart() {
    return (
        <div className="h-72 w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background">
            <MessageScrollerProvider>
                <MessageScroller>
                    <MessageScrollerViewport>
                        <MessageScrollerContent className="p-4">
                            <Turns turns={seed} />
                            <MessageScrollerItem>
                                <Message>
                                    <MessageContent>
                                        <MessageFooter>
                                            <time>09:52</time> · 8 messages
                                        </MessageFooter>
                                    </MessageContent>
                                </Message>
                            </MessageScrollerItem>
                        </MessageScrollerContent>
                    </MessageScrollerViewport>
                    <MessageScrollerButton direction="start" />
                    <MessageScrollerButton />
                </MessageScroller>
            </MessageScrollerProvider>
        </div>
    );
}
