"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import * as React from "react";

function BubbleGroup({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="bubble-group" className={cn("flex min-w-0 flex-col gap-1", className)} {...props} />;
}

// Grey surface variants carry a border: light secondary/muted sit within a few % of the background, and
// high contrast flattens surface shades entirely.
// Variants paint the child `bubble-content`, so a clickable content (`render={<button />}`) gets the hover.
// Literal strings on purpose: Tailwind only generates classes it can read in the source.
const bubbleVariants = cva(
    "group/bubble relative flex w-fit max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
    {
        variants: {
            variant: {
                default:
                    "*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/85",
                secondary:
                    "*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground *:data-[slot=bubble-content]:border-border [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]",
                muted: "*:data-[slot=bubble-content]:bg-muted *:data-[slot=bubble-content]:text-foreground *:data-[slot=bubble-content]:border-border [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_8%)]",
                tinted: "*:data-[slot=bubble-content]:bg-accent *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--accent),var(--foreground)_8%)]",
                outline:
                    "*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-hover",
                ghost: "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0 *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:bg-hover",
                destructive:
                    "*:data-[slot=bubble-content]:bg-danger/12 *:data-[slot=bubble-content]:text-danger dark:*:data-[slot=bubble-content]:bg-danger/20 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-danger/20 dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-danger/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

type BubbleProps = React.ComponentProps<"div"> &
    VariantProps<typeof bubbleVariants> & {
        /** Side the bubble sits on. Inside `<Message align="end">` it follows the message. */
        align?: "start" | "end";
    };

function Bubble({variant = "default", align = "start", className, ...props}: BubbleProps) {
    return (
        <div
            data-slot="bubble"
            data-variant={variant}
            data-align={align}
            className={cn(bubbleVariants({variant}), className)}
            {...props}
        />
    );
}

const bubbleContentVariants = cva([
    "w-fit max-w-full min-w-0 overflow-hidden rounded-xl border border-transparent px-3 py-2 text-sm leading-relaxed wrap-break-word",
    // Tail: the corner pointing at the speaker is tighter (bottom-start, or bottom-end on the end side).
    "rounded-es-sm group-data-[align=end]/bubble:self-end group-data-[align=end]/bubble:rounded-es-xl group-data-[align=end]/bubble:rounded-ee-sm group-data-[align=end]/message:rounded-es-xl group-data-[align=end]/message:rounded-ee-sm",
    "[button]:text-left [button,a]:cursor-pointer [button,a]:transition-[color,background-color,border-color,box-shadow] [button,a]:duration-100",
    focusRing,
]);

function BubbleContent({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn(bubbleContentVariants(), className)}, props),
        render,
        state: {
            slot: "bubble-content",
        },
    });
}

const bubbleReactionsVariants = cva(
    "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-pill border border-border bg-popover px-1.5 py-0.5 text-xs text-popover-foreground shadow-sm shadow-(color:--shadow-color) has-[button]:p-0",
    {
        variants: {
            side: {
                top: "top-0 -translate-y-3/4",
                bottom: "bottom-0 translate-y-3/4",
            },
            align: {
                start: "left-3",
                end: "right-3",
            },
        },
        defaultVariants: {
            side: "bottom",
            align: "end",
        },
    },
);

function BubbleReactions({
    side = "bottom",
    align = "end",
    className,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof bubbleReactionsVariants>) {
    return (
        <div
            data-slot="bubble-reactions"
            data-align={align}
            data-side={side}
            className={cn(bubbleReactionsVariants({side, align}), className)}
            {...props}
        />
    );
}

export {
    Bubble,
    BubbleContent,
    bubbleContentVariants,
    BubbleGroup,
    BubbleReactions,
    bubbleReactionsVariants,
    bubbleVariants,
};
export type {BubbleProps};
