"use client";

import {cn} from "cn";
import * as React from "react";

function MessageGroup({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="message-group" className={cn("flex w-full min-w-0 flex-col gap-1", className)} {...props} />;
}

type MessageProps = React.ComponentProps<"div"> & {
    /** `end` mirrors the row: avatar on the right, bubbles and footer aligned to the end (the user's side). */
    align?: "start" | "end";
};

function Message({className, align = "start", ...props}: MessageProps) {
    return (
        <div
            data-slot="message"
            data-align={align}
            className={cn(
                "group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
                className,
            )}
            {...props}
        />
    );
}

function MessageAvatar({
    className,
    side = "bottom",
    ...props
}: React.ComponentProps<"div"> & {
    /** `bottom` pins next to the last bubble (chat style); `top` sits by the header, for long assistant replies. */
    side?: "top" | "bottom";
}) {
    return (
        <div
            data-slot="message-avatar"
            data-side={side}
            className={cn(
                "flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-pill data-[side=bottom]:group-has-data-[slot=message-footer]/message:-translate-y-8 data-[side=top]:self-start",
                className,
            )}
            {...props}
        />
    );
}

function MessageContent({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="message-content"
            className={cn(
                "flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end",
                className,
            )}
            {...props}
        />
    );
}

function MessageHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="message-header"
            className={cn(
                "flex max-w-full min-w-0 items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_time]:font-mono [&_time]:font-normal [&_time]:tabular-nums",
                className,
            )}
            {...props}
        />
    );
}

function MessageFooter({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="message-footer"
            className={cn(
                "flex max-w-full min-w-0 items-center gap-1 px-3 text-xs text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_time]:font-mono [&_time]:tabular-nums",
                className,
            )}
            {...props}
        />
    );
}

export {Message, MessageAvatar, MessageContent, MessageFooter, MessageGroup, MessageHeader};
export type {MessageProps};
