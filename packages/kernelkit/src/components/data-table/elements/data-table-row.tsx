"use client";

import {cn} from "cn";
import type {HTMLAttributes} from "react";

import type {DataTableViewColumn} from "../views/data-table-view";
import {useDataTableContext} from "./data-table-base";
import {DataTableCell} from "./data-table-cell";

export type DataTableRowProps<T> = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    data: T;
    columns: DataTableViewColumn<T>[];
    head?: boolean;
    even?: boolean;
    first?: boolean;
    last?: boolean;
};

export function DataTableRow<T>({
    className,
    data,
    columns,
    head,
    even,
    first: _first,
    last: _last,
    ...props
}: DataTableRowProps<T>) {
    const {striped} = useDataTableContext();

    return (
        <div
            data-slot="data-table-row"
            data-head={head || undefined}
            className={cn(
                "relative flex flex-row border-border transition-colors duration-100",
                // striped is a plain class so a per-row highlight in `className` wins via tailwind-merge
                !head && striped && even && "bg-muted/50",
                // hover is gated by the `hoverable` flag on DataTable and skips header rows
                !head && "group-data-hoverable/data-table:hover:bg-hover",
                // selected = accent tint + a 2px primary indicator (never shade alone)
                "data-[state=selected]:bg-accent! data-[state=selected]:text-accent-foreground data-[state=selected]:shadow-[inset_2px_0_0_var(--primary)]",
                className,
            )}
            {...props}
        >
            {columns.map((column) => {
                const cellProps = column.cellProps(data);
                return (
                    <DataTableCell key={column.id} style={column.style} head={head} {...cellProps}>
                        {column.cell(data)}
                    </DataTableCell>
                );
            })}
        </div>
    );
}
