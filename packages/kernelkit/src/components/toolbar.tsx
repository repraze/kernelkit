"use client";

import {Toolbar as ToolbarPrimitive} from "@base-ui/react/toolbar";
import {buttonVariants} from "@repraze/kernelkit/components/button";
import {fieldSurface, focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";

/**
 * A bordered bar of controls with roving arrow-key focus (Base UI Toolbar). Items are ghost `icon-sm`
 * buttons by default; pass `render={<Button …/>}` (or a Toggle, a Select trigger, a Menu trigger) to change one.
 */
function Toolbar({className, orientation = "horizontal", ...props}: ToolbarPrimitive.Root.Props) {
    return (
        <ToolbarPrimitive.Root
            data-slot="toolbar"
            orientation={orientation}
            className={cn(
                "flex w-fit items-center gap-px rounded-lg border border-border bg-background p-px data-vertical:flex-col",
                className,
            )}
            {...props}
        />
    );
}

function ToolbarButton({className, render, ...props}: ToolbarPrimitive.Button.Props) {
    return (
        <ToolbarPrimitive.Button
            data-slot="toolbar-button"
            // With a custom `render` (a kernelkit Button, Toggle…) that element brings its own look.
            className={cn(
                render === undefined && buttonVariants({variant: "ghost", size: "icon-sm"}),
                // Disabled items stay focusable (aria-disabled, not `disabled`): dim them from the data attr.
                "data-disabled:pointer-events-none data-disabled:opacity-50",
                className,
            )}
            render={render}
            {...props}
        />
    );
}

function ToolbarLink({className, ...props}: ToolbarPrimitive.Link.Props) {
    return (
        <ToolbarPrimitive.Link
            data-slot="toolbar-link"
            className={cn(
                "inline-flex h-7 items-center gap-1 rounded-md px-2 text-[0.8rem] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
                focusRing,
                className,
            )}
            {...props}
        />
    );
}

/** Compact text field that fits the toolbar row (`h-7`). */
function ToolbarInput({className, ...props}: ToolbarPrimitive.Input.Props) {
    return (
        <ToolbarPrimitive.Input
            data-slot="toolbar-input"
            className={cn(
                fieldSurface,
                focusRing,
                "h-7 w-40 min-w-0 rounded-md px-2 text-base md:text-[0.8rem]",
                className,
            )}
            {...props}
        />
    );
}

function ToolbarGroup({className, ...props}: ToolbarPrimitive.Group.Props) {
    return (
        <ToolbarPrimitive.Group
            data-slot="toolbar-group"
            className={cn("flex items-center gap-px data-vertical:flex-col", className)}
            {...props}
        />
    );
}

function ToolbarSeparator({className, ...props}: ToolbarPrimitive.Separator.Props) {
    return (
        <ToolbarPrimitive.Separator
            data-slot="toolbar-separator"
            className={cn(
                // Perpendicular to the toolbar: a horizontal toolbar gets data-orientation="vertical" separators.
                "shrink-0 bg-border data-vertical:mx-1 data-vertical:h-4 data-vertical:w-px data-horizontal:my-1 data-horizontal:h-px data-horizontal:w-4",
                className,
            )}
            {...props}
        />
    );
}

export {Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator};
