import {Field, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";
import {NativeSelect, NativeSelectOptGroup, NativeSelectOption} from "@repraze/kernelkit/components/native-select";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Native Select",
    category: "Inputs",
    description: "A styled platform `<select>`: native pickers on mobile, works without JavaScript.",
    order: 5,
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes},
        {title: "Groups", component: Groups},
        {title: "States", component: States},
    ],
    props: [
        {
            component: "NativeSelect",
            rows: [
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "h-7 / h-8 / h-9."},
                {name: "className", type: "string", description: "Applies to the wrapper (width lives here)."},
            ],
        },
    ],
});

export function Default() {
    return (
        <NativeSelect defaultValue="info" aria-label="Log level">
            <NativeSelectOption value="debug">debug</NativeSelectOption>
            <NativeSelectOption value="info">info</NativeSelectOption>
            <NativeSelectOption value="warn">warn</NativeSelectOption>
            <NativeSelectOption value="error">error</NativeSelectOption>
        </NativeSelect>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["sm", "default", "lg"] as const).map((size) => (
                <NativeSelect key={size} size={size} className="w-32" aria-label={`Interval ${size}`}>
                    <NativeSelectOption>30s</NativeSelectOption>
                    <NativeSelectOption>1m</NativeSelectOption>
                    <NativeSelectOption>5m</NativeSelectOption>
                </NativeSelect>
            ))}
        </div>
    );
}

export function Groups() {
    return (
        <NativeSelect className="w-52" defaultValue="pg16" aria-label="Database engine">
            <NativeSelectOptGroup label="PostgreSQL">
                <NativeSelectOption value="pg16">postgres 16</NativeSelectOption>
                <NativeSelectOption value="pg15">postgres 15</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="MySQL">
                <NativeSelectOption value="my8">mysql 8.4</NativeSelectOption>
            </NativeSelectOptGroup>
        </NativeSelect>
    );
}

export function States() {
    return (
        <div className="flex flex-wrap items-start gap-4">
            <NativeSelect disabled aria-label="Region">
                <NativeSelectOption>eu-west-3</NativeSelectOption>
            </NativeSelect>
            <Field data-invalid className="w-48">
                <FieldLabel htmlFor="ns-restart">Restart policy</FieldLabel>
                <NativeSelect id="ns-restart" aria-invalid className="w-full" defaultValue="">
                    <NativeSelectOption value="" disabled>
                        Select a policy
                    </NativeSelectOption>
                    <NativeSelectOption value="always">always</NativeSelectOption>
                    <NativeSelectOption value="on-failure">on-failure</NativeSelectOption>
                </NativeSelect>
                <FieldError>Required.</FieldError>
            </Field>
        </div>
    );
}
