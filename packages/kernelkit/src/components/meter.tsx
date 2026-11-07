"use client";

import {Meter as MeterPrimitive} from "@base-ui/react/meter";
import {cn} from "cn";
import {
    progressIndicatorClass,
    type ProgressSize,
    progressTrackClass,
    progressVariants,
} from "kernelkit/components/progress";
import type {Color} from "kernelkit/lib/color";

interface MeterProps extends Omit<MeterPrimitive.Root.Props, "color"> {
    /** Indicator color. Defaults to primary; pass a status color for thresholds. */
    color?: Color | null;
    /** Track height: sm `h-1`, default `h-1.5`, lg `h-2`. */
    size?: ProgressSize | null;
}

/** A static measurement within a known range (disk usage, quota, battery). For task completion use Progress. */
function Meter({className, children, color, size, ...props}: MeterProps) {
    const resolvedColor = color ?? "primary";
    const resolvedSize = size ?? "default";
    return (
        <MeterPrimitive.Root
            data-slot="meter"
            data-color={resolvedColor}
            data-size={resolvedSize}
            className={cn(progressVariants({color: resolvedColor, size: resolvedSize}), className)}
            {...props}
        >
            {children}
            <MeterTrack>
                <MeterIndicator />
            </MeterTrack>
        </MeterPrimitive.Root>
    );
}

function MeterTrack({className, ...props}: MeterPrimitive.Track.Props) {
    return <MeterPrimitive.Track data-slot="meter-track" className={cn(progressTrackClass, className)} {...props} />;
}

function MeterIndicator({className, ...props}: MeterPrimitive.Indicator.Props) {
    return (
        <MeterPrimitive.Indicator
            data-slot="meter-indicator"
            className={cn(progressIndicatorClass, className)}
            {...props}
        />
    );
}

function MeterLabel({className, ...props}: MeterPrimitive.Label.Props) {
    return <MeterPrimitive.Label data-slot="meter-label" className={cn("text-sm font-medium", className)} {...props} />;
}

function MeterValue({className, ...props}: MeterPrimitive.Value.Props) {
    return (
        <MeterPrimitive.Value
            data-slot="meter-value"
            className={cn("ms-auto font-mono text-xs text-muted-foreground tabular-nums", className)}
            {...props}
        />
    );
}

export {Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue};
export type {MeterProps};
