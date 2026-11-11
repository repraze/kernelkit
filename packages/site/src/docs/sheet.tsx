import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {Field, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";
import {
    Sheet,
    SheetBody,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@repraze/kernelkit/components/sheet";
import {PanelRightIcon} from "lucide-react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Sheet",
    category: "Overlays",
    source: baseUi("dialog"),
    description: "A dialog that slides in from a screen edge, for side panels, details and filters.",
    order: 3,
    demos: [
        {title: "Details panel", component: DetailsPanel},
        {
            title: "Sides",
            component: Sides,
            description: "`side` picks the edge. The inner corners follow the radius knob.",
        },
    ],
    props: [
        {
            component: "SheetContent",
            rows: [
                {name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"'},
                {name: "showCloseButton", type: "boolean", default: "true"},
            ],
        },
        {
            component: "SheetBody",
            rows: [
                {
                    name: "className",
                    type: "string",
                    description: "Scrolling middle section, padded to match header and footer.",
                },
            ],
        },
    ],
});

const LABELS = [
    ["region", "eu-central-1"],
    ["instance", "c6i.2xlarge"],
    ["kernel", "6.6.87"],
    ["uptime", "41d 6h"],
    ["pods", "38 / 110"],
];

export function DetailsPanel() {
    return (
        <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
                <PanelRightIcon data-icon="inline-start" /> Node details
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>edge-fra-03</SheetTitle>
                    <SheetDescription>Worker node in prod-eu, pool general-purpose.</SheetDescription>
                </SheetHeader>
                <SheetBody>
                    <div className="flex gap-1.5">
                        <Badge variant="soft" color="success">
                            Ready
                        </Badge>
                        <Badge variant="outline">schedulable</Badge>
                    </div>
                    <dl className="flex flex-col gap-2 text-sm">
                        {LABELS.map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-4">
                                <dt className="text-muted-foreground">{k}</dt>
                                <dd className="font-mono">{v}</dd>
                            </div>
                        ))}
                    </dl>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="sheet-taint">Taint</FieldLabel>
                            <Input id="sheet-taint" placeholder="dedicated=gpu:NoSchedule" />
                        </Field>
                    </FieldGroup>
                </SheetBody>
                <SheetFooter>
                    <Button>Apply</Button>
                    <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

export function Sides() {
    return (
        <div className="grid grid-cols-2 gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
                <Sheet key={side}>
                    <SheetTrigger render={<Button variant="outline" className="capitalize" />}>{side}</SheetTrigger>
                    <SheetContent side={side}>
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                            <SheetDescription>Narrow the event stream by source and level.</SheetDescription>
                        </SheetHeader>
                        <SheetFooter>
                            <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            ))}
        </div>
    );
}
