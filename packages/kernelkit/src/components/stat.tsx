"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon} from "lucide-react";
import type * as React from "react";

/** A metric: label, big mono value, delta and an optional sparkline. Sits alone or inside a Card. */
const statVariants = cva("group/stat grid min-w-0 grid-cols-[1fr_auto] content-start gap-x-3", {
    variants: {
        size: {
            sm: "gap-y-0.5",
            default: "gap-y-1",
            lg: "gap-y-1.5",
        },
    },
    defaultVariants: {size: "default"},
});

function Stat({
    className,
    size = "default",
    render,
    ...props
}: useRender.ComponentProps<"div"> & {size?: "sm" | "default" | "lg"}) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn(statVariants({size}), className)}, props),
        render,
        state: {slot: "stat", size},
    });
}

function StatLabel({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="stat-label"
            className={cn(
                "col-span-full flex min-w-0 items-center gap-1.5 truncate text-xs font-medium text-muted-foreground [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
                className,
            )}
            {...props}
        />
    );
}

function StatValue({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="stat-value"
            className={cn(
                "col-start-1 flex items-baseline gap-1 font-alt text-2xl leading-tight font-medium tracking-tight text-foreground tabular-nums",
                "group-data-[size=sm]/stat:text-xl group-data-[size=lg]/stat:text-3xl",
                className,
            )}
            {...props}
        />
    );
}

/** Unit or suffix after the value (`ms`, `%`, `req/s`). */
function StatUnit({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="stat-unit"
            className={cn("text-sm font-normal tracking-normal text-muted-foreground", className)}
            {...props}
        />
    );
}

type StatTrend = "up" | "down" | "flat";

const statDeltaVariants = cva(
    "col-start-1 inline-flex w-fit items-center gap-1 font-alt text-xs font-medium tabular-nums [&_svg]:size-3.5 [&_svg]:shrink-0",
    {
        variants: {
            intent: {
                positive: "text-success",
                negative: "text-danger",
                neutral: "text-muted-foreground",
            },
        },
        defaultVariants: {intent: "neutral"},
    },
);

const trendIcon = {up: ArrowUpRightIcon, down: ArrowDownRightIcon, flat: MinusIcon} as const;

/**
 * Change versus a previous period. `trend` picks the arrow; up is good (success) and down is bad (danger)
 * unless `invert` is set (latency, error rate, cost). The arrow keeps the meaning readable without color.
 */
function StatDelta({
    className,
    trend = "flat",
    invert = false,
    children,
    ...props
}: React.ComponentProps<"div"> & {trend?: StatTrend; invert?: boolean}) {
    const good = trend === "flat" ? null : (trend === "up") !== invert;
    const intent = good === null ? "neutral" : good ? "positive" : "negative";
    const Icon = trendIcon[trend];
    return (
        <div
            data-slot="stat-delta"
            data-trend={trend}
            data-intent={intent}
            className={cn(statDeltaVariants({intent}), className)}
            {...props}
        >
            <Icon aria-hidden="true" />
            {children}
        </div>
    );
}

function StatDescription({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="stat-description"
            className={cn("col-start-1 text-xs text-muted-foreground", className)}
            {...props}
        />
    );
}

/** Right-hand slot beside the value and delta rows: a sparkline, an icon tile or a badge. */
function StatSparkline({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="stat-sparkline"
            className={cn(
                "col-start-2 row-span-2 row-start-2 flex h-full min-h-8 w-24 items-end self-end text-primary-text",
                className,
            )}
            {...props}
        />
    );
}

export {
    Stat,
    StatDelta,
    statDeltaVariants,
    StatDescription,
    StatLabel,
    StatSparkline,
    StatUnit,
    StatValue,
    statVariants,
};
export type {StatTrend};
