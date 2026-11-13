/**
 * The color axis (GUIDELINES.md §2). A color sets three local CSS variables; variants only read them:
 *
 * - `--c`      the color, text tier: readable as text/icon/border on any surface
 * - `--c-fg`   text on a solid `--c` fill
 * - `--c-tint` opaque wash behind foreground text
 * - `--c-fill` / `--c-fill-fg` vivid solid surface and its text (TermiColor "fills are the brand":
 *   in light mode the text tier is darkened for contrast, the fill tier stays vivid)
 * - `--c-soft-text` text on a wash of its own color (soft variants, soft status surfaces): `--c` mixed 25%
 *   toward the foreground with its chroma restored, which keeps hue and saturation and passes WCAG AA
 *   4.5:1 for every color, in light, dark and both hc modes, on background, card and popover (plain `--c`
 *   on its own wash fell to ~3.6)
 *
 * Spread `colorVariants` into a cva `variants.color` map, then write variants against the vars
 * (`bg-(--c) text-(--c-fg)`, `bg-(--c)/12 text-(--c-soft-text)`, …).
 */

export const STATUS_COLORS = ["danger", "warning", "success", "info"] as const;
export const HUES = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"] as const;
export const COLORS = ["neutral", "primary", ...STATUS_COLORS, ...HUES] as const;

export type Color = (typeof COLORS)[number];

/**
 * Derived from `--c` on the same element, so it is set alongside every color (a :root rule would see no `--c`).
 * The mix toward the (neutral) foreground sets the lightness for contrast but also scales chroma by 0.75, so
 * where relative color syntax is supported the chroma is multiplied back by 1/0.75: same lightness and hue,
 * the original saturation (≥ 5.08:1 everywhere, vs ≥ 5.68 for the plain mix kept as the fallback).
 */
const SOFT_TEXT =
    "[--c-soft-text:color-mix(in_oklab,var(--c)_75%,var(--foreground))] supports-[color:oklch(from_red_l_c_h)]:[--c-soft-text:oklch(from_color-mix(in_oklab,var(--c)_75%,var(--foreground))_l_calc(c*1.333)_h)]";

// Literal strings on purpose: Tailwind only generates classes it can read in the source.
const baseColorVariants: Record<Color, string> = {
    neutral:
        "[--c:var(--foreground)] [--c-fg:var(--background)] [--c-tint:var(--secondary)] [--c-fill:var(--foreground)] [--c-fill-fg:var(--background)]",
    primary:
        "[--c:var(--primary-text)] [--c-fg:var(--tc-on-accent)] [--c-tint:var(--accent)] [--c-fill:var(--primary)] [--c-fill-fg:var(--primary-foreground)]",
    danger: "[--c:var(--danger)] [--c-fg:var(--danger-foreground)] [--c-tint:var(--danger-tint)] [--c-fill:var(--tc-red-fill)] [--c-fill-fg:var(--tc-red-on-fill)]",
    warning:
        "[--c:var(--warning)] [--c-fg:var(--warning-foreground)] [--c-tint:var(--warning-tint)] [--c-fill:var(--tc-yellow-fill)] [--c-fill-fg:var(--tc-yellow-on-fill)]",
    success:
        "[--c:var(--success)] [--c-fg:var(--success-foreground)] [--c-tint:var(--success-tint)] [--c-fill:var(--tc-green-fill)] [--c-fill-fg:var(--tc-green-on-fill)]",
    info: "[--c:var(--info)] [--c-fg:var(--info-foreground)] [--c-tint:var(--info-tint)] [--c-fill:var(--tc-blue-fill)] [--c-fill-fg:var(--tc-blue-on-fill)]",
    red: "[--c:var(--tc-red)] [--c-fg:var(--tc-red-on)] [--c-tint:var(--tc-red-tint)] [--c-fill:var(--tc-red-fill)] [--c-fill-fg:var(--tc-red-on-fill)]",
    orange: "[--c:var(--tc-orange)] [--c-fg:var(--tc-orange-on)] [--c-tint:var(--tc-orange-tint)] [--c-fill:var(--tc-orange-fill)] [--c-fill-fg:var(--tc-orange-on-fill)]",
    yellow: "[--c:var(--tc-yellow)] [--c-fg:var(--tc-yellow-on)] [--c-tint:var(--tc-yellow-tint)] [--c-fill:var(--tc-yellow-fill)] [--c-fill-fg:var(--tc-yellow-on-fill)]",
    green: "[--c:var(--tc-green)] [--c-fg:var(--tc-green-on)] [--c-tint:var(--tc-green-tint)] [--c-fill:var(--tc-green-fill)] [--c-fill-fg:var(--tc-green-on-fill)]",
    cyan: "[--c:var(--tc-cyan)] [--c-fg:var(--tc-cyan-on)] [--c-tint:var(--tc-cyan-tint)] [--c-fill:var(--tc-cyan-fill)] [--c-fill-fg:var(--tc-cyan-on-fill)]",
    blue: "[--c:var(--tc-blue)] [--c-fg:var(--tc-blue-on)] [--c-tint:var(--tc-blue-tint)] [--c-fill:var(--tc-blue-fill)] [--c-fill-fg:var(--tc-blue-on-fill)]",
    purple: "[--c:var(--tc-purple)] [--c-fg:var(--tc-purple-on)] [--c-tint:var(--tc-purple-tint)] [--c-fill:var(--tc-purple-fill)] [--c-fill-fg:var(--tc-purple-on-fill)]",
    pink: "[--c:var(--tc-pink)] [--c-fg:var(--tc-pink-on)] [--c-tint:var(--tc-pink-tint)] [--c-fill:var(--tc-pink-fill)] [--c-fill-fg:var(--tc-pink-on-fill)]",
};

export const colorVariants = Object.fromEntries(
    Object.entries(baseColorVariants).map(([color, vars]) => [color, `${vars} ${SOFT_TEXT}`]),
) as Record<Color, string>;

/** Every color except neutral: the ones whose outline/ghost variants are tinted. */
export const TINTED_COLORS = COLORS.filter((c) => c !== "neutral");

/** Fill styles shared by Button, Badge, Toggle… (GUIDELINES.md §2). */
export const FILL_VARIANTS = ["solid", "soft", "outline", "ghost", "link"] as const;
export type FillVariant = (typeof FILL_VARIANTS)[number];

/** shadcn names kept for drop-in use. */
export type FillVariantAlias = "default" | "secondary" | "destructive";

const ALIASES: Record<FillVariantAlias, {variant: FillVariant; color?: Color}> = {
    default: {variant: "solid"},
    secondary: {variant: "solid", color: "neutral"},
    destructive: {variant: "soft", color: "danger"},
};

/** Each variant's natural color when none is given: solid things are primary, chrome is neutral. */
const DEFAULT_COLOR: Record<FillVariant, Color> = {
    solid: "primary",
    soft: "primary",
    link: "primary",
    outline: "neutral",
    ghost: "neutral",
};

/** Resolve aliases and the variant's default color. */
export function resolveFill(
    variant: FillVariant | FillVariantAlias | null | undefined,
    color: Color | null | undefined,
    fallback: FillVariant = "solid",
): {variant: FillVariant; color: Color} {
    const alias = variant && variant in ALIASES ? ALIASES[variant as FillVariantAlias] : undefined;
    const v = alias?.variant ?? (variant as FillVariant | null | undefined) ?? fallback;
    return {variant: v, color: color ?? alias?.color ?? DEFAULT_COLOR[v]};
}
