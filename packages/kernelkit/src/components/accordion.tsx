"use client";

import {Accordion as AccordionPrimitive} from "@base-ui/react/accordion";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {ChevronDownIcon} from "lucide-react";

/** `default`: rows split by lines. `outline`: the same rows inside a bordered `rounded-xl` panel. */
const accordionVariants = cva("group/accordion flex w-full flex-col", {
    variants: {
        variant: {
            default: "",
            outline: "overflow-hidden rounded-xl border border-border bg-card",
        },
    },
    defaultVariants: {variant: "default"},
});

function Accordion({
    className,
    variant = "default",
    ...props
}: AccordionPrimitive.Root.Props & {variant?: "default" | "outline"}) {
    return (
        <AccordionPrimitive.Root
            data-slot="accordion"
            data-variant={variant}
            className={cn(accordionVariants({variant}), className)}
            {...props}
        />
    );
}

function AccordionItem({className, ...props}: AccordionPrimitive.Item.Props) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn("not-last:border-b not-last:border-border", className)}
            {...props}
        />
    );
}

function AccordionTrigger({className, children, ...props}: AccordionPrimitive.Trigger.Props) {
    return (
        <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    focusRing,
                    "group/accordion-trigger relative flex flex-1 items-center justify-between gap-2 rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-100",
                    "hover:underline hover:underline-offset-4 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
                    // outline variant: full-width rows with a hover wash instead of an underline
                    "group-data-[variant=outline]/accordion:rounded-none group-data-[variant=outline]/accordion:px-4 group-data-[variant=outline]/accordion:hover:bg-hover group-data-[variant=outline]/accordion:hover:no-underline group-data-[variant=outline]/accordion:focus-visible:ring-inset",
                    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                    className,
                )}
                {...props}
            >
                {children}
                <ChevronDownIcon
                    data-slot="accordion-trigger-icon"
                    className="ml-auto text-muted-foreground transition-transform duration-150 group-aria-expanded/accordion-trigger:rotate-180 motion-reduce:transition-none"
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({className, children, ...props}: AccordionPrimitive.Panel.Props) {
    return (
        <AccordionPrimitive.Panel
            data-slot="accordion-content"
            className="h-(--accordion-panel-height) overflow-hidden text-sm text-muted-foreground transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
            {...props}
        >
            <div
                data-slot="accordion-content-inner"
                className={cn(
                    "pt-0 pb-2.5 group-data-[variant=outline]/accordion:px-4 group-data-[variant=outline]/accordion:pb-4",
                    "[&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
                    className,
                )}
            >
                {children}
            </div>
        </AccordionPrimitive.Panel>
    );
}

export {Accordion, AccordionContent, AccordionItem, AccordionTrigger, accordionVariants};
