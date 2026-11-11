"use client";

import {Command, CommandEmpty, CommandGroup, CommandInput, CommandList} from "@repraze/kernelkit/components/command";
import {SearchDialog, SearchFooter, SearchItem, substringFilter} from "@repraze/kernelkit/components/search-dialog";
import {SearchTrigger, useSearchHotkeys} from "@repraze/kernelkit/components/search-trigger";
import {FileTextIcon, type LucideIcon} from "lucide-react";
import {useCallback, useState} from "react";

import type {DocsIndex} from "./docs-index";

export interface DocsSearchProps {
    index: DocsIndex;
    /** One icon per category, so a result's kind reads at a glance; `fallbackIcon` for the others. */
    icons?: Record<string, LucideIcon>;
    fallbackIcon?: LucideIcon;
    /** Slugs shown before the first keystroke, in a "Suggested" group. */
    suggested?: string[];
    placeholder?: string;
    /** Go to a page (the router's navigate). */
    onSelect: (slug: string) => void;
}

/**
 * The suite's docs search: SearchTrigger + hotkeys (Ctrl/⌘ K, `/`) opening a SearchDialog over the docs
 * index, grouped by category, with a plain substring filter.
 */
export function DocsSearch({
    index,
    icons = {},
    fallbackIcon = FileTextIcon,
    suggested = [],
    placeholder = "Search the docs…",
    onSelect,
}: DocsSearchProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    useSearchHotkeys(useCallback((toggle: boolean) => setOpen((o) => (toggle ? !o : true)), []));

    const groups = query.trim()
        ? index.byCategory
        : [{category: "Suggested", docs: suggested.flatMap((slug) => index.docs.filter((d) => d.slug === slug))}];

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
                    <CommandInput value={query} onValueChange={setQuery} placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>No results for “{query}”.</CommandEmpty>
                        {groups.map(({category, docs}) => (
                            <CommandGroup key={category} heading={category}>
                                {docs.map((doc) => {
                                    const Icon = icons[doc.category] ?? fallbackIcon;
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
                                                onSelect(doc.slug);
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
