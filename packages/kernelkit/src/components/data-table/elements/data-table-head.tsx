"use client";

import {cn} from "cn";
import type {HTMLAttributes, ReactNode} from "react";

import {useDataTableSizing} from "../data-table-utils";
import type {DataTableView} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";

export type DataTableHeadProps<T> = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    view: DataTableView<T>;
    children?: ReactNode;
};

export function DataTableHead<T>({className, view, children, ...props}: DataTableHeadProps<T>) {
    const {columns} = useDataTableViewDetector({view});
    const {ref, innerWidth} = useDataTableSizing({columns});

    return (
        <div
            data-slot="data-table-head-container"
            className={cn("relative flex shrink-0 grow-0 basis-auto flex-col", className)}
            ref={ref}
            {...props}
        >
            <div
                data-slot="data-table-head"
                className="flex w-full shrink-0 grow-0 flex-col *:data-[slot=data-table-row]:border-b *:data-[slot=data-table-row]:border-border"
                style={{minWidth: `${innerWidth}px`}}
            >
                {children}
            </div>
        </div>
    );
}
