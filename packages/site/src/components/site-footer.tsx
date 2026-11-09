import {SiteFooter as SiteFooterRoot, SiteFooterLink, SiteFooterLinks} from "@repraze/kernelkit/components/site-footer";
import {Link} from "@tanstack/react-router";

import {GITHUB_URL} from "@/lib/site";

/** The suite's footer (kernelkit SiteFooter): credits, then the project's links. */
export function SiteFooter() {
    return (
        <SiteFooterRoot>
            <span>
                MIT · themed by{" "}
                <SiteFooterLink href="https://repraze.github.io/termicolor/" className="underline underline-offset-4">
                    TermiColor
                </SiteFooterLink>{" "}
                · a{" "}
                <SiteFooterLink href="https://repraze.com" className="underline underline-offset-4">
                    repraze.com
                </SiteFooterLink>{" "}
                project
            </span>
            <SiteFooterLinks aria-label="Footer">
                <SiteFooterLink render={<Link to="/docs/$slug" params={{slug: "introduction"}} />}>Docs</SiteFooterLink>
                <SiteFooterLink href={`${import.meta.env.BASE_URL}r/registry.json`}>Registry</SiteFooterLink>
                <SiteFooterLink href="https://www.npmjs.com/package/@repraze/kernelkit">npm</SiteFooterLink>
                <SiteFooterLink href={GITHUB_URL}>GitHub</SiteFooterLink>
            </SiteFooterLinks>
        </SiteFooterRoot>
    );
}
