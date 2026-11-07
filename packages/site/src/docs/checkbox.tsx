import {Checkbox} from "@repraze/kernelkit/components/checkbox";
import {Label} from "@repraze/kernelkit/components/label";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Checkbox",
    category: "Inputs",
    baseUi: "checkbox",
    description: "Toggles a single option on or off; checked fills with the accent, indeterminate shows a dash.",
    demos: [
        {title: "States", component: States},
        {
            title: "With label",
            component: WithLabel,
            layout: "start",
            description: "Wrap the box in a `Label` so the text is part of the hit area.",
        },
        {
            title: "Indeterminate",
            component: Indeterminate,
            layout: "start",
            description:
                "Set `indeterminate` for a partially selected parent. See Checkbox Group for the managed version.",
        },
        {title: "Invalid", component: Invalid, layout: "start"},
    ],
    props: [
        {
            component: "Checkbox",
            rows: [
                {name: "checked", type: "boolean", description: "Controlled state. Pair with `onCheckedChange`."},
                {name: "defaultChecked", type: "boolean", default: "false"},
                {
                    name: "indeterminate",
                    type: "boolean",
                    default: "false",
                    description: "Shows a dash instead of a check; wins over `checked` visually.",
                },
                {name: "parent", type: "boolean", description: "Controls the children of a `CheckboxGroup`."},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "aria-invalid", type: "boolean", description: "Danger border and ring."},
                {name: "value / name", type: "string", description: "Form value and field name."},
            ],
        },
    ],
});

export function States() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <Checkbox aria-label="Unchecked" />
            <Checkbox aria-label="Checked" defaultChecked />
            <Checkbox aria-label="Indeterminate" indeterminate />
            <Checkbox aria-label="Disabled" disabled />
            <Checkbox aria-label="Disabled checked" disabled defaultChecked />
            <Checkbox aria-label="Invalid" aria-invalid />
        </div>
    );
}

export function WithLabel() {
    return (
        <div className="flex flex-col gap-4">
            <Label>
                <Checkbox defaultChecked />
                Restart pods on config change
            </Label>
            <Label>
                <Checkbox />
                Stream build logs to stdout
            </Label>
            <div className="flex items-start gap-2">
                <Checkbox id="drain-node" defaultChecked className="mt-0.5" />
                <div className="flex flex-col gap-1">
                    <Label htmlFor="drain-node">Drain node before reboot</Label>
                    <p className="text-sm text-muted-foreground">Evicts workloads so the scheduler can move them.</p>
                </div>
            </div>
            <Label>
                <Checkbox disabled />
                Force push to main (locked by policy)
            </Label>
        </div>
    );
}

export function Indeterminate() {
    const [regions, setRegions] = React.useState({"eu-west-1": true, "us-east-1": false, "ap-south-1": true});
    const values = Object.values(regions);
    const all = values.every(Boolean);
    const some = values.some(Boolean);
    return (
        <div className="flex flex-col gap-3">
            <Label>
                <Checkbox
                    checked={all}
                    indeterminate={some && !all}
                    onCheckedChange={(checked) =>
                        setRegions((r) => Object.fromEntries(Object.keys(r).map((k) => [k, checked])) as typeof r)
                    }
                />
                All regions
            </Label>
            <div className="flex flex-col gap-3 pl-6">
                {Object.entries(regions).map(([region, checked]) => (
                    <Label key={region} className="font-mono font-normal">
                        <Checkbox
                            checked={checked}
                            onCheckedChange={(next) => setRegions((r) => ({...r, [region]: next}))}
                        />
                        {region}
                    </Label>
                ))}
            </div>
        </div>
    );
}

export function Invalid() {
    return (
        <div className="flex flex-col gap-2">
            <Label>
                <Checkbox aria-invalid />I accept the data processing agreement
            </Label>
            <p className="text-sm text-danger">Required before provisioning the cluster.</p>
        </div>
    );
}
