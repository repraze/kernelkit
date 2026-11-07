"use client";

import {NavigationMenu as NavigationMenuPrimitive} from "@base-ui/react/navigation-menu";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {focusRing, popupSurface} from "kernelkit/lib/recipes";
import {usePortalContainer} from "kernelkit/provider";
import {ChevronDownIcon} from "lucide-react";

function NavigationMenu({
    align = "start",
    className,
    children,
    // Radix-era shadcn prop: Base UI always renders the shared viewport. Accepted for drop-in use.
    viewport: _viewport,
    ...props
}: NavigationMenuPrimitive.Root.Props &
    Pick<NavigationMenuPrimitive.Positioner.Props, "align"> & {
        /** Accepted for shadcn compatibility; the popup always uses the shared viewport. */
        viewport?: boolean;
    }) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            className={cn(
                "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
                className,
            )}
            {...props}
        >
            {children}
            <NavigationMenuPositioner align={align} />
        </NavigationMenuPrimitive.Root>
    );
}

function NavigationMenuList({className, ...props}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
    return (
        <NavigationMenuPrimitive.List
            data-slot="navigation-menu-list"
            className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
            {...props}
        />
    );
}

function NavigationMenuItem({className, ...props}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
    return (
        <NavigationMenuPrimitive.Item
            data-slot="navigation-menu-item"
            className={cn("relative", className)}
            {...props}
        />
    );
}

/**
 * Top-level trigger and link look: a ghost control at the default height (GUIDELINES §4). Open keeps the
 * hover wash; the current page (`data-active`) gets the accent tint + medium weight.
 */
const navigationMenuTriggerStyle = cva([
    "group/navigation-menu-trigger inline-flex h-8 w-max items-center justify-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-foreground",
    "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
    focusRing,
    "hover:bg-hover data-popup-open:bg-hover disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
]);

function NavigationMenuTrigger({className, children, ...props}: NavigationMenuPrimitive.Trigger.Props) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), "pr-2", className)}
            {...props}
        >
            {children}
            <NavigationMenuPrimitive.Icon
                render={
                    <ChevronDownIcon
                        className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-popup-open/navigation-menu-trigger:rotate-180 motion-reduce:transition-none"
                        aria-hidden="true"
                    />
                }
            />
        </NavigationMenuPrimitive.Trigger>
    );
}

function NavigationMenuContent({className, ...props}: NavigationMenuPrimitive.Content.Props) {
    return (
        <NavigationMenuPrimitive.Content
            data-slot="navigation-menu-content"
            className={cn(
                "h-full w-auto p-1 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
                "data-ending-style:data-[activation-direction=left]:translate-x-[50%] data-ending-style:data-[activation-direction=right]:translate-x-[-50%] data-starting-style:data-[activation-direction=left]:translate-x-[-50%] data-starting-style:data-[activation-direction=right]:translate-x-[50%]",
                className,
            )}
            {...props}
        />
    );
}

function NavigationMenuPositioner({
    className,
    side = "bottom",
    sideOffset = 8,
    align = "start",
    alignOffset = 0,
    ...props
}: NavigationMenuPrimitive.Positioner.Props) {
    return (
        <NavigationMenuPrimitive.Portal container={usePortalContainer()}>
            <NavigationMenuPrimitive.Positioner
                data-slot="navigation-menu-positioner"
                side={side}
                sideOffset={sideOffset}
                align={align}
                alignOffset={alignOffset}
                className={cn(
                    "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none motion-reduce:transition-none data-[side=bottom]:before:absolute data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:-top-2.5 data-[side=bottom]:before:h-2.5",
                    className,
                )}
                {...props}
            >
                <NavigationMenuPrimitive.Popup
                    data-slot="navigation-menu-popup"
                    className={cn(
                        popupSurface,
                        "relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none",
                    )}
                >
                    <NavigationMenuPrimitive.Viewport
                        data-slot="navigation-menu-viewport"
                        className="relative size-full overflow-hidden rounded-[inherit]"
                    />
                </NavigationMenuPrimitive.Popup>
            </NavigationMenuPrimitive.Positioner>
        </NavigationMenuPrimitive.Portal>
    );
}

/**
 * A link. At the top level it looks like a trigger; inside `NavigationMenuContent` it is a list row
 * (`rounded-md`, keyboard highlight instead of a ring). `active` marks the current page.
 */
function NavigationMenuLink({className, ...props}: NavigationMenuPrimitive.Link.Props) {
    return (
        <NavigationMenuPrimitive.Link
            data-slot="navigation-menu-link"
            className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-foreground outline-none select-none",
                "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
                "hover:bg-hover focus-visible:ring-3 focus-visible:ring-ring/50",
                "data-active:bg-accent data-active:font-medium data-active:text-accent-foreground",
                "in-data-[slot=navigation-menu-list]:h-8 in-data-[slot=navigation-menu-list]:font-medium",
                "in-data-[slot=navigation-menu-content]:rounded-md in-data-[slot=navigation-menu-content]:px-2 in-data-[slot=navigation-menu-content]:focus-visible:bg-accent in-data-[slot=navigation-menu-content]:focus-visible:text-accent-foreground in-data-[slot=navigation-menu-content]:focus-visible:ring-0",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}

function NavigationMenuIndicator({
    className,
    ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
    return (
        <NavigationMenuPrimitive.Icon
            data-slot="navigation-menu-indicator"
            className={cn(
                "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
                className,
            )}
            {...props}
        >
            <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
        </NavigationMenuPrimitive.Icon>
    );
}

export {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuPositioner,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
};
