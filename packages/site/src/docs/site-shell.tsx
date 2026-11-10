import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {Card, CardDescription, CardHeader, CardTitle} from "@repraze/kernelkit/components/card";
import {Carousel, CarouselContent, CarouselDots, CarouselItem} from "@repraze/kernelkit/components/carousel";
import {Command, CommandGroup, CommandInput, CommandList} from "@repraze/kernelkit/components/command";
import {
    Hero,
    HeroActions,
    HeroBody,
    HeroDescription,
    HeroEyebrow,
    HeroMedia,
    HeroShowcase,
    HeroTitle,
} from "@repraze/kernelkit/components/hero";
import {
    PageHeader,
    PageHeaderActions,
    PageHeaderDescription,
    PageHeaderEyebrow,
    PageHeaderTitle,
} from "@repraze/kernelkit/components/page-header";
import {Pager, PagerLink} from "@repraze/kernelkit/components/pager";
import {SearchFooter, SearchItem} from "@repraze/kernelkit/components/search-dialog";
import {SearchTrigger} from "@repraze/kernelkit/components/search-trigger";
import {
    Section,
    SectionAction,
    SectionDescription,
    SectionEyebrow,
    SectionHeader,
    SectionTitle,
} from "@repraze/kernelkit/components/section";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@repraze/kernelkit/components/sidebar";
import {SiteFooter, SiteFooterLink, SiteFooterLinks} from "@repraze/kernelkit/components/site-footer";
import {
    SiteHeader,
    SiteHeaderActions,
    SiteHeaderBrand,
    SiteHeaderContent,
    SiteNav,
    SiteNavLink,
} from "@repraze/kernelkit/components/site-header";
import {Toc, TocItem, TocList, TocTitle} from "@repraze/kernelkit/components/toc";
import {ArrowRightIcon, FileTextIcon, MoonIcon, ServerIcon, TerminalIcon} from "lucide-react";

import {Code, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Site shell",
    category: "Layout",
    description:
        "The suite's shared chrome: header, search, docs layout, page header, table of contents, pager, landing hero and sections, and footer. Every site looks the same; accent, radius and brand mark are its own.",
    demos: [
        {title: "Header", component: Header, layout: "full"},
        {title: "Sidebar navigation", component: SidebarNav, layout: "start"},
        {title: "Page header", component: Header2, layout: "start"},
        {title: "On this page and pager", component: TocAndPager, layout: "start"},
        {title: "Hero", component: HeroDemo, layout: "full"},
        {
            title: "Split hero",
            component: SplitHeroDemo,
            layout: "full",
            description:
                '`layout="split"`: from `lg`, the text in a `HeroBody` on the left and a `HeroShowcase` on the right (a `Carousel` with `autoplay`, fixed-height slides). Below `lg` it is the centered hero and the showcase hides.',
        },
        {title: "Section", component: SectionDemo, layout: "start"},
        {title: "Search", component: SearchDemo, layout: "start"},
        {title: "Footer", component: FooterDemo, layout: "full"},
    ],
    notes: Notes,
    props: [
        {
            component: "SiteNavLink",
            rows: [
                {
                    name: "aria-current / data-status / data-active",
                    type: '"page" / "active" / boolean',
                    description:
                        "Current page: foreground text and a 2px accent indicator on the header border (in the phone menu: a tinted row with the indicator on its left). TanStack Router sets data-status.",
                },
                {name: "render", type: "ReactElement", description: "Your router link."},
            ],
        },
        {
            component: "SiteSidebar",
            rows: [
                {
                    name: "children",
                    type: "ReactNode",
                    description:
                        "SidebarGroup / SidebarMenu parts (they work without a SidebarProvider). Sticky, scrolls with edge fades, keeps the current item in view.",
                },
                {name: "viewportClassName", type: "string"},
            ],
        },
        {
            component: "TocItem",
            rows: [
                {name: "active", type: "boolean", description: "From useTocActive(ids): the section being read."},
                {name: "depth", type: "0 | 1 | 2", default: "0", description: "Indent for sub-sections."},
            ],
        },
        {
            component: "SearchTrigger / useSearchHotkeys",
            rows: [
                {name: "onClick", type: "() => void", description: "Open your search dialog."},
                {
                    name: "useSearchHotkeys(cb)",
                    type: "(toggle: boolean) => void",
                    description: "Ctrl/⌘ K (toggle) anywhere, / (open) outside text fields.",
                },
            ],
        },
    ],
});

