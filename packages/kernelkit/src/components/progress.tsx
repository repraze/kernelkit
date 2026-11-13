"use client";

import {Progress as ProgressPrimitive} from "@base-ui/react/progress";
import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {placeholderFill} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import type * as React from "react";

/** Root of a progress or meter: label + value on one row, track below. Sets the color vars. */
const progressVariants = cva("group/progress flex w-full flex-wrap items-center gap-x-3 gap-y-1.5", {
    variants: {
        color: colorVariants,
        size: {sm: "", default: "", lg: ""},
    },
    defaultVariants: {color: "primary", size: "default"},
});

/** Pill track: a faint wash of the color (reads on card and background); an inset outline in high contrast. */
const progressTrackClass =
    "relative flex h-1.5 w-full items-center overflow-hidden rounded-pill bg-(--c)/15 group-data-[size=lg]/progress:h-2 group-data-[size=sm]/progress:h-1 hc:bg-transparent hc:inset-ring hc:inset-ring-border";

/** Filled part, solid fill tier of the color (§2). */
const progressIndicatorClass =
    "h-full rounded-pill bg-(--c-fill) transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none";

type ProgressSize = "sm" | "default" | "lg";

interface ProgressProps extends Omit<ProgressPrimitive.Root.Props, "color"> {
    /** Indicator color. Defaults to primary. */
    color?: Color | null;
    /** Track height: sm `h-1`, default `h-1.5`, lg `h-2`. */
    size?: ProgressSize | null;
    /** `bar`: one pill track. `segmented`: a row of cells, lit in order; a wave runs through them while indeterminate. */
    variant?: "bar" | "segmented";
    /** `segmented` only: number of cells. */
    segments?: number;
}

function Progress({
    className,
    children,
    value,
    color,
    size,
    variant = "bar",
    segments = 12,
    max = 100,
    ...props
}: ProgressProps) {
    const resolvedColor = color ?? "primary";
    const resolvedSize = size ?? "default";
    return (
        <ProgressPrimitive.Root
            value={value}
            max={max}
            data-slot="progress"
            data-variant={variant}
            data-color={resolvedColor}
            data-size={resolvedSize}
            className={cn(progressVariants({color: resolvedColor, size: resolvedSize}), className)}
            {...props}
        >
            {children}
            {variant === "segmented" ? (
                <ProgressSegments segments={segments} lit={value == null ? null : (value / max) * segments} />
            ) : (
                <ProgressTrack>
                    <ProgressIndicator />
                </ProgressTrack>
            )}
        </ProgressPrimitive.Root>
    );
}

function ProgressTrack({className, ...props}: ProgressPrimitive.Track.Props) {
    return (
        <ProgressPrimitive.Track data-slot="progress-track" className={cn(progressTrackClass, className)} {...props} />
    );
}

function ProgressIndicator({className, ...props}: ProgressPrimitive.Indicator.Props) {
    return (
        <ProgressPrimitive.Indicator
            data-slot="progress-indicator"
            className={cn(
                progressIndicatorClass,
                // indeterminate (value null): a third of the track sweeping left to right
                "data-indeterminate:w-2/5 data-indeterminate:animate-indeterminate motion-reduce:data-indeterminate:animate-pulse",
                className,
            )}
            {...props}
        />
    );
}

/** Negative delays so every cell is mid-cycle on the first frame (no dead start). */
const cellDelay = (i: number, n: number) => ({animationDelay: `${-((n - i) * 1.2) / n}s`});

/**
 * The `segmented` track: cells in the fill tier, unlit ones on the placeholder fill (§4). `lit` is how many
 * cells are on (fractional rounds), `null` runs the indeterminate wave. Reduced motion slows the wave down.
 */
function ProgressSegments({
    segments,
    lit,
    className,
    ...props
}: React.ComponentProps<"div"> & {segments: number; lit: number | null}) {
    const on = lit === null ? -1 : Math.round(Math.min(segments, Math.max(0, lit)));
    return (
        <div
            data-slot="progress-segments"
            aria-hidden
            className={cn(
                "flex h-1.5 w-full gap-0.5 group-data-[size=lg]/progress:h-2 group-data-[size=sm]/progress:h-1",
                className,
            )}
            {...props}
        >
            {Array.from({length: segments}, (_, i) => (
                <span
                    key={i}
                    data-lit={on < 0 || i < on ? "" : undefined}
                    className={cn(
                        "h-full flex-1 rounded-xs transition-colors duration-300 motion-reduce:transition-none",
                        on < 0
                            ? "animate-loader-cell bg-(--c-fill) motion-reduce:[animation-duration:3s]"
                            : i < on
                              ? "bg-(--c-fill)"
                              : placeholderFill,
                    )}
                    style={on < 0 ? cellDelay(i, segments) : undefined}
                />
            ))}
        </div>
    );
}

function ProgressLabel({className, ...props}: ProgressPrimitive.Label.Props) {
    return (
        <ProgressPrimitive.Label
            data-slot="progress-label"
            className={cn("text-sm font-medium", className)}
            {...props}
        />
    );
}

function ProgressValue({className, ...props}: ProgressPrimitive.Value.Props) {
    return (
        <ProgressPrimitive.Value
            data-slot="progress-value"
            className={cn("ms-auto font-alt text-xs text-muted-foreground tabular-nums", className)}
            {...props}
        />
    );
}

export {
    Progress,
    ProgressIndicator,
    progressIndicatorClass,
    ProgressLabel,
    ProgressSegments,
    ProgressTrack,
    progressTrackClass,
    ProgressValue,
    progressVariants,
};
export type {ProgressProps, ProgressSize};
