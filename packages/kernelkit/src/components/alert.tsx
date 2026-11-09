"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {heading} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";

const alertCva = cva(
    [
        "group/alert relative grid w-full gap-0.5 rounded-lg border px-3 py-2.5 text-left text-sm",
        "has-data-[slot=alert-action]:pr-20 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5",
        "*:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg:not([class*='size-'])]:size-4",
    ],
    {
        variants: {
            color: colorVariants,
            variant: {
                // status tint behind foreground text; the hue lives in the border and the icon (§2 TermiColor rule)
                soft: "border-(--c)/30 bg-(--c-tint) text-foreground *:[svg]:text-(--c) hc:border-(--c)",
                // no wash: card surface with a hue border, for dense layouts
                outline: "border-(--c)/50 bg-card text-card-foreground *:[svg]:text-(--c) hc:border-(--c)",
            },
        },
        compoundVariants: [
            {
                color: "neutral",
                class: "border-border bg-card text-card-foreground *:[svg]:text-foreground hc:border-border",
            },
        ],
        defaultVariants: {variant: "soft", color: "neutral"},
    },
);

type AlertVariant = "soft" | "outline" | "default" | "destructive";

/** shadcn aliases: `default` = soft neutral, `destructive` = soft danger. */
function resolveAlert(variant: AlertVariant | null | undefined, color: Color | null | undefined) {
    if (variant === "destructive") {
        return {variant: "soft" as const, color: color ?? "danger"};
    }
    return {variant: variant === "outline" ? ("outline" as const) : ("soft" as const), color: color ?? "neutral"};
}

/** Alert classes for any element. Accepts the shadcn `default` / `destructive` aliases. */
function alertVariants({
    variant,
    color,
    className,
}: {variant?: AlertVariant | null; color?: Color | null; className?: string} = {}) {
    return cn(alertCva(resolveAlert(variant, color)), className);
}

interface AlertProps extends Omit<useRender.ComponentProps<"div">, "color"> {
    /** `soft` (tinted, default) or `outline`. shadcn aliases: `default` = soft, `destructive` = soft danger. */
    variant?: AlertVariant | null;
    /** Status or hue. Defaults to neutral (danger for `destructive`). */
    color?: Color | null;
}

function Alert({className, variant, color, render, ...props}: AlertProps) {
    const resolved = resolveAlert(variant, color);
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({role: "alert", className: cn(alertCva(resolved), className)}, props),
        render,
        state: {slot: "alert", variant: resolved.variant, color: resolved.color},
    });
}

function AlertTitle({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                heading,
                "group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-(--c)",
                className,
            )}
            {...props}
        />
    );
}

function AlertDescription({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn(
                "text-sm text-balance text-muted-foreground group-has-[>svg]/alert:col-start-2 md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
                className,
            )}
            {...props}
        />
    );
}

function AlertAction({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-action"
            className={cn("absolute top-2 right-2 flex items-center gap-1.5", className)}
            {...props}
        />
    );
}

export {Alert, AlertAction, AlertDescription, AlertTitle, alertVariants};
export type {AlertProps};
