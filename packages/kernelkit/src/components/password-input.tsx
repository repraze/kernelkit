"use client";

import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "kernelkit/components/input-group";
import {EyeIcon, EyeOffIcon} from "lucide-react";
import * as React from "react";

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type" | "size"> {
    /** Field height, as InputGroup (§4). */
    size?: "sm" | "default" | "lg";
    /** Controlled visibility. */
    visible?: boolean;
    /** Initial visibility when uncontrolled. */
    defaultVisible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    /** Accessible names of the toggle button. */
    showLabel?: string;
    hideLabel?: string;
}

/** Password field with a show / hide toggle. `className` styles the group; other props go to the `<input>`. */
function PasswordInput({
    className,
    size = "default",
    visible: visibleProp,
    defaultVisible = false,
    onVisibleChange,
    showLabel = "Show password",
    hideLabel = "Hide password",
    disabled,
    ...props
}: PasswordInputProps) {
    const [visibleState, setVisibleState] = React.useState(defaultVisible);
    const visible = visibleProp ?? visibleState;
    const toggle = () => {
        setVisibleState(!visible);
        onVisibleChange?.(!visible);
    };

    return (
        <InputGroup data-slot="password-input" size={size} className={className}>
            <InputGroupInput
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                spellCheck={false}
                disabled={disabled}
                {...props}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    data-slot="password-input-toggle"
                    size="icon-xs"
                    aria-label={visible ? hideLabel : showLabel}
                    aria-pressed={visible}
                    disabled={disabled}
                    onClick={toggle}
                    className="text-muted-foreground hover:text-foreground"
                >
                    {visible ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}

export {PasswordInput};
export type {PasswordInputProps};
