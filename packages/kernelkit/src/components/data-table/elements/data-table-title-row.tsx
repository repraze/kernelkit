"use client";

import {cn} from "cn";
import type {ReactNode} from "react";

import type {DataTableView, DataTableViewColumn} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";
import {DataTableRow} from "./data-table-row";

export type DataTableTitleRow<T> = {
    className?: string;
    view: DataTableView<T>;
    titles?: {[K: string]: ReactNode};
};

export function DataTableTitleRow<T>({className, view, titles, ...props}: DataTableTitleRow<T>) {
    const {columns} = useDataTableViewDetector<T>({view});
    const titleColumns = columns.map<DataTableViewColumn<undefined>>((column) => ({
        ...column,
        cell: () => (titles && column.id in titles ? titles[column.id] : column.id),
        cellProps: () => ({}),
        rawCell: () => undefined,
    }));
    return (
        <DataTableRow
            className={cn("data-table-title-row", className)}
            columns={titleColumns}
            data={undefined}
            head
            {...props}
        />
    );
}
