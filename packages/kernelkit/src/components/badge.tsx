"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {
    type Color,
    colorVariants,
    type FillVariant,
    type FillVariantAlias,
    resolveFill,
    TINTED_COLORS,
} from "kernelkit/lib/color";
import {focusRing} from "kernelkit/lib/recipes";

const badgeCva = cva(
    [
        "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-pill border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow]",
        "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
        focusRing,
    ],
    {
        variants: {
            color: colorVariants,
            variant: {
                solid: "bg-(--c-fill) text-(--c-fill-fg) [a]:hover:bg-(--c-fill)/85",
                soft: "bg-(--c)/12 text-(--c) dark:bg-(--c)/20 [a]:hover:bg-(--c)/20 dark:[a]:hover:bg-(--c)/30",
                outline: "border-border text-foreground [a]:hover:bg-hover",
                ghost: "text-foreground [a]:hover:bg-hover",
                link: "text-(--c) underline-offset-4 hover:underline",
            },
        },
        compoundVariants: [
            {
                variant: "solid",
                color: "neutral",
                class: "bg-secondary text-secondary-foreground hc:border-input [a]:hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]",
            },
            {variant: "soft", color: "neutral", class: "bg-(--c)/6 text-foreground dark:bg-(--c)/8"},
            {variant: "outline", color: [...TINTED_COLORS], class: "border-(--c)/40 text-(--c) [a]:hover:bg-(--c)/10"},
            {variant: "ghost", color: [...TINTED_COLORS], class: "text-(--c) [a]:hover:bg-(--c)/10"},
        ],
        defaultVariants: {variant: "solid", color: "primary"},
    },
);

/** Badge classes for any element. Accepts the shadcn aliases and default colors. */
function badgeVariants({
    variant,
    color,
    className,
}: {variant?: FillVariant | FillVariantAlias | null; color?: Color | null; className?: string} = {}) {
    return cn(badgeCva(resolveFill(variant, color)), className);
}

interface BadgeProps extends Omit<useRender.ComponentProps<"span">, "color"> {
    /** Fill style. `default` / `secondary` / `destructive` are shadcn aliases. */
    variant?: FillVariant | FillVariantAlias | null;
    /** Defaults to the variant's natural color: primary for solid/soft/link, neutral for outline/ghost. */
    color?: Color | null;
}

function Badge({className, variant, color, render, ...props}: BadgeProps) {
    const fill = resolveFill(variant, color);
    return useRender({
        defaultTagName: "span",
        props: mergeProps<"span">({className: cn(badgeCva(fill), className)}, props),
        render,
        state: {slot: "badge", variant: fill.variant, color: fill.color},
    });
}

export {Badge, badgeVariants};
export type {BadgeProps};
