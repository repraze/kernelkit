import {Button} from "@repraze/kernelkit/components/button";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@repraze/kernelkit/components/command";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {useNavigate} from "@tanstack/react-router";
import {SearchIcon} from "lucide-react";
import {useEffect, useState} from "react";

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

/** Docs search, built on the kit's own Command palette. */
/** Typing in a field: "/" must type a slash there, not open search. */
function isEditable(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    return !!el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName));
}

/** Same bindings as the Termicolor site: Ctrl/⌘ K anywhere, "/" outside text fields. */
export function SiteSearch() {
    const [open, setOpen] = useState(false);
    // "Ctrl" until we know it's Apple (SSR-safe, and right for the majority of keyboards)
    const [mod, setMod] = useState("Ctrl");
    const navigate = useNavigate();

    useEffect(() => {
        if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
            setMod("⌘");
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isEditable(e.target)) {
                e.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="w-40 justify-start text-muted-foreground md:w-56"
                aria-label="Search docs"
            >
                <SearchIcon data-icon="inline-start" />
                <span className="flex-1 text-start">Search…</span>
                <Kbd>{mod} K</Kbd>
            </Button>
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
