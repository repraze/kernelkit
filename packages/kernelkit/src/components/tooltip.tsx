"use client";

import {Tooltip as TooltipPrimitive} from "@base-ui/react/tooltip";
import {popupMotion} from "@repraze/kernelkit/lib/recipes";
import {usePortalContainer} from "@repraze/kernelkit/provider";
import {cn} from "cn";

function TooltipProvider({delay = 0, ...props}: TooltipPrimitive.Provider.Props) {
    return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />;
}

function Tooltip({...props}: TooltipPrimitive.Root.Props) {
    return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({...props}: TooltipPrimitive.Trigger.Props) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
    className,
    side = "top",
    sideOffset = 6,
    align = "center",
    alignOffset = 0,
    children,
    ...props
}: TooltipPrimitive.Popup.Props &
    Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
    return (
        <TooltipPrimitive.Portal container={usePortalContainer()}>
            <TooltipPrimitive.Positioner
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                className="isolate z-50"
            >
                <TooltipPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        // Popover-coloured chip: the popup surface and border, small mono text.
                        popupMotion,
                        "z-50 inline-flex min-h-6 w-fit max-w-xs items-center gap-1.5 rounded-md border border-border bg-popover px-2 py-1 font-alt text-xs text-popover-foreground shadow-md shadow-(color:--shadow-color) has-data-[slot=kbd]:pr-1 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:h-4 **:data-[slot=kbd]:min-w-4 **:data-[slot=kbd]:rounded-xs",
                        className,
                    )}
                    {...props}
                >
                    {children}
                    <TooltipPrimitive.Arrow
                        className={cn(
                            // A rotated square in the popup colours; the border sits on the two edges that face out,
                            // centred on the popup's border line so the outline runs on without a seam.
                            "z-50 size-2.5 rotate-45 rounded-xs border-border bg-popover",
                            "data-[side=top]:-bottom-1.25 data-[side=top]:border-r data-[side=top]:border-b",
                            "data-[side=bottom]:-top-1.25 data-[side=bottom]:border-t data-[side=bottom]:border-l",
                            "data-[side=left]:top-1/2! data-[side=left]:-right-1.25 data-[side=left]:-translate-y-1/2 data-[side=left]:border-t data-[side=left]:border-r",
                            "data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1.25 data-[side=inline-start]:-translate-y-1/2 data-[side=inline-start]:border-t data-[side=inline-start]:border-r",
                            "data-[side=right]:top-1/2! data-[side=right]:-left-1.25 data-[side=right]:-translate-y-1/2 data-[side=right]:border-b data-[side=right]:border-l",
                            "data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1.25 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-end]:border-b data-[side=inline-end]:border-l",
                        )}
                    />
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    );
}

export {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger};