export function Header() {
    return (
        <div className="flex flex-col">
            <SiteHeader className="static">
                <SiteHeaderContent>
                    <SiteHeaderBrand href="#header">
                        <TerminalIcon className="size-5 text-primary-text" /> ops-console
                    </SiteHeaderBrand>
                    <SiteNav>
                        <SiteNavLink href="#header" aria-current="page">
                            Nodes
                        </SiteNavLink>
                        <SiteNavLink href="#header">Deploys</SiteNavLink>
                        <SiteNavLink href="#header">Logs</SiteNavLink>
                    </SiteNav>
                    <SiteHeaderActions>
                        <SearchTrigger />
                        <Button variant="ghost" size="icon" aria-label="Theme">
                            <MoonIcon />
                        </Button>
                    </SiteHeaderActions>
                </SiteHeaderContent>
            </SiteHeader>
            <div className="h-16 bg-background" />
        </div>
    );
}

export function SidebarNav() {
    return (
        <nav aria-label="Cluster" className="w-56">
            <SidebarGroup>
                <SidebarGroupLabel className="font-mono uppercase">Cluster</SidebarGroupLabel>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="#sidebar-navigation" />}>Overview</SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton isActive render={<a href="#sidebar-navigation" />}>
                            Nodes
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="#sidebar-navigation" />}>Deployments</SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>
        </nav>
    );
}

export function Header2() {
    return (
        <PageHeader>
            <PageHeaderEyebrow>
                <Badge variant="outline" className="font-mono">
                    eu-west-1
                </Badge>
                <Badge variant="soft" color="success">
                    healthy
                </Badge>
            </PageHeaderEyebrow>
            <PageHeaderTitle>edge-fra-03</PageHeaderTitle>
            <PageHeaderDescription>
                Edge node in Frankfurt, serving 12 services behind the regional load balancer.
            </PageHeaderDescription>
            <PageHeaderActions>
                <Button>Open shell</Button>
                <Button variant="outline">Drain</Button>
            </PageHeaderActions>
        </PageHeader>
    );
}

export function TocAndPager() {
    return (
        <div className="flex w-full flex-col gap-8">
            <Toc className="w-48">
                <TocTitle>On this page</TocTitle>
                <TocList>
                    <TocItem href="#on-this-page-and-pager">Overview</TocItem>
                    <TocItem href="#on-this-page-and-pager" active>
                        Health checks
                    </TocItem>
                    <TocItem href="#on-this-page-and-pager" depth={1}>
                        Liveness
                    </TocItem>
                    <TocItem href="#on-this-page-and-pager">Logs</TocItem>
                </TocList>
            </Toc>
            <Pager>
                <PagerLink direction="previous" href="#on-this-page-and-pager">
                    Deployments
                </PagerLink>
                <PagerLink direction="next" href="#on-this-page-and-pager">
                    Logs
                </PagerLink>
            </Pager>
        </div>
    );
}

export function HeroDemo() {
    return (
        <Hero contentClassName="py-12 md:py-14">
            <HeroMedia>
                <TerminalIcon className="size-12 text-primary-text" />
            </HeroMedia>
            <HeroEyebrow>
                <Badge variant="outline" className="font-mono">
                    v2.4 · 12 regions
                </Badge>
            </HeroEyebrow>
            <HeroTitle className="text-3xl sm:text-4xl md:text-5xl">
                Ship to the <span className="text-primary-text">edge</span>.
            </HeroTitle>
            <HeroDescription>Deploy a service to every region with one command.</HeroDescription>
            <HeroActions>
                <Button size="lg">
                    Get started <ArrowRightIcon data-icon="inline-end" />
                </Button>
                <Button size="lg" variant="outline">
                    Pricing
                </Button>
            </HeroActions>
        </Hero>
    );
}

