"use client";

import {Input as InputPrimitive} from "@base-ui/react/input";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {fieldSurface, focusRing, invalidRing} from "kernelkit/lib/recipes";
import * as React from "react";

const inputVariants = cva(
    [
        fieldSurface,
        focusRing,
        invalidRing,
        "w-full min-w-0 py-1 text-base md:text-sm",
        "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
    ],
    {
        variants: {
            // Same heights as Button / Select / Tabs (GUIDELINES.md §4) so mixed rows line up.
            size: {
                sm: "h-7 rounded-md px-2 file:h-5 md:text-[0.8rem]",
                default: "h-8 px-2.5 file:h-6",
                lg: "h-9 px-3 file:h-7",
            },
        },
        defaultVariants: {size: "default"},
    },
);

interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
    size?: "sm" | "default" | "lg";
    /** Native `size` attribute (character width), renamed since `size` is the control size. */
    htmlSize?: number;
}

function Input({className, type, size = "default", htmlSize, ...props}: InputProps) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            data-size={size}
            size={htmlSize}
            className={cn(inputVariants({size}), className)}
            {...props}
        />
    );
}

export {Input, inputVariants};
export type {InputProps};
