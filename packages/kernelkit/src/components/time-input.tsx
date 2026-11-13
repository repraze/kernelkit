"use client";

import {Popover, PopoverContent, PopoverTrigger} from "@repraze/kernelkit/components/popover";
import {type HourCyclePreference, useTimeFormat} from "@repraze/kernelkit/hooks/use-time-format";
import {fieldSurface, invalidRing} from "@repraze/kernelkit/lib/recipes";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {ClockIcon} from "lucide-react";
import * as React from "react";

/**
 * Segmented time field (GUIDELINES §4, §6). The container is the field surface; it rings while any
 * segment has focus, like a text input does on click.
 */
const timeInputVariants = cva(
    [
        fieldSurface,
        invalidRing,
        "inline-flex w-fit min-w-0 cursor-text items-center text-base md:text-sm",
        "has-[[data-slot=time-input-segment]:focus]:border-ring has-[[data-slot=time-input-segment]:focus]:ring-3 has-[[data-slot=time-input-segment]:focus]:ring-ring/50",
        "data-disabled:cursor-not-allowed data-disabled:bg-field-disabled data-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    ],
    {
        variants: {
            size: {
                // icon inset and icon-to-text gap match a Button with an inline-start icon (DatePicker's
                // trigger), counting the segment's own 2px padding: 8 / 6px default, 6 / 4px sm, 10 / 8px lg
                sm: "h-7 gap-0.5 rounded-md ps-1.5 pe-2 md:text-[0.8rem] [&_svg]:size-3.5",
                default: "h-8 gap-1 ps-2 pe-2.5 [&_svg]:size-4",
                lg: "h-9 gap-1.5 ps-2.5 pe-3 [&_svg]:size-4",
            },
        },
        defaultVariants: {size: "default"},
    },
);

/** One editable part (hours, minutes, seconds, AM/PM). Focus is a solid accent chip, like a native text selection (a tint vanished on the dark field). */
const timeInputSegmentVariants = cva(
    "rounded-box px-0.5 font-mono tabular-nums outline-none caret-transparent select-none transition-[color,background-color] hover:bg-hover focus:bg-primary focus:text-primary-foreground data-placeholder:text-muted-foreground data-placeholder:focus:text-primary-foreground aria-disabled:pointer-events-none",
);

type Size = "sm" | "default" | "lg";
type Period = "AM" | "PM";
type Part = "hour" | "minute" | "second" | "period";

interface Segments {
    hour: number | null;
    minute: number | null;
    second: number | null;
    period: Period | null;
}

const EMPTY: Segments = {hour: null, minute: null, second: null, period: null};

const pad = (n: number) => String(n).padStart(2, "0");

function parse(value: string | null | undefined, cycle: 12 | 24): Segments {
    const m = value ? /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value) : null;
    if (!m) {
        return EMPTY;
    }
    const h = Math.min(23, Number(m[1]));
    const minute = Math.min(59, Number(m[2]));
    const second = m[3] === undefined ? 0 : Math.min(59, Number(m[3]));
    if (cycle === 24) {
        return {hour: h, minute, second, period: null};
    }
    return {hour: h % 12 || 12, minute, second, period: h < 12 ? "AM" : "PM"};
}

function serialize(s: Segments, cycle: 12 | 24, seconds: boolean): string | null {
    if (s.hour === null || s.minute === null || (seconds && s.second === null) || (cycle === 12 && !s.period)) {
        return null;
    }
    const h = cycle === 24 ? s.hour : (s.hour % 12) + (s.period === "PM" ? 12 : 0);
    return `${pad(h)}:${pad(s.minute)}${seconds ? `:${pad(s.second ?? 0)}` : ""}`;
}

interface TimeInputProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "children" | "color"> {
    /** 24-hour `"HH:mm"` (or `"HH:mm:ss"` with `seconds`); `null` while incomplete. */
    value?: string | null;
    defaultValue?: string | null;
    /** Fires with the full time once every segment is set, `null` when one is cleared. */
    onValueChange?: (value: string | null) => void;
    /** Adds a seconds segment. */
    seconds?: boolean;
    /** `"auto"` follows the user's locale; 12 adds a day-period segment. The value stays 24-hour. */
    hourCycle?: HourCyclePreference;
    /** BCP 47 locale for `"auto"` and the day-period labels; defaults to the browser's. */
    locale?: string;
    /** Minutes per arrow press. */
    step?: number;
    size?: Size;
    disabled?: boolean;
    /** Leading clock icon. */
    icon?: boolean;
    /** The clock icon opens a column picker (hours, minutes...) in a popover: tap and arrow-key friendly. */
    picker?: boolean;
    /** Form field name: a hidden input carries the value. */
    name?: string;
    /** Lands on the first segment, so `<FieldLabel htmlFor>` focuses it. */
    id?: string;
}

