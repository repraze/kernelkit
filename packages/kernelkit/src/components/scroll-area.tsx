"use client";

import {ScrollArea as ScrollAreaPrimitive} from "@base-ui/react/scroll-area";
import {cn} from "cn";
import type * as React from "react";

interface ScrollAreaProps extends ScrollAreaPrimitive.Root.Props {
    /** Ref to the scrolling element (for virtualizers, scroll restoration, `scrollTo`). */
    viewportRef?: React.Ref<HTMLDivElement>;
    /** Classes for the scrolling element (padding, snap, max-height…). */
    viewportClassName?: string;
    /** Which scrollbars to render. Defaults to vertical. */
    orientation?: "vertical" | "horizontal" | "both";
    /** Fade content out at the scrollable edges (shadcn `scroll-fade` utilities, scroll-driven, no JS). */
    fade?: boolean;
}

function ScrollArea({
    className,
    children,
    viewportRef,
    viewportClassName,
    orientation = "vertical",
    fade = false,
    ...props
}: ScrollAreaProps) {
    return (
        <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
            <ScrollAreaPrimitive.Viewport
                ref={viewportRef}
                data-slot="scroll-area-viewport"
                className={cn(
                    "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    fade && {vertical: "scroll-fade-y", horizontal: "scroll-fade-x", both: "scroll-fade"}[orientation],
                    viewportClassName,
                )}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            {orientation !== "horizontal" && <ScrollBar orientation="vertical" />}
            {orientation !== "vertical" && <ScrollBar orientation="horizontal" />}
            <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({className, orientation = "vertical", ...props}: ScrollAreaPrimitive.Scrollbar.Props) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            data-slot="scroll-area-scrollbar"
            data-orientation={orientation}
            orientation={orientation}
            className={cn(
                "flex touch-none p-px transition-[opacity,background-color] select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
                className,
            )}
            {...props}
        >
            <ScrollAreaPrimitive.Thumb
                data-slot="scroll-area-thumb"
                className="relative flex-1 rounded-pill bg-foreground/20 transition-colors hover:bg-foreground/35 active:bg-foreground/35 hc:bg-muted-foreground"
            />
        </ScrollAreaPrimitive.Scrollbar>
    );
}

export {ScrollArea, ScrollBar};
export type {ScrollAreaProps};
