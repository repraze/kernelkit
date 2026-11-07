"use client";

import {NumberField as NumberFieldPrimitive} from "@base-ui/react/number-field";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {fieldSurface} from "kernelkit/lib/recipes";
import {MinusIcon, MoveHorizontalIcon, PlusIcon} from "lucide-react";

function NumberField({className, ...props}: NumberFieldPrimitive.Root.Props) {
    return (
        <NumberFieldPrimitive.Root
            data-slot="number-field"
            className={cn("group/number-field flex w-full flex-col gap-2", className)}
            {...props}
        />
    );
}

/** The field look: one bordered surface holding the input and both steppers (§4, §6). */
const numberFieldGroupVariants = cva(
    [
        fieldSurface,
        "group/number-field-group relative flex w-full min-w-0 items-center",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50",
        "data-invalid:border-danger data-invalid:ring-3 data-invalid:ring-danger/20 has-aria-invalid:border-danger has-aria-invalid:ring-3 has-aria-invalid:ring-danger/20 dark:data-invalid:ring-danger/40 dark:has-aria-invalid:ring-danger/40",
        "data-disabled:cursor-not-allowed data-disabled:bg-field-disabled data-disabled:opacity-50",
    ],
    {
        variants: {
            size: {
                sm: "h-7 gap-0.5 rounded-md pr-0.5",
                default: "h-8 gap-0.5 pr-1",
                lg: "h-9 gap-1 pr-1",
            },
        },
        defaultVariants: {size: "default"},
    },
);

function NumberFieldGroup({
    className,
    size = "default",
    ...props
}: NumberFieldPrimitive.Group.Props & VariantProps<typeof numberFieldGroupVariants>) {
    return (
        <NumberFieldPrimitive.Group
            data-slot="number-field-group"
            data-size={size}
            className={cn(numberFieldGroupVariants({size}), className)}
            {...props}
        />
    );
}

function NumberFieldInput({className, ...props}: NumberFieldPrimitive.Input.Props) {
    return (
        <NumberFieldPrimitive.Input
            data-slot="number-field-input"
            className={cn(
                "h-full w-full min-w-0 flex-1 bg-transparent px-2.5 text-base tabular-nums outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
                "group-data-[size=sm]/number-field-group:md:text-[0.8rem] group-data-[size=lg]/number-field-group:px-3",
                className,
            )}
            {...props}
        />
    );
}

const stepper =
    "flex shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color] select-none hover:bg-hover hover:text-foreground active:bg-hover disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 group-data-disabled/number-field-group:opacity-100 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 size-6 group-data-[size=sm]/number-field-group:size-5 group-data-[size=sm]/number-field-group:rounded-sm group-data-[size=sm]/number-field-group:[&_svg:not([class*='size-'])]:size-3";

function NumberFieldDecrement({className, children, ...props}: NumberFieldPrimitive.Decrement.Props) {
    return (
        <NumberFieldPrimitive.Decrement
            data-slot="number-field-decrement"
            aria-label="Decrease"
            className={cn(stepper, className)}
            {...props}
        >
            {children ?? <MinusIcon />}
        </NumberFieldPrimitive.Decrement>
    );
}

function NumberFieldIncrement({className, children, ...props}: NumberFieldPrimitive.Increment.Props) {
    return (
        <NumberFieldPrimitive.Increment
            data-slot="number-field-increment"
            aria-label="Increase"
            className={cn(stepper, className)}
            {...props}
        >
            {children ?? <PlusIcon />}
        </NumberFieldPrimitive.Increment>
    );
}

/** Drag horizontally over its children (usually the label) to change the value. */
function NumberFieldScrubArea({className, children, ...props}: NumberFieldPrimitive.ScrubArea.Props) {
    return (
        <NumberFieldPrimitive.ScrubArea
            data-slot="number-field-scrub-area"
            className={cn("flex w-fit cursor-ew-resize items-center gap-2 select-none *:cursor-ew-resize", className)}
            {...props}
        >
            {children}
            <NumberFieldScrubAreaCursor />
        </NumberFieldPrimitive.ScrubArea>
    );
}

function NumberFieldScrubAreaCursor({className, children, ...props}: NumberFieldPrimitive.ScrubAreaCursor.Props) {
    return (
        <NumberFieldPrimitive.ScrubAreaCursor
            data-slot="number-field-scrub-area-cursor"
            className={cn("text-foreground drop-shadow-sm", className)}
            {...props}
        >
            {children ?? <MoveHorizontalIcon className="size-5" />}
        </NumberFieldPrimitive.ScrubAreaCursor>
    );
}

export {
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    numberFieldGroupVariants,
    NumberFieldIncrement,
    NumberFieldInput,
    NumberFieldScrubArea,
    NumberFieldScrubAreaCursor,
};