/**
 * A time field split into segments, each a spinbutton: arrows step with wrap, digits fill and move on,
 * Backspace clears, Left / Right (or `:`) move between segments, `a` / `p` set the period.
 */
function TimeInput({
    value,
    defaultValue = null,
    onValueChange,
    seconds = false,
    hourCycle: hourCyclePreference = "auto",
    locale,
    step = 1,
    size = "default",
    disabled = false,
    icon = true,
    picker = true,
    name,
    id,
    className,
    ...props
}: TimeInputProps) {
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const fmt = useTimeFormat(hourCyclePreference, locale);
    const hourCycle = fmt.hourCycle;
    const controlled = value !== undefined;
    const [segs, setSegs] = React.useState<Segments>(() => parse(controlled ? value : defaultValue, hourCycle));
    // the locale's cycle can arrive after hydration (SSR renders 24h): carry the time over to the new cycle
    const [segsCycle, setSegsCycle] = React.useState(hourCycle);
    if (segsCycle !== hourCycle) {
        setSegsCycle(hourCycle);
        setSegs(parse(serialize(fill(segs, segsCycle), segsCycle, seconds), hourCycle));
    }
    // controlled: follow outside changes that differ from what the segments already say
    const [seen, setSeen] = React.useState(value);
    if (controlled && value !== seen) {
        setSeen(value);
        if (value !== serialize(segs, hourCycle, seconds)) {
            setSegs(parse(value, hourCycle));
        }
    }

    const typed = React.useRef("");
    const refs = React.useRef<Partial<Record<Part, HTMLSpanElement | null>>>({});
    // visual order: the day period leads in locales that write it first ("午前 09:30")
    const parts: Part[] = [
        ...(hourCycle === 12 && fmt.periodFirst ? (["period"] as const) : []),
        "hour",
        "minute",
        ...(seconds ? (["second"] as const) : []),
        ...(hourCycle === 12 && !fmt.periodFirst ? (["period"] as const) : []),
    ];

    const update = (patch: Partial<Segments>) => {
        const next = {...segs, ...patch};
        const before = serialize(segs, hourCycle, seconds);
        const after = serialize(next, hourCycle, seconds);
        setSegs(next);
        if (controlled) {
            setSeen(after);
        }
        if (after !== before) {
            onValueChange?.(after);
        }
    };

    const move = (from: Part, delta: number) => {
        const target = parts[parts.indexOf(from) + delta];
        if (target) {
            refs.current[target]?.focus();
        }
    };

    const range = (part: Part): [number, number] =>
        part === "hour" ? (hourCycle === 12 ? [1, 12] : [0, 23]) : part === "period" ? [0, 1] : [0, 59];

    const onKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>, part: Part) => {
        if (disabled || e.metaKey || e.ctrlKey || e.altKey) {
            return;
        }
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        const key = e.key;
        const [min, max] = range(part);
        const current = part === "period" ? (segs.period === null ? null : segs.period === "AM" ? 0 : 1) : segs[part];
        const set = (n: number | null) =>
            update(part === "period" ? {period: n === null ? null : n === 0 ? "AM" : "PM"} : {[part]: n});

        if (key === "ArrowUp" || key === "ArrowDown" || key === "PageUp" || key === "PageDown") {
            e.preventDefault();
            typed.current = "";
            const dir = key === "ArrowUp" || key === "PageUp" ? 1 : -1;
            const by = part === "minute" ? step : 1;
            const span = max - min + 1;
            if (current === null) {
                set(dir > 0 ? min : part === "minute" ? max - (max % step) : max);
            } else {
                // snap to the step grid, then wrap
                const snapped =
                    part === "minute" && current % by ? current - (current % by) + (dir > 0 ? 0 : by) : current;
                set(((((snapped - min + dir * by) % span) + span) % span) + min);
            }
        } else if (key === "Home" || key === "End") {
            e.preventDefault();
            set(key === "Home" ? min : max);
        } else if (key === "Backspace" || key === "Delete") {
            e.preventDefault();
            typed.current = "";
            if (current === null && key === "Backspace") {
                move(part, -1);
            } else {
                set(null);
            }
        } else if (key === (rtl ? "ArrowRight" : "ArrowLeft")) {
            e.preventDefault();
            move(part, -1);
        } else if (key === (rtl ? "ArrowLeft" : "ArrowRight") || key === ":" || key === "." || key === " ") {
            e.preventDefault();
            move(part, 1);
        } else if (part === "period" && /^[ap]$/i.test(key)) {
            e.preventDefault();
            set(key.toLowerCase() === "a" ? 0 : 1);
        } else if (part !== "period" && /^\d$/.test(key)) {
            e.preventDefault();
            const buffer = typed.current + key;
            const n = Number(buffer);
            if (buffer.length === 2 || n * 10 > max) {
                // complete: take it if it fits, else start over with this digit
                const final = n >= min && n <= max ? n : Number(key);
                set(final);
                typed.current = "";
                move(part, 1);
            } else {
                // first digit: shown, and kept pending for a second one ("0" in a 1-12 hour shows empty)
                typed.current = buffer;
                set(n < min ? null : n);
            }
        } else if (key === "Tab") {
            typed.current = "";
        }
    };

    const label: Record<Part, string> = {hour: "Hours", minute: "Minutes", second: "Seconds", period: "AM/PM"};

    const segment = (part: Part) => {
        const [min, max] = range(part);
        const v = part === "period" ? segs.period : segs[part];
        const text = v === null ? "--" : typeof v === "number" ? fmt.digits(v) : v === "AM" ? fmt.am : fmt.pm;
        return (
            <span
                key={part}
                ref={(el) => {
                    refs.current[part] = el;
                }}
                id={part === "hour" ? id : undefined}
                role="spinbutton"
                tabIndex={disabled ? -1 : 0}
                aria-label={label[part]}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={v === null ? undefined : part === "period" ? (v === "AM" ? 0 : 1) : (v as number)}
                aria-valuetext={v === null ? "Empty" : String(text)}
                aria-disabled={disabled || undefined}
                inputMode={part === "period" ? "text" : "numeric"}
                data-slot="time-input-segment"
                data-part={part}
                data-placeholder={v === null ? "" : undefined}
                className={timeInputSegmentVariants()}
                onKeyDown={(e) => onKeyDown(e, part)}
                onFocus={() => {
                    typed.current = "";
                }}
            >
                {text}
            </span>
        );
    };

    const fieldRef = React.useRef<HTMLDivElement>(null);
    const current = serialize(segs, hourCycle, seconds);

    return (
        <div
            ref={fieldRef}
            role="group"
            data-slot="time-input"
            data-size={size}
            data-disabled={disabled ? "" : undefined}
            className={cn(timeInputVariants({size}), className)}
            onMouseDown={(e) => {
                // a click on the padding or icon goes to the first empty segment, else the first one
                const target = e.target as HTMLElement;
                if (!disabled && !target.closest("[data-slot=time-input-segment],[data-slot=time-input-picker]")) {
                    e.preventDefault();
                    const empty = parts.find((p) => (p === "period" ? segs.period : segs[p]) === null);
                    refs.current[empty ?? "hour"]?.focus();
                }
            }}
            {...props}
        >
            {icon && picker ? (
                <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                    <PopoverTrigger
                        data-slot="time-input-picker"
                        disabled={disabled}
                        aria-label="Choose time"
                        // a bare icon in the same place and size as a plain icon (and DatePicker's), with a
                        // 32px hit area; hover and open turn it foreground, keyboard focus rings it
                        className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-box text-muted-foreground outline-none transition-colors after:absolute after:-inset-2 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none data-popup-open:text-primary-text"
                    >
                        <ClockIcon />
                    </PopoverTrigger>
                    <PopoverContent
                        data-slot="time-input-content"
                        // anchored to the whole field, not the icon, so it lines up like DatePicker's
                        anchor={fieldRef}
                        align="start"
                        className="w-auto p-1"
                        initialFocus={pickerFocusTarget}
                    >
                        <TimeColumns
                            value={serialize(fill(segs, hourCycle), hourCycle, seconds)}
                            onValueChange={(next) => {
                                const parsed = parse(next, hourCycle);
                                update(parsed);
                            }}
                            onCommit={() => setPickerOpen(false)}
                            seconds={seconds}
                            hourCycle={hourCycle}
                            locale={locale}
                            step={step}
                        />
                    </PopoverContent>
                </Popover>
            ) : (
                icon && <ClockIcon className="text-muted-foreground" />
            )}
            <span data-slot="time-input-segments" className="flex items-center">
                {hourCycle === 12 && fmt.periodFirst && <span className="me-1">{segment("period")}</span>}
                {segment("hour")}
                <span aria-hidden className="text-muted-foreground">
                    :
                </span>
                {segment("minute")}
                {seconds && (
                    <>
                        <span aria-hidden className="text-muted-foreground">
                            :
                        </span>
                        {segment("second")}
                    </>
                )}
                {hourCycle === 12 && !fmt.periodFirst && <span className="ms-1">{segment("period")}</span>}
            </span>
            {name && <input type="hidden" name={name} value={current ?? ""} />}
        </div>
    );
}

