import {Button} from "@repraze/kernelkit/components/button";
import {Input} from "@repraze/kernelkit/components/input";
import {Label} from "@repraze/kernelkit/components/label";
import {Switch} from "@repraze/kernelkit/components/switch";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Switch",
    category: "Inputs",
    baseUi: "switch",
    description:
        "Turns a setting on or off immediately, like a hardware toggle; use a checkbox when the change waits for a submit.",
    demos: [
        {title: "States", component: States},
        {
            title: "Sizes",
            component: Sizes,
            description: "`sm`, `default` and `lg`. Each centers in the row height of the matching control size.",
        },
        {title: "Settings list", component: SettingsList, layout: "start"},
    ],
    props: [
        {
            component: "Switch",
            rows: [
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {name: "checked", type: "boolean", description: "Controlled state. Pair with `onCheckedChange`."},
                {name: "defaultChecked", type: "boolean", default: "false"},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "aria-invalid", type: "boolean", description: "Danger border and ring."},
            ],
        },
    ],
});

export function States() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <Switch aria-label="Off" />
            <Switch aria-label="On" defaultChecked />
            <Switch aria-label="Disabled" disabled />
            <Switch aria-label="Disabled on" disabled defaultChecked />
            <Switch aria-label="Invalid" aria-invalid />
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
                <Switch size="sm" defaultChecked aria-label="Small" />
                <Button size="sm" variant="outline">
                    sm
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Switch defaultChecked aria-label="Default" />
                <Input className="w-40" defaultValue="default" aria-label="Default" />
            </div>
            <div className="flex items-center gap-2">
                <Switch size="lg" defaultChecked aria-label="Large" />
                <Button size="lg" variant="outline">
                    lg
                </Button>
            </div>
        </div>
    );
}

const settings = [
    {id: "autoscale", title: "Autoscaling", description: "Add nodes when CPU stays above 80% for 5 min.", on: true},
    {id: "spot", title: "Spot instances", description: "Run stateless workers on preemptible capacity.", on: false},
    {id: "telemetry", title: "Telemetry", description: "Ship metrics and traces to the observability stack.", on: true},
];

export function SettingsList() {
    return (
        <div className="flex w-full max-w-md flex-col divide-y divide-border rounded-xl border border-border">
            {settings.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 p-3">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`switch-${s.id}`}>{s.title}</Label>
                        <p className="text-sm text-muted-foreground">{s.description}</p>
                    </div>
                    <Switch id={`switch-${s.id}`} defaultChecked={s.on} />
                </div>
            ))}
        </div>
    );
}
