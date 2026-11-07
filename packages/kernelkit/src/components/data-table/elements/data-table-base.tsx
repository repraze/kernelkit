"use client";

import {cva} from "class-variance-authority";
import {cn} from "cn";
import type {CSSProperties, HTMLAttributes, ReactNode} from "react";
import {createContext, useContext, useMemo} from "react";

// `striped` is provided via context (not the group) so it can be applied as a plain background class on
// each row. That lets a per-row override (e.g. a data-driven highlight passed through DataTablePropView)
// win via tailwind-merge instead of losing to the higher-specificity group selector.
const DataTableContext = createContext<{striped?: boolean}>({});

export function useDataTableContext() {
    return useContext(DataTableContext);
}

/** The frame. Same flags as `<Table>`: `bordered`, `striped`, `hoverable` (default on), `dividers`. */
export const dataTableVariants = cva(
    "group/data-table relative flex max-w-full flex-col overflow-x-auto overflow-y-hidden text-sm data-expand:min-w-full",
    {
        variants: {
            bordered: {
                true: "rounded-lg border border-border",
                false: "",
            },
        },
        defaultVariants: {bordered: false},
    },
);

export type DataTableProps = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    /** Stretch to the container width (min-w-full). */
    expand?: boolean;
    /** Zebra-stripe odd rows. */
    striped?: boolean;
    /** Row hover wash (on by default). */
    hoverable?: boolean;
    /** Rounded border frame (matches the bordered `<Table>`). */
    bordered?: boolean;
    /** Vertical separators between columns. */
    dividers?: boolean;
    children?: ReactNode;
};

export function DataTable({
    className,
    expand,
    striped,
    hoverable = true,
    bordered,
    dividers,
    style,
    children,
    ...props
}: DataTableProps) {
    const mergedStyle: CSSProperties = {height: 250, ...style};

    const context = useMemo(() => ({striped}), [striped]);

    return (
        <DataTableContext.Provider value={context}>
            <div
                data-slot="data-table"
                data-expand={expand || undefined}
                data-hoverable={hoverable || undefined}
                data-bordered={bordered || undefined}
                data-striped={striped || undefined}
                data-dividers={dividers || undefined}
                className={cn(dataTableVariants({bordered: !!bordered}), className)}
                style={mergedStyle}
                {...props}
            >
                {children}
            </div>
        </DataTableContext.Provider>
    );
}
