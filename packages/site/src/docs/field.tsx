import {Button} from "@repraze/kernelkit/components/button";
import {Checkbox} from "@repraze/kernelkit/components/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@repraze/kernelkit/components/input-group";
import {
    NumberField,
    NumberFieldDecrement,
    NumberFieldGroup,
    NumberFieldIncrement,
    NumberFieldInput,
} from "@repraze/kernelkit/components/number-field";
import {RadioGroup, RadioGroupItem} from "@repraze/kernelkit/components/radio-group";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repraze/kernelkit/components/select";
import {Switch} from "@repraze/kernelkit/components/switch";
import {Textarea} from "@repraze/kernelkit/components/textarea";
import {ToggleGroup, ToggleGroupItem} from "@repraze/kernelkit/components/toggle-group";
import {SearchIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Field",
    category: "Inputs",
    baseUi: "field",
    description:
        "Label, control, description and error stacked with consistent spacing. Compose forms from FieldSet and FieldGroup.",
    order: 10,
    demos: [
        {title: "Default", component: Default},
        {
            title: "Form",
            component: Form,
            layout: "start",
            description: "FieldSet › FieldGroup › Field, gap-5 between fields.",
        },
        {title: "Horizontal", component: Horizontal, description: "Label beside a checkbox or switch."},
        {
            title: "Choice cards",
            component: ChoiceCards,
            description:
                "A FieldLabel wrapping a Field becomes a card: hover wash, focus ring, primary border when checked.",
        },
        {
            title: "Invalid",
            component: Invalid,
            description: "`data-invalid` on Field turns the label danger; `aria-invalid` on the control.",
        },
        {title: "Separator", component: Separator},
        {
            title: "Alignment",
            component: Alignment,
            layout: "start",
            description: "Every control family shares the h-7 / h-8 / h-9 scale, so mixed rows line up.",
        },
    ],
    props: [
        {
            component: "Field",
            rows: [
                {
                    name: "orientation",
                    type: '"vertical" | "horizontal" | "responsive"',
                    default: '"vertical"',
                    description: "responsive switches at the FieldGroup @md container size.",
                },
                {name: "data-invalid", type: "boolean", description: "Danger label text."},
                {name: "data-disabled", type: "boolean", description: "Dims the label."},
            ],
        },
        {component: "FieldLegend", rows: [{name: "variant", type: '"legend" | "label"', default: '"legend"'}]},
        {
            component: "FieldError",
            rows: [
                {name: "errors", type: "{message?: string}[]", description: "Deduplicated; several render as a list."},
            ],
        },
    ],
});

export function Default() {
    return (
        <Field className="max-w-xs">
            <FieldLabel htmlFor="field-repo">Repository</FieldLabel>
            <Input id="field-repo" placeholder="acme/platform" />
            <FieldDescription>Owner and name, as on the git host.</FieldDescription>
        </Field>
    );
}

export function Form() {
    return (
        <form className="w-full max-w-md" onSubmit={(e) => e.preventDefault()}>
            <FieldSet>
                <FieldLegend>New service</FieldLegend>
                <FieldDescription>Provisions a deployment, a DNS record and an alert policy.</FieldDescription>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="form-name">Name</FieldLabel>
                        <Input id="form-name" placeholder="billing-worker" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="form-region">Region</FieldLabel>
                        <Select defaultValue="eu-west-3">
                            <SelectTrigger id="form-region" className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="eu-west-3">eu-west-3</SelectItem>
                                <SelectItem value="us-east-1">us-east-1</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="form-notes">Notes</FieldLabel>
                        <Textarea id="form-notes" placeholder="Runbook link, owners…" />
                    </Field>
                    <Field orientation="horizontal">
                        <Button type="submit">Create service</Button>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}

export function Horizontal() {
    return (
        <FieldGroup className="max-w-sm">
            <Field orientation="horizontal">
                <Checkbox id="field-drain" defaultChecked />
                <FieldLabel htmlFor="field-drain">Drain node before upgrade</FieldLabel>
            </Field>
            <Field orientation="horizontal">
                <FieldContent>
                    <FieldLabel htmlFor="field-autoscale">Autoscaling</FieldLabel>
                    <FieldDescription>Add nodes when CPU stays above 70% for 5 min.</FieldDescription>
                </FieldContent>
                <Switch id="field-autoscale" defaultChecked />
            </Field>
        </FieldGroup>
    );
}

export function ChoiceCards() {
    return (
        <RadioGroup defaultValue="rolling" className="w-full max-w-md">
            <FieldLabel htmlFor="plan-rolling">
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Rolling update</FieldTitle>
                        <FieldDescription>Replace pods in batches of 25%. Zero downtime.</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="rolling" id="plan-rolling" />
                </Field>
            </FieldLabel>
            <FieldLabel htmlFor="plan-bluegreen">
                <Field orientation="horizontal">
                    <FieldContent>
                        <FieldTitle>Blue / green</FieldTitle>
                        <FieldDescription>Switch traffic once the new stack is healthy.</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="bluegreen" id="plan-bluegreen" />
                </Field>
            </FieldLabel>
            <FieldLabel htmlFor="plan-recreate">
                <Field orientation="horizontal" data-disabled>
                    <FieldContent>
                        <FieldTitle>Recreate</FieldTitle>
                        <FieldDescription>Disabled for production clusters.</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem value="recreate" id="plan-recreate" disabled />
                </Field>
            </FieldLabel>
        </RadioGroup>
    );
}

export function Invalid() {
    return (
        <Field data-invalid className="max-w-xs">
            <FieldLabel htmlFor="field-cron">Schedule</FieldLabel>
            <Input id="field-cron" aria-invalid defaultValue="*/5 * * *" className="font-mono" />
            <FieldError errors={[{message: "Expected 5 fields, got 4."}, {message: "Expected 5 fields, got 4."}]} />
        </Field>
    );
}

export function Separator() {
    return (
        <FieldGroup className="max-w-xs">
            <Button variant="outline">Continue with SSO</Button>
            <FieldSeparator>or</FieldSeparator>
            <Field>
                <Input placeholder="oncall@acme.dev" aria-label="Email" />
            </Field>
        </FieldGroup>
    );
}

export function Alignment() {
    return (
        <div className="flex flex-col gap-4">
            {(["sm", "default", "lg"] as const).map((size) => (
                <div key={size} className="flex items-center gap-2">
                    <span className="w-12 font-mono text-xs text-muted-foreground">{size}</span>
                    <Input size={size} aria-label={`Host ${size}`} placeholder="host" className="w-20" />
                    <Select defaultValue="tcp">
                        <SelectTrigger size={size} aria-label={`Protocol ${size}`}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tcp">tcp</SelectItem>
                            <SelectItem value="udp">udp</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputGroup size={size} className="w-28">
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupInput placeholder="filter" aria-label={`Filter ${size}`} />
                    </InputGroup>
                    <NumberField defaultValue={3} className="w-26">
                        <NumberFieldGroup size={size}>
                            <NumberFieldInput aria-label={`Replicas ${size}`} />
                            <NumberFieldDecrement />
                            <NumberFieldIncrement />
                        </NumberFieldGroup>
                    </NumberField>
                    <ToggleGroup size={size} variant="outline" spacing={0} defaultValue={["1h"]}>
                        <ToggleGroupItem value="1h">1h</ToggleGroupItem>
                        <ToggleGroupItem value="24h">24h</ToggleGroupItem>
                    </ToggleGroup>
                    <Button size={size}>Apply</Button>
                </div>
            ))}
        </div>
    );
}
