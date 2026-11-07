"use client";

import {cn} from "cn";
import type {HTMLAttributes, ReactNode} from "react";

import {useDataTableSizing} from "../data-table-utils";
import type {DataTableView} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";

export type DataTableFootProps<T> = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    view: DataTableView<T>;
    children?: ReactNode;
};

export function DataTableFoot<T>({className, view, children, ...props}: DataTableFootProps<T>) {
    const {columns} = useDataTableViewDetector({view});
    const {ref, innerWidth} = useDataTableSizing({columns});

    return (
        <div
            data-slot="data-table-foot-container"
            className={cn("relative flex shrink-0 grow-0 basis-auto flex-col", className)}
            ref={ref}
            {...props}
        >
            <div
                data-slot="data-table-foot"
                className="flex w-full shrink-0 grow-0 flex-col *:data-[slot=data-table-row]:border-t *:data-[slot=data-table-row]:border-border *:data-[slot=data-table-row]:bg-muted/50 *:data-[slot=data-table-row]:text-foreground *:data-[slot=data-table-row]:font-medium"
                style={{minWidth: `${innerWidth}px`}}
            >
                {children}
            </div>
        </div>
    );
}
