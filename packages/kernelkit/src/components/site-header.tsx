"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {Button} from "@repraze/kernelkit/components/button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@repraze/kernelkit/components/sheet";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import {MenuIcon} from "lucide-react";
import type * as React from "react";

/**
 * The suite's site header: sticky, blurred, one row of `--kk-header-height` inside a `--kk-site-width`
 * container. Brand, then mono nav links (current page underlined in the accent), then actions.
 *
 * ```tsx
 * <SiteHeader>
 *   <SiteHeaderContent>
 *     <SiteHeaderMenu title="termicolor">…mobile nav…</SiteHeaderMenu>
 *     <SiteHeaderBrand render={<Link to="/" />}>…</SiteHeaderBrand>
 *     <SiteNav><SiteNavLink render={<Link to="/ports" />}>Ports</SiteNavLink></SiteNav>
 *     <SiteHeaderActions>…search, theme, github…</SiteHeaderActions>
 *   </SiteHeaderContent>
 * </SiteHeader>
 * ```
 */
function SiteHeader({className, render, ...props}: useRender.ComponentProps<"header">) {
    return useRender({
        defaultTagName: "header",
        props: mergeProps<"header">(
            {
                className: cn(
                    "sticky top-0 z-40 w-full border-b border-border bg-background/85 text-foreground backdrop-blur supports-backdrop-filter:bg-background/70",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "site-header"},
    });
}

/** The header row: centered at the site width, the same gutters as SiteContainer. */
function SiteHeaderContent({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "mx-auto flex h-14 w-full max-w-(--kk-site-width) items-center gap-4 px-4 md:gap-6 md:px-6",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "site-header-content"},
    });
}

/** Logo + name, links home. Pass the router link with `render`. */
function SiteHeaderBrand({className, render, ...props}: useRender.ComponentProps<"a">) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                className: cn(
                    "flex shrink-0 items-center gap-2 rounded-md font-mono text-sm font-semibold tracking-tight",
                    focusRing,
                    "[&_svg]:shrink-0",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "site-header-brand"},
    });
}

/** Primary navigation (desktop). On phones the links move into SiteHeaderMenu. */
function SiteNav({className, render, ...props}: useRender.ComponentProps<"nav">) {
    return useRender({
        defaultTagName: "nav",
        props: mergeProps<"nav">(
            {"aria-label": "Main", className: cn("hidden items-center gap-1 md:flex", className)},
            props,
        ),
        render,
        state: {slot: "site-nav"},
    });
}

/**
 * A nav link, styled like the suite's other navigation (GUIDELINES §7c): muted at rest, a hover wash,
 * and when current (`aria-current="page"`, `data-status="active"` from TanStack Router, or `data-active`)
 * the sidebar's current-row look: accent tint, foreground text and a 2px accent pill. In SiteNav the pill
 * runs along the link's bottom edge (like NavigationMenu); elsewhere (the phone menu) it sits on the
 * left edge, like a sidebar row.
 */
function SiteNavLink({className, render, ...props}: useRender.ComponentProps<"a">) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                className: cn(
                    "relative flex h-8 items-center rounded-md px-2.5 font-mono text-sm text-muted-foreground transition-colors hover:bg-hover hover:text-foreground motion-reduce:transition-none",
                    focusRing,
                    // indicator: left edge by default, bottom edge inside SiteNav
                    "after:pointer-events-none after:absolute after:top-1.5 after:bottom-1.5 after:left-0 after:w-0.5 after:rounded-pill after:bg-primary-text after:opacity-0",
                    "in-data-[slot=site-nav]:after:top-auto in-data-[slot=site-nav]:after:right-2.5 in-data-[slot=site-nav]:after:bottom-0 in-data-[slot=site-nav]:after:left-2.5 in-data-[slot=site-nav]:after:h-0.5 in-data-[slot=site-nav]:after:w-auto",
                    "aria-[current=page]:text-foreground aria-[current=page]:after:opacity-100 data-[status=active]:text-foreground data-[status=active]:after:opacity-100 data-active:text-foreground data-active:after:opacity-100",
                    "aria-[current=page]:bg-primary-tint data-[status=active]:bg-primary-tint data-active:bg-primary-tint",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "site-nav-link"},
    });
}

/** Right side of the header row: search, theme, repository links. */
function SiteHeaderActions({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn("ml-auto flex items-center gap-1", className)}, props),
        render,
        state: {slot: "site-header-actions"},
    });
}

interface SiteHeaderMenuProps extends Omit<React.ComponentProps<typeof Sheet>, "children"> {
    children?: React.ReactNode;
    /** Sheet title (also the accessible name). */
    title?: React.ReactNode;
    className?: string;
}

/**
 * Phone navigation: a menu button (hidden from `md`) opening a left sheet with the nav and the page's
 * sidebar. Control `open` to close it on navigation.
 */
function SiteHeaderMenu({title = "Menu", children, className, ...props}: SiteHeaderMenuProps) {
    return (
        <Sheet {...props}>
            <SheetTrigger
                render={<Button variant="ghost" size="icon-sm" className="-ml-1.5 md:hidden" aria-label="Menu" />}
            >
                <MenuIcon />
            </SheetTrigger>
            <SheetContent
                side="left"
                data-slot="site-header-menu"
                className={cn("w-72 gap-0 overflow-y-auto overscroll-contain p-0", className)}
            >
                <SheetHeader className="border-b border-border">
                    <SheetTitle className="flex items-center gap-2">{title}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-2">{children}</div>
            </SheetContent>
        </Sheet>
    );
}

export {SiteHeader, SiteHeaderActions, SiteHeaderBrand, SiteHeaderContent, SiteHeaderMenu, SiteNav, SiteNavLink};
