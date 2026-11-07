import {Meter, MeterLabel, MeterValue} from "@repraze/kernelkit/components/meter";
import type {Color} from "@repraze/kernelkit/lib/color";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Meter",
    category: "Feedback",
    baseUi: "meter",
    description: "A measurement within a known range: disk usage, memory, quota. Shares Progress's look and sizes.",
    demos: [
        {title: "Default", component: Default},
        {
            title: "Thresholds",
            component: Thresholds,
            description: "Pick the color from the value: success under 70%, warning under 90%, danger above.",
        },
        {title: "Custom range and format", component: CustomRange},
        {title: "Sizes", component: Sizes},
    ],
    props: [
        {
            component: "Meter",
            rows: [
                {name: "value", type: "number", description: "Required."},
                {name: "min / max", type: "number", default: "0 / 100"},
                {name: "format", type: "Intl.NumberFormatOptions", description: "Formats MeterValue."},
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: '"primary"',
                },
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
            ],
        },
    ],
});

export function Default() {
    return (
        <Meter value={42} className="max-w-sm">
            <MeterLabel>Memory</MeterLabel>
            <MeterValue />
        </Meter>
    );
}

function threshold(value: number): Color {
    return value < 70 ? "success" : value < 90 ? "warning" : "danger";
}

export function Thresholds() {
    const volumes = [
        {name: "/", used: 38},
        {name: "/var/lib/docker", used: 76},
        {name: "/var/log", used: 94},
    ];
    return (
        <div className="flex w-full max-w-sm flex-col gap-5">
            {volumes.map((v) => (
                <Meter key={v.name} value={v.used} color={threshold(v.used)}>
                    <MeterLabel className="font-mono text-xs">{v.name}</MeterLabel>
                    <MeterValue />
                </Meter>
            ))}
        </div>
    );
}

export function CustomRange() {
    return (
        <Meter
            value={1.6}
            max={2}
            format={{style: "unit", unit: "terabyte", maximumFractionDigits: 1}}
            className="max-w-sm"
        >
            <MeterLabel>Object storage</MeterLabel>
            <MeterValue>{(formatted) => `${formatted} of 2 TB`}</MeterValue>
        </Meter>
    );
}

export function Sizes() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-5">
            <Meter size="sm" value={25} aria-label="CPU, small">
                <MeterLabel>sm</MeterLabel>
            </Meter>
            <Meter value={50}>
                <MeterLabel>default</MeterLabel>
            </Meter>
            <Meter size="lg" value={75}>
                <MeterLabel>lg</MeterLabel>
            </Meter>
        </div>
    );
}
