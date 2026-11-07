"use client";

import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "cn";
import type {HTMLAttributes, ReactNode} from "react";

const dataTableCellVariants = cva(
    // `dividers` draws vertical separators between columns (driven by the group on DataTable)
    "flex flex-row flex-nowrap items-center overflow-hidden p-2 text-ellipsis whitespace-nowrap group-data-dividers/data-table:not-last:border-r group-data-dividers/data-table:border-border",
    {
        variants: {
            head: {
                // same micro label as <TableHead>
                true: "h-10 py-0 text-xs font-medium text-muted-foreground",
                false: "",
            },
        },
        defaultVariants: {
            head: false,
        },
    },
);

export type DataTableCellProps = HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof dataTableCellVariants> & {
        className?: string;
        children?: ReactNode;
    };

export function DataTableCell({className, head, children, ...props}: DataTableCellProps) {
    return (
        <div
            data-slot={head ? "data-table-head-cell" : "data-table-cell"}
            className={cn(dataTableCellVariants({head}), className)}
            {...props}
        >
            {children}
        </div>
    );
}

export {dataTableCellVariants};
