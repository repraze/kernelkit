"use client";

import {cn} from "cn";
import type {HTMLAttributes} from "react";

import {useDataTableSizing} from "../data-table-utils";
import type {DataTableView} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";
import {DataTableRow} from "./data-table-row";
import {DataTableScroll} from "./data-table-scroll";

export type DataTableBodyProps<T> = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    view: DataTableView<T>;
};

export function DataTableBody<T>({className, view, ...props}: DataTableBodyProps<T>) {
    const {columns, data} = useDataTableViewDetector({view});
    const {ref, innerWidth} = useDataTableSizing({columns});

    return (
        <div
            data-slot="data-table-body-container"
            className={cn("relative flex min-h-0 flex-1 flex-col", className)}
            ref={ref}
            {...props}
        >
            <DataTableScroll
                className="min-h-0 w-full flex-1"
                viewportClassName="[&_[data-slot=data-table-row]:not(:last-child)]:border-b"
                style={{minWidth: `${innerWidth}px`}}
            >
                {data.map((row, index) => {
                    const rowProps = view.getRowProps(row);
                    return (
                        <DataTableRow
                            key={index}
                            data={row}
                            columns={columns}
                            even={index % 2 === 1}
                            first={index === 0}
                            last={index === data.length - 1}
                            {...rowProps}
                        />
                    );
                })}
            </DataTableScroll>
        </div>
    );
}
