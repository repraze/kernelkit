/**
 * Shared class recipes (GUIDELINES.md §3-§6). Components compose these so every control family
 * shares one focus ring, one field surface, one popup surface and one list-item look. Plain strings:
 * `cn()` can still override any part from `className`.
 */

/** Keyboard focus ring for standalone controls (§6). */
export const focusRing = "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/** aria-invalid look for controls (§6). */
export const invalidRing =
    "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40";

/** Text-entry surface: input, textarea, select trigger, input-group, combobox chips (§4, §6). */
export const fieldSurface =
    "rounded-lg border border-input bg-field transition-[color,background-color,border-color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:bg-field-disabled disabled:opacity-50";

/** Floating panel: popover, menus, select/combobox list, hover card (§1, §3). */
export const popupSurface =
    "rounded-lg border border-border bg-popover text-popover-foreground shadow-lg shadow-(color:--shadow-color)";

/** Popup open/close motion (§6). */
export const popupMotion =
    "origin-(--transform-origin) duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 motion-reduce:animate-none";

/**
 * The sidebar's current-row indicator (§7c): a 2px accent pill inset on the row's left edge, hidden until
 * the row's state shows it (`data-highlighted:after:opacity-100`, `data-active:after:opacity-100`...).
 * The row keeps its own rounding on every corner.
 */
export const rowIndicator =
    "after:pointer-events-none after:absolute after:top-1.5 after:bottom-1.5 after:left-0 after:w-0.5 after:rounded-pill after:bg-primary-text after:opacity-0";

/** Row inside a popup or list: menu item, select item, command item (§4, §6). */
export const listItem = `${rowIndicator} data-highlighted:after:opacity-100 relative flex min-h-8 cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-accent-foreground`;

/** Group label inside a popup or list. */
export const listLabel = "px-2 py-1.5 text-xs font-medium text-muted-foreground";

/** Separator inside a popup or list. */
export const listSeparator = "-mx-1 my-1 h-px bg-border";

/**
 * Modal backdrop for dialog, alert dialog, sheet, drawer. A transition on Base UI's starting/ending styles,
 * not a keyframe: the backdrop stays mounted until the slower panel finishes, and a finished keyframe
 * (no fill) snapped it back to full dim and blur for that wait, a flash on close.
 */
export const backdrop =
    "fixed inset-0 isolate z-50 bg-black/40 transition-opacity duration-150 ease-out motion-reduce:transition-none supports-backdrop-filter:backdrop-blur-xs data-starting-style:opacity-0 data-ending-style:opacity-0"; // lint-design-ignore: scrim is not a role

/** Title in cards, dialogs, sheets, popovers, empty states, alerts (§5). */
export const heading = "font-heading font-medium tracking-tight";

/** Empty track / placeholder: progress & meter tracks, skeletons, unlit segments. bg-muted vanishes on cards. */
export const placeholderFill = "bg-foreground/10 hc:bg-border";

/** Selected row (table, data table, code line, list): accent tint + 2px inset primary indicator (§6). */
export const selectedRow = "bg-accent text-accent-foreground shadow-[inset_2px_0_0_var(--primary-text)]";

/**
 * Status surface shared by Alert and Callout (§2): one `soft` / `outline` axis, same values in both.
 * Expects a color variant (`--c`, `--c-tint`) on the same element. Text, icons and links on it use
 * `--c-text`, which each variant sets to the color that passes 4.5:1 on that surface. Neutral swaps the hue border for the
 * plain border on a card surface (`statusSurfaceNeutral`).
 */
export const statusSurface = {
    // status tint behind foreground text; the hue lives in the border, icon and accents (TermiColor rule).
    // `--c-text` is the hue for text, icons and links on it: on the tint it is the soft text (4.5:1)
    soft: "border-(--c)/30 bg-(--c-tint) hc:border-(--c) [--c-text:var(--c-soft-text)]",
    // no wash: card surface with a hue border, for dense layouts
    outline: "border-(--c)/50 bg-card hc:border-(--c) [--c-text:var(--c)]",
} as const;

export const statusSurfaceNeutral = "border-border bg-card hc:border-border [--c-text:var(--c)]";
