import {Command, CommandEmpty, CommandGroup, CommandInput, CommandList} from "@repraze/kernelkit/components/command";
import {SearchDialog, SearchFooter, SearchItem} from "@repraze/kernelkit/components/search-dialog";
import {SearchTrigger, useSearchHotkeys} from "@repraze/kernelkit/components/search-trigger";
import {useNavigate} from "@tanstack/react-router";
import {
    BookOpenIcon,
    ComponentIcon,
    LayersIcon,
    LayoutIcon,
    type LucideIcon,
    MessageSquareIcon,
    MousePointerClickIcon,
    NavigationIcon,
    SquareChartGanttIcon,
    TextCursorInputIcon,
    TriangleAlertIcon,
} from "lucide-react";
import {useCallback, useState} from "react";

import {DOCS, DOCS_BY_CATEGORY} from "@/lib/docs-index";

/** One icon per docs category, so a result's kind reads at a glance. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
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

/** Shown before you type. */
const SUGGESTED = ["introduction", "theming", "button", "sidebar", "site-shell"];

/** Plain substring match: cmdk's default fuzzy match finds "t…a…b" in nearly every title. */
function substringFilter(value: string, search: string, keywords?: string[]) {
    const haystack = [value, ...(keywords ?? [])].join(" ").toLowerCase();
    const needle = search.trim().toLowerCase();
    if (haystack.startsWith(needle)) {
        return 1;
    }
    return haystack.includes(needle) ? 0.5 : 0;
}

/** Docs search: the suite's SearchTrigger + hotkeys and SearchDialog. */
export function SiteSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    useSearchHotkeys(useCallback((toggle: boolean) => setOpen((o) => (toggle ? !o : true)), []));

    const groups = query.trim()
        ? DOCS_BY_CATEGORY
        : [{category: "Suggested", docs: SUGGESTED.flatMap((slug) => DOCS.filter((d) => d.slug === slug))}];

    return (
        <>
            <SearchTrigger onClick={() => setOpen(true)} aria-label="Search docs" />
            <SearchDialog
                open={open}
                onOpenChange={(next) => {
                    setOpen(next);
                    if (!next) {
                        setQuery("");
                    }
                }}
                description="Search the docs"
            >
                <Command filter={substringFilter} loop>
                    <CommandInput value={query} onValueChange={setQuery} placeholder="Search components and guides…" />
                    <CommandList>
                        <CommandEmpty>No results for “{query}”.</CommandEmpty>
                        {groups.map(({category, docs}) => (
                            <CommandGroup key={category} heading={category}>
                                {docs.map((doc) => {
                                    const Icon = CATEGORY_ICONS[doc.category] ?? ComponentIcon;
                                    return (
                                        <SearchItem
                                            key={doc.slug}
                                            value={doc.title}
                                            keywords={[doc.category, doc.slug]}
                                            icon={<Icon />}
                                            title={doc.title}
                                            description={doc.description}
                                            onSelect={() => {
                                                setOpen(false);
                                                setQuery("");
                                                void navigate({to: "/docs/$slug", params: {slug: doc.slug}});
                                            }}
                                        />
                                    );
                                })}
                            </CommandGroup>
                        ))}
                    </CommandList>
                    <SearchFooter />
                </Command>
            </SearchDialog>
        </>
    );
}
