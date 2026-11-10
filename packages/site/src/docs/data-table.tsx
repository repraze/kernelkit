import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    createDataTableBooleanFilter,
    createDataTableNumberFilter,
    createDataTableNumberSort,
    createDataTableStringFilter,
    createDataTableStringSort,
    DataTable,
    DataTableBody,
    type DataTableColumn,
    type DataTableFilterCellProps,
    DataTableFilterRow,
    DataTableFilterView,
    DataTableFoot,
    DataTableHead,
    DataTableInfoRow,
    DataTablePropView,
    DataTableRootView,
    DataTableSortRow,
    type DataTableSortRowMethod,
    DataTableSortView,
    DataTableTitleRow,
    DataTableVirtualizedBody,
    viewToCsv,
} from "@repraze/kernelkit/components/data-table";
import {StatusDot} from "@repraze/kernelkit/components/status-dot";
import {CheckIcon, CopyIcon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Data table",
    category: "Data display",
    description:
        "A virtualized, sortable and filterable grid for large datasets, driven by composable views over your rows.",
    demos: [
        {
            title: "Sort, filter, 10,000 rows",
            component: Virtualized,
            layout: "full",
            description:
                "Click a header to cycle its sort. Only the visible rows are rendered (`DataTableVirtualizedBody`).",
        },
        {
            title: "Flags",
            component: Flags,
            layout: "full",
            description: "Same flags as `<Table>`: `bordered`, `striped`, `hoverable` (default on), `dividers`.",
        },
        {
            title: "Row props",
            component: RowProps,
            layout: "full",
            description:
                '`DataTablePropView` adds props per row: hot processes (CPU > 75%) get `data-state="selected"`.',
        },
    ],
    props: [
        {
            component: "DataTable",
            rows: [
                {name: "bordered", type: "boolean", default: "false"},
                {name: "striped", type: "boolean", default: "false"},
                {name: "hoverable", type: "boolean", default: "true"},
                {name: "dividers", type: "boolean", default: "false"},
                {name: "expand", type: "boolean", default: "false", description: "Stretch to the container width."},
                {name: "style.height", type: "number", default: "250", description: "The body scrolls inside it."},
            ],
        },
        {
            component: "DataTableColumn<T>",
            rows: [
                {name: "id", type: "string", description: "Key for titles, sorts and filters."},
                {name: "cell", type: "keyof T | (row: T) => ReactNode"},
                {
                    name: "rawCell",
                    type: "keyof T | (row: T) => any",
                    description: "Value used to sort, filter and export.",
                },
                {name: "width", type: "number", description: "Base width in px."},
                {name: "grow / shrink", type: "number", default: "0"},
                {name: "align", type: '"left" | "right" | "center"', default: '"left"'},
            ],
        },
        {
            component: "Views",
            rows: [
                {name: "DataTableRootView", type: "(columns, data)", description: "Source of columns and rows."},
                {name: "DataTableFilterView", type: "(parent)", description: "Driven by DataTableFilterRow."},
                {name: "DataTableSortView", type: "(parent)", description: "Driven by DataTableSortRow."},
                {name: "DataTablePropView", type: "(parent, row => props)", description: "Per-row props / classes."},
                {name: "viewToCsv", type: "(view) => string", description: "Export what the view shows."},
            ],
        },
    ],
});

type Proc = {pid: number; node: string; command: string; cpu: number; memory: number; healthy: boolean};

const NODES = ["edge-fra-01", "edge-fra-02", "core-iad-01", "core-iad-02", "edge-sin-01"];
const COMMANDS = ["nginx", "postgres", "node api.js", "redis-server", "envoy", "otel-collector", "cron", "sshd"];

// Deterministic pseudo-random rows so screenshots are stable.
function makeRows(count: number): Proc[] {
    let seed = 7;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
    };
    return Array.from({length: count}, (_, i) => ({
        pid: 1000 + i,
        node: NODES[Math.floor(rand() * NODES.length)] as string,
        command: COMMANDS[Math.floor(rand() * COMMANDS.length)] as string,
        cpu: Math.round(rand() * 1000) / 10,
        memory: Math.round(rand() * 4096),
        healthy: rand() > 0.12,
    }));
}

const BIG = makeRows(10_000);
const SMALL = makeRows(12);

