"use client";

import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import {heading} from "kernelkit/lib/recipes";

const emptyVariants = cva(
    "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl p-6 text-center text-balance",
    {
        variants: {
            variant: {
                default: "",
                // drop zone / placeholder region: a dashed outline marks where content will appear
                outline: "border border-dashed border-border",
            },
        },
        defaultVariants: {variant: "default"},
    },
);

function Empty({className, variant, ...props}: React.ComponentProps<"div"> & VariantProps<typeof emptyVariants>) {
    return (
        <div
            data-slot="empty"
            data-variant={variant ?? "default"}
            className={cn(emptyVariants({variant}), className)}
            {...props}
        />
    );
}

function EmptyHeader({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-header"
            className={cn("flex max-w-sm flex-col items-center gap-1.5", className)}
            {...props}
        />
    );
}

const emptyMediaVariants = cva(
    "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-transparent",
                icon: "size-10 rounded-lg border border-transparent bg-muted text-foreground hc:border-border [&_svg:not([class*='size-'])]:size-5",
            },
        },
        defaultVariants: {variant: "default"},
    },
);

function EmptyMedia({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
    return (
        <div
            data-slot="empty-icon"
            data-variant={variant}
            className={cn(emptyMediaVariants({variant}), className)}
            {...props}
        />
    );
}

function EmptyTitle({className, ...props}: React.ComponentProps<"div">) {
    return <div data-slot="empty-title" className={cn(heading, "text-sm", className)} {...props} />;
}

function EmptyDescription({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-description"
            className={cn(
                "text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary-text",
                className,
            )}
            {...props}
        />
    );
}

function EmptyContent({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty-content"
            className={cn("flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance", className)}
            {...props}
        />
    );
}

export {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, emptyMediaVariants, EmptyTitle, emptyVariants};
