"use client";

import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {Button} from "kernelkit/components/button";
import {Input} from "kernelkit/components/input";
import {Textarea} from "kernelkit/components/textarea";
import {fieldSurface} from "kernelkit/lib/recipes";
import * as React from "react";

const inputGroupVariants = cva(
    [
        fieldSurface,
        "group/input-group relative flex w-full min-w-0 items-center outline-none",
        // focus ring on the container while its control has focus (§6 composite controls)
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50",
        "has-aria-invalid:border-danger has-aria-invalid:ring-3 has-aria-invalid:ring-danger/20 dark:has-aria-invalid:ring-danger/40",
        "has-[[data-slot=input-group-control]:disabled]:bg-field-disabled has-[[data-slot=input-group-control]:disabled]:opacity-50 hc:has-[[data-slot=input-group-control]:disabled]:bg-transparent dark:hc:has-[[data-slot=input-group-control]:disabled]:bg-transparent",
        // inside a combobox popup the search field sits flush, no ring
        "in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0",
        // block addons stack above / below the control
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto",
        "has-[>[data-align=block-end]]:[&>input]:h-8 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:h-8 has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
    ],
    {
        variants: {
            size: {
                sm: "h-7 rounded-md text-[0.8rem]",
                default: "h-8",
                lg: "h-9",
            },
        },
        defaultVariants: {size: "default"},
    },
);

function InputGroup({
    className,
    size = "default",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupVariants>) {
    return (
        <div
            data-slot="input-group"
            data-size={size}
            role="group"
            className={cn(inputGroupVariants({size}), className)}
            {...props}
        />
    );
}

const inputGroupAddonVariants = cva(
    "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-has-[[data-slot=input-group-control]:disabled]/input-group:opacity-50 [&>kbd]:rounded-md [&>svg:not([class*='size-'])]:size-4 group-data-[size=sm]/input-group:text-[0.8rem] group-data-[size=sm]/input-group:[&>svg:not([class*='size-'])]:size-3.5",
    {
        variants: {
            align: {
                "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
                "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
                "block-start":
                    "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
                "block-end":
                    "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
            },
        },
        defaultVariants: {
            align: "inline-start",
        },
    },
);

function InputGroupAddon({
    className,
    align = "inline-start",
    onClick,
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
    return (
        <div
            role="group"
            data-slot="input-group-addon"
            data-align={align}
            className={cn(inputGroupAddonVariants({align}), className)}
            onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented || (e.target as HTMLElement).closest("button")) {
                    return;
                }
                e.currentTarget.parentElement?.querySelector<HTMLElement>("[data-slot=input-group-control]")?.focus();
            }}
            {...props}
        />
    );
}

const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
    variants: {
        size: {
            xs: "h-6 gap-1 rounded-md px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
            sm: "",
            "icon-xs": "size-6 rounded-md p-0 has-[>svg]:p-0",
            "icon-sm": "size-8 p-0 has-[>svg]:p-0",
        },
    },
    defaultVariants: {
        size: "xs",
    },
});

function InputGroupButton({
    className,
    type = "button",
    variant = "ghost",
    size = "xs",
    ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
    VariantProps<typeof inputGroupButtonVariants> & {
        type?: "button" | "submit" | "reset";
    }) {
    return (
        <Button
            type={type}
            data-size={size}
            variant={variant}
            className={cn(
                inputGroupButtonVariants({size}),
                // a small group gets a smaller button so it keeps a 2px inset
                "group-data-[size=sm]/input-group:data-[size=icon-xs]:size-5 group-data-[size=sm]/input-group:data-[size=icon-xs]:rounded-sm group-data-[size=sm]/input-group:data-[size=xs]:h-5 group-data-[size=sm]/input-group:data-[size=xs]:rounded-sm",
                className,
            )}
            {...props}
        />
    );
}

function InputGroupText({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="input-group-text"
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground group-data-[size=sm]/input-group:text-[0.8rem] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function InputGroupInput({className, ...props}: React.ComponentProps<typeof Input>) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn(
                "h-full flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
                "group-data-[size=sm]/input-group:px-2 group-data-[size=sm]/input-group:md:text-[0.8rem] group-data-[size=lg]/input-group:px-3",
                className,
            )}
            {...props}
        />
    );
}

function InputGroupTextarea({className, ...props}: React.ComponentProps<"textarea">) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn(
                "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
                className,
            )}
            {...props}
        />
    );
}

export {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    inputGroupButtonVariants,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
    inputGroupVariants,
};
