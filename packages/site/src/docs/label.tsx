import {Checkbox} from "kernelkit/components/checkbox";
import {Input} from "kernelkit/components/input";
import {Label} from "kernelkit/components/label";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Label",
    category: "Inputs",
    description: "Accessible name for a control. Dims itself when its peer control is disabled.",
    order: 20,
    demos: [
        {title: "With input", component: WithInput},
        {title: "With checkbox", component: WithCheckbox, description: "Wrap or place next to the control."},
        {title: "Disabled", component: Disabled},
    ],
    props: [{component: "Label", rows: [{name: "htmlFor", type: "string", description: "id of the control."}]}],
});

export function WithInput() {
    return (
        <div className="grid w-full max-w-xs gap-2">
            <Label htmlFor="label-host">Hostname</Label>
            <Input id="label-host" placeholder="db-primary.internal" />
        </div>
    );
}

export function WithCheckbox() {
    return (
        <Label>
            <Checkbox defaultChecked /> Drain node before reboot
        </Label>
    );
}

export function Disabled() {
    return (
        <div className="flex items-center gap-2">
            <Checkbox id="label-disabled" disabled className="peer" />
            <Label htmlFor="label-disabled">Force kill (requires admin)</Label>
        </div>
    );
}
