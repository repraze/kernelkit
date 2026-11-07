"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import type * as React from "react";

/** The wrapper: dot + optional label, inline. Sets the color vars for the dot. */
const statusDotVariants = cva("group/status-dot inline-flex items-center text-sm text-foreground", {
    variants: {
        color: colorVariants,
        size: {
            sm: "gap-1.5 text-xs",
            default: "gap-2",
            lg: "gap-2",
        },
    },
    defaultVariants: {color: "neutral", size: "default"},
});

const dotSize = {
    sm: "size-1.5",
    default: "size-2",
    lg: "size-2.5",
} as const;

interface StatusDotProps extends Omit<useRender.ComponentProps<"span">, "color"> {
    /** Status hue. Defaults to `neutral` (muted grey). */
    color?: Color | null;
    size?: "sm" | "default" | "lg";
    /** Animated ping ring for live / in-progress states. Disabled under `prefers-reduced-motion`. */
    pulse?: boolean;
    /** Accessible name when there is no visible label. */
    label?: string;
}

/**
 * A small pill dot that carries a status color. Put the visible label as children; color is never the only
 * signal, so give a dot without children a `label`.
 */
function StatusDot({
    className,
    color,
    size = "default",
    pulse = false,
    label,
    children,
    render,
    ...props
}: StatusDotProps) {
    const resolved = color ?? "neutral";
    const dot = (
        <span data-slot="status-dot-indicator" className={cn("relative inline-flex shrink-0", dotSize[size])}>
            {pulse ? (
                <span
                    data-slot="status-dot-ping"
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-pill bg-(--c) opacity-60 motion-reduce:hidden"
                />
            ) : null}
            <span
                aria-hidden="true"
                className={cn(
                    "relative inline-flex size-full rounded-pill bg-(--c)",
                    resolved === "neutral" && "bg-muted-foreground",
                )}
            />
        </span>
    );
    return useRender({
        defaultTagName: "span",
        props: mergeProps<"span">(
            {
                className: cn(statusDotVariants({color: resolved, size}), className),
                role: label && !children ? "img" : undefined,
                "aria-label": label && !children ? label : undefined,
                children: (
                    <>
                        {dot}
                        {children ? <span data-slot="status-dot-label">{children}</span> : null}
                    </>
                ),
            } as React.ComponentProps<"span">,
            props,
        ),
        render,
        state: {slot: "status-dot", color: resolved, size, pulse: pulse || undefined},
    });
}

export {StatusDot, statusDotVariants};
export type {StatusDotProps};
