"use client";

import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {Loader2Icon} from "lucide-react";

/** Sizes follow the icon column of §4 so a spinner can replace an icon in place. */
const spinnerVariants = cva(
    // reduced motion: slow the spin down rather than freeze it, a frozen spinner reads as a glyph
    "shrink-0 animate-spin text-current motion-reduce:[animation-duration:2.5s]",
    {
        variants: {
            size: {
                xs: "size-3",
                sm: "size-3.5",
                default: "size-4",
                lg: "size-5",
                xl: "size-6",
            },
        },
        defaultVariants: {size: "default"},
    },
);

interface SpinnerProps extends React.ComponentProps<"svg">, VariantProps<typeof spinnerVariants> {}

/** Indeterminate loading indicator. Inherits `currentColor`; announces itself as a status. */
function Spinner({className, size, ...props}: SpinnerProps) {
    return (
        <Loader2Icon
            data-slot="spinner"
            data-size={size ?? "default"}
            role="status"
            aria-label="Loading"
            className={cn(spinnerVariants({size}), className)}
            {...props}
        />
    );
}

export {Spinner, spinnerVariants};
export type {SpinnerProps};
