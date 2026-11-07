import {Badge} from "@repraze/kernelkit/components/badge";
import {Checkbox} from "@repraze/kernelkit/components/checkbox";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@repraze/kernelkit/components/table";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Table",
    category: "Data display",
    description: "A semantic HTML table with row hover, selection and optional frame, stripes and column dividers.",
    demos: [
        {title: "Default", component: Default},
        {title: "Bordered", component: Bordered, description: "`bordered` frames the table in a rounded border."},
        {title: "Striped", component: Striped, description: "`striped` zebra-stripes the body rows."},
        {title: "Dividers", component: Dividers, description: "`dividers` adds vertical lines between columns."},
        {
            title: "Selection",
            component: Selection,
            description: 'Selected rows (`data-state="selected"`) get the accent tint and a primary indicator.',
        },
        {title: "Footer and caption", component: WithFooter},
    ],
    props: [
        {
            component: "Table",
            rows: [
                {
                    name: "bordered",
                    type: "boolean",
                    default: "false",
                    description: "Rounded border frame (clips overflow).",
                },
                {name: "striped", type: "boolean", default: "false", description: "Zebra-stripe even body rows."},
                {name: "hoverable", type: "boolean", default: "true", description: "Row hover wash."},
                {name: "dividers", type: "boolean", default: "false", description: "Vertical column separators."},
                {
                    name: "containerClassName",
                    type: "string",
                    description: 'Classes for the wrapper div, e.g. "max-h-96 overflow-auto".',
                },
            ],
        },
        {
            component: "TableRow",
            rows: [{name: "data-state", type: '"selected"', description: "Marks the row as selected."}],
        },
    ],
});

const PROCESSES = [
    {pid: 1, name: "systemd", user: "root", cpu: 0.1, mem: "12.4 MB", state: "sleeping"},
    {pid: 812, name: "postgres", user: "postgres", cpu: 14.2, mem: "1.8 GB", state: "running"},
    {pid: 1044, name: "nginx", user: "www-data", cpu: 2.7, mem: "48.0 MB", state: "running"},
    {pid: 2210, name: "node api.js", user: "deploy", cpu: 31.5, mem: "612 MB", state: "running"},
    {pid: 3307, name: "backup.sh", user: "root", cpu: 0.0, mem: "3.1 MB", state: "zombie"},
];

const stateColor = {running: "success", sleeping: "neutral", zombie: "danger"} as const;

function ProcessRows() {
    return (
        <>
            {PROCESSES.map((p) => (
                <TableRow key={p.pid}>
                    <TableCell className="font-mono tabular-nums">{p.pid}</TableCell>
                    <TableCell className="font-mono">{p.name}</TableCell>
                    <TableCell>{p.user}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{p.cpu.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{p.mem}</TableCell>
                    <TableCell>
                        <Badge variant="soft" color={stateColor[p.state as keyof typeof stateColor]}>
                            {p.state}
                        </Badge>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

function ProcessHead() {
    return (
        <TableHeader>
            <TableRow>
                <TableHead className="w-16">PID</TableHead>
                <TableHead>Command</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">CPU %</TableHead>
                <TableHead className="text-right">Memory</TableHead>
                <TableHead>State</TableHead>
            </TableRow>
        </TableHeader>
    );
}

export function Default() {
    return (
        <Table>
            <ProcessHead />
            <TableBody>
                <ProcessRows />
            </TableBody>
        </Table>
    );
}

export function Bordered() {
    return (
        <Table bordered>
            <ProcessHead />
            <TableBody>
                <ProcessRows />
            </TableBody>
        </Table>
    );
}

export function Striped() {
    return (
        <Table bordered striped>
            <ProcessHead />
            <TableBody>
                <ProcessRows />
            </TableBody>
        </Table>
    );
}

export function Dividers() {
    return (
        <Table bordered dividers>
            <ProcessHead />
            <TableBody>
                <ProcessRows />
            </TableBody>
        </Table>
    );
}

export function Selection() {
    const [selected, setSelected] = React.useState<Set<number>>(new Set([812, 2210]));
    const all = selected.size === PROCESSES.length;
    const toggle = (pid: number) =>
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(pid)) {
                next.delete(pid);
            } else {
                next.add(pid);
            }
            return next;
        });
    return (
        <Table bordered>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-8">
                        <Checkbox
                            aria-label="Select all"
                            checked={all}
                            indeterminate={!all && selected.size > 0}
                            onCheckedChange={() => setSelected(all ? new Set() : new Set(PROCESSES.map((p) => p.pid)))}
                        />
                    </TableHead>
                    <TableHead>PID</TableHead>
                    <TableHead>Command</TableHead>
                    <TableHead className="text-right">CPU %</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {PROCESSES.map((p) => (
                    <TableRow key={p.pid} data-state={selected.has(p.pid) ? "selected" : undefined}>
                        <TableCell>
                            <Checkbox
                                aria-label={`Select ${p.name}`}
                                checked={selected.has(p.pid)}
                                onCheckedChange={() => toggle(p.pid)}
                            />
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">{p.pid}</TableCell>
                        <TableCell className="font-mono">{p.name}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums">{p.cpu.toFixed(1)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function WithFooter() {
    const total = PROCESSES.reduce((sum, p) => sum + p.cpu, 0);
    return (
        <Table bordered>
            <TableCaption>Snapshot of edge-fra-01 at 14:02:11 UTC.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Command</TableHead>
                    <TableHead className="text-right">CPU %</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {PROCESSES.map((p) => (
                    <TableRow key={p.pid}>
                        <TableCell className="font-mono">{p.name}</TableCell>
                        <TableCell className="text-right font-mono tabular-nums">{p.cpu.toFixed(1)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{total.toFixed(1)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
