import {
    Attachment,
    AttachmentContent,
    AttachmentDescription,
    AttachmentMedia,
    AttachmentTitle,
} from "kernelkit/components/attachment";
import {Avatar, AvatarFallback} from "kernelkit/components/avatar";
import {Bubble, BubbleContent} from "kernelkit/components/bubble";
import {Button} from "kernelkit/components/button";
import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockHeader,
    CodeBlockTitle,
} from "kernelkit/components/code-block";
import {
    Message,
    MessageAvatar,
    MessageContent,
    MessageFooter,
    MessageGroup,
    MessageHeader,
} from "kernelkit/components/message";
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
import {
    CheckCheckIcon,
    CheckIcon,
    CopyIcon,
    FileTextIcon,
    RotateCcwIcon,
    SearchIcon,
    TerminalIcon,
    ThumbsUpIcon,
} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Message",
    category: "Chat",
    description:
        "One turn in a conversation: avatar, header, content and footer. The user's turns sit at the end in a bubble; the assistant's are plain text.",
    order: 1,
    demos: [
        {
            title: "Chat",
            component: Chat,
            layout: "start",
            description:
                "Message, Bubble, Trace, Attachment and CodeBlock together: the assistant reads the logs, then answers.",
        },
        {title: "User and assistant", component: Basic, layout: "start"},
        {
            title: "Header and footer",
            component: Meta,
            layout: "start",
            description: "Meta is `text-xs` muted. A `<time>` inside a header or footer renders in mono.",
        },
        {
            title: "Group",
            component: Group,
            layout: "start",
            description: "MessageGroup stacks consecutive turns from the same speaker under one avatar.",
        },
    ],
    props: [
        {
            component: "Message",
            rows: [
                {
                    name: "align",
                    type: '"start" | "end"',
                    default: '"start"',
                    description:
                        "`end` mirrors the row for the user's side: avatar right, bubbles and footer end-aligned.",
                },
            ],
        },
        {
            component: "MessageAvatar",
            rows: [
                {
                    name: "side",
                    type: '"bottom" | "top"',
                    default: '"bottom"',
                    description:
                        "`bottom` pins next to the last bubble and lifts above a footer; `top` aligns with the first line, for long replies.",
                },
            ],
        },
    ],
});

const fix = `# deploy/api.yaml
resources:
  limits:
-   memory: 256Mi
+   memory: 512Mi`;

export function Chat() {
    return (
        <div className="flex w-full max-w-2xl flex-col gap-6">
            <Message align="end">
                <MessageContent>
                    <Attachment size="sm">
                        <AttachmentMedia>
                            <FileTextIcon />
                        </AttachmentMedia>
                        <AttachmentContent>
                            <AttachmentTitle>api-7f9c-crash.log</AttachmentTitle>
                            <AttachmentDescription>Log · 48 KB</AttachmentDescription>
                        </AttachmentContent>
                    </Attachment>
                    <Bubble variant="secondary">
                        <BubbleContent>
                            The api deploy keeps restarting after the 14:02 rollout. Can you check?
                        </BubbleContent>
                    </Bubble>
                </MessageContent>
            </Message>
            <Message>
                <MessageAvatar side="top">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <TerminalIcon className="size-3.5" />
                        </AvatarFallback>
                    </Avatar>
                </MessageAvatar>
                <MessageContent>
                    <TraceCollapsible defaultOpen>
                        <TraceCollapsibleTrigger>
                            <TraceLine>
                                <TraceTitle>Investigated for 12s</TraceTitle>
                            </TraceLine>
                        </TraceCollapsibleTrigger>
                        <TraceCollapsibleContent>
                            <Trace>
                                <TraceLine>
                                    <TraceIcon>
                                        <FileTextIcon />
                                    </TraceIcon>
                                    <TraceTitle>Read api-7f9c-crash.log</TraceTitle>
                                    <TraceDescription>1,204 lines</TraceDescription>
                                </TraceLine>
                                <TraceLine>
                                    <TraceIcon>
                                        <SearchIcon />
                                    </TraceIcon>
                                    <TraceTitle>Searched for OOMKilled</TraceTitle>
                                    <TraceDescription>37 matches</TraceDescription>
                                </TraceLine>
                                <TraceLine>
                                    <TraceIcon>
                                        <TerminalIcon />
                                    </TraceIcon>
                                    <TraceTitle>kubectl top pod api-7f9c</TraceTitle>
                                    <TraceDescription>0.8s</TraceDescription>
                                </TraceLine>
                            </Trace>
                        </TraceCollapsibleContent>
                    </TraceCollapsible>
                    <Bubble variant="ghost">
                        <BubbleContent>
                            The pod is being <strong>OOMKilled</strong>: the new image loads the embeddings cache at
                            boot and peaks at 410&nbsp;MiB, over the 256&nbsp;MiB limit. Raise the limit:
                        </BubbleContent>
                    </Bubble>
                    <CodeBlock size="sm">
                        <CodeBlockHeader>
                            <CodeBlockTitle>deploy/api.yaml</CodeBlockTitle>
                            <CodeBlockActions>
                                <CodeBlockCopyButton value={fix} />
                            </CodeBlockActions>
                        </CodeBlockHeader>
                        <CodeBlockContent>{fix.split("\n").slice(1).join("\n")}</CodeBlockContent>
                    </CodeBlock>
                    <MessageFooter>
                        <Button variant="ghost" size="icon-xs" aria-label="Copy">
                            <CopyIcon />
                        </Button>
                        <Button variant="ghost" size="icon-xs" aria-label="Retry">
                            <RotateCcwIcon />
                        </Button>
                        <Button variant="ghost" size="icon-xs" aria-label="Helpful">
                            <ThumbsUpIcon />
                        </Button>
                    </MessageFooter>
                </MessageContent>
            </Message>
            <Message className="pl-10">
                <MessageContent>
                    <Trace>
                        <TraceLine status="running">
                            <TraceIcon>
                                <Spinner />
                            </TraceIcon>
                            <TraceTitle>Watching rollout api-7f9d</TraceTitle>
                        </TraceLine>
                    </Trace>
                </MessageContent>
            </Message>
        </div>
    );
}

