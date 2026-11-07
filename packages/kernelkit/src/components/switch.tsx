"use client";

import {Switch as SwitchPrimitive} from "@base-ui/react/switch";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";

/**
 * Track classes. The track is border-box with a 1px border, so the thumb sits 1px inside it and travels
 * (width - height) when checked.
 */
const switchVariants = cva(
    [
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-pill border px-px",
        "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        focusRing,
        "data-unchecked:border-input data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-unchecked:hover:bg-[color-mix(in_oklch,var(--input),var(--foreground)_15%)] dark:data-unchecked:hover:bg-[color-mix(in_oklch,var(--input),var(--foreground)_15%)]", // lint-design-ignore: paired dark:hover below
        "data-checked:border-primary data-checked:bg-primary data-checked:hover:border-primary/85 data-checked:hover:bg-primary/85",
        "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:pointer-events-none",
        "group-has-[:focus-visible]/field-label:ring-0",
    ],
    {
        variants: {
            size: {
                sm: "h-4 w-7",
                default: "h-5 w-9",
                lg: "h-6 w-11",
            },
        },
        defaultVariants: {size: "default"},
    },
);

const switchThumbVariants = cva(
    [
        "pointer-events-none block rounded-pill shadow-sm shadow-(color:--shadow-color) ring-0 transition-[translate,background-color] duration-100 motion-reduce:transition-none",
        "data-unchecked:translate-x-0 data-unchecked:bg-background dark:data-unchecked:bg-foreground", // lint-design-ignore: thumb has no hover state
        "data-checked:bg-primary-foreground",
    ],
    {
        variants: {
            size: {
                sm: "size-3 data-checked:translate-x-3",
                default: "size-4 data-checked:translate-x-4",
                lg: "size-5 data-checked:translate-x-5",
            },
        },
        defaultVariants: {size: "default"},
    },
);

type SwitchProps = SwitchPrimitive.Root.Props & VariantProps<typeof switchVariants>;

function Switch({className, size = "default", ...props}: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(switchVariants({size}), className)}
            {...props}
        >
            <SwitchPrimitive.Thumb data-slot="switch-thumb" className={switchThumbVariants({size})} />
        </SwitchPrimitive.Root>
    );
}

export {Switch, switchThumbVariants, switchVariants};
export type {SwitchProps};
