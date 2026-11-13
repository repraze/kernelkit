"use client";

import {fieldSurface} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {XIcon} from "lucide-react";
import * as React from "react";

/**
 * Field that holds chips and a text input, the same surface as `ComboboxChips` (GUIDELINES §4, §6):
 * focus rings the container when the inner input or a chip has keyboard focus.
 */
const tagInputVariants = cva(
    [
        fieldSurface,
        "flex w-full min-w-0 cursor-text flex-wrap items-center gap-1 bg-clip-padding text-base md:text-sm",
        "has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
        "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
        "has-[input[aria-invalid=true]]:border-danger has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-danger/20 dark:has-[input[aria-invalid=true]]:ring-danger/40",
        "data-disabled:cursor-not-allowed data-disabled:bg-field-disabled data-disabled:opacity-50",
    ],
    {
        variants: {
            // Heights match Input (§4); a chip row adds 4px per line when it wraps.
            size: {
                sm: "min-h-7 rounded-md px-2 py-0.5 has-data-[slot=tag-input-chip]:px-0.5 md:text-[0.8rem]",
                default: "min-h-8 px-2.5 py-1 has-data-[slot=tag-input-chip]:px-1",
                lg: "min-h-9 px-3 py-1.5 has-data-[slot=tag-input-chip]:px-1.5",
            },
        },
        defaultVariants: {size: "default"},
    },
);

/** One tag: the `ComboboxChip` look. Keyboard focus (arrows, Backspace on an empty input) rings it. */
const tagInputChipVariants = cva(
    "flex h-5.5 w-fit min-w-0 items-center gap-1 rounded-md border border-border bg-foreground/10 px-1.5 text-xs font-medium whitespace-nowrap text-foreground hc:bg-transparent outline-none transition-[border-color,box-shadow] focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 has-data-[slot=tag-input-chip-remove]:pe-0",
);

type Size = "sm" | "default" | "lg";

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
    const [inner, setInner] = React.useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : inner;
    const set = React.useCallback(
        (next: T) => {
            if (!controlled) {
                setInner(next);
            }
            onChange?.(next);
        },
        [controlled, onChange],
    );
    return [current, set] as const;
}

interface TagInputProps extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "size" | "onChange" | "type" | "max"
> {
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (tags: string[]) => void;
    /** Keys that commit the typed text as a tag. */
    separators?: string[];
    /** Splits pasted text into several tags. */
    delimiter?: string | RegExp;
    /** Most tags allowed; extra ones are ignored. */
    max?: number;
    allowDuplicates?: boolean;
    /** `false` rejects silently, a string rejects with that message (`onValidationError`). */
    validate?: (tag: string) => boolean | string;
    /** Called with the rejection message, then `null` once the text changes or a tag is added. */
    onValidationError?: (message: string | null) => void;
    /** Commit the pending text when the input loses focus. */
    addOnBlur?: boolean;
    size?: Size;
    /** Classes for the inner `<input>` (`className` goes on the field). */
    inputClassName?: string;
}

/**
 * A field of free-form tags. Enter or comma adds the typed text, a paste splits on commas, newlines and
 * tabs. Backspace in an empty input focuses the last tag, a second press removes it; arrows move between
 * tags, Delete / Backspace removes the focused one.
 */
