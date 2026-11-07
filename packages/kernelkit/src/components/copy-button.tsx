"use client";

import {cn} from "cn";
import {Button, type ButtonProps} from "kernelkit/components/button";
import {CheckIcon, CopyIcon} from "lucide-react";
import * as React from "react";

interface CopyButtonProps extends Omit<ButtonProps, "value" | "onCopy"> {
    /** Text to copy, or a function returning it (read at click time). */
    value: string | (() => string);
    /** Called after a successful copy. */
    onCopy?: (value: string) => void;
    /** How long the check mark shows, in ms. */
    timeout?: number;
    /** Accessible name before / after copying. */
    label?: string;
    copiedLabel?: string;
}

/**
 * Copies `value` to the clipboard and shows a check for `timeout` ms. Icon-only by default (ghost,
 * `size="icon"`; `"default"` when it has children); pass children for a labelled button, e.g. `<CopyButton size="sm">Copy</CopyButton>`.
 */
function CopyButton({
    value,
    onCopy,
    timeout = 2000,
    label = "Copy to clipboard",
    copiedLabel = "Copied",
    variant = "ghost",
    size,
    className,
    children,
    onClick,
    ...props
}: CopyButtonProps) {
    const [copied, setCopied] = React.useState(false);
    const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    React.useEffect(() => () => clearTimeout(timer.current), []);

    const copy: ButtonProps["onClick"] = async (event) => {
        onClick?.(event);
        const text = typeof value === "function" ? value() : value;
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            return;
        }
        setCopied(true);
        onCopy?.(text);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
    };

    const Icon = copied ? CheckIcon : CopyIcon;
    const iconOnly = children === undefined;

    return (
        <Button
            data-slot="copy-button"
            data-copied={copied || undefined}
            variant={variant}
            size={size ?? (iconOnly ? "icon" : "default")}
            aria-label={iconOnly ? (copied ? copiedLabel : label) : undefined}
            className={cn("data-copied:[&_svg]:text-success", className)}
            onClick={copy}
            {...props}
        >
            <Icon data-icon={iconOnly ? undefined : "inline-start"} />
            {children}
            <span className="sr-only" aria-live="polite">
                {copied ? copiedLabel : ""}
            </span>
        </Button>
    );
}

export {CopyButton};
export type {CopyButtonProps};
