"use client";

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@repraze/kernelkit/components/combobox";
import {type HourCyclePreference, useTimeFormat} from "@repraze/kernelkit/hooks/use-time-format";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import * as React from "react";

/* ------------------------------------------------------------------------------------------------
 * Time helpers (minutes since midnight)
 * ----------------------------------------------------------------------------------------------*/

const pad = (n: number) => String(n).padStart(2, "0");

function toMinutes(value: string | null | undefined): number | null {
    const m = value ? /^(\d{1,2}):(\d{2})/.exec(value) : null;
    if (!m) {
        return null;
    }
    const h = Number(m[1]);
    const min = Number(m[2]);
    return h > 23 || min > 59 ? null : h * 60 + min;
}

const toValue = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

function formatTime(minutes: number, cycle: 12 | 24) {
    const h = Math.floor(minutes / 60);
    const m = pad(minutes % 60);
    return cycle === 24 ? `${pad(h)}:${m}` : `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

function formatDuration(minutes: number) {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m ? `${h} h ${m} min` : `${h} h`;
}

/**
 * Lenient match, like Google Calendar's time list: "9" → 09:xx and 9 PM, "930" / "9:3" → 09:30,
 * "9p" → 21:xx, "21" → 21:xx. Returns the exact time when the query is a complete one ("10:10", "7:05pm").
 */
function matchTime(query: string, cycle: 12 | 24 = 24) {
    const q = query
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/\.(?=\d)/, ":");
    const meridiem = /(a|am|p|pm)$/.exec(q)?.[1]?.[0] as "a" | "p" | undefined;
    const body = meridiem ? q.replace(/(a|am|p|pm)$/, "") : q;
    if (!/^\d{0,2}(:\d{0,2})?$|^\d{3,4}$/.test(body) || (!body && !meridiem)) {
        return {test: () => false, exact: null as number | null};
    }
    let hourText: string;
    let minuteText: string;
    if (body.includes(":")) {
        [hourText = "", minuteText = ""] = body.split(":");
    } else if (body.length > 2) {
        hourText = body.slice(0, body.length - 2);
        minuteText = body.slice(-2);
    } else {
        hourText = body;
        minuteText = "";
    }

    const test = (minutes: number) => {
        const h24 = Math.floor(minutes / 60);
        const h12 = h24 % 12 || 12;
        const pm = h24 >= 12;
        if (meridiem && (meridiem === "p") !== pm) {
            return false;
        }
        // 24h display: hours are read as 24h ("9" is 09:xx) unless a meridiem is typed
        const hourOk =
            !hourText ||
            (meridiem || cycle === 12
                ? Number(hourText) === h12 || (!meridiem && Number(hourText) === h24)
                : Number(hourText) === h24);
        return hourOk && pad(minutes % 60).startsWith(minuteText);
    };

    // a complete time typed off the grid ("10:10") is offered as its own option
    let exact: number | null = null;
    const h = Number(hourText);
    if (hourText && minuteText.length === 2) {
        const m = Number(minuteText);
        const h24 = meridiem ? (h % 12) + (meridiem === "p" ? 12 : 0) : h;
        if (m < 60 && h24 < 24 && (!meridiem || (h >= 1 && h <= 12))) {
            exact = h24 * 60 + m;
        }
    }
    return {test, exact};
}

/* ------------------------------------------------------------------------------------------------
 * TimeSelect
 * ----------------------------------------------------------------------------------------------*/

const timeSelectVariants = cva(
    "w-36 font-normal *:data-[slot=input-group-control]:font-mono *:data-[slot=input-group-control]:tabular-nums",
    {
        variants: {
            size: {
                sm: "h-7 rounded-md text-[0.8rem]",
                default: "h-8",
                lg: "h-9",
            },
        },
        defaultVariants: {size: "default"},
    },
);

interface TimeSelectProps {
    /** 24-hour `"HH:mm"`, or `null`. */
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    /** Minutes between slots. */
    step?: number;
    /** First slot, `"HH:mm"`. */
    min?: string;
    /** Last slot, `"HH:mm"`. */
    max?: string;
    /** How times are shown; `"auto"` follows the user's locale. The value stays 24-hour. */
    hourCycle?: HourCyclePreference;
    /** BCP 47 locale for `"auto"` and the labels ("9:30 AM", "午前9:30"); defaults to the browser's. */
    locale?: string;
    /** A start time: slots begin there and show their duration, "(1 h 30 min)", like an end-time list. */
    durationFrom?: string | null;
    placeholder?: string;
    size?: "sm" | "default" | "lg";
    disabled?: boolean;
    "aria-invalid"?: boolean;
    "aria-label"?: string;
    id?: string;
    name?: string;
    className?: string;
}

/**
 * A time from a list of slots, Google Calendar style: open it and pick, or type a few characters
 * ("9", "930", "9p") to filter. A complete time typed off the grid ("10:10") is offered too.
 */
function TimeSelect({
    value,
    defaultValue = null,
    onValueChange,
    step = 30,
    min = "00:00",
    max = "23:59",
    hourCycle: hourCyclePreference = "auto",
    locale,
    durationFrom,
    placeholder: placeholderProp,
    size = "default",
    disabled,
    id,
    name,
    className,
    ...aria
}: TimeSelectProps) {
    const controlled = value !== undefined;
    const [inner, setInner] = React.useState<string | null>(defaultValue);
    const current = controlled ? value : inner;
    const currentMin = toMinutes(current);

    const set = (next: string | null) => {
        if (!controlled) {
            setInner(next);
        }
        onValueChange?.(next);
    };

    const from = toMinutes(durationFrom);
    const slots = React.useMemo(() => {
        const lo = Math.max(toMinutes(min) ?? 0, from ?? 0);
        const hi = toMinutes(max) ?? 23 * 60 + 59;
        const s = Math.max(1, step);
        const list: number[] = [];
        // durationFrom: the grid starts at the start time; otherwise it is aligned on midnight
        for (let t = from !== null ? lo : Math.ceil(lo / s) * s; t <= hi; t += s) {
            list.push(t);
        }
        return list;
    }, [min, max, step, from]);

    const fmt = useTimeFormat(hourCyclePreference, locale);
    const hourCycle = fmt.hourCycle;
    const placeholder = placeholderProp ?? (hourCycle === 12 ? "--:-- --" : "--:--");
    const label = fmt.format;

    // filter only once the user types: opening on a picked time lists every slot, scrolled to it
    const [input, setInput] = React.useState(currentMin === null ? "" : label(currentMin));
    const [query, setQuery] = React.useState<string | null>(null);
    // re-label when the value changes or the locale's format arrives after hydration
    const seenKey = `${current}|${hourCycle}|${fmt.am}|${fmt.pm}`;
    const [seen, setSeen] = React.useState(seenKey);
    if (seenKey !== seen) {
        setSeen(seenKey);
        setInput(currentMin === null ? "" : label(currentMin));
    }

    const items = React.useMemo(() => {
        const base =
            currentMin !== null && !slots.includes(currentMin) ? [...slots, currentMin].sort((a, b) => a - b) : slots;
        if (!query) {
            return base;
        }
        const {test, exact} = matchTime(query, hourCycle);
        // the typed text also matches the localized label ("p.m.", "午後")
        const q = query.toLowerCase().replace(/\s+/g, "");
        const hits = base.filter((t) => test(t) || label(t).toLowerCase().replace(/\s+/g, "").includes(q));
        return exact !== null && !hits.includes(exact) ? [exact, ...hits] : hits;
    }, [slots, currentMin, query, hourCycle, label]);

    const listRef = React.useRef<HTMLDivElement>(null);

    return (
        <Combobox<number>
            items={items}
            filter={null}
            // typing highlights the first match, so Enter takes it
            autoHighlight
            value={currentMin}
            onValueChange={(next) => {
                setQuery(null);
                set(next === null ? null : toValue(next));
            }}
            inputValue={input}
            onInputValueChange={(text, details) => {
                setInput(text);
                if (details.reason === "input-change") {
                    setQuery(text.trim() || null);
                }
            }}
            onOpenChange={(open) => {
                if (open) {
                    // the selected slot in view (Base UI highlights it; the list starts at the top)
                    requestAnimationFrame(() =>
                        listRef.current
                            ?.querySelector<HTMLElement>("[data-selected]")
                            ?.scrollIntoView({block: "center"}),
                    );
                } else {
                    setQuery(null);
                    setInput(currentMin === null ? "" : label(currentMin));
                }
            }}
            itemToStringLabel={label}
            disabled={disabled}
            name={name}
        >
            <ComboboxInput
                id={id}
                placeholder={placeholder}
                disabled={disabled}
                inputMode="text"
                autoComplete="off"
                className={cn(timeSelectVariants({size}), className)}
                {...aria}
            />
            <ComboboxContent data-slot="time-select-content">
                <ComboboxEmpty>No matching time.</ComboboxEmpty>
                <ComboboxList ref={listRef}>
                    {(minutes: number) => (
                        <ComboboxItem key={minutes} value={minutes} className="tabular-nums">
                            <span className="font-mono">{label(minutes)}</span>
                            {from !== null && minutes >= from && (
                                <span className="ms-auto font-alt text-xs text-muted-foreground">
                                    {formatDuration(minutes - from)}
                                </span>
                            )}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export {formatDuration, formatTime, matchTime, TimeSelect, timeSelectVariants};
export type {TimeSelectProps};
