"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {heading} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {ArrowRightIcon, ArrowUpRightIcon} from "lucide-react";
import * as React from "react";

/** `--card-spacing` drives every part's padding and the gap between sections (§4: p-4, sm p-3). */
const cardVariants = cva(
    "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl border border-border bg-card py-(--card-spacing) text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
    {
        variants: {
            size: {
                default: "[--card-spacing:--spacing(4)]",
                sm: "[--card-spacing:--spacing(3)]",
            },
        },
        defaultVariants: {size: "default"},
    },
);

function Card({className, size = "default", ...props}: React.ComponentProps<"div"> & {size?: "default" | "sm"}) {
    return <div data-slot="card" data-size={size} className={cn(cardVariants({size}), className)} {...props} />;
}

function CardHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:border-border [.border-b]:pb-(--card-spacing)",
                className,
            )}
            {...props}
        />
    );
}

function CardTitle({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn(heading, "text-base leading-snug group-data-[size=sm]/card:text-sm", className)}
            {...props}
        />
    );
}

function CardDescription({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardAction({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
            {...props}
        />
    );
}

function CardContent({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="card-content" className={cn("px-(--card-spacing)", className)} {...props} />;
}

function CardFooter({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                "flex items-center gap-2 rounded-b-xl border-t border-border bg-muted/50 p-(--card-spacing)",
                className,
            )}
            {...props}
        />
    );
}

/**
 * A whole card that is one link (§6, clickable surfaces). The cursor alone never says "clickable":
 * hover and keyboard focus turn the border and title to the accent, wash the top in the accent tint,
 * nudge a `LinkCardArrow` and zoom a `LinkCardMedia`. Use `render` for a router link.
 *
 * ```tsx
 * <LinkCard render={<Link to="/ports/vscode" />}>
 *   <CardHeader>
 *     <CardTitle>VS Code</CardTitle>
 *     <CardDescription>Editor theme.</CardDescription>
 *     <CardAction><LinkCardArrow /></CardAction>
 *   </CardHeader>
 * </LinkCard>
 * ```
 */
function LinkCard({
    className,
    size = "default",
    render,
    ...props
}: useRender.ComponentProps<"a"> & {size?: "default" | "sm"}) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                className: cn(
                    cardVariants({size}),
                    "group/link-card relative isolate outline-none transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
                    "hover:border-primary-text focus-visible:border-primary-text focus-visible:ring-3 focus-visible:ring-ring/50",
                    // the wash: under the content, over the card background
                    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-primary-tint before:to-transparent before:to-70% before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100 focus-visible:before:opacity-100 motion-reduce:before:transition-none",
                    "has-[>[data-slot=link-card-media]:first-child]:pt-0",
                    "**:data-[slot=card-title]:transition-colors hover:**:data-[slot=card-title]:text-primary-text focus-visible:**:data-[slot=card-title]:text-primary-text",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "link-card", size},
    });
}

/** An image band at the top of a LinkCard; its child zooms slightly on hover. */
function LinkCardMedia({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="link-card-media"
            className={cn(
                "overflow-hidden border-b border-border *:transition-transform *:duration-300 group-hover/link-card:*:scale-[1.03] group-focus-visible/link-card:*:scale-[1.03] motion-reduce:*:transition-none motion-reduce:group-hover/link-card:*:scale-100",
                className,
            )}
            {...props}
        />
    );
}

/** The trailing arrow of a LinkCard: accent on hover, and it moves toward where the click goes. */
function LinkCardArrow({
    className,
    external = false,
    ...props
}: React.ComponentProps<typeof ArrowRightIcon> & {
    /** An up-right arrow for links that leave the site. */
    external?: boolean;
}) {
    const Icon = external ? ArrowUpRightIcon : ArrowRightIcon;
    return (
        <Icon
            data-slot="link-card-arrow"
            aria-hidden
            className={cn(
                "size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-200 group-hover/link-card:text-primary-text group-focus-visible/link-card:text-primary-text motion-reduce:transition-none",
                external
                    ? "group-hover/link-card:translate-x-0.5 group-hover/link-card:-translate-y-0.5 group-focus-visible/link-card:translate-x-0.5 group-focus-visible/link-card:-translate-y-0.5"
                    : "group-hover/link-card:translate-x-1 group-focus-visible/link-card:translate-x-1",
                className,
            )}
            {...props}
        />
    );
}

export {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    cardVariants,
    LinkCard,
    LinkCardArrow,
    LinkCardMedia,
};
