"use client";

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
    useSyncExternalStore,
} from "react";

import {
    applyTheme,
    DEFAULT_STORAGE_KEY,
    DEFAULT_THEME,
    type ResolvedMode,
    sanitizeTheme,
    themeClassName,
    themeScript,
    type ThemeScriptOptions,
    type ThemeState,
} from "./theme";

export interface ThemeContextValue extends ThemeState {
    /** `mode` with "system" resolved against the OS preference. */
    resolvedMode: ResolvedMode;
    setTheme: (patch: Partial<ThemeState>) => void;
    setMode: (mode: ThemeState["mode"]) => void;
    setContrast: (contrast: ThemeState["contrast"]) => void;
    setAccent: (accent: ThemeState["accent"]) => void;
    setRadius: (radius: ThemeState["radius"]) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Element overlays portal into, so popups inside a ThemeScope keep its theme. */
const PortalContainerContext = createContext<HTMLElement | null>(null);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeSystem(onChange: () => void) {
    const mq = window.matchMedia(DARK_QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
}

function useSystemMode(): ResolvedMode {
    return useSyncExternalStore(
        subscribeSystem,
        () => (window.matchMedia(DARK_QUERY).matches ? "dark" : "light"),
        () => "light",
    );
}

function readStored(key: string, fallback: ThemeState): ThemeState {
    if (typeof window === "undefined") {
        return fallback;
    }
    try {
        return sanitizeTheme(JSON.parse(window.localStorage.getItem(key) ?? "null"), fallback);
    } catch {
        return fallback;
    }
}

export interface ThemeProviderProps {
    children?: ReactNode;
    /** Initial values when nothing is stored. Default: system mode, normal contrast, pink, md radius. */
    defaultTheme?: Partial<ThemeState>;
    /** localStorage key; `null` disables persistence. */
    storageKey?: string | null;
    /** Force values regardless of storage/user choice (e.g. a site that is always red). */
    forcedTheme?: Partial<ThemeState>;
}

/**
 * Owns the app theme: applies `.light/.dark`, `.hc`, `.accent-*`, `.radius-*` to <html>, persists the
 * choice and syncs it across tabs. Pair with <ThemeScript /> in <head> to avoid a flash on load.
 */
export function ThemeProvider({
    children,
    defaultTheme,
    storageKey = DEFAULT_STORAGE_KEY,
    forcedTheme,
}: ThemeProviderProps) {
    const fallback = useMemo(
        () => ({...DEFAULT_THEME, ...defaultTheme}),
        [defaultTheme?.mode, defaultTheme?.contrast, defaultTheme?.accent, defaultTheme?.radius],
    );
    // Server and first client render use the defaults; the stored value lands in a layout effect
    // (the pre-paint script has already put the right classes on <html>, so nothing flashes).
    const [stored, setStored] = useState<ThemeState>(fallback);
    useIsoLayoutEffect(() => {
        if (storageKey) {
            setStored(readStored(storageKey, fallback));
        }
    }, [storageKey, fallback]);

    useEffect(() => {
        if (!storageKey) {
            return;
        }
        const onStorage = (e: StorageEvent) => {
            if (e.key === storageKey) {
                setStored(readStored(storageKey, fallback));
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [storageKey, fallback]);

    const theme = useMemo(() => ({...stored, ...forcedTheme}), [stored, forcedTheme]);
    const system = useSystemMode();
    const resolvedMode = theme.mode === "system" ? system : theme.mode;

    useIsoLayoutEffect(() => {
        applyTheme(document.documentElement, {...theme, mode: resolvedMode});
    }, [theme.contrast, theme.accent, theme.radius, resolvedMode]);

    const setTheme = useCallback(
        (patch: Partial<ThemeState>) => {
            setStored((prev) => {
                const next = sanitizeTheme({...prev, ...patch}, fallback);
                if (storageKey) {
                    try {
                        window.localStorage.setItem(storageKey, JSON.stringify(next));
                    } catch {
                        // storage blocked (private mode, quota): keep the in-memory choice
                    }
                }
                return next;
            });
        },
        [storageKey, fallback],
    );

    const value = useMemo<ThemeContextValue>(
        () => ({
            ...theme,
            resolvedMode,
            setTheme,
            setMode: (mode) => setTheme({mode}),
            setContrast: (contrast) => setTheme({contrast}),
            setAccent: (accent) => setTheme({accent}),
            setRadius: (radius) => setTheme({radius}),
        }),
        [theme, resolvedMode, setTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Current theme and setters. Must be used under <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within <ThemeProvider>");
    }
    return ctx;
}

/** Renders the pre-paint script. Place in <head> (Next.js: in the root layout). */
export function ThemeScript({nonce, ...options}: ThemeScriptOptions & {nonce?: string}) {
    return <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{__html: themeScript(options)}} />;
}

export interface ThemeScopeProps extends Omit<React.ComponentProps<"div">, "children"> {
    children?: ReactNode;
    /** Values not given inherit from the surrounding <ThemeProvider> (or the defaults). */
    mode?: ResolvedMode;
    contrast?: ThemeState["contrast"];
    accent?: ThemeState["accent"];
    radius?: ThemeState["radius"];
}

/**
 * A subtree with its own theme (previews, side-by-side comparisons). Overlays opened inside portal into
 * the scope, so they keep its colors and radius.
 */
export function ThemeScope({mode, contrast, accent, radius, className, children, ...props}: ThemeScopeProps) {
    const parent = useContext(ThemeContext);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const theme = {
        mode: mode ?? parent?.resolvedMode ?? "light",
        contrast: contrast ?? parent?.contrast ?? DEFAULT_THEME.contrast,
        accent: accent ?? parent?.accent ?? DEFAULT_THEME.accent,
        radius: radius ?? parent?.radius ?? DEFAULT_THEME.radius,
    };
    const classes = themeClassName(theme);
    return (
        <div
            data-slot="theme-scope"
            className={[classes, "bg-background text-foreground", className].filter(Boolean).join(" ")}
            {...props}
        >
            <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>
            <div ref={setContainer} data-slot="theme-scope-portal" className={classes} />
        </div>
    );
}

/** Container for `*.Portal` parts: the nearest ThemeScope's portal root, else document.body. */
export function usePortalContainer(): HTMLElement | undefined {
    return useContext(PortalContainerContext) ?? undefined;
}
