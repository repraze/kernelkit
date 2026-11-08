"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import type * as React from "react";

/**
 * The suite's site footer: a top border and one mono row at the site width, credits on the left and
 * links on the right.
 *
 * ```tsx
 * <SiteFooter>
 *   <span>MIT · built from one palette</span>
 *   <SiteFooterLinks>
 *     <SiteFooterLink href="https://github.com/…">GitHub</SiteFooterLink>
 *   </SiteFooterLinks>
 * </SiteFooter>
 * ```
 */
function SiteFooter({className, children, ...props}: React.ComponentProps<"footer">) {
    return (
        <footer data-slot="site-footer" className={cn("border-t border-border", className)} {...props}>
            <div className="mx-auto flex w-full max-w-(--kk-site-width) flex-col gap-3 px-4 py-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-6">
                {children}
            </div>
        </footer>
    );
}

/** The footer's links (wrap on phones). */
function SiteFooterLinks({className, render, ...props}: useRender.ComponentProps<"nav">) {
    return useRender({
        defaultTagName: "nav",
        props: mergeProps<"nav">({className: cn("flex flex-wrap items-center gap-x-4 gap-y-1", className)}, props),
        render,
        state: {slot: "site-footer-links"},
    });
}

/** A footer link: muted, foreground on hover. */
function SiteFooterLink({className, render, ...props}: useRender.ComponentProps<"a">) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {className: cn("rounded-sm transition-colors hover:text-foreground", focusRing, className)},
            props,
        ),
        render,
        state: {slot: "site-footer-link"},
    });
}

export {SiteFooter, SiteFooterLink, SiteFooterLinks};
