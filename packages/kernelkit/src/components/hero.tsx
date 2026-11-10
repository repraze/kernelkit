"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";
import type * as React from "react";

/**
 * The suite's landing hero: a full-bleed band under the header (muted surface, bottom border) with
 * centered content at the site width. The default backdrop is a dot grid fading out from the center;
 * pass `background` to replace it (an animation, a canvas).
 *
 * ```tsx
 * <Hero>
 *   <HeroMedia><Logo /></HeroMedia>
 *   <HeroEyebrow><Badge>v0.1</Badge></HeroEyebrow>
 *   <HeroTitle>Components with a <span className="text-primary-text">kernel</span> of contrast.</HeroTitle>
 *   <HeroDescription>…</HeroDescription>
 *   <HeroActions><Button size="lg">Get started</Button></HeroActions>
 * </Hero>
 * ```
 */
interface HeroProps extends Omit<React.ComponentProps<"section">, "children"> {
    children?: React.ReactNode;
    /**
     * `center` (default): one centered column. `split`: from `lg`, a `HeroBody` on the left and a
     * `HeroShowcase` on the right; below `lg` it falls back to the centered column and hides the showcase.
     */
    layout?: "center" | "split";
    /** Replaces the dot grid behind the content. `null` for none. */
    background?: React.ReactNode;
    /** Classes for the centered content column. */
    contentClassName?: string;
}

function Hero({className, contentClassName, background, layout = "center", children, ...props}: HeroProps) {
    return (
        <section
            data-slot="hero"
            data-layout={layout}
            className={cn("group/hero relative isolate overflow-hidden border-b border-border bg-muted/40", className)}
            {...props}
        >
            {background === undefined ? <HeroDots /> : background}
            <div
                className={cn(
                    "relative mx-auto flex w-full max-w-(--kk-site-width) flex-col items-center gap-5 px-4 py-10 text-center md:px-6 md:py-14",
                    layout === "split" && "lg:grid lg:grid-cols-2 lg:gap-12 lg:text-left",
                    contentClassName,
                )}
            >
                {children}
            </div>
        </section>
    );
}

/** The default backdrop: a faint 16px dot grid (12% foreground, so high contrast's bright borders don't
 * shout behind the title), masked to fade toward the edges. */
function HeroDots() {
    return (
        <div
            aria-hidden
            data-slot="hero-dots"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_12%,transparent)_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
    );
}

/** The brand mark or an illustration above the title. */
function HeroMedia({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "flex items-center justify-center [&_svg]:shrink-0",
                    "lg:group-data-[layout=split]/hero:justify-start",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "hero-media"},
    });
}

/** Badges above the title: version, status. */
function HeroEyebrow({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "flex flex-wrap items-center justify-center gap-2 lg:group-data-[layout=split]/hero:justify-start",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "hero-eyebrow"},
    });
}

/** The page's one h1. Put the key word in `text-primary-text`. */
function HeroTitle({className, render, ...props}: useRender.ComponentProps<"h1">) {
    return useRender({
        defaultTagName: "h1",
        props: mergeProps<"h1">(
            {
                className: cn(
                    "max-w-4xl font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl xl:text-6xl",
                    // half the width beside a showcase: one step smaller
                    "xl:group-data-[layout=split]/hero:text-5xl",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "hero-title"},
    });
}

/** One or two sentences on what it is and who it is for. */
function HeroDescription({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">(
            {className: cn("max-w-2xl text-base text-pretty text-muted-foreground md:text-lg", className)},
            props,
        ),
        render,
        state: {slot: "hero-description"},
    });
}

/** The calls to action: one primary (solid, size lg), at most one secondary (outline). */
function HeroActions({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "flex flex-wrap items-center justify-center gap-2 lg:group-data-[layout=split]/hero:justify-start",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "hero-actions"},
    });
}

/** Under the actions: an install command, a swatch strip. */
function HeroFooter({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "flex w-full flex-col items-center gap-3 lg:group-data-[layout=split]/hero:items-start",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "hero-footer"},
    });
}

/** The text column of a split hero: media, eyebrow, title, description, actions, footer. */
function HeroBody({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "flex w-full min-w-0 flex-col items-center gap-5 lg:group-data-[layout=split]/hero:items-start",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "hero-body"},
    });
}

/**
 * The right column of a split hero: a carousel, a demo, a screenshot. Hidden below `lg`, where the hero
 * is one centered column; give it a fixed height so heroes across the suite line up.
 */
function HeroShowcase({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn("hidden w-full min-w-0 text-left lg:block", className)}, props),
        render,
        state: {slot: "hero-showcase"},
    });
}

export {Hero, HeroActions, HeroBody, HeroDescription, HeroEyebrow, HeroFooter, HeroMedia, HeroShowcase, HeroTitle};