/** Empty segments take their first value, so the picker always shows a full time. */
function fill(s: Segments, cycle: 12 | 24): Segments {
    return {
        hour: s.hour ?? (cycle === 12 ? 12 : 0),
        minute: s.minute ?? 0,
        second: s.second ?? 0,
        period: s.period ?? (cycle === 12 ? "AM" : null),
    };
}

/** The popover opens on the hours column's selected option (found once the popup is in the DOM). */
function pickerFocusTarget(): HTMLElement | null {
    return document.querySelector<HTMLElement>(
        "[data-slot=time-input-content] [data-slot=time-columns-column] [data-slot=time-columns-option][tabindex='0']",
    );
}

/** A column of the picker: a listbox of option buttons, scrolled so the selected one sits in the middle. */
const timeColumnsOptionVariants = cva([
    "flex h-8 w-full shrink-0 snap-center items-center justify-center rounded-md font-mono text-sm tabular-nums outline-none select-none",
    "transition-[color,background-color] duration-100 motion-reduce:transition-none",
    "hover:bg-hover",
    // selected: the vivid fill, like Calendar's selected day
    "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary/85",
]);

interface TimeColumnsProps extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "children"> {
    /** 24-hour `"HH:mm"` / `"HH:mm:ss"`; `null` shows no selection until a pick fills the rest with zeros. */
    value: string | null;
    onValueChange: (value: string) => void;
    /** Enter in a column (close a popover). */
    onCommit?: () => void;
    seconds?: boolean;
    /** `"auto"` follows the user's locale. */
    hourCycle?: HourCyclePreference;
    locale?: string;
    /** Minutes between options. */
    step?: number;
}

