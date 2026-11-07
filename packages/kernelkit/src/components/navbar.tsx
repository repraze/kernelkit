"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";

/** Sticky top bar: translucent background over a blur, one bottom line. */
function Navbar({className, render, ...props}: useRender.ComponentProps<"header">) {
    return useRender({
        defaultTagName: "header",
        props: mergeProps<"header">(
            {
                className: cn(
                    "sticky top-0 z-40 w-full border-b border-border bg-background/85 text-foreground supports-backdrop-filter:backdrop-blur-md",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "navbar"},
    });
}

/** The bar's row: `h-14`, horizontal padding, items centered. Constrain its width here (`max-w-*`). */
function NavbarContent({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn("flex h-14 items-center gap-2 px-4", className)}, props),
        render,
        state: {slot: "navbar-content"},
    });
}

/** A cluster of items (brand, links, actions). Push one to the end with `ml-auto`. */
function NavbarSection({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn("flex items-center gap-2", className)}, props),
        render,
        state: {slot: "navbar-section"},
    });
}

/** Holds the primary links or a `NavigationMenu`. Defaults to a `<nav>`. */
function NavbarMenu({className, render, ...props}: useRender.ComponentProps<"nav">) {
    return useRender({
        defaultTagName: "nav",
        props: mergeProps<"nav">({className: cn("flex items-center gap-1", className)}, props),
        render,
        state: {slot: "navbar-menu"},
    });
}

export {Navbar, NavbarContent, NavbarMenu, NavbarSection};
