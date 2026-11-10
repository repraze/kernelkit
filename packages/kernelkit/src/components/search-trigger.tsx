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
}

/** Header search button: icon, placeholder, OS-aware shortcut. Same 32px height as the header's icon buttons. Open your dialog in `onClick`. */
function SearchTrigger({children = "Search…", className, ...props}: SearchTriggerProps) {
    const mod = useModKey();
    return (
        <Button
            variant="outline"
            aria-label="Search"
            data-slot="search-trigger"
            className={cn("w-8 justify-start px-0 text-muted-foreground sm:w-48 sm:px-2.5 md:w-56", className)}
            {...props}
        >
            <SearchIcon data-icon="inline-start" className="mx-auto sm:mx-0" />
            <span className="hidden flex-1 text-start sm:inline">{children}</span>
            <Kbd className="hidden sm:inline-flex">{mod} K</Kbd>
        </Button>
    );
}

export {SearchTrigger, useModKey, useSearchHotkeys};
export type {SearchTriggerProps};
