"use client";

import {AlertDialog as AlertDialogPrimitive} from "@base-ui/react/alert-dialog";
import {Button} from "@repraze/kernelkit/components/button";
import {type Color, colorVariants} from "@repraze/kernelkit/lib/color";
import {backdrop, heading} from "@repraze/kernelkit/lib/recipes";
import {usePortalContainer} from "@repraze/kernelkit/provider";
import {cn} from "cn";
import * as React from "react";

function AlertDialog({...props}: AlertDialogPrimitive.Root.Props) {
    return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({...props}: AlertDialogPrimitive.Trigger.Props) {
    return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({...props}: AlertDialogPrimitive.Portal.Props) {
    return <AlertDialogPrimitive.Portal container={usePortalContainer()} data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({className, ...props}: AlertDialogPrimitive.Backdrop.Props) {
    return (
        <AlertDialogPrimitive.Backdrop
            data-slot="alert-dialog-overlay"
            className={cn(backdrop, className)}
            {...props}
        />
    );
}

function AlertDialogContent({
    className,
    size = "default",
    ...props
}: AlertDialogPrimitive.Popup.Props & {
    size?: "default" | "sm";
}) {
    return (
        <AlertDialogPortal>
            <AlertDialogOverlay />
            <AlertDialogPrimitive.Popup
                data-slot="alert-dialog-content"
                data-size={size}
                className={cn(
                    "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-xl shadow-(color:--shadow-color) duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none",
                    className,
                )}
                {...props}
            />
        </AlertDialogPortal>
    );
}

function AlertDialogHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-header"
            className={cn(
                "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
                className,
            )}
            {...props}
        />
    );
}

function AlertDialogFooter({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-dialog-footer"
            className={cn(
                "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-border bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        />
    );
}

/** Icon tile. `color` tints it (TermiColor rule: tint surface, colored icon and border). */
function AlertDialogMedia({
    className,
    color,
    ...props
}: Omit<React.ComponentProps<"div">, "color"> & {
    color?: Color;
}) {
    return (
        <div
            data-slot="alert-dialog-media"
            data-color={color}
            className={cn(
                "mb-2 inline-flex size-10 items-center justify-center rounded-lg border border-border bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-5",
                color && [colorVariants[color], "border-(--c)/40 bg-(--c-tint) text-foreground *:[svg]:text-(--c)"],
                className,
            )}
            {...props}
        />
    );
}

function AlertDialogTitle({className, ...props}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className={cn(
                heading,
                "text-base sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
                className,
            )}
            {...props}
        />
    );
}

function AlertDialogDescription({className, ...props}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className={cn(
                "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
                className,
            )}
            {...props}
        />
    );
}

/** The confirming action. A plain Button (it does not close the dialog): accepts `variant`, `color`, `size`. */
function AlertDialogAction({className, ...props}: React.ComponentProps<typeof Button>) {
    return <Button data-slot="alert-dialog-action" className={cn(className)} {...props} />;
}

function AlertDialogCancel({
    className,
    variant = "outline",
    color,
    size = "default",
    ...props
}: Omit<AlertDialogPrimitive.Close.Props, "color"> &
    Pick<React.ComponentProps<typeof Button>, "variant" | "color" | "size">) {
    return (
        <AlertDialogPrimitive.Close
            data-slot="alert-dialog-cancel"
            className={cn(className)}
            render={<Button variant={variant} color={color} size={size} />}
            {...props}
        />
    );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    AlertDialogTrigger,
};
