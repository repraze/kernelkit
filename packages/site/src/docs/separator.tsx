import {Separator} from "@repraze/kernelkit/components/separator";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Separator",
    category: "Layout",
    source: baseUi("separator"),
    description: "A 1px line in the border color that divides content horizontally or vertically.",
    demos: [
        {title: "Horizontal", component: Horizontal},
        {title: "Vertical", component: Vertical, description: "Stretches to the height of a flex row."},
    ],
    props: [
        {
            component: "Separator",
            rows: [{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'}],
        },
    ],
});

export function Horizontal() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-1">
                <h4 className="font-heading text-sm font-medium">node-04.eu-west-1</h4>
                <p className="text-sm text-muted-foreground">8 vCPU · 32 GiB · kernel 6.8</p>
            </div>
            <Separator />
            <p className="text-sm text-muted-foreground">Last heartbeat 2s ago. 14 workloads scheduled.</p>
        </div>
    );
}

export function Vertical() {
    return (
        <div className="flex h-5 items-center gap-3 text-sm">
            <span>Overview</span>
            <Separator orientation="vertical" />
            <span>Deployments</span>
            <Separator orientation="vertical" />
            <span>Logs</span>
            <Separator orientation="vertical" />
            <span>Settings</span>
        </div>
    );
}
