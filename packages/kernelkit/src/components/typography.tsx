"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {focusRing} from "kernelkit/lib/recipes";
import {LinkIcon} from "lucide-react";

/**
 * Prose primitives. Every part renders a sensible default tag and takes `render` to swap it
 * (`<Title size={2} render={<h2 />}>`), so visual size and document outline stay independent.
 */

const titleVariants = cva("block leading-[1.125] text-balance wrap-break-word", {
    variants: {
        variant: {
            title: "font-heading font-semibold text-foreground",
            subtitle: "font-normal text-muted-foreground",
        },
        size: {
            1: "text-4xl tracking-[-0.04em] md:text-5xl",
            2: "text-[2rem] tracking-[-0.031em]",
            3: "text-2xl tracking-[-0.025em]",
            4: "text-[1.2rem] tracking-[-0.02em]",
            5: "text-base tracking-[-0.01em]",
            6: "text-sm",
        },
    },
    defaultVariants: {variant: "title", size: 1},
});

type TitleProps = useRender.ComponentProps<"p"> & VariantProps<typeof titleVariants>;

/** Heading text. `size` 1-6 is visual only: pick the element with `render` (`<h1 />`…). */
function Title({className, variant, size, render, ...props}: TitleProps) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">({className: cn(titleVariants({variant, size}), className)}, props),
        render,
        state: {slot: "title", variant: variant ?? "title", size: size ?? 1},
    });
}

/** Trailing `#` link for a heading: `<Title render={<h2 id="install" />}>Install <TitleAnchor href="#install" /></Title>`. */
function TitleAnchor({className, render, children, ...props}: useRender.ComponentProps<"a">) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                "aria-label": "Link to this section",
                className: cn(
                    "ml-2 inline-flex rounded-sm align-middle text-muted-foreground opacity-60 transition-[color,opacity,box-shadow] hover:text-foreground hover:opacity-100 focus-visible:opacity-100 [&_svg]:size-[0.5em]",
                    focusRing,
                    className,
                ),
                children: children ?? <LinkIcon aria-hidden />,
            },
            props,
        ),
        render,
        state: {slot: "title-anchor"},
    });
}

/** Small heading for sidebars, tables of contents and aside panels. */
function AsideTitle({className, render, ...props}: useRender.ComponentProps<"span">) {
    return useRender({
        defaultTagName: "span",
        props: mergeProps<"span">(
            {
                className: cn(
                    "mb-2 block py-2 font-heading text-sm leading-[1.125] font-semibold text-balance wrap-break-word",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "aside-title"},
    });
}

/** Quiet inline link: muted until hovered. For links in running prose use `variant="prose"`. */
const textLinkVariants = cva(["rounded-xs transition-[color,box-shadow]", focusRing], {
    variants: {
        variant: {
            muted: "text-muted-foreground hover:text-foreground",
            prose: "font-medium text-primary-text underline underline-offset-4 hover:decoration-2",
        },
    },
    defaultVariants: {variant: "muted"},
});

function TextLink({
    className,
    variant,
    render,
    ...props
}: useRender.ComponentProps<"a"> & VariantProps<typeof textLinkVariants>) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">({className: cn(textLinkVariants({variant}), className)}, props),
        render,
        state: {slot: "text-link"},
    });
}

/** Body paragraph: `text-sm` reading size with relaxed leading. */
function Text({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">({className: cn("text-sm leading-relaxed text-foreground", className)}, props),
        render,
        state: {slot: "text"},
    });
}

/** Intro paragraph under a page title. */
function Lead({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">(
            {className: cn("text-base leading-relaxed text-pretty text-muted-foreground md:text-lg", className)},
            props,
        ),
        render,
        state: {slot: "lead"},
    });
}

/** Secondary text: captions, meta, hints. */
function Muted({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">({className: cn("text-xs text-muted-foreground", className)}, props),
        render,
        state: {slot: "muted"},
    });
}

/** Inline code span inside prose. */
function InlineCode({className, render, ...props}: useRender.ComponentProps<"code">) {
    return useRender({
        defaultTagName: "code",
        props: mergeProps<"code">(
            {
                className: cn(
                    "rounded-sm border border-border bg-muted px-[0.3em] py-[0.1em] font-mono text-[0.875em] text-foreground",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "inline-code"},
    });
}

/** Quotation with a left rule. */
function Blockquote({className, render, ...props}: useRender.ComponentProps<"blockquote">) {
    return useRender({
        defaultTagName: "blockquote",
        props: mergeProps<"blockquote">(
            {className: cn("border-l-2 border-border pl-4 text-sm text-muted-foreground italic", className)},
            props,
        ),
        render,
        state: {slot: "blockquote"},
    });
}

/** Bulleted list (`render={<ol />}` + `className="list-decimal"` for numbered). */
function List({className, render, ...props}: useRender.ComponentProps<"ul">) {
    return useRender({
        defaultTagName: "ul",
        props: mergeProps<"ul">(
            {
                className: cn(
                    "ml-5 flex list-disc flex-col gap-1 text-sm leading-relaxed marker:text-muted-foreground",
                    className,
                ),
            },
            props,
        ),
        render,
        state: {slot: "list"},
    });
}

export {
    AsideTitle,
    Blockquote,
    InlineCode,
    Lead,
    List,
    Muted,
    Text,
    TextLink,
    textLinkVariants,
    Title,
    TitleAnchor,
    titleVariants,
};
export type {TitleProps};
