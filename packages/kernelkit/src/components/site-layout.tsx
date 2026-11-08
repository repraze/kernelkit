"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {ScrollArea} from "@repraze/kernelkit/components/scroll-area";
import {cn} from "cn";
import * as React from "react";

/**
 * The suite's page layout, under SiteHeader:
 *
 * ```tsx
 * <SiteLayout>
 *   <SiteSidebar aria-label="Docs">…SidebarGroup / SidebarMenu…</SiteSidebar>
 *   <SiteMain>…PageHeader, content, Pager…</SiteMain>
 *   <SiteAside><Toc>…</Toc></SiteAside>
 * </SiteLayout>
 * ```
 *
 * Sidebars are sticky below the header and scroll on their own with edge fades. Content pages without
 * a sidebar use SiteContainer.
 */

/** Centered at `--kk-site-width` with the header's gutters. */
function SiteContainer({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {className: cn("mx-auto w-full max-w-(--kk-site-width) px-4 md:px-6", className)},
            props,
        ),
        render,
        state: {slot: "site-container"},
    });
}

/** Sidebar + main (+ aside) row inside the site container. */
function SiteLayout({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "mx-auto flex w-full max-w-(--kk-site-width) flex-1 gap-8 px-4 py-8 md:px-6 lg:gap-10 lg:py-10",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "site-layout"},
    });
}

/** Offset of sticky columns: below the header, with breathing room. */
const stickyColumn = "sticky top-[calc(var(--kk-header-height)+1.5rem)] h-[calc(100svh-var(--kk-header-height)-3rem)]";

interface SiteSidebarProps extends React.ComponentProps<"aside"> {
    /** Classes for the scrolling viewport (padding, etc.). */
    viewportClassName?: string;
}

/** Items a nav marks current: SidebarMenuButton isActive, router links, aria-current. */
const CURRENT = '[data-active]:not([data-active="false"]), [aria-current="page"], [data-status="active"]';

/** Center the current item in the sidebar's own viewport (never scrolls the page). */
function useKeepCurrentInView(viewport: React.RefObject<HTMLDivElement | null>) {
    React.useEffect(() => {
        const el = viewport.current;
        if (!el) {
            return;
        }
        const reveal = () => {
            const item = el.querySelector<HTMLElement>(CURRENT);
            if (!item) {
                return;
            }
            const offset = item.getBoundingClientRect().top - el.getBoundingClientRect().top;
            if (offset < 0 || offset > el.clientHeight - item.offsetHeight) {
                el.scrollTop += offset - el.clientHeight / 2;
            }
        };
        reveal();
        // navigation flips data-active / aria-current on the links: follow it
        const observer = new MutationObserver(reveal);
        observer.observe(el, {
            subtree: true,
            attributes: true,
            attributeFilter: ["data-active", "aria-current", "data-status"],
        });
        return () => observer.disconnect();
    }, [viewport]);
}

/**
 * Left navigation column (from `md`): sticky, scrolls on its own, fades at its edges, and keeps the
 * current item in view.
 */
function SiteSidebar({className, viewportClassName, children, ...props}: SiteSidebarProps) {
    const viewport = React.useRef<HTMLDivElement>(null);
    useKeepCurrentInView(viewport);
    return (
        <aside data-slot="site-sidebar" className={cn("hidden w-56 shrink-0 md:block", className)} {...props}>
            {/* sticky on a wrapper: Base UI's ScrollArea root sets position inline */}
            <div className={stickyColumn}>
                <ScrollArea
                    fade
                    className="h-full"
                    viewportRef={viewport}
                    viewportClassName={cn("pb-4", viewportClassName)}
                >
                    {children}
                </ScrollArea>
            </div>
        </aside>
    );
}

/** The page column. */
function SiteMain({className, render, ...props}: useRender.ComponentProps<"main">) {
    return useRender({
        defaultTagName: "main",
        props: mergeProps<"main">({className: cn("flex min-w-0 flex-1 flex-col gap-10", className)}, props),
        render,
        state: {slot: "site-main"},
    });
}

/** Right column (from `xl`): table of contents, page meta. Sticky like the sidebar. */
function SiteAside({className, children, ...props}: React.ComponentProps<"aside">) {
    return (
        <aside data-slot="site-aside" className={cn("hidden w-48 shrink-0 xl:block", className)} {...props}>
            <div className={cn(stickyColumn, "overflow-y-auto")}>{children}</div>
        </aside>
    );
}

export {SiteAside, SiteContainer, SiteLayout, SiteMain, SiteSidebar};
