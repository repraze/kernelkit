"use client";

import {cn} from "cn";

import type {DataTableView, DataTableViewColumn} from "../views/data-table-view";
import {convertColumn, useDataTableViewDetector} from "../views/data-table-view";
import {DataTableRow} from "./data-table-row";

export type DataTableInfoRowProps<T> = {
    className?: string;
    view: DataTableView<T>;
};

export function DataTableInfoRow<T>({className, view, ...props}: DataTableInfoRowProps<T>) {
    const {columns, data} = useDataTableViewDetector<T>({view});
    const columnCount = columns.length;
    const rowCount = data.length;
    const columnWidth = columns.reduce((w, c) => w + c.width, 0);
    const infoColumn: DataTableViewColumn<undefined> = convertColumn({
        id: "info",
        cell: () => (
            <span className="font-alt tabular-nums">
                {rowCount.toLocaleString()} rows · {columnCount} columns
            </span>
        ),
        width: columnWidth,
        grow: 1,
    });
    return (
        <DataTableRow
            className={cn("data-table-row-info", className)}
            columns={[infoColumn]}
            data={undefined}
            head
            {...props}
        />
    );
}
