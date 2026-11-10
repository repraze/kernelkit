"use client";

import {Avatar as AvatarPrimitive} from "@base-ui/react/avatar";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import * as React from "react";

type AvatarSize = "xs" | "sm" | "default" | "lg";

/** Pill-shaped (square at radius-none). Sizes: xs 16px, sm 24px, default 32px, lg 40px. */
const avatarVariants = cva(
    "group/avatar relative flex shrink-0 rounded-pill select-none after:pointer-events-none after:absolute after:inset-0 after:rounded-pill after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten",
    {
        variants: {
            size: {
                xs: "size-4",
                sm: "size-6",
                default: "size-8",
                lg: "size-10",
            },
        },
        defaultVariants: {size: "default"},
    },
);

function Avatar({
    className,
    size = "default",
    ...props
}: AvatarPrimitive.Root.Props & {
    size?: AvatarSize;
}) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            data-size={size}
            className={cn(avatarVariants({size}), className)}
            {...props}
        />
    );
}

function AvatarImage({className, ...props}: AvatarPrimitive.Image.Props) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn("aspect-square size-full rounded-pill object-cover", className)}
            {...props}
        />
    );
}

function AvatarFallback({className, ...props}: AvatarPrimitive.Fallback.Props) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
                "flex size-full items-center justify-center rounded-pill bg-muted font-medium text-muted-foreground",
                "text-sm group-data-[size=lg]/avatar:text-base group-data-[size=sm]/avatar:text-xs group-data-[size=xs]/avatar:text-[0.5rem]",
                "[&>svg]:size-4 group-data-[size=lg]/avatar:[&>svg]:size-5 group-data-[size=sm]/avatar:[&>svg]:size-3 group-data-[size=xs]/avatar:[&>svg]:size-2.5",
                className,
            )}
            {...props}
        />
    );
}

function AvatarBadge({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="avatar-badge"
            className={cn(
                "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-pill bg-primary text-primary-foreground ring-2 ring-background select-none",
                "group-data-[size=xs]/avatar:size-1.5 group-data-[size=xs]/avatar:[&>svg]:hidden",
                "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
                "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
                "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
                className,
            )}
            {...props}
        />
    );
}

function AvatarGroup({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="avatar-group"
            className={cn(
                "group/avatar-group flex -space-x-2 has-data-[size=sm]:-space-x-1.5 has-data-[size=xs]:-space-x-1 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
                className,
            )}
            {...props}
        />
    );
}

function AvatarGroupCount({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="avatar-group-count"
            className={cn(
                "relative flex size-8 shrink-0 items-center justify-center rounded-pill bg-muted font-alt text-xs font-medium text-muted-foreground ring-2 ring-background [&>svg]:size-4",
                "group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:text-sm group-has-data-[size=lg]/avatar-group:[&>svg]:size-5",
                "group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-[0.625rem] group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
                "group-has-data-[size=xs]/avatar-group:size-4 group-has-data-[size=xs]/avatar-group:text-[0.5rem] group-has-data-[size=xs]/avatar-group:[&>svg]:size-2",
                className,
            )}
            {...props}
        />
    );
}

export {Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, avatarVariants};
export type {AvatarSize};
