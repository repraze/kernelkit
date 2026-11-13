"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";

interface ShimmerProps extends useRender.ComponentProps<"span"> {
    /** Seconds per sweep. */
    duration?: number;
}

/**
 * Text with a highlight band sweeping across it ("Thinking…", "Indexing files…"). Muted text, foreground
 * band. Reduced motion: plain muted text.
 */
function Shimmer({render, duration, className, style, ...props}: ShimmerProps) {
    return useRender({
        defaultTagName: "span",
        props: mergeProps<"span">(
            {
                className: cn(
                    "inline-block animate-shimmer bg-linear-to-r from-muted-foreground from-40% via-foreground via-50% to-muted-foreground to-60% bg-size-[250%_100%] bg-clip-text text-transparent",
                    "motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-muted-foreground",
                    className,
                ),
                style: duration ? {animationDuration: `${duration}s`, ...style} : style,
            },
            props,
        ),
        render,
        state: {slot: "shimmer"},
    });
}

export {Shimmer};
export type {ShimmerProps};
