"use client";

import {Progress as ProgressPrimitive} from "@base-ui/react/progress";
import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {cva} from "class-variance-authority";
import {cn} from "cn";

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
}

function Progress({className, children, value, color, size, ...props}: ProgressProps) {
    const resolvedColor = color ?? "primary";
    const resolvedSize = size ?? "default";
    return (
        <ProgressPrimitive.Root
            value={value}
            data-slot="progress"
            data-color={resolvedColor}
            data-size={resolvedSize}
            className={cn(progressVariants({color: resolvedColor, size: resolvedSize}), className)}
            {...props}
        >
            {children}
            <ProgressTrack>
                <ProgressIndicator />
            </ProgressTrack>
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
            className={cn("ms-auto font-mono text-xs text-muted-foreground tabular-nums", className)}
            {...props}
        />
    );
}

export {
    Progress,
    ProgressIndicator,
    progressIndicatorClass,
    ProgressLabel,
    ProgressTrack,
    progressTrackClass,
    ProgressValue,
    progressVariants,
};
export type {ProgressProps, ProgressSize};