export function SplitHeroDemo() {
    return (
        <Hero layout="split" contentClassName="py-12 md:py-14">
            <HeroBody>
                <HeroEyebrow>
                    <Badge variant="outline" className="font-mono">
                        v2.4 · 12 regions
                    </Badge>
                </HeroEyebrow>
                <HeroTitle className="text-3xl sm:text-4xl md:text-5xl xl:text-5xl">
                    Ship to the <span className="text-primary-text">edge</span>.
                </HeroTitle>
                <HeroDescription>Deploy a service to every region with one command.</HeroDescription>
                <HeroActions>
                    <Button size="lg">
                        Get started <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                </HeroActions>
            </HeroBody>
            <HeroShowcase>
                <Carousel autoplay={5000} opts={{loop: true}} aria-label="Regions">
                    <CarouselContent>
                        {["eu-west", "us-east", "ap-south"].map((region) => (
                            <CarouselItem key={region}>
                                <Card className="h-48">
                                    <CardHeader>
                                        <CardTitle className="font-mono">{region}</CardTitle>
                                        <CardDescription>4 nodes · p95 38ms</CardDescription>
                                    </CardHeader>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots />
                </Carousel>
            </HeroShowcase>
        </Hero>
    );
}

export function SectionDemo() {
    return (
        <Section className="w-full py-0 md:py-0">
            <SectionHeader>
                <SectionEyebrow>Regions</SectionEyebrow>
                <SectionTitle>Close to every user</SectionTitle>
                <SectionDescription>Twelve regions, one deploy.</SectionDescription>
                <SectionAction>
                    <Button variant="outline">
                        All regions <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                </SectionAction>
            </SectionHeader>
            <div className="h-24 rounded-lg border border-dashed" />
        </Section>
    );
}

export function SearchDemo() {
    return (
        <Command className="w-full max-w-lg rounded-xl border">
            <CommandInput placeholder="Search nodes and docs…" />
            <CommandList>
                <CommandGroup heading="Nodes">
                    <SearchItem icon={<ServerIcon />} title="edge-fra-03" description="Frankfurt, 12 services" />
                    <SearchItem
                        icon={<ServerIcon />}
                        title="edge-ams-01"
                        description="Amsterdam, 9 services"
                        meta={<Badge variant="secondary">draining</Badge>}
                    />
                </CommandGroup>
                <CommandGroup heading="Docs">
                    <SearchItem icon={<FileTextIcon />} title="Deploys" description="Roll out a release by region." />
                </CommandGroup>
            </CommandList>
            <SearchFooter />
        </Command>
    );
}

export function FooterDemo() {
    return (
        <SiteFooter className="border-t-0">
            <span>MIT · ops-console</span>
            <SiteFooterLinks>
                <SiteFooterLink href="#footer">Docs</SiteFooterLink>
                <SiteFooterLink href="#footer">Status</SiteFooterLink>
                <SiteFooterLink href="#footer">GitHub</SiteFooterLink>
            </SiteFooterLinks>
        </SiteFooter>
    );
}

function Notes() {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">Layout</h2>
            <p className="text-sm text-muted-foreground">
                This docs site is built with these parts. TermiColor, KernelKit and repraze.com share them; a site sets
                only its accent, radius and brand mark. Navigation follows one rule everywhere: muted at rest, a hover
                wash, and the current item in the foreground with a 2px accent indicator on the edge that faces its
                structure (the header border, the sidebar row's left edge, the tree line).
            </p>
            <Code
                code={`<SiteHeader>
    <SiteHeaderContent>
        <SiteHeaderMenu title={<Logo />}>…phone nav…</SiteHeaderMenu>
        <SiteHeaderBrand render={<Link to="/" />}><Logo /></SiteHeaderBrand>
        <SiteNav>
            <SiteNavLink render={<Link to="/docs" />}>Docs</SiteNavLink>
        </SiteNav>
        <SiteHeaderActions>
            <SearchTrigger onClick={openSearch} />  {/* opens a SearchDialog */}
        </SiteHeaderActions>
    </SiteHeaderContent>
</SiteHeader>
<SiteLayout>
    <SiteSidebar>{/* SidebarGroup / SidebarMenu */}</SiteSidebar>
    <SiteMain>
        <PageHeader>…</PageHeader>
        …
        <Pager>…</Pager>
    </SiteMain>
    <SiteAside><Toc>…</Toc></SiteAside>
</SiteLayout>
<SiteFooter>…</SiteFooter>

// a landing page
<Hero>
    <HeroMedia><LogoMark /></HeroMedia>
    <HeroTitle>…</HeroTitle>
    <HeroDescription>…</HeroDescription>
    <HeroActions>{/* one primary, one outline */}</HeroActions>
</Hero>
<SiteContainer className="divide-y">
    <Section>
        <SectionHeader>…<SectionAction>{/* where next */}</SectionAction></SectionHeader>
        …
    </Section>
</SiteContainer>`}
            />
        </section>
    );
}
