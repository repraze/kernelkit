"use client";

import {cn} from "cn";
import {focusRing} from "kernelkit/lib/recipes";
import {ArrowDownAZIcon, ArrowDownUpIcon, ArrowUpZAIcon, MoveDownIcon, MoveUpIcon} from "lucide-react";
import type {ComponentType, ReactNode} from "react";
import {useCallback, useState} from "react";

import type {DataTableSortFn, DataTableSortView} from "../views/data-table-sort-view";
import type {DataTableView, DataTableViewColumn} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";
import {DataTableRow} from "./data-table-row";

export type DataTableSortIcon = ComponentType<{className?: string}>;

export type DataTableSortRowMethod = {
    id: string;
    icon: DataTableSortIcon;
    label?: string;
    apply?: DataTableSortFn;
};

export type DataTableSortRowProps<T> = {
    className?: string;
    view: DataTableView<T>;
    sortView: DataTableSortView<T>;
    titles?: {[K: string]: ReactNode};
    sorts?: {[K: string]: DataTableSortRowMethod[]};
};

export function DataTableSortRow<T>({className, view, sortView, titles, sorts, ...props}: DataTableSortRowProps<T>) {
    const {columns} = useDataTableViewDetector<T>({view});
    const [selectedIds, setSelectedId] = useState<{[K: string]: string | undefined}>({});
    const handleSort = useCallback(
        (columnId: string, currentId: string) => {
            const sortList = sorts && columnId in sorts ? sorts[columnId] : undefined;
            if (sortList) {
                const index = sortList.findIndex((s) => s.id === currentId);
                const nextIndex = index === -1 ? 0 : (index + 1) % sortList.length;
                const nextSort = sortList[nextIndex];

                if (nextSort?.apply) {
                    // apply next sort
                    setSelectedId({[columnId]: nextSort.id});
                    sortView.setSorts({[columnId]: nextSort.apply});
                } else {
                    // no sort, remove sort
                    setSelectedId({});
                    sortView.setSorts({});
                }
            } else {
                // no list, remove sort
                setSelectedId({});
                sortView.setSorts({});
            }
        },
        [sortView, sorts],
    );
    const sortColumns = columns.map<DataTableViewColumn<undefined>>((column) => {
        const columnId = column.id;
        const title = titles && columnId in titles ? titles[columnId] : columnId;
        const sortList = sorts && columnId in sorts ? sorts[columnId] : undefined;
        if (sortList && sortList.length > 0) {
            const sortId = selectedIds[columnId];
            const sort = sortId ? sortList.find((s) => s.id === sortId) : sortList[0];
            const usedId = sort ? sort.id : (sortList[0]?.id ?? "");
            const SortIcon = sort?.icon;
            const active = !!sort?.apply;
            // right-aligned columns read better with the sort icon on the left of the label so it isn't
            // crammed against the right edge; other alignments keep the label growing with the icon trailing
            const alignRight = column.style.textAlign === "right";
            const icon = SortIcon ? (
                <SortIcon
                    aria-hidden="true"
                    className={cn("size-3.5 shrink-0", active ? "text-primary-text" : "text-muted-foreground")}
                />
            ) : null;
            const label = <span className="min-w-0 truncate">{title}</span>;
            return {
                ...column,
                cell: () => (
                    <button
                        type="button"
                        data-slot="data-table-sort-button"
                        data-active={active || undefined}
                        title={sort?.label}
                        aria-label={
                            sort?.label ? `${typeof title === "string" ? title : columnId}: ${sort.label}` : undefined
                        }
                        onClick={() => handleSort(columnId, usedId)}
                        className={cn(
                            focusRing,
                            "-mx-1 flex h-7 min-w-0 flex-1 cursor-pointer items-center gap-1.5 rounded-md border border-transparent px-1 transition-[color,background-color,border-color,box-shadow] duration-100 select-none hover:bg-hover hover:text-foreground data-active:text-foreground",
                            alignRight && "justify-end",
                        )}
                    >
                        {alignRight ? (
                            <>
                                {icon}
                                {label}
                            </>
                        ) : (
                            <>
                                {label}
                                {icon}
                            </>
                        )}
                    </button>
                ),
                cellProps: () => ({
                    "aria-sort": active ? (sort?.id.endsWith("desc") ? "descending" : "ascending") : undefined,
                }),
                rawCell: () => undefined,
            };
        } else {
            // fallback to regular title
            return {
                ...column,
                cell: () => title,
                cellProps: () => ({}),
                rawCell: () => undefined,
            };
        }
    });
    return (
        <DataTableRow
            className={cn("data-table-sort-row", className)}
            columns={sortColumns}
            data={undefined}
            head
            {...props}
        />
    );
}

export function createDataTableStringSort(): DataTableSortRowMethod[] {
    return [
        {
            id: "str-none",
            icon: ArrowDownUpIcon,
            label: "None",
        },
        {
            id: "str-asc",
            icon: ArrowDownAZIcon,
            label: "Ascending",
            apply: (a, b) => a.toString().localeCompare(b.toString()),
        },
        {
            id: "str-desc",
            icon: ArrowUpZAIcon,
            label: "Descending",
            apply: (a, b) => b.toString().localeCompare(a.toString()),
        },
    ];
}

export function createDataTableNumberSort(): DataTableSortRowMethod[] {
    return [
        {
            id: "num-none",
            icon: ArrowDownUpIcon,
            label: "None",
        },
        {
            id: "num-asc",
            icon: MoveDownIcon,
            label: "Ascending",
            apply: (a, b) => a - b,
        },
        {
            id: "num-desc",
            icon: MoveUpIcon,
            label: "Descending",
            apply: (a, b) => b - a,
        },
    ];
}

export const createDataTableDateSort = createDataTableNumberSort; // alias
