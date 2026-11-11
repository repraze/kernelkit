import {Field, FieldDescription, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";
import {Label} from "@repraze/kernelkit/components/label";
import {
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    NumberFieldIncrement,
    NumberFieldInput,
    NumberFieldScrubArea,
} from "@repraze/kernelkit/components/number-field";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Number Field",
    category: "Inputs",
    source: baseUi("number-field"),
    description: "A numeric input with steppers, keyboard and wheel stepping, locale formatting and a scrub area.",
    order: 8,
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes},
        {title: "Scrub area", component: Scrub, description: "Drag the label horizontally to change the value."},
        {title: "Formatting", component: Formatting, description: "`format` takes Intl.NumberFormat options."},
        {title: "States", component: States, description: "Disabled and invalid."},
    ],
    props: [
        {
            component: "NumberField",
            rows: [
                {name: "value / defaultValue", type: "number | null"},
                {name: "min / max", type: "number"},
                {
                    name: "step / smallStep / largeStep",
                    type: "number",
                    default: "1 / 0.1 / 10",
                    description: "Alt / Shift modify the step.",
                },
                {name: "format", type: "Intl.NumberFormatOptions"},
                {name: "allowWheelScrub", type: "boolean", default: "false"},
            ],
        },
        {component: "NumberFieldGroup", rows: [{name: "size", type: '"sm" | "default" | "lg"', default: '"default"'}]},
        {
            component: "NumberFieldScrubArea",
            rows: [
                {
                    name: "direction",
                    type: '"horizontal" | "vertical"',
                    default: '"horizontal"',
                    description: "Renders its own cursor.",
                },
            ],
        },
    ],
});

export function Default() {
    return (
        <NumberField defaultValue={3} min={0} max={64} className="w-36">
            <NumberFieldGroup>
                <NumberFieldInput aria-label="Replicas" />
                <NumberFieldDecrement />
                <NumberFieldIncrement />
            </NumberFieldGroup>
        </NumberField>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["sm", "default", "lg"] as const).map((size) => (
                <NumberField key={size} defaultValue={8080} className="w-32" format={{useGrouping: false}}>
                    <NumberFieldGroup size={size}>
                        <NumberFieldInput aria-label={`Port ${size}`} />
                        <NumberFieldDecrement />
                        <NumberFieldIncrement />
                    </NumberFieldGroup>
                </NumberField>
            ))}
        </div>
    );
}

export function Scrub() {
    return (
        <NumberField id="nf-timeout" defaultValue={30} min={1} max={600} className="w-40">
            <NumberFieldScrubArea>
                <Label htmlFor="nf-timeout">Timeout (s)</Label>
            </NumberFieldScrubArea>
            <NumberFieldGroup>
                <NumberFieldInput />
                <NumberFieldDecrement />
                <NumberFieldIncrement />
            </NumberFieldGroup>
        </NumberField>
    );
}

export function Formatting() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <NumberField defaultValue={0.25} step={0.05} min={0} max={1} format={{style: "percent"}} className="w-32">
                <NumberFieldGroup>
                    <NumberFieldInput aria-label="Error budget" />
                    <NumberFieldDecrement />
                    <NumberFieldIncrement />
                </NumberFieldGroup>
            </NumberField>
            <NumberField defaultValue={1240.5} step={10} format={{style: "currency", currency: "USD"}} className="w-40">
                <NumberFieldGroup>
                    <NumberFieldInput aria-label="Monthly cap" />
                    <NumberFieldDecrement />
                    <NumberFieldIncrement />
                </NumberFieldGroup>
            </NumberField>
        </div>
    );
}

export function States() {
    return (
        <div className="flex flex-wrap items-start gap-4">
            <NumberField defaultValue={2} disabled className="w-32">
                <NumberFieldGroup>
                    <NumberFieldInput aria-label="Workers" />
                    <NumberFieldDecrement />
                    <NumberFieldIncrement />
                </NumberFieldGroup>
            </NumberField>
            <Field data-invalid className="w-44">
                <FieldLabel>Memory (GiB)</FieldLabel>
                <NumberField defaultValue={512}>
                    <NumberFieldGroup>
                        <NumberFieldInput aria-invalid />
                        <NumberFieldDecrement />
                        <NumberFieldIncrement />
                    </NumberFieldGroup>
                </NumberField>
                <FieldDescription>Node limit is 256 GiB.</FieldDescription>
                <FieldError>Exceeds the node limit.</FieldError>
            </Field>
        </div>
    );
}
