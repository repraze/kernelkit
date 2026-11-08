"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import {ArrowLeftIcon, ArrowRightIcon} from "lucide-react";
import type * as React from "react";

/** Previous / next page links at the end of a page. */
function Pager({className, render, ...props}: useRender.ComponentProps<"nav">) {
    return useRender({
        defaultTagName: "nav",
        props: mergeProps<"nav">(
            {
                "aria-label": "Pages",
                className: cn("grid grid-cols-2 gap-4 border-t border-border pt-6", className),
            },
            props,
        ),
        render,
        state: {slot: "pager"},
    });
}

interface PagerLinkProps extends useRender.ComponentProps<"a"> {
    direction: "previous" | "next";
    /** Small caption above the title. Defaults to "Previous" / "Next". */
    label?: React.ReactNode;
}

/** A pager card: caption + page title, arrow on the travel side. Pass router links with `render`. */
function PagerLink({className, render, direction, label, children, ...props}: PagerLinkProps) {
    const next = direction === "next";
    const Arrow = next ? ArrowRightIcon : ArrowLeftIcon;
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                rel: next ? "next" : "prev",
                className: cn(
                    "group/pager flex flex-col gap-1 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary-text hover:bg-hover",
                    focusRing,
                    next ? "col-start-2 items-end text-end" : "col-start-1 items-start",
                    className,
                ),
                children: (
                    <>
                        <span className="text-xs text-muted-foreground">{label ?? (next ? "Next" : "Previous")}</span>
                        <span className="flex items-center gap-1.5 font-medium">
                            {!next && (
                                <Arrow className="size-4 transition-transform group-hover/pager:-translate-x-0.5" />
                            )}
                            {children}
                            {next && (
                                <Arrow className="size-4 transition-transform group-hover/pager:translate-x-0.5" />
                            )}
                        </span>
                    </>
                ),
            },
            props,
        ),
        render,
        state: {slot: "pager-link", direction},
    });
}

export {Pager, PagerLink};
export type {PagerLinkProps};
