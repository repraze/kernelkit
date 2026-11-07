"use client";

import {cva} from "class-variance-authority";
import {cn} from "cn";
import type * as React from "react";

/** A keycap: mono, `rounded-sm`, a thicker bottom border for the key look (readable in hc). */
const kbdVariants = cva(
    [
        "pointer-events-none inline-flex w-fit items-center justify-center gap-1 rounded-sm border border-b-2 border-border bg-muted font-mono font-medium text-muted-foreground select-none [&_svg]:shrink-0",
        // inside a tooltip (inverted surface) the key becomes a translucent chip
        "in-data-[slot=tooltip-content]:border-transparent in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10",
    ],
    {
        variants: {
            size: {
                sm: "h-4 min-w-4 px-0.5 text-[0.625rem] [&_svg:not([class*='size-'])]:size-2.5",
                default: "h-5 min-w-5 px-1 text-xs [&_svg:not([class*='size-'])]:size-3",
            },
        },
        defaultVariants: {size: "default"},
    },
);

function Kbd({className, size = "default", ...props}: React.ComponentProps<"kbd"> & {size?: "sm" | "default"}) {
    return <kbd data-slot="kbd" data-size={size} className={cn(kbdVariants({size}), className)} {...props} />;
}

function KbdGroup({className, ...props}: React.ComponentProps<"kbd">) {
    return (
        <kbd
            data-slot="kbd-group"
            className={cn("inline-flex items-center gap-1 font-mono text-xs text-muted-foreground", className)}
            {...props}
        />
    );
}

export {Kbd, KbdGroup, kbdVariants};
