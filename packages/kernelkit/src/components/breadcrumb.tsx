"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cn} from "cn";
import {MoreHorizontalIcon} from "lucide-react";
import * as React from "react";

function Breadcrumb({className, ...props}: React.ComponentProps<"nav">) {
    return <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />;
}

function BreadcrumbList({className, ...props}: React.ComponentProps<"ol">) {
    return (
        <ol
            data-slot="breadcrumb-list"
            className={cn(
                "flex flex-wrap items-center gap-1.5 font-mono text-xs wrap-break-word text-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}

function BreadcrumbItem({className, ...props}: React.ComponentProps<"li">) {
    return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-1", className)} {...props} />;
}

function BreadcrumbLink({className, render, ...props}: useRender.ComponentProps<"a">) {
    return useRender({
        defaultTagName: "a",
        props: mergeProps<"a">(
            {
                className: cn(
                    "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground [&_svg:not([class*='size-'])]:size-3",
                    focusRing,
                    className,
                ),
            },
            props,
        ),
        render,
        state: {
            slot: "breadcrumb-link",
        },
    });
}

function BreadcrumbPage({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-page"
            role="link"
            aria-disabled="true"
            aria-current="page"
            className={cn(
                "inline-flex items-center gap-1 font-medium text-foreground [&_svg:not([class*='size-'])]:size-3",
                className,
            )}
            {...props}
        />
    );
}

/** A muted `/` between levels (a path, in mono). Pass children to use another mark. */
function BreadcrumbSeparator({children, className, ...props}: React.ComponentProps<"li">) {
    return (
        <li
            data-slot="breadcrumb-separator"
            role="presentation"
            aria-hidden="true"
            className={cn("text-muted-foreground select-none [&>svg]:size-3", className)}
            {...props}
        >
            {children ?? "/"}
        </li>
    );
}

function BreadcrumbEllipsis({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="breadcrumb-ellipsis"
            role="presentation"
            aria-hidden="true"
            className={cn("flex size-5 items-center justify-center rounded-sm [&>svg]:size-3.5", className)}
            {...props}
        >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
        </span>
    );
}

export {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
};
