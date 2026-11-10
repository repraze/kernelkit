"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";

/**
 * A landing-page section: a header (title, description, and its call to action on the right) over
 * content. Sections stack inside a SiteContainer; every section ends in somewhere to go next.
 *
 * ```tsx
 * <Section>
 *   <SectionHeader>
 *     <SectionTitle>Ports</SectionTitle>
 *     <SectionDescription>…</SectionDescription>
 *     <SectionAction><Button variant="ghost">All ports <ArrowRightIcon /></Button></SectionAction>
 *   </SectionHeader>
 *   …content…
 * </Section>
 * ```
 */
/** A titled block of a landing page. */
function Section({className, render, ...props}: useRender.ComponentProps<"section">) {
    return useRender({
        defaultTagName: "section",
        props: mergeProps<"section">(
            {className: cn("flex scroll-mt-24 flex-col gap-6 py-12 md:py-16", className)},
            props,
        ),
        render,
        state: {slot: "section"},
    });
}

/** Title and description on the left, the section's action bottom-right (below on phones). */
function SectionHeader({className, render, ...props}: useRender.ComponentProps<"header">) {
    return useRender({
        defaultTagName: "header",
        props: mergeProps<"header">(
            {className: cn("grid gap-x-6 gap-y-2 sm:grid-cols-[1fr_auto] sm:items-end", className)},
            props,
        ),
        render,
        state: {slot: "section-header"},
    });
}

/** A short mono label above the title. */
function SectionEyebrow({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {className: cn("font-alt text-xs font-medium text-primary-text uppercase sm:col-start-1", className)},
            props,
        ),
        render,
        state: {slot: "section-eyebrow"},
    });
}

/** The section's h2. */
function SectionTitle({className, render, ...props}: useRender.ComponentProps<"h2">) {
    return useRender({
        defaultTagName: "h2",
        props: mergeProps<"h2">(
            {
                className: cn(
                    "font-heading text-2xl font-semibold tracking-tight text-balance sm:col-start-1 md:text-3xl",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "section-title"},
    });
}

/** What the section shows, in a sentence. */
function SectionDescription({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">(
            {className: cn("max-w-2xl text-pretty text-muted-foreground sm:col-start-1", className)},
            props,
        ),
        render,
        state: {slot: "section-description"},
    });
}

/** Where to go next: usually a ghost or outline Button with a trailing arrow. */
function SectionAction({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                className: cn(
                    "flex items-center gap-2 sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:self-end",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "section-action"},
    });
}

export {Section, SectionAction, SectionDescription, SectionEyebrow, SectionHeader, SectionTitle};
