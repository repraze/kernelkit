import {Label} from "kernelkit/components/label";
import {Slider} from "kernelkit/components/slider";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Slider",
    category: "Inputs",
    baseUi: "slider",
    description: "Picks a value or a range along a track by dragging or with the arrow keys.",
    demos: [
        {title: "Basic", component: Basic},
        {
            title: "Range",
            component: Range,
            description: "Pass two values to get two thumbs; `minStepsBetweenValues` keeps them apart.",
        },
        {title: "Steps", component: Steps},
        {title: "Vertical", component: Vertical},
        {title: "Disabled", component: Disabled},
    ],
    props: [
        {
            component: "Slider",
            rows: [
                {
                    name: "value",
                    type: "number | number[]",
                    description: "Controlled value; an array of two for a range.",
                },
                {name: "defaultValue", type: "number | number[]"},
                {name: "onValueChange", type: "(value: number | number[]) => void"},
                {name: "min / max", type: "number", default: "0 / 100"},
                {name: "step", type: "number", default: "1"},
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
                {name: "disabled", type: "boolean", default: "false"},
            ],
        },
    ],
});

export function Basic() {
    const [value, setValue] = React.useState(64);
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <div className="flex items-center justify-between">
                <Label>CPU limit</Label>
                <span className="font-mono text-sm text-muted-foreground">{value}%</span>
            </div>
            <Slider value={value} onValueChange={(v) => setValue(v as number)} aria-label="CPU limit" />
        </div>
    );
}

export function Range() {
    const [value, setValue] = React.useState([200, 800]);
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <div className="flex items-center justify-between">
                <Label>Latency window</Label>
                <span className="font-mono text-sm text-muted-foreground">
                    {value[0]}–{value[1]} ms
                </span>
            </div>
            <Slider
                value={value}
                onValueChange={(v) => setValue(v as number[])}
                min={0}
                max={1000}
                step={10}
                minStepsBetweenValues={5}
                aria-label="Latency window"
            />
        </div>
    );
}

export function Steps() {
    const [value, setValue] = React.useState(3);
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <div className="flex items-center justify-between">
                <Label>Replicas</Label>
                <span className="font-mono text-sm text-muted-foreground">{value}</span>
            </div>
            <Slider
                value={value}
                onValueChange={(v) => setValue(v as number)}
                min={1}
                max={9}
                step={1}
                aria-label="Replicas"
            />
            <div className="flex justify-between font-mono text-xs text-muted-foreground">
                <span>1</span>
                <span>9</span>
            </div>
        </div>
    );
}

export function Vertical() {
    return (
        <div className="flex h-44 items-stretch gap-8">
            <Slider orientation="vertical" defaultValue={70} aria-label="Read IOPS" />
            <Slider orientation="vertical" defaultValue={[25, 60]} aria-label="Memory band" />
            <Slider orientation="vertical" defaultValue={40} aria-label="Write IOPS" />
        </div>
    );
}

export function Disabled() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <Label>Swap size (fixed by node pool)</Label>
            <Slider defaultValue={30} disabled aria-label="Swap size" />
        </div>
    );
}