const COLUMNS: DataTableColumn<Proc>[] = [
    {
        id: "pid",
        cell: (r) => <span className="font-mono tabular-nums">{r.pid}</span>,
        rawCell: "pid",
        width: 64,
        align: "right",
    },
    {id: "node", cell: (r) => <span className="font-mono">{r.node}</span>, rawCell: "node", width: 108, grow: 1},
    {
        id: "command",
        cell: (r) => <span className="font-mono">{r.command}</span>,
        rawCell: "command",
        width: 120,
        grow: 1,
    },
    {
        id: "cpu",
        cell: (r) => <span className="font-mono tabular-nums">{r.cpu.toFixed(1)}</span>,
        rawCell: "cpu",
        width: 88,
        align: "right",
    },
    {
        id: "memory",
        cell: (r) => <span className="font-mono tabular-nums">{r.memory.toLocaleString()} MB</span>,
        rawCell: "memory",
        width: 100,
        align: "right",
    },
    {
        id: "healthy",
        cell: (r) => (
            <StatusDot color={r.healthy ? "success" : "danger"} size="sm">
                {r.healthy ? "healthy" : "failing"}
            </StatusDot>
        ),
        rawCell: "healthy",
        width: 96,
    },
];

const TITLES = {pid: "PID", node: "Node", command: "Command", cpu: "CPU %", memory: "Memory", healthy: "Health"};

const SORTS: Record<string, DataTableSortRowMethod[]> = {
    pid: createDataTableNumberSort(),
    node: createDataTableStringSort(),
    command: createDataTableStringSort(),
    cpu: createDataTableNumberSort(),
    memory: createDataTableNumberSort(),
};

const FILTERS: Record<string, React.ComponentType<DataTableFilterCellProps>> = {
    node: createDataTableStringFilter({inputProps: {placeholder: "filter…", "aria-label": "Filter node"}}),
    command: createDataTableStringFilter({inputProps: {placeholder: "filter…", "aria-label": "Filter command"}}),
    cpu: createDataTableNumberFilter({inputProps: {placeholder: "=", "aria-label": "Filter CPU"}}),
    healthy: createDataTableBooleanFilter({selectProps: {"aria-label": "Filter health"}}),
};

function useViews(
    rows: Proc[],
    rowProps?: (row: Proc) => React.HTMLAttributes<HTMLDivElement>,
    columns: DataTableColumn<Proc>[] = COLUMNS,
) {
    return React.useMemo(() => {
        const root = new DataTableRootView(columns, rows);
        const filter = new DataTableFilterView(root);
        const sort = new DataTableSortView(filter);
        const view = new DataTablePropView(sort, rowProps);
        return {filter, sort, view};
    }, [rows, rowProps, columns]);
}

export function Virtualized() {
    const {filter, sort, view} = useViews(BIG);
    const [copied, setCopied] = React.useState(false);
    return (
        <div className="flex w-full min-w-0 flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processes · all nodes</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        navigator.clipboard
                            .writeText(viewToCsv(view))
                            .then(() => setCopied(true))
                            .catch(() => {});
                    }}
                >
                    {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                    Copy CSV
                </Button>
            </div>
            <DataTable bordered expand style={{height: 380}}>
                <DataTableHead view={view}>
                    <DataTableSortRow view={view} sortView={sort} titles={TITLES} sorts={SORTS} />
                    <DataTableFilterRow view={view} filterView={filter} filters={FILTERS} />
                </DataTableHead>
                <DataTableVirtualizedBody view={view} />
                <DataTableFoot view={view}>
                    <DataTableInfoRow view={view} />
                </DataTableFoot>
            </DataTable>
        </div>
    );
}

const NARROW = COLUMNS.filter((c) => ["pid", "node", "cpu"].includes(c.id));

export function Flags() {
    const {view} = useViews(SMALL, undefined, NARROW);
    return (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-6 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
                <Badge variant="outline">bordered striped</Badge>
                <DataTable bordered striped expand style={{height: 220}}>
                    <DataTableHead view={view}>
                        <DataTableTitleRow view={view} titles={TITLES} />
                    </DataTableHead>
                    <DataTableBody view={view} />
                </DataTable>
            </div>
            <div className="flex flex-col gap-2">
                <Badge variant="outline">bordered dividers</Badge>
                <DataTable bordered dividers expand style={{height: 220}}>
                    <DataTableHead view={view}>
                        <DataTableTitleRow view={view} titles={TITLES} />
                    </DataTableHead>
                    <DataTableBody view={view} />
                </DataTable>
            </div>
        </div>
    );
}

// Mark hot processes (CPU > 75%) as selected.
function hot(row: Proc): React.HTMLAttributes<HTMLDivElement> {
    return row.cpu > 75 ? ({"data-state": "selected"} as React.HTMLAttributes<HTMLDivElement>) : {};
}

export function RowProps() {
    const {sort, view} = useViews(SMALL, hot);
    return (
        <div className="w-full min-w-0 p-6">
            <DataTable bordered expand style={{height: 260}}>
                <DataTableHead view={view}>
                    <DataTableSortRow view={view} sortView={sort} titles={TITLES} sorts={SORTS} />
                </DataTableHead>
                <DataTableBody view={view} />
            </DataTable>
        </div>
    );
}
