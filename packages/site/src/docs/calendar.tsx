import {Calendar} from "@repraze/kernelkit/components/calendar";
import * as React from "react";
import type {DateRange} from "react-day-picker";

import {defineDoc} from "@/lib/doc-kit";

// Fixed dates so the docs render the same every day.
const today = new Date(2026, 10, 6);
const day = (d: number, m = 10) => new Date(2026, m, d);

export const doc = defineDoc({
    title: "Calendar",
    category: "Inputs",
    description: "Month grid for picking a date or range, built on react-day-picker. Use Date Picker for a form field.",
    demos: [
        {
            title: "Single",
            component: Single,
            description: "Today has a dot under the number; the selected day is a primary fill.",
        },
        {title: "Range", component: Range, description: '`mode="range"`: ends are filled, the middle is a band.'},
        {
            title: "Disabled days",
            component: DisabledDays,
            description: "Weekends and past days are struck through; outside days are muted.",
        },
        {title: "Month and year dropdowns", component: Dropdowns, description: '`captionLayout="dropdown"`.'},
        {title: "Week numbers", component: WeekNumbers},
    ],
    props: [
        {
            component: "Calendar",
            rows: [
                {
                    name: "mode",
                    type: '"single" | "multiple" | "range"',
                    description: "Selection model (react-day-picker).",
                },
                {name: "selected / onSelect", type: "Date | Date[] | DateRange", description: "Controlled selection."},
                {name: "disabled", type: "Matcher | Matcher[]", description: "Days that can't be picked."},
                {
                    name: "captionLayout",
                    type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
                    default: '"label"',
                },
                {name: "showOutsideDays", type: "boolean", default: "true"},
                {
                    name: "buttonVariant",
                    type: "Button variant",
                    default: '"ghost"',
                    description: "Look of the month nav buttons.",
                },
                {name: "numberOfMonths", type: "number", default: "1"},
            ],
        },
    ],
});

export function Single() {
    const [date, setDate] = React.useState<Date | undefined>(day(12));
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            today={today}
            defaultMonth={today}
            className="rounded-xl border border-border"
        />
    );
}

export function Range() {
    const [range, setRange] = React.useState<DateRange | undefined>({from: day(9), to: day(17)});
    return (
        <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            today={today}
            defaultMonth={today}
            numberOfMonths={2}
            className="rounded-xl border border-border"
        />
    );
}

export function DisabledDays() {
    const [date, setDate] = React.useState<Date | undefined>(day(18));
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            today={today}
            defaultMonth={today}
            disabled={[{before: today}, {dayOfWeek: [0, 6]}]}
            className="rounded-xl border border-border"
        />
    );
}

export function Dropdowns() {
    const [date, setDate] = React.useState<Date | undefined>(day(3, 11));
    return (
        <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            today={today}
            defaultMonth={day(1, 11)}
            captionLayout="dropdown"
            startMonth={new Date(2024, 0)}
            endMonth={new Date(2028, 11)}
            className="rounded-xl border border-border"
        />
    );
}

export function WeekNumbers() {
    return (
        <Calendar
            mode="single"
            today={today}
            defaultMonth={today}
            showWeekNumber
            className="rounded-xl border border-border"
        />
    );
}
