import {Checkbox} from "@repraze/kernelkit/components/checkbox";
import {CheckboxGroup} from "@repraze/kernelkit/components/checkbox-group";
import {Label} from "@repraze/kernelkit/components/label";
import * as React from "react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Checkbox Group",
    category: "Inputs",
    source: baseUi("checkbox-group"),
    description: "Shares one array value across a set of checkboxes, with an optional select-all parent.",
    demos: [
        {title: "Basic", component: Basic, layout: "start"},
        {
            title: "Select all",
            component: SelectAll,
            layout: "start",
            description:
                "Pass `allValues` to the group and add `<Checkbox parent />`: it checks or clears every child and turns indeterminate in between.",
        },
        {title: "Disabled", component: Disabled, layout: "start"},
    ],
    props: [
        {
            component: "CheckboxGroup",
            rows: [
                {name: "value", type: "string[]", description: "Checked child values (controlled)."},
                {name: "defaultValue", type: "string[]", default: "[]"},
                {name: "onValueChange", type: "(value: string[]) => void"},
                {
                    name: "allValues",
                    type: "string[]",
                    description: "Every child value. Required for a `parent` checkbox.",
                },
                {name: "disabled", type: "boolean", default: "false", description: "Disables every checkbox."},
            ],
        },
    ],
});

export function Basic() {
    const id = React.useId();
    return (
        <CheckboxGroup aria-labelledby={id} defaultValue={["stdout", "audit"]}>
            <p id={id} className="text-sm font-medium">
                Log sinks
            </p>
            <Label className="font-normal">
                <Checkbox value="stdout" />
                stdout
            </Label>
            <Label className="font-normal">
                <Checkbox value="audit" />
                Audit trail
            </Label>
            <Label className="font-normal">
                <Checkbox value="s3" />
                S3 archive
            </Label>
        </CheckboxGroup>
    );
}

const services = ["api-gateway", "auth-service", "billing-worker", "search-indexer"];

export function SelectAll() {
    const [value, setValue] = React.useState(["api-gateway", "billing-worker"]);
    return (
        <CheckboxGroup aria-label="Services to redeploy" value={value} onValueChange={setValue} allValues={services}>
            <Label>
                <Checkbox parent />
                Redeploy all services
                <span className="font-normal text-muted-foreground">
                    ({value.length}/{services.length})
                </span>
            </Label>
            <div className="flex flex-col gap-3 pl-6">
                {services.map((service) => (
                    <Label key={service} className="font-mono font-normal">
                        <Checkbox value={service} />
                        {service}
                    </Label>
                ))}
            </div>
        </CheckboxGroup>
    );
}

export function Disabled() {
    return (
        <CheckboxGroup aria-label="Retention" defaultValue={["7d"]} disabled>
            <Label className="font-normal">
                <Checkbox value="7d" />
                Keep snapshots for 7 days
            </Label>
            <Label className="font-normal">
                <Checkbox value="30d" />
                Keep snapshots for 30 days
            </Label>
        </CheckboxGroup>
    );
}
