"use client";

import {Menubar as MenubarPrimitive} from "@base-ui/react/menubar";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@repraze/kernelkit/components/dropdown-menu";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import * as React from "react";

/** Bordered bar at the control height (GUIDELINES §4); triggers sit inside its 3px padding. */
function Menubar({className, ...props}: MenubarPrimitive.Props) {
    return (
        <MenubarPrimitive
            data-slot="menubar"
            className={cn(
                "flex h-8 w-fit items-center gap-0.5 rounded-lg border border-border bg-background p-[3px]",
                className,
            )}
            {...props}
        />
    );
}

function MenubarMenu({...props}: React.ComponentProps<typeof DropdownMenu>) {
    return <DropdownMenu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({...props}: React.ComponentProps<typeof DropdownMenuGroup>) {
    return <DropdownMenuGroup data-slot="menubar-group" {...props} />;
}

function MenubarPortal({...props}: React.ComponentProps<typeof DropdownMenuPortal>) {
    return <DropdownMenuPortal data-slot="menubar-portal" {...props} />;
}

/** Top-level menu button: hover wash, kept while its menu is open. */
function MenubarTrigger({className, ...props}: React.ComponentProps<typeof DropdownMenuTrigger>) {
    return (
        <DropdownMenuTrigger
            data-slot="menubar-trigger"
            className={cn(
                "flex h-full items-center gap-1.5 rounded-md px-2 text-sm font-medium select-none",
                "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
                focusRing,
                "hover:bg-hover data-popup-open:bg-hover disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function MenubarContent({
    className,
    align = "start",
    alignOffset = -4,
    sideOffset = 8,
    ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
    return (
        <DropdownMenuContent
            data-slot="menubar-content"
            align={align}
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            className={cn("w-auto min-w-48", className)}
            {...props}
        />
    );
}

// Rows come from dropdown-menu (listItem recipe); only the data-slot changes.
function MenubarItem({...props}: React.ComponentProps<typeof DropdownMenuItem>) {
    return <DropdownMenuItem data-slot="menubar-item" {...props} />;
}

function MenubarCheckboxItem({...props}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
    return <DropdownMenuCheckboxItem data-slot="menubar-checkbox-item" {...props} />;
}

function MenubarRadioGroup({...props}: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
    return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />;
}

function MenubarRadioItem({...props}: React.ComponentProps<typeof DropdownMenuRadioItem>) {
    return <DropdownMenuRadioItem data-slot="menubar-radio-item" {...props} />;
}

function MenubarLabel({...props}: React.ComponentProps<typeof DropdownMenuLabel>) {
    return <DropdownMenuLabel data-slot="menubar-label" {...props} />;
}

function MenubarSeparator({...props}: React.ComponentProps<typeof DropdownMenuSeparator>) {
    return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />;
}

function MenubarShortcut({...props}: React.ComponentProps<typeof DropdownMenuShortcut>) {
    return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />;
}

function MenubarSub({...props}: React.ComponentProps<typeof DropdownMenuSub>) {
    return <DropdownMenuSub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({...props}: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
    return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />;
}

function MenubarSubContent({...props}: React.ComponentProps<typeof DropdownMenuSubContent>) {
    return <DropdownMenuSubContent data-slot="menubar-sub-content" {...props} />;
}

export {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarPortal,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
};