export function Basic() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-6">
            <Message align="end">
                <MessageContent>
                    <Bubble variant="secondary">
                        <BubbleContent>Why did the nightly build fail?</BubbleContent>
                    </Bubble>
                </MessageContent>
            </Message>
            <Message>
                <MessageContent>
                    <Bubble variant="ghost">
                        <BubbleContent>
                            The <code className="rounded-sm bg-muted px-1 font-mono text-[0.85em]">test:e2e</code> step
                            timed out waiting for Postgres. The service container started, but its health check never
                            passed because the image tag was bumped to 17 without migrating the volume.
                        </BubbleContent>
                    </Bubble>
                </MessageContent>
            </Message>
        </div>
    );
}

export function Meta() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-6">
            <Message align="end">
                <MessageAvatar>
                    <Avatar size="sm">
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </MessageAvatar>
                <MessageContent>
                    <MessageHeader>
                        Jordan <time dateTime="2026-11-06T14:06">14:06</time>
                    </MessageHeader>
                    <Bubble>
                        <BubbleContent>Roll back api to v2.31.4.</BubbleContent>
                    </Bubble>
                    <MessageFooter>
                        <CheckCheckIcon /> Read
                    </MessageFooter>
                </MessageContent>
            </Message>
            <Message>
                <MessageAvatar>
                    <Avatar size="sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <TerminalIcon className="size-3.5" />
                        </AvatarFallback>
                    </Avatar>
                </MessageAvatar>
                <MessageContent>
                    <MessageHeader>
                        Kernel <time dateTime="2026-11-06T14:06">14:06</time>
                    </MessageHeader>
                    <Bubble variant="ghost">
                        <BubbleContent>
                            Rolled back. <code className="font-mono">api</code> is serving v2.31.4 on 6/6 pods.
                        </BubbleContent>
                    </Bubble>
                    <MessageFooter>
                        <CheckIcon className="text-success" /> Healthy · <time>0.9s</time>
                    </MessageFooter>
                </MessageContent>
            </Message>
        </div>
    );
}

export function Group() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-6">
            <Message align="end">
                <MessageContent>
                    <MessageGroup>
                        <Bubble variant="secondary">
                            <BubbleContent>Staging is green now.</BubbleContent>
                        </Bubble>
                        <Bubble variant="secondary">
                            <BubbleContent>Ship it to prod behind the flag?</BubbleContent>
                        </Bubble>
                    </MessageGroup>
                    <MessageFooter>
                        <time>14:11</time>
                    </MessageFooter>
                </MessageContent>
            </Message>
        </div>
    );
}