/**
 * Hours | minutes | (seconds) | (AM/PM) as scrollable listboxes. A click or tap picks; ↑↓ / Home / End
 * pick within a column, ← → move between columns, Enter commits. Every pick fires `onValueChange` with a
 * full time. Embed it in a popover (TimeInput does) or inline.
 */
function TimeColumns({
    value,
    onValueChange,
    onCommit,
    seconds = false,
    hourCycle: hourCyclePreference = "auto",
    locale,
    step = 1,
    className,
    ...props
}: TimeColumnsProps) {
    const fmt = useTimeFormat(hourCyclePreference, locale);
    const hourCycle = fmt.hourCycle;
    const segs = parse(value, hourCycle);
    const full = fill(segs, hourCycle);
    const empty = value === null;

    const withValue = (list: number[], v: number | null) =>
        v === null || list.includes(v) ? list : [...list, v].sort((a, b) => a - b);
    const periodColumn = {part: "period" as const, label: "AM/PM", options: ["AM", "PM"] as Period[]};
    const columns: {part: Part; label: string; options: (number | Period)[]}[] = [
        ...(hourCycle === 12 && fmt.periodFirst ? [periodColumn] : []),
        {
            part: "hour",
            label: "Hours",
            options:
                hourCycle === 12
                    ? [12, ...Array.from({length: 11}, (_, i) => i + 1)]
                    : Array.from({length: 24}, (_, i) => i),
        },
        {
            part: "minute",
            label: "Minutes",
            options: withValue(
                Array.from({length: Math.ceil(60 / Math.max(1, step))}, (_, i) => i * Math.max(1, step)),
                segs.minute,
            ),
        },
        ...(seconds
            ? [{part: "second" as const, label: "Seconds", options: Array.from({length: 60}, (_, i) => i)}]
            : []),
        ...(hourCycle === 12 && !fmt.periodFirst ? [periodColumn] : []),
    ];

    const pick = (part: Part, option: number | Period) => {
        onValueChange(serialize({...full, [part]: option}, hourCycle, seconds)!);
    };

    const root = React.useRef<HTMLDivElement>(null);
    const center = (behavior: ScrollBehavior) => {
        root.current?.querySelectorAll<HTMLElement>("[data-slot=time-columns-column]").forEach((col) => {
            const opt = col.querySelector<HTMLElement>("[tabindex='0']");
            if (opt) {
                col.scrollTo({top: opt.offsetTop - (col.clientHeight - opt.offsetHeight) / 2, behavior});
            }
        });
    };
    // centre the selection on mount, follow it after keyboard picks
    React.useLayoutEffect(() => center("instant"), []);

    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, ci: number, oi: number) => {
        const col = columns[ci]!;
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        const go = (i: number) => {
            e.preventDefault();
            const next = Math.max(0, Math.min(col.options.length - 1, i));
            pick(col.part, col.options[next]!);
            requestAnimationFrame(() => {
                const btn = root.current?.querySelectorAll<HTMLElement>("[data-slot=time-columns-column]")[ci]
                    ?.children[next] as HTMLElement | undefined;
                btn?.focus({preventScroll: true});
                btn?.scrollIntoView({block: "nearest"});
            });
        };
        const toColumn = (delta: number) => {
            e.preventDefault();
            root.current
                ?.querySelectorAll<HTMLElement>("[data-slot=time-columns-column]")
                [ci + delta]?.querySelector<HTMLElement>("[tabindex='0']")
                ?.focus();
        };
        switch (e.key) {
            case "ArrowDown":
                return go(oi + 1);
            case "ArrowUp":
                return go(oi - 1);
            case "PageDown":
                return go(oi + 5);
            case "PageUp":
                return go(oi - 5);
            case "Home":
                return go(0);
            case "End":
                return go(col.options.length - 1);
            case "ArrowLeft":
                return toColumn(rtl ? 1 : -1);
            case "ArrowRight":
                return toColumn(rtl ? -1 : 1);
            case "Enter":
                e.preventDefault();
                if (empty) {
                    pick(col.part, col.options[oi]!);
                }
                onCommit?.();
                return;
        }
    };

    return (
        <div ref={root} data-slot="time-columns" className={cn("flex gap-1", className)} {...props}>
            {columns.map((col, ci) => {
                const current = full[col.part];
                const active = Math.max(0, col.options.indexOf(current as never));
                return (
                    // the ring sits on a wrapper: the column's scroll-fade mask would clip it
                    <div
                        key={col.part}
                        data-slot="time-columns-frame"
                        className="rounded-md has-focus-visible:ring-2 has-focus-visible:ring-ring/50"
                    >
                        <div
                            role="listbox"
                            aria-label={col.label}
                            data-slot="time-columns-column"
                            data-part={col.part}
                            className={cn(
                                // room above and below so the first and last options can sit in the middle
                                "no-scrollbar relative flex h-56 w-14 snap-y snap-proximity flex-col gap-0.5 overflow-y-auto overscroll-contain scroll-fade-y py-24",
                                "rounded-md",
                            )}
                        >
                            {col.options.map((option, oi) => {
                                const selected = !empty && option === current;
                                return (
                                    <button
                                        key={String(option)}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        tabIndex={oi === active ? 0 : -1}
                                        data-slot="time-columns-option"
                                        className={timeColumnsOptionVariants()}
                                        onClick={() => pick(col.part, option)}
                                        onKeyDown={(e) => onKeyDown(e, ci, oi)}
                                    >
                                        {typeof option === "number"
                                            ? fmt.digits(option)
                                            : option === "AM"
                                              ? fmt.am
                                              : fmt.pm}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export {
    parse as parseTime,
    serialize as serializeTime,
    TimeColumns,
    timeColumnsOptionVariants,
    TimeInput,
    timeInputSegmentVariants,
    timeInputVariants,
};
export type {TimeColumnsProps, TimeInputProps};
