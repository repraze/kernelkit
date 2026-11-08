import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@repraze/kernelkit/components/command";
import {SearchTrigger, useSearchHotkeys} from "@repraze/kernelkit/components/search-trigger";
import {useNavigate} from "@tanstack/react-router";
import {useCallback, useState} from "react";

import {DOCS_BY_CATEGORY} from "@/lib/docs-index";

/** Plain substring match: cmdk's default fuzzy match finds "t…a…b" in nearly every title. */
function substringFilter(value: string, search: string, keywords?: string[]) {
    const haystack = [value, ...(keywords ?? [])].join(" ").toLowerCase();
    const needle = search.trim().toLowerCase();
    if (haystack.startsWith(needle)) {
        return 1;
    }
    return haystack.includes(needle) ? 0.5 : 0;
}

/** Docs search: the suite's SearchTrigger + hotkeys, results in the kit's Command palette. */
export function SiteSearch() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    useSearchHotkeys(useCallback((toggle: boolean) => setOpen((o) => (toggle ? !o : true)), []));

    return (
        <>
            <SearchTrigger onClick={() => setOpen(true)} aria-label="Search docs" />
            <CommandDialog open={open} onOpenChange={setOpen} title="Search docs">
                <Command filter={substringFilter}>
                    <CommandInput placeholder="Search components…" />
                    <CommandList>
                        <CommandEmpty>No component matches.</CommandEmpty>
                        {DOCS_BY_CATEGORY.map(({category, docs}) => (
                            <CommandGroup key={category} heading={category}>
                                {docs.map((doc) => (
                                    <CommandItem
                                        key={doc.slug}
                                        value={doc.title}
                                        keywords={[doc.category, doc.slug]}
                                        onSelect={() => {
                                            setOpen(false);
                                            void navigate({to: "/docs/$slug", params: {slug: doc.slug}});
                                        }}
                                    >
                                        <span className="shrink-0 whitespace-nowrap">{doc.title}</span>
                                        <span className="ml-auto truncate text-xs text-muted-foreground">
                                            {doc.description}
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
}
