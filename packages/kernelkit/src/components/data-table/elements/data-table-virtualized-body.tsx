"use client";

import {useVirtualizer} from "@tanstack/react-virtual";
import {cn} from "cn";
import type {HTMLAttributes} from "react";
import {useState} from "react";

import {useDataTableSizing} from "../data-table-utils";
import type {DataTableView} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";
import {DataTableRow} from "./data-table-row";
import {DataTableScroll} from "./data-table-scroll";

export type DataTableVirtualizedBodyProps<T> = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    view: DataTableView<T>;
    innerRowHeight?: number;
    overscan?: number;
};

export function DataTableVirtualizedBody<T>({
    className,
    view,
    innerRowHeight,
    overscan = 12,
    ...props
}: DataTableVirtualizedBodyProps<T>) {
    const {columns, data} = useDataTableViewDetector({view});
    const {ref, innerWidth, rowHeight} = useDataTableSizing({columns, innerRowHeight});

    // callback-ref + state so the virtualizer re-runs once the ScrollArea viewport (the real scrolling
    // element) is mounted; a plain ref wouldn't trigger the re-render TanStack needs to pick it up
    const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

    const virtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => scrollElement,
        estimateSize: () => rowHeight,
        overscan,
    });

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div
            data-slot="data-table-body-container"
            className={cn("relative flex min-h-0 flex-1 flex-col", className)}
            ref={ref}
            {...props}
        >
            <DataTableScroll
                viewportRef={setScrollElement}
                className="min-h-0 w-full flex-1"
                style={{minWidth: `${innerWidth}px`}}
            >
                <div style={{height: `${virtualizer.getTotalSize()}px`, width: "100%", position: "relative"}}>
                    {virtualItems.map((virtualItem) => {
                        const index = virtualItem.index;
                        const row = data[index] as T;
                        const {style: viewStyle, className: rowClassName, ...rowProps} = view.getRowProps(row);
                        return (
                            <DataTableRow
                                key={virtualItem.key}
                                data={row}
                                columns={columns}
                                even={index % 2 === 1}
                                first={index === 0}
                                last={index === data.length - 1}
                                className={cn("border-b", rowClassName)}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                    ...viewStyle,
                                }}
                                {...rowProps}
                            />
                        );
                    })}
                </div>
            </DataTableScroll>
        </div>
    );
}
