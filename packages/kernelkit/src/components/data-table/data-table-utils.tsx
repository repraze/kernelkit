"use client";

import {useEffect, useMemo, useRef, useState} from "react";

import type {DataTableView, DataTableViewColumn} from "./views/data-table-view";

// default row height: p-2 (16) + text-sm line-height (20) + 1px border = 37px, matching <Table /> rows
const DEFAULT_ROW_HEIGHT = 37;
const ROW_VERTICAL_PADDING = 16; // p-2 top + bottom
const ROW_BORDER = 1;

export function getTotalColumnWidth<T>(columns: DataTableViewColumn<T>[]): number {
    return columns.reduce((w, c) => w + c.width, 0);
}

// the body uses an overlay scrollbar (ScrollArea) that consumes no width, so no scrollbar gap to add
export function getInnerTableWidth<T>(columns: DataTableViewColumn<T>[], containerWidth?: number): number {
    const columnsWidth = getTotalColumnWidth(columns);
    return Math.max(columnsWidth, containerWidth || 0);
}

export type DataTableSizingProps<T> = {
    columns: DataTableViewColumn<T>[];
    innerRowHeight?: number;
};

export type DataTableSizing = {
    ref: React.RefObject<HTMLDivElement | null>;
    width?: number;
    height?: number;
    inited: boolean;
    innerWidth: number;
    rowHeight: number;
};

export function useDataTableSizing<T>({columns, innerRowHeight}: DataTableSizingProps<T>): DataTableSizing {
    const ref = useRef<HTMLDivElement>(null);

    const [size, setSize] = useState<{width?: number; height?: number}>({});

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) {
                const {width, height} = entry.contentRect;
                setSize((prev) => (prev.width === width && prev.height === height ? prev : {width, height}));
            }
        });
        observer.observe(element);

        // initial measure
        const rect = element.getBoundingClientRect();
        setSize({width: rect.width, height: rect.height});

        return () => observer.disconnect();
    }, []);

    return useMemo(() => {
        return {
            ref,
            width: size.width,
            height: size.height,
            inited: size.width !== undefined,
            innerWidth: getInnerTableWidth(columns, size.width),
            rowHeight:
                innerRowHeight !== undefined ? ROW_VERTICAL_PADDING + innerRowHeight + ROW_BORDER : DEFAULT_ROW_HEIGHT,
        };
    }, [columns, size.width, size.height, innerRowHeight]);
}

export function viewToCsv<T>(view: DataTableView<T>) {
    const columns = view.getColumns();
    const data = view.getData();

    const rows: string[][] = [];
    const cells: string[] = [];
    function addCell(s: any) {
        if (typeof s === "string") {
            if (s.includes('"') || s.includes(",")) {
                cells.push(`"${s.replace(/"/g, '""')}"`);
            } else {
                cells.push(s);
            }
        } else {
            cells.push(s.toString());
        }
    }
    function commitRow() {
        const row = cells.splice(0, cells.length);
        rows.push(row);
    }

    // fill table
    if (columns.length > 0) {
        columns.forEach((c) => {
            addCell(c.id);
        });
        commitRow();

        data.forEach((d) => {
            columns.forEach((c) => {
                addCell(c.rawCell(d));
            });
            commitRow();
        });
    }

    // convert to csv string
    const out = rows.reduce((out, row) => {
        const rowLen = row.length;
        return `${
            out +
            row.reduce((out, cell, i) => {
                return out + cell + (i < rowLen - 1 ? "," : "");
            }, "")
        }\n`;
    }, "");

    return out;
}
