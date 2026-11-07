"use client";

import {cva} from "class-variance-authority";
import {cn} from "cn";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "kernelkit/components/collapsible";
import {type Color, colorVariants} from "kernelkit/lib/color";
import {heading} from "kernelkit/lib/recipes";
import {ChevronDownIcon} from "lucide-react";
import type * as React from "react";

/**
 * Long-form aside for docs and articles (note, tip, warning). A left accent bar carries the color;
 * the surface is a faint wash so body text stays foreground. For app status use Alert.
 */
const calloutVariants = cva(
    [
        "group/callout relative overflow-hidden rounded-lg border border-(--c)/25 bg-(--c)/5 pl-1 text-sm text-foreground hc:border-(--c)",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-(--c)",
    ],
    {
        variants: {
            color: colorVariants,
        },
        compoundVariants: [
            {
                color: "neutral",
                class: "border-border bg-card before:bg-muted-foreground hc:border-border",
            },
        ],
        defaultVariants: {color: "neutral"},
    },
);

const calloutHeader =
    "flex min-h-8 w-full items-center gap-1.5 px-3 py-1.5 text-left text-xs text-(--c) group-data-[color=neutral]/callout:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";

const calloutBody =
    "px-3 py-2 text-sm leading-relaxed [&_a]:text-(--c) [&_a]:underline [&_a]:underline-offset-3 group-data-[color=neutral]/callout:[&_a]:text-foreground [&_p:not(:last-child)]:mb-2 border-(--c)/25 group-data-[color=neutral]/callout:border-border hc:border-(--c)";

interface CalloutProps extends Omit<React.ComponentProps<"div">, "color" | "title"> {
    /** Status or hue of the bar, header and border. */
    color?: Color | null;
    /** Leading icon element, e.g. `<InfoIcon />`. */
    icon?: React.ReactNode;
    /** Header label. The header renders when `title` or `icon` is set. */
    title?: React.ReactNode;
    /** Header toggles the body. Needs a `title` or `icon`. */
    collapsible?: boolean;
    /** Start collapsed (only with `collapsible`). */
    defaultCollapsed?: boolean;
}

function Callout({
    className,
    color,
    icon,
    title,
    collapsible = false,
    defaultCollapsed = false,
    children,
    ...props
}: CalloutProps) {
    const resolved = color ?? "neutral";
    const hasHeader = Boolean(title || icon);
    const headerContent = (
        <>
            {icon}
            {title ? (
                <span data-slot="callout-title" className={cn(heading, "font-medium")}>
                    {title}
                </span>
            ) : null}
        </>
    );

    if (collapsible && hasHeader) {
        return (
            <Collapsible
                data-slot="callout"
                data-color={resolved}
                defaultOpen={!defaultCollapsed}
                className={cn(calloutVariants({color: resolved}), className)}
                {...props}
            >
                <CollapsibleTrigger
                    data-slot="callout-header"
                    className={cn(
                        calloutHeader,
                        "cursor-pointer transition-[background-color,box-shadow] outline-none select-none hover:bg-hover focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
                    )}
                >
                    {headerContent}
                    <ChevronDownIcon
                        data-slot="callout-chevron"
                        className="ml-auto transition-transform duration-150 group-data-closed/callout:-rotate-90 motion-reduce:transition-none"
                    />
                </CollapsibleTrigger>
                {children ? (
                    <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                        <div data-slot="callout-content" className={cn(calloutBody, "border-t")}>
                            {children}
                        </div>
                    </CollapsibleContent>
                ) : null}
            </Collapsible>
        );
    }

    return (
        <div
            data-slot="callout"
            data-color={resolved}
            className={cn(calloutVariants({color: resolved}), className)}
            {...props}
        >
            {hasHeader ? (
                <div data-slot="callout-header" className={calloutHeader}>
                    {headerContent}
                </div>
            ) : null}
            {children ? (
                <div data-slot="callout-content" className={cn(calloutBody, hasHeader && "border-t")}>
                    {children}
                </div>
            ) : null}
        </div>
    );
}

export {Callout, calloutVariants};
export type {CalloutProps};
