import {Input} from "kernelkit/components/input";
import {Label} from "kernelkit/components/label";
import {estimateStrength, PasswordStrength} from "kernelkit/components/password-strength";
import {useState} from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Password strength",
    category: "Feedback",
    description:
        "A four-segment bar and label that grade a new password from danger to success. Presentational: you pass the score.",
    demos: [
        {
            title: "With an input",
            component: WithInput,
            description:
                "`estimateStrength` is a tiny length and character-class heuristic. Swap in zxcvbn for real policy.",
        },
        {title: "Scores", component: Scores},
        {title: "Custom label", component: CustomLabel},
    ],
    props: [
        {
            component: "PasswordStrength",
            rows: [
                {name: "score", type: "0 | 1 | 2 | 3 | 4", description: "Too weak, weak, fair, good, strong."},
                {name: "label", type: "ReactNode", description: "Overrides the default score label."},
                {name: "empty", type: "boolean", default: "false", description: "Grey state before anything is typed."},
                {name: "hideLabel", type: "boolean", default: "false"},
            ],
        },
        {
            component: "estimateStrength",
            rows: [
                {
                    name: "(password: string)",
                    type: "=> 0 | 1 | 2 | 3 | 4",
                    description: "No dependencies, UX hint only.",
                },
            ],
        },
    ],
});

export function WithInput() {
    const [password, setPassword] = useState("");
    return (
        <div className="flex w-full max-w-xs flex-col gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 12 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength score={estimateStrength(password)} empty={!password} />
        </div>
    );
}

export function Scores() {
    return (
        <div className="grid w-full max-w-xs gap-4">
            <PasswordStrength score={0} empty />
            <PasswordStrength score={0} />
            <PasswordStrength score={1} />
            <PasswordStrength score={2} />
            <PasswordStrength score={3} />
            <PasswordStrength score={4} />
        </div>
    );
}

export function CustomLabel() {
    return <PasswordStrength score={1} label="Found in a breach list" className="w-full max-w-xs" />;
}
