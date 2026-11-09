/** Theme model shared by the provider, the pre-paint script and ThemeScope. No React here. */

export const MODES = ["system", "light", "dark"] as const;
export const CONTRASTS = ["normal", "high"] as const;
/** TermiColor accents (same names and order as @repraze/termicolor's ACCENTS). */
export const ACCENTS = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"] as const;
export const RADII = ["none", "sm", "md", "lg", "xl"] as const;

export type Mode = (typeof MODES)[number];
export type ResolvedMode = Exclude<Mode, "system">;
export type Contrast = (typeof CONTRASTS)[number];
export type Accent = (typeof ACCENTS)[number];
export type Radius = (typeof RADII)[number];

export interface ThemeState {
    mode: Mode;
    contrast: Contrast;
    accent: Accent;
    radius: Radius;
}

export const DEFAULT_THEME: ThemeState = {mode: "system", contrast: "normal", accent: "pink", radius: "md"};
export const DEFAULT_STORAGE_KEY = "kernelkit-theme";

/** Keep only known values, falling back per field (storage may hold stale or hand-edited JSON). */
export function sanitizeTheme(value: unknown, fallback: ThemeState): ThemeState {
    const v = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
    const pick = <T extends string>(list: readonly T[], key: keyof ThemeState): T =>
        list.includes(v[key] as T) ? (v[key] as T) : (fallback[key] as T);
    return {
        mode: pick(MODES, "mode"),
        contrast: pick(CONTRASTS, "contrast"),
        accent: pick(ACCENTS, "accent"),
        radius: pick(RADII, "radius"),
    };
}

/** Class toggles for a theme scope: .light/.dark, .hc, .accent-<name>, .radius-<size>. */
export function themeClasses(theme: Omit<ThemeState, "mode"> & {mode: ResolvedMode}): Record<string, boolean> {
    return {
        light: theme.mode === "light",
        dark: theme.mode === "dark",
        hc: theme.contrast === "high",
        ...Object.fromEntries(ACCENTS.map((a) => [`accent-${a}`, a === theme.accent])),
        ...Object.fromEntries(RADII.map((r) => [`radius-${r}`, r === theme.radius])),
    };
}

/** Space-separated class string for a resolved theme (for SSR markup and ThemeScope). */
export function themeClassName(theme: Omit<ThemeState, "mode"> & {mode: ResolvedMode}): string {
    return Object.entries(themeClasses(theme))
        .filter(([, on]) => on)
        .map(([name]) => name)
        .join(" ");
}

export function applyTheme(el: Element, theme: Omit<ThemeState, "mode"> & {mode: ResolvedMode}) {
    for (const [name, on] of Object.entries(themeClasses(theme))) {
        el.classList.toggle(name, on);
    }
    (el as HTMLElement).style.colorScheme = theme.mode;
}

export interface ThemeScriptOptions {
    storageKey?: string;
    defaults?: Partial<ThemeState>;
}

/**
 * Inline script source that applies the stored theme to <html> before first paint. Put it in <head>
 * (or use <ThemeScript />). Self-contained: it can't import anything, so it repeats the class logic.
 */
export function themeScript({storageKey = DEFAULT_STORAGE_KEY, defaults}: ThemeScriptOptions = {}): string {
    const d = {...DEFAULT_THEME, ...defaults};
    const lists = {mode: MODES, contrast: CONTRASTS, accent: ACCENTS, radius: RADII};
    return `(function(){try{var k=${JSON.stringify(storageKey)},d=${JSON.stringify(d)},l=${JSON.stringify(lists)},s={};
try{s=JSON.parse(localStorage.getItem(k))||{}}catch(e){}
var t={};for(var f in l){t[f]=l[f].indexOf(s[f])>=0?s[f]:d[f]}
var m=t.mode==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t.mode;
var c=document.documentElement.classList;c.toggle("light",m==="light");c.toggle("dark",m==="dark");c.toggle("hc",t.contrast==="high");
l.accent.forEach(function(a){c.toggle("accent-"+a,a===t.accent)});l.radius.forEach(function(r){c.toggle("radius-"+r,r===t.radius)});
document.documentElement.style.colorScheme=m}catch(e){}})();`;
}
