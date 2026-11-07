"use client";

import {cn} from "cn";
import {GripVerticalIcon} from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

function ResizablePanelGroup({className, ...props}: ResizablePrimitive.GroupProps) {
    return (
        <ResizablePrimitive.Group
            data-slot="resizable-panel-group"
            className={cn("flex h-full w-full aria-[orientation=vertical]:flex-col", className)}
            {...props}
        />
    );
}

function ResizablePanel({...props}: ResizablePrimitive.PanelProps) {
    return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />;
}

/**
 * 1px line between panels with a wider invisible hit area. `data-separator` (set by the library) drives
 * the states: hover washes the hit area, dragging turns the line primary, keyboard focus rings it.
 */
function ResizableHandle({
    withHandle,
    className,
    ...props
}: ResizablePrimitive.SeparatorProps & {
    /** Show a grip in the middle of the line. */
    withHandle?: boolean;
}) {
    return (
        <ResizablePrimitive.Separator
            data-slot="resizable-handle"
            className={cn(
                "group/handle relative flex w-px shrink-0 items-center justify-center bg-border outline-none",
                "transition-[background-color,box-shadow] duration-100 motion-reduce:transition-none",
                // hit area
                "after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2 after:transition-colors",
                "hover:after:bg-hover data-[separator=hover]:after:bg-hover data-[separator=active]:bg-primary-text data-[separator=active]:after:bg-primary/15",
                "focus-visible:bg-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "data-[separator=disabled]:opacity-50",
                // horizontal line (vertical group)
                "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
                className,
            )}
            {...props}
        >
            {withHandle && (
                <div
                    data-slot="resizable-grip"
                    className="z-10 flex h-6 w-3 shrink-0 items-center justify-center rounded-sm border border-border bg-background text-muted-foreground transition-colors group-hover/handle:text-foreground group-data-[separator=active]/handle:border-primary-text group-data-[separator=active]/handle:text-primary-text"
                >
                    <GripVerticalIcon className="size-2.5" />
                </div>
            )}
        </ResizablePrimitive.Separator>
    );
}

export {ResizableHandle, ResizablePanel, ResizablePanelGroup};
