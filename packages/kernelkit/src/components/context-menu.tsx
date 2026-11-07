"use client";

import {ContextMenu as ContextMenuPrimitive} from "@base-ui/react/context-menu";
import {cn} from "cn";
import {
    menuContentClass,
    menuIndicatorClass,
    type MenuItemVariant,
    menuItemVariants,
    menuShortcutClass,
    resolveItemVariant,
} from "kernelkit/components/dropdown-menu";
import {listLabel, listSeparator} from "kernelkit/lib/recipes";
import {usePortalContainer} from "kernelkit/provider";
import {CheckIcon, ChevronRightIcon} from "lucide-react";
import * as React from "react";

function ContextMenu({...props}: ContextMenuPrimitive.Root.Props) {
    return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuPortal({...props}: ContextMenuPrimitive.Portal.Props) {
    return <ContextMenuPrimitive.Portal container={usePortalContainer()} data-slot="context-menu-portal" {...props} />;
}

function ContextMenuTrigger({className, ...props}: ContextMenuPrimitive.Trigger.Props) {
    return (
        <ContextMenuPrimitive.Trigger
            data-slot="context-menu-trigger"
            className={cn("select-none", className)}
            {...props}
        />
    );
}

function ContextMenuContent({
    className,
    align = "start",
    alignOffset = 4,
    side = "right",
    sideOffset = 0,
    ...props
}: ContextMenuPrimitive.Popup.Props &
    Pick<ContextMenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
    return (
        <ContextMenuPrimitive.Portal container={usePortalContainer()}>
            <ContextMenuPrimitive.Positioner
                className="isolate z-50 outline-none"
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
            >
                <ContextMenuPrimitive.Popup
                    data-slot="context-menu-content"
                    className={cn(menuContentClass, "min-w-44", className)}
                    {...props}
                />
            </ContextMenuPrimitive.Positioner>
        </ContextMenuPrimitive.Portal>
    );
}

function ContextMenuGroup({...props}: ContextMenuPrimitive.Group.Props) {
    return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

/** Plain caption: works inside or outside a `ContextMenuGroup`. */
function ContextMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<"div"> & {
    inset?: boolean;
}) {
    return (
        <div
            data-slot="context-menu-label"
            data-inset={inset}
            className={cn(listLabel, "data-inset:pl-8", className)}
            {...props}
        />
    );
}

function ContextMenuItem({
    className,
    inset,
    variant = "default",
    ...props
}: ContextMenuPrimitive.Item.Props & {
    inset?: boolean;
    variant?: MenuItemVariant;
}) {
    const v = resolveItemVariant(variant);
    return (
        <ContextMenuPrimitive.Item
            data-slot="context-menu-item"
            data-inset={inset}
            data-variant={v}
            className={cn(menuItemVariants({variant: v}), className)}
            {...props}
        />
    );
}

function ContextMenuSub({...props}: ContextMenuPrimitive.SubmenuRoot.Props) {
    return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: ContextMenuPrimitive.SubmenuTrigger.Props & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.SubmenuTrigger
            data-slot="context-menu-sub-trigger"
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
        </ContextMenuPrimitive.SubmenuTrigger>
    );
}

function ContextMenuSubContent({
    alignOffset = -5,
    sideOffset = 0,
    ...props
}: React.ComponentProps<typeof ContextMenuContent>) {
    return (
        <ContextMenuContent
            data-slot="context-menu-sub-content"
            side="right"
            alignOffset={alignOffset}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    inset,
    ...props
}: ContextMenuPrimitive.CheckboxItem.Props & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.CheckboxItem
            data-slot="context-menu-checkbox-item"
            data-inset={inset}
            className={cn(menuItemVariants(), "pr-8", className)}
            checked={checked}
            {...props}
        >
            <span className={menuIndicatorClass} data-slot="context-menu-checkbox-item-indicator">
                <ContextMenuPrimitive.CheckboxItemIndicator>
                    <CheckIcon />
                </ContextMenuPrimitive.CheckboxItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    );
}

function ContextMenuRadioGroup({...props}: ContextMenuPrimitive.RadioGroup.Props) {
    return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuRadioItem({
    className,
    children,
    inset,
    ...props
}: ContextMenuPrimitive.RadioItem.Props & {
    inset?: boolean;
}) {
    return (
        <ContextMenuPrimitive.RadioItem
            data-slot="context-menu-radio-item"
            data-inset={inset}
            className={cn(menuItemVariants(), "pr-8", className)}
            {...props}
        >
            <span className={menuIndicatorClass} data-slot="context-menu-radio-item-indicator">
                <ContextMenuPrimitive.RadioItemIndicator>
                    <CheckIcon />
                </ContextMenuPrimitive.RadioItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.RadioItem>
    );
}

function ContextMenuSeparator({className, ...props}: ContextMenuPrimitive.Separator.Props) {
    return (
        <ContextMenuPrimitive.Separator
            data-slot="context-menu-separator"
            className={cn(listSeparator, className)}
            {...props}
        />
    );
}

function ContextMenuShortcut({className, ...props}: React.ComponentProps<"span">) {
    return <span data-slot="context-menu-shortcut" className={cn(menuShortcutClass, className)} {...props} />;
}

export {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
};
