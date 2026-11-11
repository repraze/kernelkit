"use client";

import {Button} from "@repraze/kernelkit/components/button";
import {Separator} from "@repraze/kernelkit/components/separator";
import {
    SiteHeader,
    SiteHeaderActions,
    SiteHeaderBrand,
    SiteHeaderContent,
    SiteHeaderMenu,
    SiteNav,
    SiteNavLink,
} from "@repraze/kernelkit/components/site-header";
import {ThemeMenu} from "@repraze/kernelkit/components/theme-menu";
import type * as React from "react";
import {useEffect, useState} from "react";

import {GithubIcon} from "./github-icon";

export interface SuiteNavItem {
    label: string;
    /** A router link as a `render` element (`<Link to="/ports" />`); or `href` for a plain anchor. */
    render?: React.ReactElement;
    href?: string;
    /** Marks the entry current (`aria-current="page"`): the section the open page belongs to. */
    current?: boolean;
}

export interface SuiteHeaderProps {
    /** The brand (a BrandLogo), in the header and as the phone menu's title. */
    brand: React.ReactNode;
    /** Accessible name of the home link, e.g. "KernelKit home". */
    brandLabel: string;
    /** The home link as a `render` element (`<Link to="/" />`); a plain "/" anchor otherwise. */
    home?: React.ReactElement;
    nav: SuiteNavItem[];
    /** Accessible name of the nav (default "Main"). */
    navLabel?: string;
    /** The search (DocsSearch, or the site's own), before the separator. */
    search?: React.ReactNode;
    /** Replaces the default `<ThemeMenu />`. */
    themeMenu?: React.ReactNode;
    /** The repository button (a GitHub icon). */
    repository?: {href: string; label?: string; icon?: React.ReactNode};
    /** The phone menu's content after the nav links (the docs nav, a tree). */
    menu?: React.ReactNode;
    /** Closes the phone menu when it changes: pass the pathname. */
    locationKey?: string;
}

/**
 * The suite's site header (GUIDELINES §7b): phone menu, brand, mono nav, then search · theme · repository.
 * Every site renders this; only the brand, nav and menu content differ.
 */
export function SuiteHeader({
    brand,
    brandLabel,
    home,
    nav,
    navLabel = "Main",
    search,
    themeMenu,
    repository,
    menu,
    locationKey,
}: SuiteHeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    useEffect(() => setMenuOpen(false), [locationKey]);

    const navLinks = nav.map((item) => (
        <SiteNavLink
            key={item.label}
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            render={item.render}
        >
            {item.label}
        </SiteNavLink>
    ));

    return (
        <SiteHeader>
            <SiteHeaderContent>
                <SiteHeaderMenu title={brand} open={menuOpen} onOpenChange={setMenuOpen}>
                    <nav aria-label={navLabel} className="flex flex-col gap-1 px-2 pt-2">
                        {navLinks}
                    </nav>
                    {menu}
                </SiteHeaderMenu>
                <SiteHeaderBrand aria-label={brandLabel} href={home ? undefined : "/"} render={home}>
                    {brand}
                </SiteHeaderBrand>
                <SiteNav aria-label={navLabel}>{navLinks}</SiteNav>
                <SiteHeaderActions>
                    {search}
                    <Separator
                        orientation="vertical"
                        className="mx-1 hidden data-vertical:h-5 data-vertical:self-center sm:block"
                    />
                    {themeMenu ?? <ThemeMenu />}
                    {repository ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            render={<a href={repository.href} aria-label={repository.label ?? "GitHub"} />}
                        >
                            {repository.icon ?? <GithubIcon className="size-4" />}
                        </Button>
                    ) : null}
                </SiteHeaderActions>
            </SiteHeaderContent>
        </SiteHeader>
    );
}
