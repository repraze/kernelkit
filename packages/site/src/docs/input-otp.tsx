import {REGEXP_ONLY_DIGITS} from "input-otp";
import {Field, FieldDescription, FieldError, FieldLabel} from "kernelkit/components/field";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "kernelkit/components/input-otp";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Input OTP",
    category: "Inputs",
    description: "One-time code entry: slots that fill as you type or paste. Built on input-otp.",
    order: 9,
    demos: [
        {title: "Default", component: Default},
        {title: "Separated groups", component: Separated},
        {title: "With field", component: WithField},
        {title: "Invalid", component: Invalid, description: "`aria-invalid` on InputOTP marks every slot."},
        {title: "Disabled", component: Disabled},
    ],
    props: [
        {
            component: "InputOTP",
            rows: [
                {name: "maxLength", type: "number", description: "Number of characters."},
                {name: "pattern", type: "string", description: "Regex source, e.g. REGEXP_ONLY_DIGITS."},
                {name: "value / onChange", type: "string / (value) => void"},
                {name: "onComplete", type: "(value) => void", description: "Fires when every slot is filled."},
                {name: "containerClassName", type: "string", description: "Class for the slot row."},
            ],
        },
        {component: "InputOTPSlot", rows: [{name: "index", type: "number", description: "Character position."}]},
    ],
});

export function Default() {
    const [value, setValue] = React.useState("4821");
    return (
        <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={value} onChange={setValue}>
            <InputOTPGroup>
                {Array.from({length: 6}, (_, i) => (
                    <InputOTPSlot key={i} index={i} />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
}

export function Separated() {
    return (
        <InputOTP maxLength={6}>
            <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
            </InputOTPGroup>
        </InputOTP>
    );
}

export function WithField() {
    return (
        <Field className="w-fit">
            <FieldLabel htmlFor="otp-2fa">Authenticator code</FieldLabel>
            <InputOTP id="otp-2fa" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                <InputOTPGroup>
                    {Array.from({length: 6}, (_, i) => (
                        <InputOTPSlot key={i} index={i} />
                    ))}
                </InputOTPGroup>
            </InputOTP>
            <FieldDescription>From your authenticator app.</FieldDescription>
        </Field>
    );
}

export function Invalid() {
    const [value, setValue] = React.useState("190274");
    return (
        <Field data-invalid className="w-fit">
            <InputOTP maxLength={6} value={value} onChange={setValue} aria-invalid>
                <InputOTPGroup>
                    {Array.from({length: 6}, (_, i) => (
                        <InputOTPSlot key={i} index={i} />
                    ))}
                </InputOTPGroup>
            </InputOTP>
            <FieldError>Code expired. Request a new one.</FieldError>
        </Field>
    );
}

export function Disabled() {
    return (
        <InputOTP maxLength={4} disabled value="73">
            <InputOTPGroup>
                {Array.from({length: 4}, (_, i) => (
                    <InputOTPSlot key={i} index={i} />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
}
