"use client";

import {Button} from "@repraze/kernelkit/components/button";
import {Calendar} from "@repraze/kernelkit/components/calendar";
import {useLocale} from "@repraze/kernelkit/components/locale";
import {Popover, PopoverContent, PopoverTrigger} from "@repraze/kernelkit/components/popover";
import {cn} from "cn";
import {format as formatDate} from "date-fns";
import {CalendarIcon} from "lucide-react";
import * as React from "react";
import type {DateRange} from "react-day-picker";

type CalendarProps = React.ComponentProps<typeof Calendar>;

interface DatePickerBaseProps {
    /** Trigger text when nothing is picked. */
    placeholder?: React.ReactNode;
    /**
     * Trigger label: `Intl.DateTimeFormat` options (default `{dateStyle: "long"}`, `"medium"` for ranges), a
     * function, or a date-fns pattern string.
     */
    format?: DateFormat;
    /** BCP 47 tag for the label and the calendar; defaults to LocaleProvider › browser. */
    locale?: string;
    size?: "sm" | "default" | "lg";
    disabled?: boolean;
    "aria-invalid"?: boolean;
    id?: string;
    className?: string;
    /** Extra props for the Calendar (disabled days, captionLayout, startMonth…). */
    calendarProps?: Omit<CalendarProps, "mode" | "selected" | "onSelect">;
    /** Popover alignment against the trigger. */
    align?: "start" | "center" | "end";
}

type DateFormat = Intl.DateTimeFormatOptions | string | ((date: Date) => string);

/** One date in the trigger. */
function formatOne(date: Date, format: DateFormat, locale: string) {
    if (typeof format === "function") {
        return format(date);
    }
    if (typeof format === "string") {
        return formatDate(date, format);
    }
    return new Intl.DateTimeFormat(locale, format).format(date);
}

/** A range in the trigger: Intl's formatRange shares what both ends have in common ("Nov 14 – 20, 2026"). */
function formatRange(from: Date, to: Date, format: DateFormat, locale: string) {
    if (typeof format === "object") {
        return new Intl.DateTimeFormat(locale, format).formatRange(from, to);
    }
    return `${formatOne(from, format, locale)} – ${formatOne(to, format, locale)}`;
}

function useControllable<T>(value: T | undefined, defaultValue: T | undefined, onChange?: (value: T) => void) {
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

function DatePickerTrigger({
    label,
    placeholder,
    size = "default",
    className,
    ...props
}: React.ComponentProps<typeof Button> & {label?: string; placeholder: React.ReactNode}) {
    return (
        <PopoverTrigger
            data-slot="date-picker-trigger"
            data-empty={label ? undefined : ""}
            render={
                <Button
                    variant="outline"
                    size={size}
                    className={cn(
                        // a field like Select's trigger, not an outline button: it sits beside inputs and TimeInput
                        "w-60 justify-start bg-field text-start font-normal hover:bg-field-hover aria-expanded:bg-field-hover data-empty:text-muted-foreground data-popup-open:bg-field-hover [&>svg]:text-muted-foreground",
                        className,
                    )}
                    {...props}
                />
            }
        >
            <CalendarIcon data-icon="inline-start" />
            <span className="truncate">{label ?? placeholder}</span>
        </PopoverTrigger>
    );
}

interface DatePickerProps extends DatePickerBaseProps {
    value?: Date | null;
    defaultValue?: Date | null;
    onValueChange?: (date: Date | null) => void;
}

/** A date field: outline trigger that opens a Calendar in a Popover. Closes on pick. */
function DatePicker({
    value,
    defaultValue = null,
    onValueChange,
    placeholder = "Pick a date",
    format = {dateStyle: "long"},
    locale: localeProp,
    calendarProps,
    align = "start",
    className,
    ...trigger
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = useControllable<Date | null>(value, defaultValue, onValueChange);
    const locale = useLocale(localeProp);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <DatePickerTrigger
                label={date ? formatOne(date, format, locale) : undefined}
                placeholder={placeholder}
                className={className}
                {...trigger}
            />
            <PopoverContent data-slot="date-picker-content" className="w-auto p-0" align={align}>
                <Calendar
                    locale={locale}
                    {...calendarProps}
                    mode="single"
                    selected={date ?? undefined}
                    defaultMonth={date ?? calendarProps?.defaultMonth}
                    onSelect={(next) => {
                        setDate(next ?? null);
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

interface DateRangePickerProps extends DatePickerBaseProps {
    value?: DateRange | null;
    defaultValue?: DateRange | null;
    onValueChange?: (range: DateRange | null) => void;
    /** Months shown side by side. */
    numberOfMonths?: number;
}

/** A date range field: stays open until both ends are picked. */
function DateRangePicker({
    value,
    defaultValue = null,
    onValueChange,
    placeholder = "Pick a date range",
    format = {dateStyle: "medium"},
    locale: localeProp,
    numberOfMonths = 2,
    calendarProps,
    align = "start",
    className,
    ...trigger
}: DateRangePickerProps) {
    const [range, setRange] = useControllable<DateRange | null>(value, defaultValue, onValueChange);
    const locale = useLocale(localeProp);
    const label = range?.from
        ? range.to
            ? formatRange(range.from, range.to, format, locale)
            : formatOne(range.from, format, locale)
        : undefined;

    return (
        <Popover>
            <DatePickerTrigger label={label} placeholder={placeholder} className={cn("w-72", className)} {...trigger} />
            <PopoverContent data-slot="date-picker-content" className="w-auto p-0" align={align}>
                <Calendar
                    locale={locale}
                    {...calendarProps}
                    mode="range"
                    numberOfMonths={numberOfMonths}
                    selected={range ?? undefined}
                    defaultMonth={range?.from ?? calendarProps?.defaultMonth}
                    onSelect={(next) => setRange(next ?? null)}
                />
            </PopoverContent>
        </Popover>
    );
}

export {DatePicker, DatePickerTrigger, DateRangePicker};
export type {DateFormat, DatePickerProps, DateRangePickerProps};
