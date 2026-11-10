"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repraze/kernelkit/components/dialog";
import {fieldSurface, listSeparator, rowIndicator} from "@repraze/kernelkit/lib/recipes";
import {Command as CommandPrimitive} from "cmdk";
import {cn} from "cn";
import {CheckIcon, SearchIcon} from "lucide-react";
import * as React from "react";

/**
 * cmdk renders `data-selected` / `data-disabled` as "true" | "false", so the `listItem` recipe (which keys on
 * attribute presence) can't be used as is: this is the same row, keyed on `=true`.
 */
const commandItemClass = `${rowIndicator} data-[selected=true]:after:opacity-100 group/command-item relative flex min-h-8 cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[selected=true]:[&_svg:not([class*='text-'])]:text-accent-foreground`;

function Command({className, ...props}: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive
            data-slot="command"
            className={cn(
                "flex size-full flex-col overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground",
                // inside CommandDialog the dialog is the surface
                "in-data-[slot=dialog-content]:rounded-none in-data-[slot=dialog-content]:border-0",
                className,
            )}
            {...props}
        />
    );
}

function CommandDialog({
    title = "Command palette",
    description = "Search for a command to run…",
    children,
    className,
    showCloseButton = false,
    initialFocus,
    finalFocus,
    ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> &
    Pick<React.ComponentProps<typeof DialogContent>, "initialFocus" | "finalFocus"> & {
        title?: string;
        description?: string;
        className?: string;
        showCloseButton?: boolean;
        children: React.ReactNode;
    }) {
    return (
        <Dialog {...props}>
            <DialogContent
                data-slot="command-dialog"
                className={cn("top-1/4 translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg", className)}
                showCloseButton={showCloseButton}
                // where focus goes on open/close (e.g. the search input)
                initialFocus={initialFocus}
                finalFocus={finalFocus}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}

function CommandInput({className, ...props}: React.ComponentProps<typeof CommandPrimitive.Input>) {
    return (
        <div
            data-slot="command-input-wrapper"
            className={cn(
                fieldSurface,
                "mb-1 flex h-8 shrink-0 items-center gap-2 px-2.5 focus-within:border-ring has-disabled:opacity-50",
                "in-data-[slot=dialog-content]:h-9",
            )}
        >
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            <CommandPrimitive.Input
                data-slot="command-input"
                className={cn(
                    "h-full w-full min-w-0 bg-transparent text-base outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm",
                    className,
                )}
                {...props}
            />
        </div>
    );
}

function CommandList({className, ...props}: React.ComponentProps<typeof CommandPrimitive.List>) {
    return (
        <CommandPrimitive.List
            data-slot="command-list"
            className={cn(
                "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
                className,
            )}
            {...props}
        />
    );
}

function CommandEmpty({className, ...props}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return (
        <CommandPrimitive.Empty
            data-slot="command-empty"
            className={cn("py-6 text-center text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

function CommandGroup({className, ...props}: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            data-slot="command-group"
            className={cn(
                // group heading = the `listLabel` recipe
                "overflow-hidden text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}

function CommandSeparator({className, ...props}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return (
        <CommandPrimitive.Separator data-slot="command-separator" className={cn(listSeparator, className)} {...props} />
    );
}

function CommandItem({className, children, ...props}: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item data-slot="command-item" className={cn(commandItemClass, className)} {...props}>
            {children}
            <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
        </CommandPrimitive.Item>
    );
}

function CommandShortcut({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="command-shortcut"
            className={cn(
                "ml-auto pl-4 font-mono text-xs text-muted-foreground group-data-[selected=true]/command-item:text-accent-foreground",
                className,
            )}
            {...props}
        />
    );
}

export {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    commandItemClass,
    CommandList,
    CommandSeparator,
    CommandShortcut,
};
