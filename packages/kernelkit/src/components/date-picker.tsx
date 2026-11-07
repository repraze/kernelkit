"use client";

import {cn} from "cn";
import {format as formatDate} from "date-fns";
import {Button} from "kernelkit/components/button";
import {Calendar} from "kernelkit/components/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "kernelkit/components/popover";
import {CalendarIcon} from "lucide-react";
import * as React from "react";
import type {DateRange} from "react-day-picker";

type CalendarProps = React.ComponentProps<typeof Calendar>;

interface DatePickerBaseProps {
    /** Trigger text when nothing is picked. */
    placeholder?: React.ReactNode;
    /** date-fns format string for the trigger label. */
    format?: string;
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
                        "w-60 justify-start text-left font-normal data-empty:text-muted-foreground data-popup-open:bg-hover [&>svg]:text-muted-foreground",
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
    format = "PPP",
    calendarProps,
    align = "start",
    className,
    ...trigger
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = useControllable<Date | null>(value, defaultValue, onValueChange);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <DatePickerTrigger
                label={date ? formatDate(date, format) : undefined}
                placeholder={placeholder}
                className={className}
                {...trigger}
            />
            <PopoverContent data-slot="date-picker-content" className="w-auto p-0" align={align}>
                <Calendar
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
    format = "LLL d, y",
    numberOfMonths = 2,
    calendarProps,
    align = "start",
    className,
    ...trigger
}: DateRangePickerProps) {
    const [range, setRange] = useControllable<DateRange | null>(value, defaultValue, onValueChange);
    const label = range?.from
        ? range.to
            ? `${formatDate(range.from, format)} – ${formatDate(range.to, format)}`
            : formatDate(range.from, format)
        : undefined;

    return (
        <Popover>
            <DatePickerTrigger label={label} placeholder={placeholder} className={cn("w-72", className)} {...trigger} />
            <PopoverContent data-slot="date-picker-content" className="w-auto p-0" align={align}>
                <Calendar
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
export type {DatePickerProps, DateRangePickerProps};
