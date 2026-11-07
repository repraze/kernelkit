"use client";

import {fieldSurface, focusRing, invalidRing} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {ChevronDownIcon} from "lucide-react";
import * as React from "react";

const nativeSelectVariants = cva(
    [
        fieldSurface,
        focusRing,
        invalidRing,
        "w-full min-w-0 appearance-none py-0 pr-8 pl-2.5 text-sm outline-none select-none hover:bg-field-hover disabled:pointer-events-none",
    ],
    {
        variants: {
            size: {
                sm: "h-7 rounded-md pr-7 text-[0.8rem]",
                default: "h-8",
                lg: "h-9 pl-3 pr-9",
            },
        },
        defaultVariants: {size: "default"},
    },
);

type NativeSelectProps = Omit<React.ComponentProps<"select">, "size"> & {
    size?: "sm" | "default" | "lg";
};

/** A styled `<select>`: the platform picker, for long lists on mobile or forms without JS. */
function NativeSelect({className, size = "default", ...props}: NativeSelectProps) {
    return (
        <div
            className={cn("group/native-select relative w-fit has-[select:disabled]:opacity-50", className)}
            data-slot="native-select-wrapper"
            data-size={size}
        >
            <select
                data-slot="native-select"
                data-size={size}
                className={cn(nativeSelectVariants({size}), "disabled:opacity-100")}
                {...props}
            />
            <ChevronDownIcon
                className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground select-none group-data-[size=lg]/native-select:right-2.5 group-data-[size=sm]/native-select:right-1.5 group-data-[size=sm]/native-select:size-3.5"
                aria-hidden="true"
                data-slot="native-select-icon"
            />
        </div>
    );
}

function NativeSelectOption({className, ...props}: React.ComponentProps<"option">) {
    return (
        <option
            data-slot="native-select-option"
            className={cn("bg-popover text-popover-foreground", className)}
            {...props}
        />
    );
}

function NativeSelectOptGroup({className, ...props}: React.ComponentProps<"optgroup">) {
    return (
        <optgroup
            data-slot="native-select-optgroup"
            className={cn("bg-popover text-popover-foreground", className)}
            {...props}
        />
    );
}

export {NativeSelect, NativeSelectOptGroup, NativeSelectOption, nativeSelectVariants};
export type {NativeSelectProps};
