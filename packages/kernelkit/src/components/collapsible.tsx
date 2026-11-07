"use client";

import {Collapsible as CollapsiblePrimitive} from "@base-ui/react/collapsible";
import {cn} from "cn";
import {ChevronRightIcon} from "lucide-react";
import type * as React from "react";

/** Root. Adds `group/collapsible` so any descendant can react to `data-open` (e.g. a rotating chevron). */
function Collapsible({className, ...props}: CollapsiblePrimitive.Root.Props) {
    return (
        <CollapsiblePrimitive.Root data-slot="collapsible" className={cn("group/collapsible", className)} {...props} />
    );
}

function CollapsibleTrigger({...props}: CollapsiblePrimitive.Trigger.Props) {
    return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />;
}

/** Chevron pushed to the trigger's end that rotates 90° while open. */
function CollapsibleChevron({className, ...props}: React.ComponentProps<typeof ChevronRightIcon>) {
    return (
        <ChevronRightIcon
            data-slot="collapsible-chevron"
            aria-hidden="true"
            className={cn(
                "ml-auto size-4 shrink-0 text-muted-foreground transition-transform duration-150 group-data-open/collapsible:rotate-90 motion-reduce:transition-none",
                className,
            )}
            {...props}
        />
    );
}

function CollapsibleContent({className, ...props}: CollapsiblePrimitive.Panel.Props) {
    return (
        <CollapsiblePrimitive.Panel
            data-slot="collapsible-content"
            className={cn(
                "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
                className,
            )}
            {...props}
        />
    );
}

export {Collapsible, CollapsibleChevron, CollapsibleContent, CollapsibleTrigger};
