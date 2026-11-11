import {Field, FieldDescription, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Input",
    category: "Inputs",
    source: baseUi("input"),
    description: "A single-line text field. h-8, the same height as Button and Select.",
    order: 1,
    demos: [
        {title: "Default", component: Default},
        {title: "Types", component: Types},
        {title: "With label", component: WithLabel},
        {title: "States", component: States, description: "Disabled, read-only and `aria-invalid`."},
        {title: "Sizes", component: Sizes, description: "h-7 / h-8 / h-9, like Button and Select."},
    ],
    props: [
        {
            component: "Input",
            rows: [
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "h-7 / h-8 / h-9."},
                {name: "htmlSize", type: "number", description: "The native `size` attribute (width in characters)."},
                {name: "type", type: "string", default: '"text"', description: "Any native input type."},
                {name: "aria-invalid", type: "boolean", description: "Danger border and ring."},
            ],
        },
    ],
});

export function Default() {
    return <Input className="max-w-xs" placeholder="node-01.eu-west.internal" />;
}

export function Types() {
    return (
        <div className="grid w-full max-w-xs gap-3">
            <Input type="email" placeholder="oncall@acme.dev" />
            <Input type="number" placeholder="Replicas" defaultValue={3} />
            <Input type="search" placeholder="Search logs…" />
            <Input type="file" />
        </div>
    );
}

export function WithLabel() {
    return (
        <Field className="max-w-xs">
            <FieldLabel htmlFor="input-cluster">Cluster name</FieldLabel>
            <Input id="input-cluster" placeholder="prod-eu-1" />
            <FieldDescription>Lowercase letters, digits and dashes.</FieldDescription>
        </Field>
    );
}

export function States() {
    return (
        <div className="grid w-full max-w-xs gap-3">
            <Input disabled placeholder="Disabled" />
            <Input readOnly defaultValue="read-only: 10.0.4.12" />
            <Field data-invalid>
                <Input aria-invalid defaultValue="prod_eu" />
                <FieldError>Underscores are not allowed.</FieldError>
            </Field>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="grid w-full max-w-xs gap-3">
            <Input size="sm" placeholder="sm · h-7" />
            <Input placeholder="default · h-8" />
            <Input size="lg" placeholder="lg · h-9" />
        </div>
    );
}
