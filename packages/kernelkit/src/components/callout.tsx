"use client";

import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@repraze/kernelkit/components/collapsible";
import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {heading, statusSurface, statusSurfaceNeutral} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {ChevronDownIcon} from "lucide-react";
import type * as React from "react";

/**
 * Long-form aside for docs and articles (note, tip, warning). The color rides on the suite's row
 * indicator (the sidebar and menu pill: 2px, rounded, flush left, inset from the top and bottom).
 * Surfaces share Alert's `soft` / `outline` variants. For app status use Alert.
 */
const calloutVariants = cva(
    [
        "group/callout relative overflow-hidden rounded-lg border text-sm text-foreground",
        // header/body divider: half-strength hue, so it reads on the soft tint too (the hue itself in hc)
        "[--callout-line:color-mix(in_oklab,var(--c)_50%,transparent)] hc:[--callout-line:var(--c)]",
        // the row indicator (recipes rowIndicator), always on, in the callout's color, above the header's hover.
        // The box has no padding of its own: header and body span the full width (pl-4 clears the pill).
        "before:pointer-events-none before:absolute before:z-10 before:top-1.5 before:bottom-1.5 before:left-0 before:w-0.5 before:rounded-pill before:bg-(--c)",
    ],
    {
        variants: {
            color: colorVariants,
            variant: statusSurface,
        },
        compoundVariants: [
            {
                color: "neutral",
                class: [
                    statusSurfaceNeutral,
                    "before:bg-muted-foreground [--callout-line:var(--border)] hc:[--callout-line:var(--border)]",
                ],
            },
        ],
        defaultVariants: {color: "neutral", variant: "soft"},
    },
);

const calloutHeader =
    "flex min-h-8 w-full items-center gap-1.5 py-1.5 pr-3 pl-4 text-left text-xs text-(--c-text) group-data-[color=neutral]/callout:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";

const calloutBody =
    "py-2 pr-3 pl-4 text-sm leading-relaxed [&_a]:text-(--c-text) [&_a]:underline [&_a]:underline-offset-3 group-data-[color=neutral]/callout:[&_a]:text-foreground [&_p:not(:last-child)]:mb-2 border-(--callout-line)";

interface CalloutProps extends Omit<React.ComponentProps<"div">, "color" | "title"> {
    /** Status or hue of the indicator, header and border. */
    color?: Color | null;
    /** `soft` (tinted, default) or `outline` (card surface, stronger border): the same axis as Alert. */
    variant?: "soft" | "outline" | null;
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
    variant,
    icon,
    title,
    collapsible = false,
    defaultCollapsed = false,
    children,
    ...props
}: CalloutProps) {
    const resolved = color ?? "neutral";
    const surface = variant ?? "soft";
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
                data-variant={surface}
                defaultOpen={!defaultCollapsed}
                className={cn(calloutVariants({color: resolved, variant: surface}), className)}
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
            data-variant={surface}
            className={cn(calloutVariants({color: resolved, variant: surface}), className)}
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
