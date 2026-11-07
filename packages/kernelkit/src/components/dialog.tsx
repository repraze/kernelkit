"use client";

import {Dialog as DialogPrimitive} from "@base-ui/react/dialog";
import {Button} from "@repraze/kernelkit/components/button";
import {backdrop, heading} from "@repraze/kernelkit/lib/recipes";
import {usePortalContainer} from "@repraze/kernelkit/provider";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {XIcon} from "lucide-react";
import * as React from "react";

/** Centered modal panel (GUIDELINES §3: `rounded-xl`, §4: `p-4`). */
const dialogContentVariants = cva(
    "group/dialog-content fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-border bg-popover p-4 text-sm text-popover-foreground shadow-xl shadow-(color:--shadow-color) duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none",
    {
        variants: {
            size: {
                sm: "sm:max-w-xs",
                default: "sm:max-w-sm",
                lg: "sm:max-w-lg",
                xl: "sm:max-w-2xl",
            },
        },
        defaultVariants: {size: "default"},
    },
);

function Dialog({...props}: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({...props}: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({...props}: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal container={usePortalContainer()} data-slot="dialog-portal" {...props} />;
}

function DialogClose({...props}: DialogPrimitive.Close.Props) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({className, ...props}: DialogPrimitive.Backdrop.Props) {
    return <DialogPrimitive.Backdrop data-slot="dialog-overlay" className={cn(backdrop, className)} {...props} />;
}

function DialogContent({
    className,
    children,
    size = "default",
    showCloseButton = true,
    ...props
}: DialogPrimitive.Popup.Props &
    VariantProps<typeof dialogContentVariants> & {
        showCloseButton?: boolean;
    }) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
                data-slot="dialog-content"
                data-size={size}
                data-close-button={showCloseButton || undefined}
                className={cn(dialogContentVariants({size}), className)}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        render={<Button variant="ghost" className="absolute top-2.5 right-2.5" size="icon-sm" />}
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Popup>
        </DialogPortal>
    );
}

function DialogHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 group-data-close-button/dialog-content:pr-8", className)}
            {...props}
        />
    );
}

function DialogBody({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="dialog-body" className={cn("flex min-w-0 flex-col gap-4", className)} {...props} />;
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t border-border bg-muted/50 p-4 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close render={<Button variant="outline" />}>Close</DialogPrimitive.Close>
            )}
        </div>
    );
}

function DialogTitle({className, ...props}: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn(heading, "text-base leading-none", className)}
            {...props}
        />
    );
}

function DialogDescription({className, ...props}: DialogPrimitive.Description.Props) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn(
                "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
                className,
            )}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    dialogContentVariants,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
