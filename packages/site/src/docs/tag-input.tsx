import {Field, FieldDescription, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";
import {TagInput, TagInputChip} from "@repraze/kernelkit/components/tag-input";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Tag input",
    category: "Inputs",
    description: "Free-form values as chips: type and press Enter or comma, paste a list, remove with Backspace.",
    order: 6.5,
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes, description: "Same heights as Input; the field grows when chips wrap."},
        {
            title: "Paste a list",
            component: Paste,
            description: "Pasting text with commas, newlines or tabs adds every part. Duplicates are skipped.",
        },
        {
            title: "Validation",
            component: Validation,
            description:
                "`validate` returns a message to reject a tag; it stays in the input and the field turns danger.",
        },
        {title: "Max count", component: MaxCount, description: "Extra tags are refused once `max` is reached."},
        {title: "Controlled", component: Controlled},
        {title: "States", component: States, description: "Disabled and invalid."},
        {title: "Read-only chips", component: ReadOnly, description: "`TagInputChip` on its own, without the field."},
    ],
    props: [
        {
            component: "TagInput",
            rows: [
                {name: "value / defaultValue / onValueChange", type: "string[]"},
                {
                    name: "separators",
                    type: "string[]",
                    default: '["Enter", ","]',
                    description: "Keys that add the typed text.",
                },
                {
                    name: "delimiter",
                    type: "string | RegExp",
                    default: "/[,\\n\\t]/",
                    description: "Splits pasted text into tags.",
                },
                {name: "max", type: "number", description: "Most tags allowed."},
                {name: "allowDuplicates", type: "boolean", default: "false"},
                {
                    name: "validate",
                    type: "(tag: string) => boolean | string",
                    description: "`false` rejects silently, a string rejects with a message.",
                },
                {
                    name: "onValidationError",
                    type: "(message: string | null) => void",
                    description: "The rejection message, then `null` once the text changes.",
                },
                {name: "addOnBlur", type: "boolean", default: "false", description: "Add the pending text on blur."},
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {name: "name", type: "string", description: "One hidden input per tag, for forms."},
                {name: "disabled / aria-invalid", type: "boolean"},
                {name: "inputClassName", type: "string", description: "Classes for the inner input."},
            ],
        },
        {
            component: "TagInputChip",
            rows: [{name: "onRemove", type: "() => void", description: "Shows the × button."}],
        },
    ],
});

export function Default() {
    return (
        <Field className="max-w-sm">
            <FieldLabel htmlFor="tags-default">Labels</FieldLabel>
            <TagInput id="tags-default" defaultValue={["frontend", "urgent"]} placeholder="Add a label…" />
            <FieldDescription>Enter or comma to add, Backspace twice to remove the last one.</FieldDescription>
        </Field>
    );
}

export function Sizes() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-3">
            <TagInput size="sm" aria-label="Small" defaultValue={["sm", "28px"]} />
            <TagInput aria-label="Default" defaultValue={["default", "32px"]} />
            <TagInput size="lg" aria-label="Large" defaultValue={["lg", "36px"]} />
        </div>
    );
}

export function Paste() {
    return (
        <Field className="max-w-sm">
            <FieldLabel htmlFor="tags-paste">Hosts</FieldLabel>
            <TagInput
                id="tags-paste"
                defaultValue={["api-01"]}
                placeholder="Paste a list…"
                inputClassName="font-mono"
            />
            <FieldDescription>
                Try pasting <code className="font-mono">api-02, api-03, db-01</code>.
            </FieldDescription>
        </Field>
    );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Validation() {
    const [error, setError] = React.useState<string | null>(null);
    return (
        <Field className="max-w-sm" data-invalid={error ? "" : undefined}>
            <FieldLabel htmlFor="tags-email">Invite</FieldLabel>
            <TagInput
                id="tags-email"
                defaultValue={["ada@example.com"]}
                placeholder="name@example.com"
                validate={(tag) => EMAIL.test(tag) || `“${tag}” is not an email address.`}
                onValidationError={setError}
            />
            {error ? <FieldError>{error}</FieldError> : <FieldDescription>Comma-separated emails.</FieldDescription>}
        </Field>
    );
}

export function MaxCount() {
    const [tags, setTags] = React.useState(["red", "green"]);
    const [error, setError] = React.useState<string | null>(null);
    return (
        <Field className="max-w-sm" data-invalid={error ? "" : undefined}>
            <FieldLabel htmlFor="tags-max">Colors (up to 3)</FieldLabel>
            <TagInput id="tags-max" value={tags} onValueChange={setTags} max={3} onValidationError={setError} />
            {error ? <FieldError>{error}</FieldError> : <FieldDescription>{3 - tags.length} left.</FieldDescription>}
        </Field>
    );
}

export function Controlled() {
    const [tags, setTags] = React.useState(["linux", "arm64"]);
    return (
        <div className="flex w-full max-w-sm flex-col gap-2">
            <TagInput aria-label="Platforms" value={tags} onValueChange={setTags} placeholder="Add a platform…" />
            <pre className="font-mono text-xs text-muted-foreground">{JSON.stringify(tags)}</pre>
        </div>
    );
}

export function States() {
    return (
        <div className="flex w-full max-w-sm flex-col gap-5">
            <Field data-disabled>
                <FieldLabel htmlFor="tags-disabled">Disabled</FieldLabel>
                <TagInput id="tags-disabled" disabled defaultValue={["locked", "readonly"]} />
            </Field>
            <Field data-invalid>
                <FieldLabel htmlFor="tags-invalid">Invalid</FieldLabel>
                <TagInput id="tags-invalid" aria-invalid defaultValue={["prod"]} />
                <FieldError>At least two environments are required.</FieldError>
            </Field>
        </div>
    );
}

export function ReadOnly() {
    return (
        <ul className="flex flex-wrap gap-1">
            {["typescript", "react", "tailwind", "base-ui"].map((t) => (
                <TagInputChip key={t}>{t}</TagInputChip>
            ))}
        </ul>
    );
}
