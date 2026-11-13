"use client";

import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {placeholderFill} from "@repraze/kernelkit/lib/recipes";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {Loader2Icon} from "lucide-react";
import * as React from "react";

/**
 * Sizes follow the icon column of §4 so a spinner can replace an icon in place. Each size also sets the
 * vars the techy variants draw with: `--ls` (box), `--lc`/`--lg` (dot cell and gap, whole pixels so cells
 * stay crisp) and `--lb` (bar width).
 */
const spinnerVariants = cva("relative inline-flex shrink-0 items-center justify-center align-middle text-current", {
    variants: {
        variant: {
            // reduced motion: slow the spin down rather than freeze it, a frozen spinner reads as a glyph
            ring: "size-(--ls) animate-spin motion-reduce:[animation-duration:2.5s]",
            dots: "size-(--ls)",
            braille: "h-(--ls) w-(--ls) items-start overflow-hidden font-mono text-(length:--ls) leading-none",
            // hc: the placeholder fill is the dark border colour there, so the box becomes an outline instead
            scan: `size-(--ls) overflow-hidden rounded-box ${placeholderFill} hc:bg-transparent hc:shadow-[inset_0_0_0_1px_var(--border)]`,
            blink: "h-(--ls) w-[calc(var(--ls)/2)]",
            bars: "size-(--ls) justify-between",
        },
        size: {
            xs: "[--lb:2px] [--lc:3px] [--lg:1px] [--ls:0.75rem]",
            sm: "[--lb:2px] [--lc:4px] [--lg:1px] [--ls:0.875rem]",
            default: "[--lb:3px] [--lc:4px] [--lg:2px] [--ls:1rem]",
            lg: "[--lb:3px] [--lc:6px] [--lg:1px] [--ls:1.25rem]",
            xl: "[--lb:4px] [--lc:6px] [--lg:3px] [--ls:1.5rem]",
        },
    },
    defaultVariants: {variant: "ring", size: "default"},
});

type SpinnerVariant = NonNullable<VariantProps<typeof spinnerVariants>["variant"]>;

/** Every animated part: slower, not frozen, under reduced motion. */
const slow = "motion-reduce:[animation-duration:3s]";

const BRAILLE = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

/** Negative delays so every cell is mid-cycle on the first frame (no dead start). */
const delay = (i: number, n: number, duration: number) => ({animationDelay: `${-((n - i) * duration) / n}s`});

function SpinnerParts({variant}: {variant: SpinnerVariant}) {
    switch (variant) {
        case "ring":
            return <Loader2Icon aria-hidden className="size-full" />;
        case "dots":
            return (
                <span
                    data-slot="spinner-grid"
                    className="grid grid-cols-[repeat(3,var(--lc))] grid-rows-[repeat(3,var(--lc))] gap-(--lg)"
                >
                    {Array.from({length: 9}, (_, i) => (
                        <span
                            key={i}
                            className={cn("animate-loader-cell rounded-pill bg-current", slow)}
                            // diagonal wave from the top-left corner
                            style={delay(4 - (Math.floor(i / 3) + (i % 3)), 5, 1.2)}
                        />
                    ))}
                </span>
            );
        case "braille":
            return (
                <span aria-hidden className={cn("flex animate-loader-braille flex-col", slow)}>
                    {[...BRAILLE].map((g) => (
                        <span key={g} className="h-(--ls) leading-(--ls)">
                            {g}
                        </span>
                    ))}
                </span>
            );
        case "scan":
            return (
                <span
                    className={cn(
                        "absolute inset-0 animate-loader-scan border-e-2 border-current bg-linear-to-r from-transparent to-current/40",
                        slow,
                    )}
                />
            );
        case "blink":
            return <span className={cn("size-full animate-loader-blink bg-current", slow)} />;
        case "bars":
            return Array.from({length: 4}, (_, i) => (
                <span
                    key={i}
                    className={cn("h-full w-(--lb) origin-bottom animate-loader-bars rounded-box bg-current", slow)}
                    style={delay((i * 2 + Math.floor(i / 2)) % 4, 4, 0.9)}
                />
            ));
    }
}

const SpinnerContext = React.createContext<SpinnerVariant>("ring");

/**
 * Sets the default `variant` of every Spinner below it, including the ones the kit renders itself
 * (tree lazy rows, stepper, file upload, toasts): one switch for the whole app's loading look.
 */
function SpinnerProvider({variant, children}: {variant: SpinnerVariant; children: React.ReactNode}) {
    return <SpinnerContext.Provider value={variant}>{children}</SpinnerContext.Provider>;
}

interface SpinnerProps
    extends Omit<React.ComponentProps<"span">, "color" | "children">, VariantProps<typeof spinnerVariants> {
    /** Color from the §2 axis; defaults to `currentColor`. */
    color?: Color;
}

/**
 * Indeterminate loading indicator at icon size: a spinning ring, or a techy variant (dot matrix, braille,
 * scan line, block cursor, equalizer bars). Inherits `currentColor`; announces itself as a status. The
 * default variant comes from the nearest `SpinnerProvider`.
 */
function Spinner({variant, size, color, className, ...props}: SpinnerProps) {
    const fallback = React.useContext(SpinnerContext);
    const resolved = variant ?? fallback;
    return (
        <span
            data-slot="spinner"
            data-variant={resolved}
            data-size={size ?? "default"}
            data-color={color}
            role="status"
            aria-label="Loading"
            className={cn(
                spinnerVariants({variant: resolved, size}),
                color && cn(colorVariants[color], "text-(--c)"),
                className,
            )}
            {...props}
        >
            <SpinnerParts variant={resolved} />
        </span>
    );
}

export {Spinner, SpinnerProvider, spinnerVariants};
export type {SpinnerProps, SpinnerVariant};
