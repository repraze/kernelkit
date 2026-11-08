/**
 * Kernelkit brand mark: a 32x32 pixel-art CRT console, in the same Doom-HUD style as Termicolor's head
 * (light from the top left, dithered falloff, an accent rim light on the right). Its screen shows a tiny
 * kernelkit UI: a title bar, a sidebar with the current row marked, a heading, text, a solid button and a cursor.
 *
 * Every color is resolved from Termicolor's dark mode and the pink accent; nothing is hardcoded.
 */
import {mix, palette} from "@repraze/termicolor";

const dark = palette.modes.dark;
const n = dark.neutrals;
const pink = dark.accents.pink;

/** Single-char key to palette color. `.` is transparent. */
export const SPRITE_COLORS = {
    k: n[950], // outline, bezel
    d: n[800], // metal shadow
    m: n[700], // metal core shadow
    g: n[500], // metal midtone
    l: n[300], // metal light
    w: n[0], // specular, heading
    q: dark.on.pink, // screen glass
    u: mix(pink, n[900], 0.82), // dim chrome: title bar, divider
    c: mix(n[500], pink, 0.12), // text lines
    p: pink, // accent: current row, button
    P: dark.brights.pink, // hot accent: highlights, cursor, led
    r: pink, // rim light
    v: mix(pink, dark.on.pink, 0.55), // glow spill on the glass
} as const;

export type SpriteKey = keyof typeof SPRITE_COLORS;

export const SPRITE_SIZE = 32;

// prettier-ignore
export const SPRITE: readonly string[] = [
    "................................",
    "................................",
    "...kkkkkkkkkkkkkkkkkkkkkkkkkk...",
    "..kwwllllllllllllllllllllllgdr..",
    "..kwgggggggggggggggggggggggddr..",
    "..klgkkkkkkkkkkkkkkkkkkkkkgddr..",
    "..klgkkqqqqqqqqqqqqqqqqqkkgddr..",
    "..klgkqqPqcqcquuuuuuuuuqqkgddr..",
    "..klgkquuuuuuuuuuuuuuuuuqkgddr..",
    "..klgkqqqqqqquqqqqqqqqqqqkgddr..",
    "..klgkqqqcccquqwwwwwwwqqqkgddr..",
    "..klgkqqqqqqquqqqqqqqqqqqkgddr..",
    "..klgkqqPpppquqcccccccccqkgddr..",
    "..klgkqqqqqqquqccccccccqqkgddr..",
    "..kmgkqqqcccquqqqqqqqqqqqkgddr..",
    "..klmkqqqqqqquqPPPPPqqqqqkmddr..",
    "..kmmkqqqccqquvpppppvqPPqkmddr..",
    "..klmkqqqqqqquqvvvvvqqqqqkmddr..",
    "..kmmkkqqqqqqqqqqqqqqqqqkkmddr..",
    "..klmkkkkkkkkkkkkkkkkkkkkkmddr..",
    "..kmmmmmmmmmmmmmmmmmmmmmmmmddr..",
    "..kmmmmmmmmmmmmmmmmmmmmvPvmddr..",
    "..kmddddddddddddddddddddddddrr..",
    "...kkkkkkkkkkkkkkkkkkkkkkkkkk...",
    "............kmdddddr............",
    "............kkkkkkkr............",
    "........kkkkkkkkkkkkkkkk........",
    ".......kwllllllllllllllrk.......",
    ".......kmdmdmdmdmdmdmdmrk.......",
    "........kkkkkkkkkkkkkkkk........",
    "................................",
    "................................",
];

/** Transparent cells that touch the silhouette (4-neighborhood), in sprite coordinates (may be -1 or 32). */
export function outlineCells(sprite: readonly string[] = SPRITE): [number, number][] {
    const filled = (x: number, y: number) => (sprite[y]?.[x] ?? ".") !== ".";
    const cells: [number, number][] = [];
    for (let y = -1; y <= SPRITE_SIZE; y++) {
        for (let x = -1; x <= SPRITE_SIZE; x++) {
            if (!filled(x, y) && (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))) {
                cells.push([x, y]);
            }
        }
    }
    return cells;
}

/**
 * Emits a compact SVG: one rect per horizontal run of the same key, crisp edges, viewBox-scaled. With
 * `outline` (default) a 1px white ring circles the silhouette in a reserved 1px margin, so the dark
 * outline still reads on dark pages.
 */
export function spriteSvg({scale = 1, outline = true}: {scale?: number; outline?: boolean} = {}): string {
    const pad = outline ? 1 : 0;
    const size = SPRITE_SIZE + pad * 2;
    const parts: string[] = [];
    if (outline) {
        for (const [x, y] of outlineCells()) {
            parts.push(`<rect x="${x + pad}" y="${y + pad}" width="1" height="1" fill="${n[0]}"/>`);
        }
    }
    SPRITE.forEach((row, y) => {
        let x = 0;
        while (x < row.length) {
            const key = row[x]!;
            let end = x + 1;
            while (end < row.length && row[end] === key) {
                end++;
            }
            if (key !== ".") {
                const fill = SPRITE_COLORS[key as SpriteKey];
                parts.push(`<rect x="${x + pad}" y="${y + pad}" width="${end - x}" height="1" fill="${fill}"/>`);
            }
            x = end;
        }
    });
    const px = size * scale;
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${px}" height="${px}" ` +
        `shape-rendering="crispEdges">${parts.join("")}</svg>`
    );
}
