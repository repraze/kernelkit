"use client";

import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import type * as React from "react";

const tableContainerVariants = cva("relative w-full", {
    variants: {
        // `bordered` clips with overflow-hidden so the rounded corners stay clean. Override the overflow
        // via `containerClassName` (e.g. "overflow-auto max-h-96") for a bordered, scrollable frame.
        bordered: {
            true: "overflow-hidden rounded-lg border border-border",
            false: "overflow-x-auto",
        },
    },
    defaultVariants: {bordered: false},
});

interface TableProps extends React.ComponentProps<"table">, VariantProps<typeof tableContainerVariants> {
    containerClassName?: string;
    /** Zebra-stripe even body rows. */
    striped?: boolean;
    /** Row hover wash (on by default). */
    hoverable?: boolean;
    /** Vertical separators between columns. */
    dividers?: boolean;
}

function Table({className, containerClassName, bordered, striped, hoverable = true, dividers, ...props}: TableProps) {
    return (
        <div data-slot="table-container" className={cn(tableContainerVariants({bordered}), containerClassName)}>
            <table
                data-slot="table"
                data-bordered={bordered || undefined}
                data-striped={striped || undefined}
                data-hoverable={hoverable || undefined}
                data-dividers={dividers || undefined}
                className={cn("group/table w-full caption-bottom text-sm", className)}
                {...props}
            />
        </div>
    );
}

function TableHeader({className, ...props}: React.ComponentProps<"thead">) {
    return <thead data-slot="table-header" className={cn("[&_tr]:border-b", className)} {...props} />;
}

function TableBody({className, ...props}: React.ComponentProps<"tbody">) {
    return <tbody data-slot="table-body" className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableFooter({className, ...props}: React.ComponentProps<"tfoot">) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn("border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
            {...props}
        />
    );
}

function TableRow({className, ...props}: React.ComponentProps<"tr">) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "border-b border-border transition-colors duration-100 has-aria-expanded:bg-hover",
                // flags on <Table>: striping targets even body rows; hover skips the header row
                "group-data-striped/table:in-data-[slot=table-body]:even:bg-muted/50",
                "group-data-hoverable/table:not-in-data-[slot=table-header]:hover:bg-hover",
                // selected = accent tint + a 2px primary indicator on the first cell (never shade alone)
                "data-[state=selected]:bg-accent! data-[state=selected]:text-accent-foreground data-[state=selected]:*:first:shadow-[inset_2px_0_0_var(--primary)]",
                className,
            )}
            {...props}
        />
    );
}

function TableHead({className, ...props}: React.ComponentProps<"th">) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "h-10 px-2 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground [&:has([role=checkbox])]:pr-0",
                "group-data-dividers/table:not-last:border-r group-data-dividers/table:border-border",
                className,
            )}
            {...props}
        />
    );
}

function TableCell({className, ...props}: React.ComponentProps<"td">) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
                "group-data-dividers/table:not-last:border-r group-data-dividers/table:border-border",
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({className, ...props}: React.ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn(
                "mt-4 text-sm text-muted-foreground group-data-bordered/table:mt-0 group-data-bordered/table:border-t group-data-bordered/table:border-border group-data-bordered/table:py-2",
                className,
            )}
            {...props}
        />
    );
}

export {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    tableContainerVariants,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
};
export type {TableProps};
