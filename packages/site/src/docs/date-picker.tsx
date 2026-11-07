import {DatePicker, DateRangePicker} from "kernelkit/components/date-picker";
import {Label} from "kernelkit/components/label";
import * as React from "react";
import type {DateRange} from "react-day-picker";

import {defineDoc} from "@/lib/doc-kit";

const today = new Date(2026, 10, 6);

export const doc = defineDoc({
    title: "Date Picker",
    category: "Inputs",
    baseUi: "popover",
    description:
        "A form field that opens a Calendar in a Popover: outline trigger, formatted value, placeholder when empty.",
    demos: [
        {title: "Single date", component: Single, description: "Closes as soon as a day is picked."},
        {
            title: "Range",
            component: RangeDemo,
            description: "Stays open across both clicks; shows two months.",
        },
        {
            title: "Sizes",
            component: Sizes,
            description: "The trigger is an outline Button, so it lines up with inputs and buttons of the same size.",
        },
        {
            title: "Constraints and states",
            component: States,
            layout: "start",
            description: "Forward Calendar props with `calendarProps` (here: no past days, no weekends).",
        },
    ],
    props: [
        {
            component: "DatePicker",
            rows: [
                {name: "value / defaultValue", type: "Date | null"},
                {name: "onValueChange", type: "(date: Date | null) => void"},
                {name: "placeholder", type: "ReactNode", default: '"Pick a date"'},
                {
                    name: "format",
                    type: "string",
                    default: '"PPP"',
                    description: "date-fns format for the trigger label.",
                },
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {
                    name: "calendarProps",
                    type: "CalendarProps",
                    description: "disabled days, captionLayout, startMonth…",
                },
                {name: "disabled / aria-invalid", type: "boolean"},
            ],
        },
        {
            component: "DateRangePicker",
            rows: [
                {
                    name: "value / defaultValue",
                    type: "DateRange | null",
                    description: "`{from, to}` (react-day-picker).",
                },
                {name: "onValueChange", type: "(range: DateRange | null) => void"},
                {name: "numberOfMonths", type: "number", default: "2"},
                {name: "format", type: "string", default: '"LLL d, y"'},
            ],
        },
    ],
});

export function Single() {
    const [date, setDate] = React.useState<Date | null>(null);
    return (
        <div className="flex flex-col gap-2">
            <Label>Maintenance window</Label>
            <DatePicker value={date} onValueChange={setDate} calendarProps={{today, defaultMonth: today}} />
        </div>
    );
}

export function RangeDemo() {
    const [range, setRange] = React.useState<DateRange | null>({
        from: new Date(2026, 10, 2),
        to: new Date(2026, 10, 8),
    });
    return (
        <div className="flex flex-col gap-2">
            <Label>Log retention query</Label>
            <DateRangePicker value={range} onValueChange={setRange} calendarProps={{today}} />
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <DatePicker size="sm" className="w-48" calendarProps={{today, defaultMonth: today}} />
            <DatePicker className="w-52" calendarProps={{today, defaultMonth: today}} />
            <DatePicker size="lg" className="w-56" calendarProps={{today, defaultMonth: today}} />
        </div>
    );
}

export function States() {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <Label>Next deploy (weekdays only)</Label>
                <DatePicker
                    defaultValue={new Date(2026, 10, 10)}
                    calendarProps={{today, disabled: [{before: today}, {dayOfWeek: [0, 6]}]}}
                />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Freeze date</Label>
                <DatePicker disabled placeholder="Locked during release" />
            </div>
            <div className="flex flex-col gap-2">
                <Label>Certificate expiry</Label>
                <DatePicker aria-invalid calendarProps={{today, defaultMonth: today}} />
                <p className="text-sm text-danger">Pick an expiry date before issuing the certificate.</p>
            </div>
        </div>
    );
}
