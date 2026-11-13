"use client";

import {Button} from "@repraze/kernelkit/components/button";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {cn} from "cn";
import {SearchIcon} from "lucide-react";
import * as React from "react";

/** "⌘" on Apple keyboards, "Ctrl" elsewhere. SSR-safe: "Ctrl" until mounted. */
function useModKey(): string {
    const [mod, setMod] = React.useState("Ctrl");
    React.useEffect(() => {
        if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) {
            setMod("⌘");
        }
    }, []);
    return mod;
}

/** Typing in a field: "/" must type a slash there, not open search. */
function isEditable(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    return !!el && (el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName));
}

/**
 * The suite's search shortcuts: Ctrl/⌘ K anywhere (toggles), "/" outside text fields (opens).
 * Pass a stable callback (useCallback) or the listener re-binds every render.
 */
function useSearchHotkeys(onOpen: (toggle: boolean) => void, {enabled = true}: {enabled?: boolean} = {}) {
    React.useEffect(() => {
        if (!enabled) {
            return;
        }
        const onKey = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpen(true);
            } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isEditable(e.target)) {
                e.preventDefault();
                onOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onOpen, enabled]);
}

interface SearchTriggerProps extends React.ComponentProps<typeof Button> {
    /** Placeholder text. */
    children?: React.ReactNode;
    /** Full width with its placeholder at every size (a phone menu); otherwise an icon below `sm`. */
    expanded?: boolean;
}

type SearchHandler = React.MouseEventHandler<HTMLButtonElement>;

/**
 * Lets a shell open the page's search from another place (SuiteHeader's phone menu) without a second
 * dialog: a SearchTrigger inside `SearchRelay` hands its `onClick` to the relay's ref.
 */
const SearchRelayContext = React.createContext<React.RefObject<SearchHandler | null> | null>(null);

function SearchRelay({handler, children}: {handler: React.RefObject<SearchHandler | null>; children: React.ReactNode}) {
    return <SearchRelayContext.Provider value={handler}>{children}</SearchRelayContext.Provider>;
}

/**
 * Header search button: icon, placeholder, OS-aware shortcut. Same 32px height as the header's icon buttons. Open your dialog in `onClick`.
 * The keycap gets the same inset on the right as top/bottom (32 - 20 = 6px each side, border included).
 */
function SearchTrigger({children = "Search…", expanded = false, className, onClick, ...props}: SearchTriggerProps) {
    const mod = useModKey();
    const relay = React.useContext(SearchRelayContext);
    React.useEffect(() => {
        if (!relay) {
            return;
        }
        relay.current = onClick ?? null;
        return () => {
            relay.current = null;
        };
    }, [relay, onClick]);
    return (
        <Button
            variant="outline"
            aria-label="Search"
            data-slot="search-trigger"
            data-expanded={expanded || undefined}
            className={cn(
                "justify-start text-muted-foreground",
                expanded ? "w-full pr-1.25 pl-2.5" : "w-8 px-0 sm:w-40 sm:pr-1.25 sm:pl-2.5 lg:w-56",
                className,
            )}
            onClick={onClick}
            {...props}
        >
            <SearchIcon data-icon="inline-start" className={expanded ? undefined : "mx-auto sm:mx-0"} />
            <span className={cn("flex-1 truncate text-start", !expanded && "hidden sm:inline")}>{children}</span>
            <Kbd className="hidden sm:inline-flex">{mod} K</Kbd>
        </Button>
    );
}

export {SearchRelay, SearchTrigger, useModKey, useSearchHotkeys};
export type {SearchHandler, SearchTriggerProps};
