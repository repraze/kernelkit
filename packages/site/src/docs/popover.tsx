import {Button} from "@repraze/kernelkit/components/button";
import {Field, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@repraze/kernelkit/components/popover";
import {SlidersHorizontalIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Popover",
    category: "Overlays",
    baseUi: "popover",
    description: "A floating panel anchored to a trigger, for small forms and details that don't need a modal.",
    order: 5,
    demos: [
        {title: "Form", component: FormPopover},
        {
            title: "Placement",
            component: Placement,
            description: "`side` and `align` place it; it flips when there is no room.",
        },
    ],
    props: [
        {
            component: "PopoverContent",
            rows: [
                {name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"'},
                {name: "align", type: '"start" | "center" | "end"', default: '"center"'},
                {name: "sideOffset / alignOffset", type: "number", default: "4 / 0"},
            ],
        },
    ],
});

export function FormPopover() {
    return (
        <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
                <SlidersHorizontalIcon data-icon="inline-start" /> Resource limits
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Resource limits</PopoverTitle>
                    <PopoverDescription>Applied to every replica of api.</PopoverDescription>
                </PopoverHeader>
                <FieldGroup className="gap-3">
                    <Field orientation="horizontal">
                        <FieldLabel htmlFor="pop-cpu" className="w-20">
                            CPU
                        </FieldLabel>
                        <Input id="pop-cpu" defaultValue="500m" className="font-mono" />
                    </Field>
                    <Field orientation="horizontal">
                        <FieldLabel htmlFor="pop-mem" className="w-20">
                            Memory
                        </FieldLabel>
                        <Input id="pop-mem" defaultValue="512Mi" className="font-mono" />
                    </Field>
                </FieldGroup>
            </PopoverContent>
        </Popover>
    );
}

export function Placement() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
                <Popover key={side}>
                    <PopoverTrigger render={<Button variant="outline" className="capitalize" />}>{side}</PopoverTrigger>
                    <PopoverContent side={side} className="w-56">
                        <PopoverHeader>
                            <PopoverTitle>edge-fra-03</PopoverTitle>
                            <PopoverDescription>Ready · 38 pods · 41d uptime</PopoverDescription>
                        </PopoverHeader>
                    </PopoverContent>
                </Popover>
            ))}
        </div>
    );
}
