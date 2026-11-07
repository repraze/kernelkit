"use client";

import {Button} from "@repraze/kernelkit/components/button";
import {cn} from "cn";
import {ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon} from "lucide-react";
import * as React from "react";

function Pagination({className, ...props}: React.ComponentProps<"nav">) {
    return (
        <nav
            role="navigation"
            aria-label="pagination"
            data-slot="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            {...props}
        />
    );
}

function PaginationContent({className, ...props}: React.ComponentProps<"ul">) {
    return <ul data-slot="pagination-content" className={cn("flex items-center gap-0.5", className)} {...props} />;
}

function PaginationItem({...props}: React.ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    /** The current page: outlined, `aria-current="page"`. */
    isActive?: boolean;
    /** Element to render instead of `<a>` (e.g. a router link). */
    render?: React.ComponentProps<typeof Button>["render"];
} & Pick<React.ComponentProps<typeof Button>, "size"> &
    Omit<React.ComponentProps<"a">, "color">;

function PaginationLink({className, isActive, size = "icon", render, ...props}: PaginationLinkProps) {
    return (
        <Button
            variant={isActive ? "outline" : "ghost"}
            size={size}
            nativeButton={false}
            aria-current={isActive ? "page" : undefined}
            data-slot="pagination-link"
            data-active={isActive || undefined}
            className={cn(
                "aria-disabled:pointer-events-none aria-disabled:opacity-50 data-active:font-semibold",
                className,
            )}
            render={render ?? <a />}
            {...(props as React.ComponentProps<typeof Button>)}
        />
    );
}

function PaginationPrevious({
    className,
    text = "Previous",
    ...props
}: React.ComponentProps<typeof PaginationLink> & {text?: string}) {
    return (
        <PaginationLink aria-label="Go to previous page" size="default" className={className} {...props}>
            <ChevronLeftIcon data-icon="inline-start" />
            <span className="hidden sm:block">{text}</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    text = "Next",
    ...props
}: React.ComponentProps<typeof PaginationLink> & {text?: string}) {
    return (
        <PaginationLink aria-label="Go to next page" size="default" className={className} {...props}>
            <span className="hidden sm:block">{text}</span>
            <ChevronRightIcon data-icon="inline-end" />
        </PaginationLink>
    );
}

function PaginationEllipsis({className, ...props}: React.ComponentProps<"span">) {
    return (
        <span
            aria-hidden
            data-slot="pagination-ellipsis"
            className={cn(
                "flex size-8 items-center justify-center text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        >
            <MoreHorizontalIcon />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
