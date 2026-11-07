"use client";

import {Toggle as TogglePrimitive} from "@base-ui/react/toggle";
import {ToggleGroup as ToggleGroupPrimitive} from "@base-ui/react/toggle-group";
import {type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {toggleVariants} from "kernelkit/components/toggle";
import * as React from "react";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
    size: "default",
    variant: "default",
    spacing: 2,
    orientation: "horizontal",
});

type ToggleGroupProps = ToggleGroupPrimitive.Props & ToggleGroupContextValue;

/**
 * `spacing={0}` joins the items into one segmented control: outer corners follow the group radius,
 * outline items overlap their borders so the pressed item's border stays whole.
 */
function ToggleGroup({
    className,
    variant,
    size,
    spacing = 2,
    orientation = "horizontal",
    children,
    ...props
}: ToggleGroupProps) {
    return (
        <ToggleGroupPrimitive
            data-slot="toggle-group"
            data-variant={variant ?? "default"}
            data-size={size ?? "default"}
            data-spacing={spacing}
            data-orientation={orientation}
            orientation={orientation}
            style={{"--gap": spacing} as React.CSSProperties}
            className={cn(
                "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-md data-[size=xs]:rounded-md data-vertical:flex-col data-vertical:items-stretch",
                className,
            )}
            {...props}
        >
            <ToggleGroupContext.Provider value={{variant, size, spacing, orientation}}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive>
    );
}

function ToggleGroupItem({
    className,
    children,
    variant = "default",
    size = "default",
    ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
    const context = React.useContext(ToggleGroupContext);
    const itemVariant = context.variant || variant;
    const itemSize = context.size || size;

    return (
        <TogglePrimitive
            data-slot="toggle-group-item"
            data-variant={itemVariant}
            data-size={itemSize}
            data-spacing={context.spacing}
            className={cn(
                toggleVariants({variant: itemVariant, size: itemSize}),
                "focus-visible:z-10",
                // joined: square inner corners, group-radius outer corners
                "data-[spacing=0]:rounded-none",
                "group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-[inherit] group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-[inherit]",
                "group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-[inherit] group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-[inherit]",
                // joined outline: overlap borders instead of dropping one, so a pressed border is never cut
                "data-[variant=outline]:data-pressed:z-[5] group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:not-first:-ml-px group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:not-first:-mt-px",
                className,
            )}
            {...props}
        >
            {children}
        </TogglePrimitive>
    );
}

export {ToggleGroup, ToggleGroupItem};
export type {ToggleGroupProps};
