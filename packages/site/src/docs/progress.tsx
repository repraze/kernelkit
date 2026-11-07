import {Button} from "kernelkit/components/button";
import {Progress, ProgressLabel, ProgressValue} from "kernelkit/components/progress";
import {useEffect, useState} from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Progress",
    category: "Feedback",
    baseUi: "progress",
    description:
        "How far along a task is: an upload, a build, a rollout. For a static measurement in a range use Meter.",
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes, description: "sm `h-1`, default `h-1.5`, lg `h-2`."},
        {title: "Colors", component: Colors},
        {
            title: "Indeterminate",
            component: Indeterminate,
            description: "`value={null}` when the total is unknown. Reduced motion pulses instead of sweeping.",
        },
        {title: "Live", component: Live},
    ],
    props: [
        {
            component: "Progress",
            rows: [
                {name: "value", type: "number | null", description: "null = indeterminate."},
                {name: "max", type: "number", default: "100"},
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: '"primary"',
                    description: "Indicator fill.",
                },
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {
                    name: "children",
                    type: "ReactNode",
                    description: "ProgressLabel / ProgressValue, rendered on a row above the track.",
                },
            ],
        },
    ],
});

export function Default() {
    return (
        <Progress value={62} className="max-w-sm">
            <ProgressLabel>Uploading artifacts</ProgressLabel>
            <ProgressValue />
        </Progress>
    );
}

export function Sizes() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-5">
            <Progress size="sm" value={30}>
                <ProgressLabel>sm</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Progress value={55}>
                <ProgressLabel>default</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Progress size="lg" value={80}>
                <ProgressLabel>lg</ProgressLabel>
                <ProgressValue />
            </Progress>
        </div>
    );
}

export function Colors() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-5">
            <Progress value={100} color="success">
                <ProgressLabel>Build #4182</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Progress value={48} color="info">
                <ProgressLabel>Reindexing</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Progress value={73} color="warning">
                <ProgressLabel>Draining node-07</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Progress value={21} color="danger">
                <ProgressLabel>Rollback</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Progress value={64} color="neutral">
                <ProgressLabel>Neutral</ProgressLabel>
                <ProgressValue />
            </Progress>
        </div>
    );
}

export function Indeterminate() {
    return (
        <Progress value={null} className="max-w-sm">
            <ProgressLabel>Resolving dependencies</ProgressLabel>
        </Progress>
    );
}

export function Live() {
    const [value, setValue] = useState(0);
    const [running, setRunning] = useState(true);
    useEffect(() => {
        if (!running) {
            return;
        }
        const id = setInterval(() => setValue((v) => (v >= 100 ? 100 : v + 4)), 200);
        return () => clearInterval(id);
    }, [running]);
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <Progress value={value} color={value >= 100 ? "success" : "primary"}>
                <ProgressLabel>{value >= 100 ? "Rollout complete" : "Rolling out v2.14.0"}</ProgressLabel>
                <ProgressValue />
            </Progress>
            <Button
                size="sm"
                variant="outline"
                className="self-start"
                onClick={() => {
                    setValue(0);
                    setRunning(true);
                }}
            >
                Restart
            </Button>
        </div>
    );
}
