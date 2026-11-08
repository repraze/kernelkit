"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import * as React from "react";

/**
 * "On this page": a page's section links, usually in SiteAside.
 *
 * ```tsx
 * const active = useTocActive(sections.map((s) => s.id));
 * <Toc>
 *   <TocTitle>On this page</TocTitle>
 *   <TocList>
 *     {sections.map((s) => <TocItem key={s.id} href={`#${s.id}`} active={s.id === active}>{s.title}</TocItem>)}
 *   </TocList>
 * </Toc>
 * ```
 */
function Toc({className, render, ...props}: useRender.ComponentProps<"nav">) {
    return useRender({
        defaultTagName: "nav",
        props: mergeProps<"nav">(
            {"aria-label": "On this page", className: cn("flex flex-col gap-2", className)},
            props,
        ),
        render,
        state: {slot: "toc"},
    });
}

function TocTitle({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">(
            {className: cn("font-mono text-xs font-medium text-muted-foreground uppercase", className)},
            props,
        ),
        render,
        state: {slot: "toc-title"},
    });
}

function TocList({className, render, ...props}: useRender.ComponentProps<"ul">) {
    return useRender({
        defaultTagName: "ul",
        props: mergeProps<"ul">({className: cn("flex flex-col border-l border-border text-sm", className)}, props),
        render,
        state: {slot: "toc-list"},
    });
}

interface TocItemProps extends useRender.ComponentProps<"a"> {
    /** The section in view: accent indicator on the rail + foreground text. */
    active?: boolean;
    /** Heading depth below the top level (indent). */
    depth?: 0 | 1 | 2;
}

function TocItem({className, render, active = false, depth = 0, ...props}: TocItemProps) {
    const link = useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                "aria-current": active ? "location" : undefined,
                className: cn(
                    "relative block py-1 pr-2 text-muted-foreground transition-colors hover:text-foreground after:pointer-events-none after:absolute after:inset-y-0 after:-left-[1.5px] after:w-0.5 after:bg-primary-text after:opacity-0",
                    focusRing,
                    {0: "pl-3", 1: "pl-6", 2: "pl-9"}[depth],
                    "aria-[current=location]:after:opacity-100 aria-[current=location]:font-medium aria-[current=location]:text-foreground",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "toc-item"},
    });
    return <li data-slot="toc-list-item">{link}</li>;
}

/**
 * Scroll-spy: the id of the section currently being read (the last one whose top passed the header),
 * for TocItem `active`. SSR-safe; returns the first id until mounted.
 */
function useTocActive(ids: readonly string[], {offset = 96}: {offset?: number} = {}): string | undefined {
    const [active, setActive] = React.useState<string | undefined>(ids[0]);
    const key = ids.join("|");
    React.useEffect(() => {
        const elements = key
            .split("|")
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => !!el);
        if (!elements.length) {
            return;
        }
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
                const passed = elements.filter((el) => el.getBoundingClientRect().top <= offset);
                const current = atBottom ? elements[elements.length - 1] : (passed[passed.length - 1] ?? elements[0]);
                setActive(current?.id);
            });
        };
        update();
        window.addEventListener("scroll", update, {passive: true});
        window.addEventListener("resize", update);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [key, offset]);
    return active;
}

export {Toc, TocItem, TocList, TocTitle, useTocActive};
export type {TocItemProps};
