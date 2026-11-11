import {DocsNav, DocsSearch} from "@repraze/kernelkit/docs";
import {BrandLogo, SuiteHeader} from "@repraze/kernelkit/site";
import {Link, useNavigate, useRouterState} from "@tanstack/react-router";
import {
    BookOpenIcon,
    ComponentIcon,
    LayersIcon,
    LayoutIcon,
    MessageSquareIcon,
    MousePointerClickIcon,
    NavigationIcon,
    SquareChartGanttIcon,
    TextCursorInputIcon,
    TriangleAlertIcon,
} from "lucide-react";

import type {Category} from "@/lib/doc-kit";
import {DOCS_INDEX} from "@/lib/docs-index";
import {GITHUB_URL, MARK_SVG, SITE_NAME} from "@/lib/site";

/** One icon per docs category, so a search result's kind reads at a glance. */
const CATEGORY_ICONS: Record<Category, typeof BookOpenIcon> = {
    Foundations: BookOpenIcon,
    Actions: MousePointerClickIcon,
    Inputs: TextCursorInputIcon,
    Layout: LayoutIcon,
    Navigation: NavigationIcon,
    "Data display": SquareChartGanttIcon,
    Feedback: TriangleAlertIcon,
    Overlays: LayersIcon,
    Chat: MessageSquareIcon,
};

type Section = "docs" | "components" | "theming";

const NAV: {section: Section; slug: string; label: string}[] = [
    {section: "docs", slug: "introduction", label: "Docs"},
    {section: "components", slug: "button", label: "Components"},
    {section: "theming", slug: "theming", label: "Theming"},
];

/** Which header entry a docs page belongs to: Theming, other Foundations pages, or a component. */
function sectionOf(slug: string | undefined): Section | undefined {
    const doc = slug ? DOCS_INDEX.bySlug.get(slug) : undefined;
    if (!doc) {
        return undefined;
    }
    if (doc.slug === "theming") {
        return "theming";
    }
    return doc.category === "Foundations" ? "docs" : "components";
}

export const docLink = (slug: string) => <Link to="/docs/$slug" params={{slug}} />;

export const Logo = () => <BrandLogo svg={MARK_SVG} first="Kernel" second="Kit" />;

/** The docs sidebar (desktop SiteSidebar and the phone menu). */
export function SiteDocsNav() {
    const pathname = useRouterState({select: (s) => s.location.pathname});
    return <DocsNav index={DOCS_INDEX} current={DOCS_INDEX.slugOf(pathname)} linkFor={docLink} />;
}

/** The suite's header with KernelKit's brand, sections and docs search. */
export function SiteHeader() {
    const pathname = useRouterState({select: (s) => s.location.pathname});
    const navigate = useNavigate();
    const section = sectionOf(DOCS_INDEX.slugOf(pathname));
    return (
        <SuiteHeader
            brand={<Logo />}
            brandLabel={`${SITE_NAME} home`}
            home={<Link to="/" />}
            nav={NAV.map((item) => ({
                label: item.label,
                render: docLink(item.slug),
                current: item.section === section,
            }))}
            search={
                <DocsSearch
                    index={DOCS_INDEX}
                    icons={CATEGORY_ICONS}
                    fallbackIcon={ComponentIcon}
                    suggested={["introduction", "theming", "button", "sidebar", "site-shell"]}
                    placeholder="Search components and guides…"
                    onSelect={(slug) => void navigate({to: "/docs/$slug", params: {slug}})}
                />
            }
            repository={{href: GITHUB_URL}}
            menu={<SiteDocsNav />}
            locationKey={pathname}
        />
    );
}
