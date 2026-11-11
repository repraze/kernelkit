import {ToggleGroup, ToggleGroupItem} from "@repraze/kernelkit/components/toggle-group";
import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BoldIcon,
    ItalicIcon,
    LayoutGridIcon,
    ListIcon,
    TableIcon,
    UnderlineIcon,
} from "lucide-react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Toggle Group",
    category: "Actions",
    source: baseUi("toggle-group"),
    description:
        "A set of toggles with single or multiple selection. `spacing={0}` joins them into a segmented control.",
    order: 4,
    demos: [
        {title: "Single", component: Single, description: "One value at a time (the default)."},
        {title: "Multiple", component: Multiple},
        {title: "Segmented", component: Segmented, description: "`spacing={0}` with the outline variant."},
        {title: "Sizes", component: Sizes},
        {title: "Vertical", component: Vertical},
        {title: "Disabled", component: Disabled},
    ],
    props: [
        {
            component: "ToggleGroup",
            rows: [
                {
                    name: "variant",
                    type: '"default" | "outline"',
                    default: '"default"',
                    description: "Applied to every item.",
                },
                {name: "size", type: '"xs" | "sm" | "default" | "lg"', default: '"default"'},
                {
                    name: "spacing",
                    type: "number",
                    default: "2",
                    description: "Gap in spacing units. 0 joins items: shared borders, outer corners only.",
                },
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
                {name: "multiple", type: "boolean", default: "false"},
                {name: "value / defaultValue", type: "string[]"},
            ],
        },
    ],
});

export function Single() {
    return (
        <ToggleGroup defaultValue={["left"]}>
            <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeftIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenterIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRightIcon />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

export function Multiple() {
    return (
        <ToggleGroup multiple variant="outline" defaultValue={["bold", "italic"]}>
            <ToggleGroupItem value="bold" aria-label="Bold">
                <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
                <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
                <UnderlineIcon />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}

export function Segmented() {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <ToggleGroup variant="outline" spacing={0} defaultValue={["1h"]}>
                <ToggleGroupItem value="15m">15m</ToggleGroupItem>
                <ToggleGroupItem value="1h">1h</ToggleGroupItem>
                <ToggleGroupItem value="24h">24h</ToggleGroupItem>
                <ToggleGroupItem value="7d">7d</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup variant="outline" spacing={0} defaultValue={["grid"]}>
                <ToggleGroupItem value="list" aria-label="List view">
                    <ListIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="grid" aria-label="Grid view">
                    <LayoutGridIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view">
                    <TableIcon />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-col items-start gap-3">
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
                <ToggleGroup key={size} size={size} variant="outline" spacing={0} defaultValue={["logs"]}>
                    <ToggleGroupItem value="logs">Logs</ToggleGroupItem>
                    <ToggleGroupItem value="metrics">Metrics</ToggleGroupItem>
                    <ToggleGroupItem value="traces">Traces</ToggleGroupItem>
                </ToggleGroup>
            ))}
        </div>
    );
}

export function Vertical() {
    return (
        <div className="flex items-start gap-6">
            <ToggleGroup orientation="vertical" variant="outline" spacing={0} defaultValue={["us-east"]}>
                <ToggleGroupItem value="us-east">us-east-1</ToggleGroupItem>
                <ToggleGroupItem value="eu-west">eu-west-3</ToggleGroupItem>
                <ToggleGroupItem value="ap-south">ap-south-1</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup orientation="vertical" defaultValue={["center"]}>
                <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeftIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center">
                    <AlignCenterIcon />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRightIcon />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}

export function Disabled() {
    return (
        <ToggleGroup variant="outline" spacing={0} defaultValue={["stable"]} disabled>
            <ToggleGroupItem value="stable">stable</ToggleGroupItem>
            <ToggleGroupItem value="beta">beta</ToggleGroupItem>
            <ToggleGroupItem value="nightly">nightly</ToggleGroupItem>
        </ToggleGroup>
    );
}
