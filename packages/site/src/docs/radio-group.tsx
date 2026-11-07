import {Label} from "@repraze/kernelkit/components/label";
import {RadioGroup, RadioGroupItem} from "@repraze/kernelkit/components/radio-group";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Radio Group",
    category: "Inputs",
    baseUi: "radio-group",
    description: "Picks exactly one option from a short, visible list; arrow keys move the selection.",
    demos: [
        {title: "Basic", component: Basic, layout: "start"},
        {
            title: "With descriptions",
            component: WithDescriptions,
            layout: "start",
        },
        {title: "Horizontal", component: Horizontal},
        {
            title: "Disabled and invalid",
            component: States,
            layout: "start",
            description: "Disable one item or the whole group; `aria-invalid` on items flags a required choice.",
        },
    ],
    props: [
        {
            component: "RadioGroup",
            rows: [
                {name: "value", type: "unknown", description: "Selected value (controlled)."},
                {name: "defaultValue", type: "unknown"},
                {name: "onValueChange", type: "(value: unknown) => void"},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "name", type: "string", description: "Form field name."},
            ],
        },
        {
            component: "RadioGroupItem",
            rows: [
                {name: "value", type: "unknown", description: "Value this item selects."},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "aria-invalid", type: "boolean", description: "Danger border and ring."},
            ],
        },
    ],
});

export function Basic() {
    return (
        <RadioGroup defaultValue="rolling" aria-label="Deploy strategy" className="w-fit">
            <Label className="font-normal">
                <RadioGroupItem value="rolling" />
                Rolling update
            </Label>
            <Label className="font-normal">
                <RadioGroupItem value="blue-green" />
                Blue / green
            </Label>
            <Label className="font-normal">
                <RadioGroupItem value="canary" />
                Canary (5% of traffic)
            </Label>
        </RadioGroup>
    );
}

const tiers = [
    {value: "shared", title: "Shared", description: "2 vCPU burstable, scales to zero when idle."},
    {value: "dedicated", title: "Dedicated", description: "4 vCPU pinned, 16 GiB RAM, no noisy neighbours."},
    {value: "gpu", title: "GPU", description: "1× L4 accelerator for inference workloads."},
];

export function WithDescriptions() {
    return (
        <RadioGroup defaultValue="dedicated" aria-label="Instance tier" className="max-w-sm gap-4">
            {tiers.map((tier) => (
                <div key={tier.value} className="flex items-start gap-2">
                    <RadioGroupItem id={`tier-${tier.value}`} value={tier.value} className="mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <Label htmlFor={`tier-${tier.value}`}>{tier.title}</Label>
                        <p className="text-sm text-muted-foreground">{tier.description}</p>
                    </div>
                </div>
            ))}
        </RadioGroup>
    );
}

export function Horizontal() {
    return (
        <RadioGroup defaultValue="info" aria-label="Log level" className="flex w-fit flex-wrap gap-5">
            {["debug", "info", "warn", "error"].map((level) => (
                <Label key={level} className="font-mono font-normal">
                    <RadioGroupItem value={level} />
                    {level}
                </Label>
            ))}
        </RadioGroup>
    );
}

export function States() {
    return (
        <div className="flex flex-wrap gap-12">
            <RadioGroup defaultValue="eu" aria-label="Region" className="w-fit">
                <Label className="font-normal">
                    <RadioGroupItem value="eu" />
                    eu-west-1
                </Label>
                <Label className="font-normal">
                    <RadioGroupItem value="us" disabled />
                    us-east-1 (at capacity)
                </Label>
            </RadioGroup>
            <RadioGroup defaultValue="ssd" aria-label="Disk" disabled className="w-fit">
                <Label className="font-normal">
                    <RadioGroupItem value="ssd" />
                    NVMe SSD
                </Label>
                <Label className="font-normal">
                    <RadioGroupItem value="hdd" />
                    HDD
                </Label>
            </RadioGroup>
            <RadioGroup aria-label="Backup window" className="w-fit">
                <Label className="font-normal">
                    <RadioGroupItem value="night" aria-invalid />
                    02:00 – 04:00 UTC
                </Label>
                <Label className="font-normal">
                    <RadioGroupItem value="day" aria-invalid />
                    14:00 – 16:00 UTC
                </Label>
            </RadioGroup>
        </div>
    );
}
