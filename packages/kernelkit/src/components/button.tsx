"use client";

import {Button as ButtonPrimitive} from "@base-ui/react/button";
import {
    type Color,
    colorVariants,
    type FillVariant,
    type FillVariantAlias,
    resolveFill,
    TINTED_COLORS,
} from "@repraze/kernelkit/lib/color";
import {focusRing, invalidRing} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";

const buttonCva = cva(
    [
        "group/button relative inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap select-none",
        "transition-[color,background-color,border-color,box-shadow,translate] duration-100 active:not-aria-[haspopup]:translate-y-px motion-reduce:transition-none",
        "disabled:pointer-events-none disabled:opacity-50 aria-busy:pointer-events-none",
        focusRing,
        invalidRing,
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    {
        variants: {
            color: colorVariants,
            variant: {
                solid: "bg-(--c-fill) text-(--c-fill-fg) hover:bg-(--c-fill)/85 aria-expanded:bg-(--c-fill)/85",
                soft: "bg-(--c)/12 text-(--c) hover:bg-(--c)/20 aria-expanded:bg-(--c)/20 dark:bg-(--c)/20 dark:hover:bg-(--c)/30",
                outline: "border-input bg-field hover:bg-field-hover aria-expanded:bg-field-hover",
                ghost: "text-foreground hover:bg-hover aria-expanded:bg-hover",
                link: "text-(--c) underline-offset-4 hover:underline",
            },
            size: {
                default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                xs: "h-6 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
                sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                lg: "h-9 gap-2 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
                icon: "size-8",
                "icon-xs":
                    "size-6 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
                "icon-sm":
                    "size-7 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
                "icon-lg": "size-9",
            },
        },
        compoundVariants: [
            // neutral solid is the shadcn "secondary" button: a quiet surface, not a foreground fill
            {
                variant: "solid",
                color: "neutral",
                class: "bg-secondary text-secondary-foreground hc:border-input hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] aria-expanded:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)]",
            },
            // neutral soft sits below neutral solid in the hierarchy: a faint wash, not a darker grey
            {
                variant: "soft",
                color: "neutral",
                class: "bg-(--c)/6 text-foreground hover:bg-(--c)/10 aria-expanded:bg-(--c)/10 dark:bg-(--c)/8 dark:hover:bg-(--c)/12",
            },
            // tinted outline / ghost: hue border and text over the neutral chrome
            {
                variant: "outline",
                color: [...TINTED_COLORS],
                class: "border-(--c)/40 bg-transparent text-(--c) hover:bg-(--c)/10 aria-expanded:bg-(--c)/10",
            },
            {
                variant: "ghost",
                color: [...TINTED_COLORS],
                class: "text-(--c) hover:bg-(--c)/10 aria-expanded:bg-(--c)/10",
            },
        ],
        defaultVariants: {
            variant: "solid",
            color: "primary",
            size: "default",
        },
    },
);

type ButtonSize = NonNullable<Parameters<typeof buttonCva>[0]>["size"];

/** Button classes for any element (links, triggers…). Accepts the shadcn aliases and default colors. */
function buttonVariants({
    variant,
    color,
    size,
    className,
}: {
    variant?: FillVariant | FillVariantAlias | null;
    color?: Color | null;
    size?: ButtonSize;
    className?: string;
} = {}) {
    return cn(buttonCva({...resolveFill(variant, color), size}), className);
}

interface ButtonProps extends Omit<ButtonPrimitive.Props, "color"> {
    /** Fill style. `default` / `secondary` / `destructive` are shadcn aliases. */
    variant?: FillVariant | FillVariantAlias | null;
    /** Defaults to the variant's natural color: primary for solid/soft/link, neutral for outline/ghost. */
    color?: Color | null;
    size?: ButtonSize;
}

function Button({className, variant, color, size = "default", nativeButton, render, ...props}: ButtonProps) {
    const fill = resolveFill(variant, color);
    return (
        <ButtonPrimitive
            data-slot="button"
            data-variant={fill.variant}
            data-color={fill.color}
            data-size={size}
            className={cn(buttonCva({...fill, size}), className)}
            // A `render` element is usually a link: let Base UI drop button semantics for it.
            nativeButton={nativeButton ?? render === undefined}
            render={render}
            {...props}
        />
    );
}

export {Button, buttonVariants};
export type {ButtonProps};
