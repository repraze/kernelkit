import {Field, FieldDescription, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";
import {PasswordInput} from "@repraze/kernelkit/components/password-input";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Password Input",
    category: "Inputs",
    description: "A password field with a show / hide toggle. Built on InputGroup.",
    order: 7,
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes},
        {title: "With field", component: WithField},
        {title: "States", component: States, description: "Visible by default, disabled, invalid."},
    ],
    props: [
        {
            component: "PasswordInput",
            rows: [
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {name: "visible / defaultVisible", type: "boolean", default: "false"},
                {name: "onVisibleChange", type: "(visible: boolean) => void"},
                {name: "showLabel / hideLabel", type: "string", default: '"Show password" / "Hide password"'},
                {name: "className", type: "string", description: "On the group. Every other prop goes to the <input>."},
            ],
        },
    ],
});

export function Default() {
    return (
        <PasswordInput className="max-w-xs" placeholder="Password" defaultValue="hunter2-prod" aria-label="Password" />
    );
}

export function Sizes() {
    return (
        <div className="grid w-full max-w-xs gap-3">
            <PasswordInput size="sm" placeholder="sm" aria-label="Password sm" />
            <PasswordInput placeholder="default" aria-label="Password default" />
            <PasswordInput size="lg" placeholder="lg" aria-label="Password lg" />
        </div>
    );
}

export function WithField() {
    return (
        <Field className="max-w-xs">
            <FieldLabel htmlFor="pw-db">Database password</FieldLabel>
            <PasswordInput id="pw-db" autoComplete="new-password" />
            <FieldDescription>At least 16 characters. Stored in the vault.</FieldDescription>
        </Field>
    );
}

export function States() {
    return (
        <div className="grid w-full max-w-xs gap-3">
            <PasswordInput
                defaultVisible
                defaultValue="kk_svc_7f3a91"
                aria-label="Service token"
                className="font-mono"
            />
            <PasswordInput disabled defaultValue="rotating" aria-label="Rotating secret" />
            <Field data-invalid>
                <PasswordInput aria-invalid defaultValue="short" aria-label="New password" />
                <FieldError>Too short: 5 of 16 characters.</FieldError>
            </Field>
        </div>
    );
}
