import {Field, FieldError, FieldLabel} from "kernelkit/components/field";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "kernelkit/components/select";
import {CpuIcon, ServerIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Select",
    category: "Inputs",
    baseUi: "select",
    description: "Pick one value from a list in a popup. The trigger shares the field look and sizes.",
    order: 4,
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes},
        {title: "Groups", component: Groups},
        {title: "With icons", component: WithIcons},
        {title: "Disabled", component: Disabled, description: "The whole select, or single items."},
        {title: "Invalid", component: Invalid},
    ],
    props: [
        {
            component: "SelectTrigger",
            rows: [
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "h-7 / h-8 / h-9."},
            ],
        },
        {
            component: "SelectContent",
            rows: [
                {
                    name: "alignItemWithTrigger",
                    type: "boolean",
                    default: "true",
                    description: "Overlay the selected item on the trigger (macOS style). false drops the list below.",
                },
                {name: "side / align / sideOffset", type: "Positioner props", default: '"bottom" / "center" / 4'},
            ],
        },
        {
            component: "Select",
            rows: [
                {
                    name: "items",
                    type: "Record<string, ReactNode> | {value, label}[]",
                    description: "Labels for SelectValue.",
                },
                {name: "value / defaultValue", type: "any"},
                {name: "multiple", type: "boolean", default: "false"},
            ],
        },
    ],
});

const regions = [
    {value: "us-east-1", label: "us-east-1"},
    {value: "eu-west-3", label: "eu-west-3"},
    {value: "ap-south-1", label: "ap-south-1"},
];

export function Default() {
    return (
        <Select items={regions} defaultValue="eu-west-3">
            <SelectTrigger className="w-48">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {regions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                        {r.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["sm", "default", "lg"] as const).map((size) => (
                <Select key={size} items={regions} defaultValue="us-east-1">
                    <SelectTrigger size={size} className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {regions.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                                {r.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ))}
        </div>
    );
}

export function Groups() {
    return (
        <Select defaultValue="c6i.large">
            <SelectTrigger className="w-52">
                <SelectValue placeholder="Instance type" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Compute optimized</SelectLabel>
                    <SelectItem value="c6i.large">c6i.large</SelectItem>
                    <SelectItem value="c6i.xlarge">c6i.xlarge</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                    <SelectLabel>Memory optimized</SelectLabel>
                    <SelectItem value="r6i.large">r6i.large</SelectItem>
                    <SelectItem value="r6i.xlarge">r6i.xlarge</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export function WithIcons() {
    return (
        <Select defaultValue="node">
            <SelectTrigger className="w-48">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="node">
                    <ServerIcon /> Node pool
                </SelectItem>
                <SelectItem value="gpu">
                    <CpuIcon /> GPU pool
                </SelectItem>
            </SelectContent>
        </Select>
    );
}

export function Disabled() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Select disabled defaultValue="us-east-1" items={regions}>
                <SelectTrigger className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="us-east-1">us-east-1</SelectItem>
                </SelectContent>
            </Select>
            <Select defaultValue="standard">
                <SelectTrigger className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="standard">standard</SelectItem>
                    <SelectItem value="dedicated" disabled>
                        dedicated (quota)
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export function Invalid() {
    return (
        <Field data-invalid className="w-56">
            <FieldLabel>Runtime</FieldLabel>
            <Select>
                <SelectTrigger aria-invalid className="w-full">
                    <SelectValue placeholder="Choose a runtime" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="node22">node 22</SelectItem>
                    <SelectItem value="bun">bun 1.2</SelectItem>
                </SelectContent>
            </Select>
            <FieldError>Pick a runtime to continue.</FieldError>
        </Field>
    );
}
