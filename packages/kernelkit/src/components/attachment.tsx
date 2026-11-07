"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {Button} from "@repraze/kernelkit/components/button";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import * as React from "react";

const attachmentVariants = cva(
    [
        "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border border-border bg-card text-card-foreground transition-[color,background-color,border-color,box-shadow] duration-100",
        // A full-bleed AttachmentTrigger makes the whole card clickable: hover wash + keyboard ring on the card.
        "has-[>[data-slot=attachment-trigger]]:hover:bg-hover has-[>[data-slot=attachment-trigger]:focus-visible]:border-ring has-[>[data-slot=attachment-trigger]:focus-visible]:ring-3 has-[>[data-slot=attachment-trigger]:focus-visible]:ring-ring/50",
        "data-[state=error]:border-danger/50 data-[state=idle]:border-dashed data-[state=idle]:border-input data-[state=idle]:bg-transparent",
    ],
    {
        variants: {
            size: {
                default:
                    "gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
                sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
                xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
            },
            orientation: {
                horizontal: "min-w-40 items-center",
                vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
            },
        },
    },
);

type AttachmentProps = React.ComponentProps<"div"> &
    VariantProps<typeof attachmentVariants> & {
        /** `idle` = dashed drop slot, `uploading`/`processing` shimmer the title and dim image media. */
        state?: "idle" | "uploading" | "processing" | "error" | "done";
    };

function Attachment({
    className,
    state = "done",
    size = "default",
    orientation = "horizontal",
    ...props
}: AttachmentProps) {
    return (
        <div
            data-slot="attachment"
            data-state={state}
            data-size={size}
            data-orientation={orientation}
            className={cn(attachmentVariants({size, orientation}), className)}
            {...props}
        />
    );
}

const attachmentMediaVariants = cva(
    "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[orientation=vertical]/attachment:rounded-lg group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-sm group-data-[state=error]/attachment:bg-danger/12 group-data-[state=error]/attachment:text-danger group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
    {
        variants: {
            variant: {
                icon: "",
                image: "opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover",
            },
        },
        defaultVariants: {
            variant: "icon",
        },
    },
);

function AttachmentMedia({
    className,
    variant = "icon",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
    return (
        <div
            data-slot="attachment-media"
            data-variant={variant}
            className={cn(attachmentMediaVariants({variant}), className)}
            {...props}
        />
    );
}

function AttachmentContent({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="attachment-content"
            className={cn(
                "max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1",
                className,
            )}
            {...props}
        />
    );
}

function AttachmentTitle({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="attachment-title"
            className={cn(
                "block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer",
                className,
            )}
            {...props}
        />
    );
}

function AttachmentDescription({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="attachment-description"
            className={cn(
                "mt-0.5 block max-w-full min-w-0 truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-danger",
                className,
            )}
            {...props}
        />
    );
}

function AttachmentActions({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="attachment-actions"
            className={cn(
                "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1",
                className,
            )}
            {...props}
        />
    );
}

function AttachmentAction({className, variant, size = "icon-xs", ...props}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            data-slot="attachment-action"
            variant={variant ?? "ghost"}
            size={size}
            className={cn(
                "group-data-[orientation=vertical]/attachment:bg-background/85 group-data-[orientation=vertical]/attachment:backdrop-blur-xs",
                className,
            )}
            {...props}
        />
    );
}

function AttachmentTrigger({className, render, type, ...props}: useRender.ComponentProps<"button">) {
    return useRender({
        defaultTagName: "button",
        props: mergeProps<"button">(
            {
                type: render ? type : (type ?? "button"),
                className: cn("absolute inset-0 z-10 outline-none", className),
            },
            props,
        ),
        render,
        state: {
            slot: "attachment-trigger",
        },
    });
}

function AttachmentGroup({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="attachment-group"
            className={cn(
                "flex min-w-0 scroll-fade-x snap-x snap-mandatory scroll-px-1 scrollbar-none gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start",
                className,
            )}
            {...props}
        />
    );
}

export {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    attachmentMediaVariants,
    AttachmentTitle,
    AttachmentTrigger,
    attachmentVariants,
};
export type {AttachmentProps};
