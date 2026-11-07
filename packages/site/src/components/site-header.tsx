import {Link} from "@tanstack/react-router";
import {Button} from "kernelkit/components/button";
import {Navbar, NavbarContent, NavbarMenu, NavbarSection} from "kernelkit/components/navbar";
import {Separator} from "kernelkit/components/separator";

import {Logo} from "@/components/logo";
import {SiteSearch} from "@/components/site-search";
import {ModeToggle, ThemeCustomizer} from "@/components/theme-customizer";
import {GITHUB_URL} from "@/lib/site";

const NAV = [
    {slug: "introduction", label: "Docs"},
    {slug: "button", label: "Components"},
    {slug: "theming", label: "Theming"},
] as const;

/** Site header, built on the kit's own Navbar. */
export function SiteHeader() {
    return (
        <Navbar className="z-40">
            <NavbarContent className="mx-auto max-w-screen-2xl gap-6 md:px-6">
                <Link to="/" aria-label="Kernelkit home" className="shrink-0">
                    <Logo />
                </Link>
                <NavbarMenu className="hidden gap-1 md:flex">
                    {NAV.map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            size="sm"
                            className="font-mono text-muted-foreground"
                            render={<Link to="/docs/$slug" params={{slug: item.slug}} />}
                        >
                            {item.label}
                        </Button>
                    ))}
                </NavbarMenu>
                <NavbarSection className="ml-auto gap-1">
                    <SiteSearch />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="hidden font-mono sm:inline-flex"
                        render={<a href={GITHUB_URL} />}
                    >
                        GitHub
                    </Button>
                    {/* centered, not stretched: Separator stretches via data-vertical:, so override with the same variant */}
                    <Separator orientation="vertical" className="mx-1 data-vertical:h-5 data-vertical:self-center" />
                    <ThemeCustomizer />
                    <ModeToggle />
                </NavbarSection>
            </NavbarContent>
        </Navbar>
    );
}
