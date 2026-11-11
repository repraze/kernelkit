"use client";

import {SiteFooter, SiteFooterLink, SiteFooterLinks} from "@repraze/kernelkit/components/site-footer";
import type * as React from "react";
import {Fragment} from "react";

export interface SuiteFooterLinkItem {
    label: string;
    /** A router link as a `render` element; or `href` for a plain anchor. */
    render?: React.ReactElement;
    href?: string;
}

/** Suite projects a site can credit, in this order: "built with KernelKit", "themed by TermiColor". */
export type SuiteCredit = "kernelkit" | "termicolor";

const CREDITS: Record<SuiteCredit, {text: string; name: string; href: string}> = {
    kernelkit: {text: "built with", name: "KernelKit", href: "https://repraze.github.io/kernelkit/"},
    termicolor: {text: "themed by", name: "TermiColor", href: "https://repraze.github.io/termicolor/"},
};

export interface SuiteFooterProps {
    links: SuiteFooterLinkItem[];
    /** Which suite projects to credit (default `["termicolor"]`). */
    credits?: SuiteCredit[];
    /** A phrase of the site's own after the credits ("built from one palette"). */
    tagline?: React.ReactNode;
    /** Default "MIT". */
    license?: string;
}

/**
 * The suite's footer (GUIDELINES §7b): "MIT · themed by TermiColor · a repraze.com project" on the left,
 * the site's links on the right.
 */
export function SuiteFooter({links, credits = ["termicolor"], tagline, license = "MIT"}: SuiteFooterProps) {
    return (
        <SiteFooter>
            <span>
                {license}
                {credits.map((key) => {
                    const credit = CREDITS[key];
                    return (
                        <Fragment key={key}>
                            {" "}
                            · {credit.text}{" "}
                            <SiteFooterLink href={credit.href} className="underline underline-offset-4">
                                {credit.name}
                            </SiteFooterLink>
                        </Fragment>
                    );
                })}
                {tagline ? <> · {tagline}</> : null} · a{" "}
                <SiteFooterLink href="https://repraze.com" className="underline underline-offset-4">
                    repraze.com
                </SiteFooterLink>{" "}
                project
            </span>
            <SiteFooterLinks aria-label="Footer">
                {links.map((link) => (
                    <SiteFooterLink key={link.label} href={link.href} render={link.render}>
                        {link.label}
                    </SiteFooterLink>
                ))}
            </SiteFooterLinks>
        </SiteFooter>
    );
}
