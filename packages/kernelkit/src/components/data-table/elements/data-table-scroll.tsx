"use client";

import {ScrollArea as ScrollAreaPrimitive} from "@base-ui/react/scroll-area";
import {cn} from "cn";
import {ScrollBar} from "kernelkit/components/scroll-area";
import type {CSSProperties, ReactNode, Ref} from "react";

export type DataTableScrollProps = {
    className?: string;
    viewportClassName?: string;
    viewportRef?: Ref<HTMLDivElement>;
    style?: CSSProperties;
    children?: ReactNode;
};

/** Vertical overlay scroller for the body (consumes no width, so head and body columns stay aligned). */
export function DataTableScroll({className, viewportClassName, viewportRef, style, children}: DataTableScrollProps) {
    return (
        <ScrollAreaPrimitive.Root data-slot="data-table-scroll" className={cn("relative", className)} style={style}>
            <ScrollAreaPrimitive.Viewport
                ref={viewportRef}
                data-slot="data-table-viewport"
                className={cn(
                    "size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
                    viewportClassName,
                )}
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            <ScrollBar className="opacity-0 transition-opacity duration-150 data-hovering:opacity-100 data-scrolling:opacity-100 motion-reduce:transition-none" />
        </ScrollAreaPrimitive.Root>
    );
}
