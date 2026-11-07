"use client";

import {Checkbox as CheckboxPrimitive} from "@base-ui/react/checkbox";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {CheckIcon, MinusIcon} from "lucide-react";

/** Box classes, exported so a custom element can look like a checkbox. */
const checkboxVariants = cva([
    "group/checkbox peer relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-(--checkbox-radius) border border-input bg-transparent text-primary-foreground [--checkbox-radius:min(var(--radius-sm),var(--spacing))]",
    "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none bg-field",
    // 24px hit area around the 16px box (§4)
    "after:absolute after:-inset-x-3 after:-inset-y-2",
    focusRing,
    "hover:bg-field-hover",
    "data-checked:border-primary data-checked:bg-primary data-checked:hover:bg-primary/85",
    "data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:hover:bg-primary/85",
    "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
    "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:bg-field group-has-disabled/field:opacity-50",
    // inside a FieldLabel card the label shows focus, not the box
    "group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input group-has-[:focus-visible]/field-label:data-checked:border-primary",
]);

function Checkbox({className, ...props}: CheckboxPrimitive.Root.Props) {
    return (
        <CheckboxPrimitive.Root data-slot="checkbox" className={cn(checkboxVariants(), className)} {...props}>
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
            >
                <CheckIcon strokeWidth={3} className="group-data-indeterminate/checkbox:hidden" />
                <MinusIcon strokeWidth={3} className="hidden group-data-indeterminate/checkbox:block" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export {Checkbox, checkboxVariants};
