import {Field, FieldDescription, FieldError, FieldLabel} from "kernelkit/components/field";
import {Textarea} from "kernelkit/components/textarea";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Textarea",
    category: "Inputs",
    description: "A multi-line text field that grows with its content (`field-sizing: content`).",
    order: 2,
    demos: [
        {title: "Default", component: Default},
        {title: "With label", component: WithLabel},
        {title: "States", component: States},
    ],
    props: [
        {
            component: "Textarea",
            rows: [
                {name: "rows", type: "number", description: "Minimum rows; min-h-16 otherwise."},
                {name: "aria-invalid", type: "boolean", description: "Danger border and ring."},
            ],
        },
    ],
});

export function Default() {
    return <Textarea className="max-w-md" placeholder="Describe the incident: impact, timeline, mitigation…" />;
}

export function WithLabel() {
    return (
        <Field className="max-w-md">
            <FieldLabel htmlFor="ta-notes">Release notes</FieldLabel>
            <Textarea
                id="ta-notes"
                defaultValue={"- scheduler: retry evicted pods\n- api: p99 latency down 18%"}
                className="font-mono"
            />
            <FieldDescription>Markdown is supported.</FieldDescription>
        </Field>
    );
}

export function States() {
    return (
        <div className="grid w-full max-w-md gap-3">
            <Textarea disabled placeholder="Disabled while the deploy is running" />
            <Field data-invalid>
                <Textarea aria-invalid defaultValue="rollback" />
                <FieldError>A reason needs at least 20 characters.</FieldError>
            </Field>
        </div>
    );
}
