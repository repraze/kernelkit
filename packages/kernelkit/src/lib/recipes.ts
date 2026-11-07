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

/** Row inside a popup or list: menu item, select item, command item (§4, §6). */
export const listItem =
    "relative flex min-h-8 cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-highlighted:[&_svg:not([class*='text-'])]:text-accent-foreground";

/** Group label inside a popup or list. */
export const listLabel = "px-2 py-1.5 text-xs font-medium text-muted-foreground";

/** Separator inside a popup or list. */
export const listSeparator = "-mx-1 my-1 h-px bg-border";

/** Modal backdrop for dialog, alert dialog, sheet, drawer. */
export const backdrop =
    "fixed inset-0 isolate z-50 bg-black/40 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"; // lint-design-ignore: scrim is not a role

/** Title in cards, dialogs, sheets, popovers, empty states, alerts (§5). */
export const heading = "font-heading font-medium tracking-tight";

/** Empty track / placeholder: progress & meter tracks, skeletons, unlit segments. bg-muted vanishes on cards. */
export const placeholderFill = "bg-foreground/10 hc:bg-border";

/** Selected row (table, data table, code line, list): accent tint + 2px inset primary indicator (§6). */
export const selectedRow = "bg-accent text-accent-foreground shadow-[inset_2px_0_0_var(--primary)]";
