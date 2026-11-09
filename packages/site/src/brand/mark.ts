/**
 * KernelKit brand mark: a monitor whose screen shows the kit's current-row highlight (a white row with a
 * pink indicator on its left edge), drawn as one silhouette with a 2-unit pink outline around a grey
 * bezel and stand (the suite's mark style, shared with TermiColor's skull).
 *
 * Grid: a 32-unit viewBox where every edge, radius and gap is an even number of units, so the mark lands on
 * whole pixels at 16px (favicon) and 32px (navbar, retina favicon) and stays sharp at multiples of 32.
 * Every color is resolved from TermiColor's dark mode and the pink accent; nothing is hardcoded.
 */
import {palette} from "@repraze/termicolor";

const dark = palette.modes.dark;
const n = dark.neutrals;

export const MARK_COLORS = {
    outline: dark.accents.pink,
    bezel: n[600],
    screen: n[950],
    row: n[500],
    current: n[50],
    indicator: dark.accents.pink,
} as const;

/** Each shape: an even-unit path and the color key it fills with, back to front. */
export const MARK_SHAPES: readonly {d: string; fill: keyof typeof MARK_COLORS}[] = [
    // silhouette: monitor, neck and foot, 2-unit corners
    {
        d: "M4 2H28A2 2 0 0 1 30 4V20A2 2 0 0 1 28 22H20V24H22A2 2 0 0 1 24 26V28A2 2 0 0 1 22 30H10A2 2 0 0 1 8 28V26A2 2 0 0 1 10 24H12V22H4A2 2 0 0 1 2 20V4A2 2 0 0 1 4 2Z",
        fill: "outline",
    },
    // bezel and stand, inset 2 units
    {d: "M4 4H28V20H18V26H22V28H10V26H14V20H4Z", fill: "bezel"},
    {d: "M6 6H26V18H6Z", fill: "screen"},
    // a muted row above the current row: indicator + highlighted row
    {d: "M10 8H20V10H10Z", fill: "row"},
    {d: "M8 12H10V16H8Z", fill: "indicator"},
    {d: "M10 12H24V16H10Z", fill: "current"},
];

/** The mark as SVG markup. `size` sets width/height in px (omit to let CSS size it). */
export function markSvg({size}: {size?: number} = {}): string {
    const dims = size ? ` width="${size}" height="${size}"` : "";
    const paths = MARK_SHAPES.map((s) => `<path d="${s.d}" fill="${MARK_COLORS[s.fill]}"/>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"${dims}>${paths}</svg>`;
}
