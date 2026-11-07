"use client";

import {Tabs as TabsPrimitive} from "@base-ui/react/tabs";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";

function Tabs({className, orientation = "horizontal", ...props}: TabsPrimitive.Root.Props) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            orientation={orientation}
            className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
            {...props}
        />
    );
}

/**
 * `default`: a tray with the active tab raised on a bordered surface (the border keeps it readable in
 * high contrast). `line`: a baseline with a 2px primary indicator under the active tab.
 * Sizes follow the control table (GUIDELINES §4) so a tabs list lines up with buttons and inputs.
 */
const tabsListVariants = cva(
    "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground data-vertical:h-fit data-vertical:flex-col data-vertical:items-stretch",
    {
        variants: {
            variant: {
                default: "rounded-lg border border-transparent bg-muted p-[3px] data-vertical:gap-0.5 hc:border-border",
                line: "gap-1 rounded-none border-border bg-transparent data-horizontal:border-b data-horizontal:py-[3px] data-vertical:border-r data-vertical:px-[3px]",
            },
            size: {
                sm: "data-horizontal:h-7",
                default: "data-horizontal:h-8",
                lg: "data-horizontal:h-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function TabsList({
    className,
    variant = "default",
    size = "default",
    ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            data-size={size}
            className={cn(tabsListVariants({variant, size}), className)}
            {...props}
        />
    );
}

const tabsTriggerClass = cn(
    "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-sm font-medium whitespace-nowrap text-muted-foreground select-none",
    "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
    focusRing,
    "hover:text-foreground not-data-active:hover:bg-hover",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
    "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // sizes, read from the list
    "group-data-[size=sm]/tabs-list:gap-1 group-data-[size=sm]/tabs-list:px-1.5 group-data-[size=sm]/tabs-list:text-[0.8rem] group-data-[size=sm]/tabs-list:[&_svg:not([class*='size-'])]:size-3.5",
    "group-data-[size=lg]/tabs-list:gap-2 group-data-[size=lg]/tabs-list:px-2.5",
    // vertical: full-width rows
    "data-vertical:w-full data-vertical:flex-none data-vertical:justify-start data-vertical:py-1",
    // default: raised, bordered surface + foreground text (readable without the shade in hc)
    "data-active:text-foreground",
    "group-data-[variant=default]/tabs-list:data-active:border-input group-data-[variant=default]/tabs-list:data-active:bg-background group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=default]/tabs-list:data-active:shadow-(color:--shadow-color) dark:group-data-[variant=default]/tabs-list:data-active:bg-input/30",
    // line: 2px primary indicator over the list's baseline
    "after:pointer-events-none after:absolute after:rounded-pill after:bg-primary after:opacity-0 after:transition-opacity group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
    "data-horizontal:after:inset-x-1 data-horizontal:after:-bottom-1 data-horizontal:after:h-0.5",
    "data-vertical:after:inset-y-1 data-vertical:after:-right-1 data-vertical:after:w-0.5",
);

function TabsTrigger({className, ...props}: TabsPrimitive.Tab.Props) {
    return <TabsPrimitive.Tab data-slot="tabs-trigger" className={cn(tabsTriggerClass, className)} {...props} />;
}

function TabsContent({className, ...props}: TabsPrimitive.Panel.Props) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn("flex-1 rounded-md text-sm", focusRing, className)}
            {...props}
        />
    );
}

export {Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger, tabsTriggerClass};
