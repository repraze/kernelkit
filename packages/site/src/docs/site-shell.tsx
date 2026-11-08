import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    PageHeader,
    PageHeaderActions,
    PageHeaderDescription,
    PageHeaderEyebrow,
    PageHeaderTitle,
} from "@repraze/kernelkit/components/page-header";
import {Pager, PagerLink} from "@repraze/kernelkit/components/pager";
import {SearchTrigger} from "@repraze/kernelkit/components/search-trigger";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@repraze/kernelkit/components/sidebar";
import {
    SiteHeader,
    SiteHeaderActions,
    SiteHeaderBrand,
    SiteHeaderContent,
    SiteNav,
    SiteNavLink,
} from "@repraze/kernelkit/components/site-header";
import {Toc, TocItem, TocList, TocTitle} from "@repraze/kernelkit/components/toc";
import {MoonIcon, TerminalIcon} from "lucide-react";

import {Code, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Site shell",
    category: "Layout",
    description:
        "The suite's shared chrome: header, docs layout, page header, table of contents and pager. Every site looks the same; accent and radius are its own.",
    demos: [
        {title: "Header", component: Header, layout: "full"},
        {title: "Sidebar navigation", component: SidebarNav, layout: "start"},
        {title: "Page header", component: Header2, layout: "start"},
        {title: "On this page and pager", component: TocAndPager, layout: "start"},
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
                        "Current page: foreground text + 2px accent underline. TanStack Router sets data-status.",
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

function Notes() {
    return (
        <section className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">Layout</h2>
            <p className="text-sm text-muted-foreground">
                This docs site is built with these parts. Termicolor, kernelkit and repraze.com share them; a site sets
                its accent and radius and may add a banner above the header row (add its height to{" "}
                <code className="font-mono text-foreground">--kk-header-height</code>).
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
            <SearchTrigger onClick={openSearch} />
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
</SiteLayout>`}
            />
        </section>
    );
}
