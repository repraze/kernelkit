"use client";

import {Radio as RadioPrimitive} from "@base-ui/react/radio";
import {RadioGroup as RadioGroupPrimitive} from "@base-ui/react/radio-group";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {focusRing} from "kernelkit/lib/recipes";

/** Radio classes, exported so a custom element can look like a radio. */
const radioGroupItemVariants = cva([
    "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 cursor-pointer items-center justify-center rounded-pill border border-input bg-transparent",
    "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none bg-field",
    "after:absolute after:-inset-x-3 after:-inset-y-2",
    focusRing,
    "hover:bg-field-hover",
    "data-checked:border-primary data-checked:bg-primary data-checked:hover:bg-primary/85",
    "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-field group-has-disabled/field:opacity-50",
    "group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input group-has-[:focus-visible]/field-label:data-checked:border-primary",
]);

function RadioGroup({className, ...props}: RadioGroupPrimitive.Props) {
    return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid w-full gap-2", className)} {...props} />;
}

function RadioGroupItem({className, ...props}: RadioPrimitive.Root.Props) {
    return (
        <RadioPrimitive.Root
            data-slot="radio-group-item"
            className={cn(radioGroupItemVariants(), className)}
            {...props}
        >
            <RadioPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="flex items-center justify-center data-unchecked:hidden"
            >
                <span className="size-1.5 rounded-pill bg-primary-foreground" />
            </RadioPrimitive.Indicator>
        </RadioPrimitive.Root>
    );
}

export {RadioGroup, RadioGroupItem, radioGroupItemVariants};
