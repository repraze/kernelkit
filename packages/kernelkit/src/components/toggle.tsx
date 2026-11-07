"use client";

import {Toggle as TogglePrimitive} from "@base-ui/react/toggle";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {focusRing, invalidRing} from "kernelkit/lib/recipes";

/**
 * Padding is chosen so an icon-only toggle is square at its height (§4); text-only toggles (no svg)
 * get the regular control padding back.
 */
const toggleVariants = cva(
    [
        "group/toggle inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap select-none",
        "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
        "hover:bg-hover hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
        focusRing,
        invalidRing,
        // on: accent tint fill + accent text (§6: a fill, never shade alone)
        "data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:hover:bg-[color-mix(in_oklch,var(--accent),var(--foreground)_8%)]",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ],
    {
        variants: {
            variant: {
                default: "bg-transparent",
                outline: "border-input bg-transparent data-pressed:border-primary",
            },
            size: {
                xs: "h-6 min-w-6 gap-1 rounded-md px-1 text-xs not-has-[svg]:px-2 has-data-[icon=inline-end]:pl-2 has-data-[icon=inline-start]:pr-2 [&_svg:not([class*='size-'])]:size-3",
                sm: "h-7 min-w-7 gap-1 rounded-md px-1.5 text-[0.8rem] not-has-[svg]:px-2.5 has-data-[icon=inline-end]:pl-2.5 has-data-[icon=inline-start]:pr-2.5 [&_svg:not([class*='size-'])]:size-3.5",
                default:
                    "h-8 min-w-8 px-2 not-has-[svg]:px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-end]:pl-2.5 has-data-[icon=inline-start]:pr-2.5 has-data-[icon=inline-start]:pl-2",
                lg: "h-9 min-w-9 gap-2 px-2.5 not-has-[svg]:px-3 has-data-[icon=inline-end]:pl-3 has-data-[icon=inline-start]:pr-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

type ToggleProps = TogglePrimitive.Props & VariantProps<typeof toggleVariants>;

function Toggle({className, variant = "default", size = "default", ...props}: ToggleProps) {
    return (
        <TogglePrimitive
            data-slot="toggle"
            data-variant={variant}
            data-size={size}
            className={cn(toggleVariants({variant, size}), className)}
            {...props}
        />
    );
}

export {Toggle, toggleVariants};
export type {ToggleProps};
