"use client";

import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import * as React from "react";

type TimelineSize = "sm" | "default";

const TimelineContext = React.createContext<TimelineSize>("default");

/**
 * The marker column sets the rhythm: its box is as tall as the title's line (24px, 20px at `sm`), so a dot
 * or icon centres on the first line of text whatever the item holds.
 */
const timelineVariants = cva("flex flex-col", {
    variants: {
        size: {
            default: "text-sm",
            sm: "text-xs",
        },
    },
    defaultVariants: {size: "default"},
});

interface TimelineProps extends React.ComponentProps<"ol"> {
    /** `sm` is the dense log: 20px rows, `text-xs`, tighter spacing. */
    size?: TimelineSize;
}

/** A vertical list of events: a marker per item joined by a line, newest first or last as you order them. */
function Timeline({size = "default", className, ...props}: TimelineProps) {
    return (
        <TimelineContext.Provider value={size}>
            <ol data-slot="timeline" data-size={size} className={cn(timelineVariants({size}), className)} {...props} />
        </TimelineContext.Provider>
    );
}

/** One event: `TimelineMarker` then `TimelineContent` (put a `TimelineTime` first for a time column). */
function TimelineItem({className, ...props}: React.ComponentProps<"li">) {
    const size = React.useContext(TimelineContext);
    return (
        <li
            data-slot="timeline-item"
            data-size={size}
            className={cn("group/timeline-item relative flex gap-3 data-[size=sm]:gap-2.5", className)}
            {...props}
        />
    );
}

const timelineMarkerVariants = cva(
    "relative z-10 inline-flex shrink-0 items-center justify-center rounded-pill [&_svg]:shrink-0",
    {
        variants: {
            color: colorVariants,
            kind: {
                // a dot with a ring of the page colour, so it reads over the line
                dot: "bg-(--c)",
                icon: "border border-(--c)/40 bg-background text-(--c) hc:border-(--c)",
            },
            size: {
                default: "",
                sm: "",
            },
        },
        compoundVariants: [
            {kind: "dot", size: "default", class: "size-2.5"},
            {kind: "dot", size: "sm", class: "size-2"},
            {kind: "icon", size: "default", class: "size-6 [&_svg:not([class*='size-'])]:size-3.5"},
            {kind: "icon", size: "sm", class: "size-5 [&_svg:not([class*='size-'])]:size-3"},
            {kind: "dot", color: "neutral", class: "bg-muted-foreground"},
            {kind: "icon", color: "neutral", class: "border-border text-muted-foreground hc:border-border"},
        ],
        defaultVariants: {color: "neutral", kind: "dot", size: "default"},
    },
);

interface TimelineMarkerProps extends Omit<React.ComponentProps<"span">, "color"> {
    /** Status or hue of the dot / icon ring. Defaults to neutral grey. */
    color?: Color | null;
}

/**
 * The item's dot, or an icon in a ring when it has children. Carries the line down to the next item;
 * the last item has no tail.
 */
function TimelineMarker({color, className, children, ...props}: TimelineMarkerProps) {
    const size = React.useContext(TimelineContext);
    const resolved = color ?? "neutral";
    const kind = children ? "icon" : "dot";
    return (
        <span
            data-slot="timeline-marker"
            data-size={size}
            data-color={resolved}
            className="flex w-6 shrink-0 flex-col items-center self-stretch data-[size=sm]:w-5"
        >
            <span className="flex h-6 items-center justify-center data-[size=sm]:h-5" data-size={size}>
                <span
                    data-slot="timeline-marker-indicator"
                    className={cn(timelineMarkerVariants({color: resolved, kind, size}), className)}
                    {...props}
                >
                    {children}
                </span>
            </span>
            <span
                data-slot="timeline-marker-tail"
                aria-hidden="true"
                className={cn(
                    "w-px flex-1 bg-border group-last/timeline-item:hidden",
                    // a dot sits inside its box with room around it; an icon fills the box, so leave a gap at both ends
                    kind === "icon" && "my-1",
                )}
            />
        </span>
    );
}

/** Title, time and description of an item. Its bottom padding is the gap to the next item. */
function TimelineContent({className, ...props}: React.ComponentProps<"div">) {
    const size = React.useContext(TimelineContext);
    return (
        <div
            data-slot="timeline-content"
            data-size={size}
            className={cn(
                "flex min-w-0 flex-1 flex-col gap-0.5 pb-6 group-last/timeline-item:pb-0 data-[size=sm]:gap-0 data-[size=sm]:pb-2",
                className,
            )}
            {...props}
        />
    );
}

function TimelineTitle({className, ...props}: React.ComponentProps<"div">) {
    const size = React.useContext(TimelineContext);
    return (
        <div
            data-slot="timeline-title"
            data-size={size}
            className={cn(
                "flex min-h-6 flex-wrap items-center gap-x-2 font-medium text-foreground data-[size=sm]:min-h-5 data-[size=sm]:font-normal",
                className,
            )}
            {...props}
        />
    );
}

/** A timestamp: mono, muted. Inline after a title, or first in the item for a time column. */
function TimelineTime({className, ...props}: React.ComponentProps<"time">) {
    const size = React.useContext(TimelineContext);
    return (
        <time
            data-slot="timeline-time"
            data-size={size}
            className={cn(
                "inline-flex min-h-6 shrink-0 items-center font-alt text-xs font-normal text-muted-foreground tabular-nums data-[size=sm]:min-h-5",
                className,
            )}
            {...props}
        />
    );
}

function TimelineDescription({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="timeline-description"
            className={cn("text-sm text-muted-foreground in-data-[size=sm]:text-xs", className)}
            {...props}
        />
    );
}

export {
    Timeline,
    TimelineContent,
    TimelineDescription,
    TimelineItem,
    TimelineMarker,
    timelineMarkerVariants,
    TimelineTime,
    TimelineTitle,
    timelineVariants,
};
export type {TimelineMarkerProps, TimelineProps, TimelineSize};
