"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {Spinner} from "@repraze/kernelkit/components/spinner";
import {focusRing} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {CheckIcon, SkipForwardIcon, XIcon} from "lucide-react";
import * as React from "react";

type StepperOrientation = "horizontal" | "vertical";
/** Where a step stands against the current one. */
type StepState = "completed" | "current" | "upcoming";

interface StepperContextValue {
    value: number;
    setValue: (step: number) => void;
    orientation: StepperOrientation;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

interface StepperItemContextValue {
    step: number;
    state: StepState;
    error: boolean;
    loading: boolean;
    disabled: boolean;
    skipped: boolean;
    /** `completed` was passed explicitly (a selected step keeps its check). */
    done: boolean;
    orientation: StepperOrientation;
}

const StepperItemContext = React.createContext<StepperItemContextValue | null>(null);

function useStepper() {
    const ctx = React.useContext(StepperContext);
    if (!ctx) {
        throw new Error("Stepper parts must be used inside <Stepper>.");
    }
    return ctx;
}

function useStepperItem() {
    const ctx = React.useContext(StepperItemContext);
    if (!ctx) {
        throw new Error("Stepper item parts must be used inside <StepperItem>.");
    }
    return ctx;
}

/** Data attributes every part carries, so each styles itself from its own state (§4). */
function itemState(item: StepperItemContextValue) {
    return {
        "data-state": item.state,
        "data-orientation": item.orientation,
        "data-error": item.error ? "" : undefined,
        "data-loading": item.loading ? "" : undefined,
        "data-disabled": item.disabled ? "" : undefined,
        "data-skipped": item.skipped ? "" : undefined,
    };
}

const stepperVariants = cva("flex", {
    variants: {
        orientation: {
            horizontal: "w-full flex-row items-center gap-2",
            vertical: "flex-col",
        },
    },
    defaultVariants: {orientation: "horizontal"},
});

interface StepperProps extends Omit<React.ComponentProps<"ol">, "defaultValue" | "onChange"> {
    /** The current step (matches a `StepperItem`'s `step`). */
    value?: number;
    defaultValue?: number;
    onValueChange?: (step: number) => void;
    orientation?: StepperOrientation;
}

/**
 * A multi-step flow: numbered indicators joined by separators. Steps before the current one count as
 * completed unless an item says otherwise. Arrow keys move focus between `StepperTrigger`s.
 */
function Stepper({
    value,
    defaultValue = 1,
    onValueChange,
    orientation = "horizontal",
    className,
    onKeyDown,
    ...props
}: StepperProps) {
    const [inner, setInner] = React.useState(defaultValue);
    const controlled = value !== undefined;
    const current = controlled ? value : inner;
    const setValue = React.useCallback(
        (step: number) => {
            if (!controlled) {
                setInner(step);
            }
            onValueChange?.(step);
        },
        [controlled, onValueChange],
    );

    const ctx = React.useMemo(() => ({value: current, setValue, orientation}), [current, setValue, orientation]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLOListElement>) => {
        onKeyDown?.(e);
        const prev = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
        const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        if (e.defaultPrevented || ![prev, next, "Home", "End"].includes(e.key)) {
            return;
        }
        const triggers = Array.from(
            e.currentTarget.querySelectorAll<HTMLElement>("[data-slot=stepper-trigger]:not(:disabled)"),
        ).filter((el) => el.closest("[data-slot=stepper]") === e.currentTarget);
        const index = triggers.indexOf(document.activeElement as HTMLElement);
        if (index === -1) {
            return;
        }
        e.preventDefault();
        const target =
            e.key === "Home"
                ? 0
                : e.key === "End"
                  ? triggers.length - 1
                  : (index + (e.key === next ? 1 : -1) + triggers.length) % triggers.length;
        triggers[target]?.focus();
    };

    return (
        <StepperContext.Provider value={ctx}>
            <ol
                data-slot="stepper"
                data-orientation={orientation}
                aria-orientation={orientation}
                className={cn(stepperVariants({orientation}), className)}
                onKeyDown={handleKeyDown}
                {...props}
            />
        </StepperContext.Provider>
    );
}

const stepperItemVariants = cva("group/stepper-item relative flex", {
    variants: {
        orientation: {
            // every step but the last grows, so the separators share the free width
            horizontal: "flex-1 items-center gap-2 last:flex-none",
            // the separator hangs under the indicator; the padding is its length
            vertical: "items-start gap-3 pb-6 last:pb-0",
        },
    },
    defaultVariants: {orientation: "horizontal"},
});

interface StepperItemProps extends React.ComponentProps<"li"> {
    /** This step's number: shown in the indicator and compared with the Stepper's `value`. */
    step: number;
    /** Force the completed look (default: any step before the current one). */
    completed?: boolean;
    disabled?: boolean;
    /** Show the error look: danger indicator with an X. */
    error?: boolean;
    /** Show a spinner in the indicator. */
    loading?: boolean;
    /** Never ran (a CI step after a failure): dashed muted indicator with a skip glyph. Still clickable. */
    skipped?: boolean;
}

function StepperItem({
    step,
    completed,
    disabled = false,
    error = false,
    loading = false,
    skipped = false,
    className,
    ...props
}: StepperItemProps) {
    const {value, orientation} = useStepper();
    const state: StepState =
        step === value ? "current" : skipped ? "upcoming" : (completed ?? step < value) ? "completed" : "upcoming";
    const done = completed === true;
    const item = React.useMemo(
        () => ({step, state, error, loading, disabled, skipped, done, orientation}),
        [step, state, error, loading, disabled, skipped, done, orientation],
    );
    // reached = the flow got here (completed, current or failed): the line leading into it fills
    const reached = !skipped && (state !== "upcoming" || error || done);
    return (
        <StepperItemContext.Provider value={item}>
            <li
                data-slot="stepper-item"
                data-reached={reached ? "" : undefined}
                {...itemState(item)}
                className={cn(stepperItemVariants({orientation}), className)}
                {...props}
            />
        </StepperItemContext.Provider>
    );
}

/** Makes a step clickable: a button that sets the Stepper's value. Wraps the indicator and the text. */
function StepperTrigger({className, render, onClick, ...props}: useRender.ComponentProps<"button">) {
    const {setValue} = useStepper();
    const item = useStepperItem();
    return useRender({
        defaultTagName: "button",
        props: mergeProps<"button">(
            {
                type: "button",
                disabled: item.disabled,
                "aria-current": item.state === "current" ? "step" : undefined,
                className: cn(
                    "-m-1 flex min-w-0 items-center gap-2 rounded-md p-1 text-start transition-[color,background-color,box-shadow] duration-100 hover:bg-hover disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
                    "data-[orientation=vertical]:items-start data-[orientation=vertical]:gap-3",
                    focusRing,
                    className,
                ),
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                    onClick?.(e);
                    if (!e.defaultPrevented) {
                        setValue(item.step);
                    }
                },
                ...itemState(item),
            } as React.ComponentProps<"button">,
            props,
        ),
        render,
        state: {slot: "stepper-trigger"},
    });
}

