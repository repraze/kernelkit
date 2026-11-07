"use client";

import {Menu as MenuPrimitive} from "@base-ui/react/menu";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {listItem, listLabel, listSeparator, popupMotion, popupSurface} from "kernelkit/lib/recipes";
import {usePortalContainer} from "kernelkit/provider";
import {CheckIcon, ChevronRightIcon} from "lucide-react";
import * as React from "react";

/** Menu popup: shared by dropdown, context menu and menubar. */
const menuContentClass = cn(
    popupSurface,
    popupMotion,
    "z-50 max-h-(--available-height) overflow-x-hidden overflow-y-auto p-1 outline-none data-closed:overflow-hidden",
);

/** `danger` (alias `destructive`) items: danger text and a danger-tinted highlight (GUIDELINES §4). */
type MenuItemVariant = "default" | "danger" | "destructive";

/** Menu row classes. `inset` lines text up with items that lead with an icon. */
const menuItemVariants = cva([listItem, "group/menu-item data-inset:pl-8"], {
    variants: {
        variant: {
            default: "",
            danger: "text-danger data-highlighted:bg-danger/15 data-highlighted:text-danger [&_svg:not([class*='text-'])]:text-danger data-highlighted:[&_svg:not([class*='text-'])]:text-danger",
        },
    },
    defaultVariants: {variant: "default"},
});

function resolveItemVariant(variant: MenuItemVariant | undefined) {
    return variant === "destructive" || variant === "danger" ? "danger" : "default";
}

/** Keyboard shortcut hint at the end of a menu row. */
const menuShortcutClass =
    "ml-auto pl-4 font-mono text-xs text-muted-foreground group-data-highlighted/menu-item:text-accent-foreground";

/** Right-side indicator of checkbox and radio rows. */
const menuIndicatorClass = "pointer-events-none absolute right-2 flex size-4 items-center justify-center";

function DropdownMenu({...props}: MenuPrimitive.Root.Props) {
    return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({...props}: MenuPrimitive.Portal.Props) {
    return <MenuPrimitive.Portal container={usePortalContainer()} data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({...props}: MenuPrimitive.Trigger.Props) {
    return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
    align = "start",
    alignOffset = 0,
    side = "bottom",
    sideOffset = 4,
    className,
    ...props
}: MenuPrimitive.Popup.Props & Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
    return (
        <MenuPrimitive.Portal container={usePortalContainer()}>
            <MenuPrimitive.Positioner
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <MenuPrimitive.Popup
                    data-slot="dropdown-menu-content"
                    className={cn(menuContentClass, "w-(--anchor-width) min-w-40", className)}
                    {...props}
                />
            </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
    );
}

function DropdownMenuGroup({...props}: MenuPrimitive.Group.Props) {
    return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

/** Plain caption: works inside or outside a `DropdownMenuGroup` (Base UI's GroupLabel requires a Group). */
function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<"div"> & {
    inset?: boolean;
}) {
    return (
        <div
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(listLabel, "data-inset:pl-8", className)}
            {...props}
        />
    );
}

function DropdownMenuItem({
    className,
    inset,
    variant = "default",
    ...props
}: MenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: MenuItemVariant;
}) {
    const v = resolveItemVariant(variant);
    return (
        <MenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={v}
            className={cn(menuItemVariants({variant: v}), className)}
            {...props}
        />
    );
}

function DropdownMenuSub({...props}: MenuPrimitive.SubmenuRoot.Props) {
    return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                menuItemVariants(),
                "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="ml-auto" />
        </MenuPrimitive.SubmenuTrigger>
    );
}

function DropdownMenuSubContent({
    align = "start",
    alignOffset = -5,
    side = "right",
    sideOffset = 0,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
    return (
        <DropdownMenuContent
            data-slot="dropdown-menu-sub-content"
            className={cn("w-auto", className)}
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: MenuPrimitive.CheckboxItem.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            data-inset={inset}
            className={cn(menuItemVariants(), "pr-8", className)}
            checked={checked}
            {...props}
        >
            <span className={menuIndicatorClass} data-slot="dropdown-menu-checkbox-item-indicator">
                <MenuPrimitive.CheckboxItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.CheckboxItemIndicator>
            </span>
            {children}
        </MenuPrimitive.CheckboxItem>
    );
}

function DropdownMenuRadioGroup({...props}: MenuPrimitive.RadioGroup.Props) {
    return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: MenuPrimitive.RadioItem.Props & {
    inset?: boolean;
}) {
    return (
        <MenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            data-inset={inset}
            className={cn(menuItemVariants(), "pr-8", className)}
            {...props}
        >
            <span className={menuIndicatorClass} data-slot="dropdown-menu-radio-item-indicator">
                <MenuPrimitive.RadioItemIndicator>
                    <CheckIcon />
                </MenuPrimitive.RadioItemIndicator>
            </span>
            {children}
        </MenuPrimitive.RadioItem>
    );
}

function DropdownMenuSeparator({className, ...props}: MenuPrimitive.Separator.Props) {
    return (
        <MenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn(listSeparator, className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({className, ...props}: React.ComponentProps<"span">) {
    return <span data-slot="dropdown-menu-shortcut" className={cn(menuShortcutClass, className)} {...props} />;
}

export {
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
    menuContentClass,
    menuIndicatorClass,
    menuItemVariants,
    menuShortcutClass,
    resolveItemVariant,
};
export type {MenuItemVariant};