function TagInput({
    value,
    defaultValue = [],
    onValueChange,
    separators = ["Enter", ","],
    delimiter = /[,\n\t]/,
    max,
    allowDuplicates = false,
    validate,
    onValidationError,
    addOnBlur = false,
    size = "default",
    disabled,
    name,
    placeholder,
    className,
    inputClassName,
    onKeyDown,
    onPaste,
    onBlur,
    ref,
    "aria-invalid": ariaInvalid,
    ...inputProps
}: TagInputProps) {
    const [tags, setTags] = useControllable(value, defaultValue, onValueChange);
    const [text, setText] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const chipRefs = React.useRef<(HTMLElement | null)[]>([]);
    const full = max !== undefined && tags.length >= max;

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const report = (message: string | null) => {
        setError(message);
        onValidationError?.(message);
    };

    /** Adds what passes; returns the parts that did not (kept in the input). */
    const add = (candidates: string[]) => {
        const next = [...tags];
        const rejected: string[] = [];
        let message: string | null = null;
        for (const raw of candidates) {
            const tag = raw.trim();
            if (!tag) {
                continue;
            }
            if (max !== undefined && next.length >= max) {
                rejected.push(tag);
                message ??= `At most ${max} tags.`;
                continue;
            }
            if (!allowDuplicates && next.includes(tag)) {
                continue;
            }
            const verdict = validate?.(tag) ?? true;
            if (verdict !== true) {
                rejected.push(tag);
                if (typeof verdict === "string") {
                    message ??= verdict;
                }
                continue;
            }
            next.push(tag);
        }
        if (next.length !== tags.length) {
            setTags(next);
        }
        report(message);
        return rejected;
    };

    const commit = () => {
        if (!text.trim()) {
            return;
        }
        const rejected = add([text]);
        setText(rejected.join(", "));
    };

    const remove = (index: number, focusAfter: "prev" | "next" | "input" = "input") => {
        setTags(tags.filter((_, i) => i !== index));
        report(null);
        const target = focusAfter === "prev" ? index - 1 : index;
        requestAnimationFrame(() => {
            const chip = focusAfter !== "input" && target >= 0 ? chipRefs.current[target] : null;
            // the list shrank by one: `index` now points at what was the next chip
            if (chip && target < tags.length - 1) {
                chip.focus();
            } else {
                inputRef.current?.focus();
            }
        });
    };

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || e.nativeEvent.isComposing) {
            return;
        }
        const el = e.currentTarget;
        if (separators.includes(e.key)) {
            if (text.trim() || e.key !== "Enter") {
                e.preventDefault();
            }
            commit();
        } else if (e.key === "Backspace" && el.selectionStart === 0 && el.selectionEnd === 0 && tags.length) {
            e.preventDefault();
            chipRefs.current[tags.length - 1]?.focus();
        } else if (e.key === "ArrowLeft" && el.selectionStart === 0 && el.selectionEnd === 0 && tags.length) {
            e.preventDefault();
            chipRefs.current[tags.length - 1]?.focus();
        }
    };

    const onChipKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        const prev = rtl ? "ArrowRight" : "ArrowLeft";
        const next = rtl ? "ArrowLeft" : "ArrowRight";
        if (e.key === prev) {
            e.preventDefault();
            chipRefs.current[Math.max(0, index - 1)]?.focus();
        } else if (e.key === next) {
            e.preventDefault();
            (chipRefs.current[index + 1] ?? inputRef.current)?.focus();
        } else if (e.key === "Home") {
            e.preventDefault();
            chipRefs.current[0]?.focus();
        } else if (e.key === "End" || e.key === "Escape") {
            e.preventDefault();
            inputRef.current?.focus();
        } else if (e.key === "Backspace") {
            e.preventDefault();
            remove(index, index > 0 ? "prev" : "next");
        } else if (e.key === "Delete") {
            e.preventDefault();
            remove(index, "next");
        } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
            // typing on a chip goes back to the input
            inputRef.current?.focus();
        }
    };

    const onInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        onPaste?.(e);
        if (e.defaultPrevented) {
            return;
        }
        const pasted = e.clipboardData.getData("text");
        const parts = pasted.split(delimiter);
        if (parts.length < 2) {
            return;
        }
        e.preventDefault();
        const rejected = add([text + parts[0], ...parts.slice(1)]);
        setText(rejected.join(", "));
    };

    const invalid = ariaInvalid === true || ariaInvalid === "true" || error !== null;

    return (
        <div
            data-slot="tag-input"
            data-size={size}
            data-disabled={disabled ? "" : undefined}
            data-full={full ? "" : undefined}
            className={cn(tagInputVariants({size}), className)}
            onMouseDown={(e) => {
                // clicks on the field's padding focus the input, like a native field
                if (e.target === e.currentTarget && !disabled) {
                    e.preventDefault();
                    inputRef.current?.focus();
                }
            }}
        >
            {tags.length > 0 && (
                <ul data-slot="tag-input-list" aria-label="Tags" className="contents">
                    {tags.map((tag, i) => (
                        <TagInputChip
                            key={`${tag}-${i}`}
                            ref={(el) => {
                                chipRefs.current[i] = el;
                            }}
                            tabIndex={-1}
                            onKeyDown={(e) => onChipKeyDown(e, i)}
                            onRemove={disabled ? undefined : () => remove(i)}
                        >
                            {tag}
                        </TagInputChip>
                    ))}
                </ul>
            )}
            <input
                ref={inputRef}
                data-slot="tag-input-input"
                type="text"
                disabled={disabled}
                aria-invalid={invalid || undefined}
                enterKeyHint="enter"
                autoComplete="off"
                placeholder={tags.length ? undefined : placeholder}
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    if (error) {
                        report(null);
                    }
                }}
                onKeyDown={onInputKeyDown}
                onPaste={onInputPaste}
                onBlur={(e) => {
                    onBlur?.(e);
                    if (addOnBlur) {
                        commit();
                    }
                }}
                className={cn(
                    "h-5.5 min-w-16 flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
                    tags.length > 0 && "ps-1",
                    inputClassName,
                )}
                {...inputProps}
            />
            {name && tags.map((tag, i) => <input key={i} type="hidden" name={name} value={tag} />)}
        </div>
    );
}

interface TagInputChipProps extends React.ComponentProps<"li"> {
    /** Shows the × button. */
    onRemove?: () => void;
}

/** A tag chip. Usable on its own for read-only tag lists. */
function TagInputChip({className, children, onRemove, ...props}: TagInputChipProps) {
    return (
        <li data-slot="tag-input-chip" className={cn(tagInputChipVariants(), className)} {...props}>
            <span className="truncate">{children}</span>
            {onRemove && (
                <button
                    type="button"
                    data-slot="tag-input-chip-remove"
                    tabIndex={-1}
                    aria-label={typeof children === "string" ? `Remove ${children}` : "Remove"}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onRemove}
                    className="-ms-0.5 flex size-5 shrink-0 items-center justify-center rounded-box text-muted-foreground transition-[color,background-color] hover:bg-hover hover:text-foreground [&_svg]:size-3"
                >
                    <XIcon className="pointer-events-none" />
                </button>
            )}
        </li>
    );
}

export {TagInput, TagInputChip, tagInputChipVariants, tagInputVariants};
export type {TagInputChipProps, TagInputProps};