const stepperIndicatorVariants = cva([
    "relative inline-flex size-6 shrink-0 items-center justify-center rounded-pill border font-alt text-xs font-medium tabular-nums transition-[color,background-color,border-color] duration-100 motion-reduce:transition-none [&_svg:not([class*='size-'])]:size-3.5",
    // upcoming: a plain outlined number
    "border-input bg-background text-muted-foreground",
    // current: the solid accent fill
    "data-[state=current]:border-primary data-[state=current]:bg-primary data-[state=current]:text-primary-foreground",
    // completed: accent text tier, a check
    "data-[state=completed]:border-primary-text data-[state=completed]:bg-primary-tint data-[state=completed]:text-primary-text",
    // skipped: never ran, a dashed muted ring
    "data-skipped:border-dashed data-skipped:border-input data-skipped:bg-background data-skipped:text-muted-foreground",
    "data-[state=current]:data-skipped:border-foreground data-[state=current]:data-skipped:text-foreground",
    // error outranks the step state; the selected failed step is the solid danger fill
    "data-error:border-danger data-error:bg-danger-tint data-error:text-danger",
    "data-[state=current]:data-error:border-(--tc-red-fill) data-[state=current]:data-error:bg-(--tc-red-fill) data-[state=current]:data-error:text-(--tc-red-on-fill)",
]);

/** The step's badge: its number, a check once completed, an X on error, a skip glyph, a spinner while loading. */
function StepperIndicator({className, children, ...props}: React.ComponentProps<"span">) {
    const item = useStepperItem();
    const content = item.loading ? (
        <Spinner size="sm" aria-label="In progress" />
    ) : item.error ? (
        <XIcon aria-label="Error" />
    ) : item.skipped ? (
        <SkipForwardIcon aria-label="Skipped" className="size-3" />
    ) : item.state === "completed" || item.done ? (
        <CheckIcon aria-label="Completed" />
    ) : (
        (children ?? item.step)
    );
    return (
        <span
            data-slot="stepper-indicator"
            {...itemState(item)}
            className={cn(stepperIndicatorVariants(), className)}
            {...props}
        >
            {content}
        </span>
    );
}

function StepperTitle({className, ...props}: React.ComponentProps<"span">) {
    const item = useStepperItem();
    return (
        <span
            data-slot="stepper-title"
            {...itemState(item)}
            className={cn(
                "block truncate text-sm font-medium text-foreground not-data-error:data-[state=upcoming]:text-muted-foreground not-data-error:not-data-[state=current]:data-skipped:text-muted-foreground data-error:text-danger data-[orientation=vertical]:leading-6",
                className,
            )}
            {...props}
        />
    );
}

function StepperDescription({className, ...props}: React.ComponentProps<"span">) {
    const item = useStepperItem();
    return (
        <span
            data-slot="stepper-description"
            {...itemState(item)}
            className={cn("block text-xs text-muted-foreground", className)}
            {...props}
        />
    );
}

/**
 * The line to the next step. Fills with the accent once the step it leads into has been reached
 * (completed, current or failed); lines into skipped or upcoming steps stay plain. Leave it out of the last item.
 */
function StepperSeparator({className, ...props}: React.ComponentProps<"span">) {
    const item = useStepperItem();
    return (
        <span
            data-slot="stepper-separator"
            aria-hidden="true"
            {...itemState(item)}
            className={cn(
                "shrink-0 rounded-pill bg-border transition-colors duration-100 motion-reduce:transition-none [li:has(+[data-reached])>&]:bg-primary-text",
                "data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:min-w-4 data-[orientation=horizontal]:flex-1",
                // under the 24px indicator, centred on it, with a 4px gap at both ends
                "data-[orientation=vertical]:absolute data-[orientation=vertical]:start-[calc(0.75rem-1px)] data-[orientation=vertical]:top-7 data-[orientation=vertical]:bottom-1 data-[orientation=vertical]:w-0.5",
                className,
            )}
            {...props}
        />
    );
}

export {
    Stepper,
    StepperDescription,
    StepperIndicator,
    stepperIndicatorVariants,
    StepperItem,
    stepperItemVariants,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
    stepperVariants,
    useStepperItem,
};
export type {StepperItemProps, StepperOrientation, StepperProps, StepState};
