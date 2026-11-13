"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import {ArrowLeftIcon, ArrowRightIcon} from "lucide-react";
import type * as React from "react";

/** Previous / next page links at the end of a page: stacked on phones, side by side from `sm`. */
function Pager({className, render, ...props}: useRender.ComponentProps<"nav">) {
    return useRender({
        defaultTagName: "nav",
        props: mergeProps<"nav">(
            {
                "aria-label": "Pages",
                className: cn("grid gap-3 border-t border-border pt-6 sm:grid-cols-2 sm:gap-4", className),
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
                    "group/pager flex min-w-0 flex-col gap-1 rounded-lg border border-border px-4 py-3 transition-colors hover:border-primary-text hover:bg-hover",
                    focusRing,
                    next ? "items-end text-end sm:col-start-2" : "items-start sm:col-start-1",
                    className,
                ),
                children: (
                    <>
                        <span className="text-xs text-muted-foreground">{label ?? (next ? "Next" : "Previous")}</span>
                        <span className="flex max-w-full items-center gap-1.5 font-medium">
                            {!next && (
                                <Arrow className="size-4 shrink-0 transition-transform group-hover/pager:-translate-x-0.5" />
                            )}
                            <span className="min-w-0 wrap-break-word">{children}</span>
                            {next && (
                                <Arrow className="size-4 shrink-0 transition-transform group-hover/pager:translate-x-0.5" />
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
