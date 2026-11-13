import {DatePicker} from "@repraze/kernelkit/components/date-picker";
import {Field, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";
import {TimeSelect} from "@repraze/kernelkit/components/time-select";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

const LOCALES = [
    ["en-US", "English (US)"],
    ["en-GB", "English (UK)"],
    ["en-CA", "English (Canada)"],
    ["fr-FR", "Français"],
    ["ja-JP", "日本語"],
    ["ko-KR", "한국어"],
] as const;

export const doc = defineDoc({
    title: "Time select",
    category: "Inputs",
    description:
        "A time from a list of slots, like a calendar's: open and tap, or type a few characters (9, 930, 9p) to jump. For scheduling, where times sit on a grid.",
    order: 8.6,
    demos: [
        {
            title: "Default",
            component: Default,
            description: "Every 30 minutes, shown in the user's locale format; the picked slot is centred on open.",
        },
        {
            title: "12-hour",
            component: TwelveHour,
            description: "Type `9p` for 9 PM, `930` for 9:30. A complete time off the grid (`10:10`) is offered too.",
        },
        {
            title: "Locales",
            component: Locales,
            description:
                'Labels come from `Intl`: "2:00 PM", "14:00", "2:00 p.m.", "午後2:00". Typing matches them too.',
        },
        {
            title: "Start and end",
            component: StartEnd,
            description: "`durationFrom` starts the end list at the start time and shows each slot's duration.",
        },
        {
            title: "Business hours",
            component: BusinessHours,
            description: "`min` / `max` bound the slots; `step` sets their spacing.",
        },
        {title: "With a date", component: WithDate},
        {title: "Sizes and states", component: SizesStates},
    ],
    props: [
        {
            component: "TimeSelect",
            rows: [
                {name: "value / defaultValue", type: "string | null", description: '24-hour `"HH:mm"`.'},
                {name: "onValueChange", type: "(value: string | null) => void"},
                {name: "step", type: "number", default: "30", description: "Minutes between slots."},
                {name: "min / max", type: "string", default: '"00:00" / "23:59"', description: "First and last slot."},
                {
                    name: "hourCycle",
                    type: '12 | 24 | "auto"',
                    default: '"auto"',
                    description: "Display only; `auto` follows the locale.",
                },
                {
                    name: "locale",
                    type: "string",
                    description: "BCP 47 tag for `auto` and labels; browser's by default.",
                },
                {
                    name: "durationFrom",
                    type: "string | null",
                    description: "A start time: slots begin there and show their duration.",
                },
                {name: "placeholder", type: "string", default: '"--:--"'},
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {name: "id / name", type: "string"},
                {name: "disabled / aria-invalid", type: "boolean"},
            ],
        },
    ],
});

export function Default() {
    const [time, setTime] = React.useState<string | null>("09:30");
    return (
        <div className="flex flex-col items-center gap-2">
            <Field className="w-fit">
                <FieldLabel htmlFor="ts-default">Standup</FieldLabel>
                <TimeSelect id="ts-default" value={time} onValueChange={setTime} />
            </Field>
            <pre className="font-mono text-xs text-muted-foreground">{JSON.stringify(time)}</pre>
        </div>
    );
}

export function TwelveHour() {
    return (
        <Field className="w-fit">
            <FieldLabel htmlFor="ts-12">Reminder</FieldLabel>
            <TimeSelect id="ts-12" hourCycle={12} step={15} defaultValue="13:15" />
        </Field>
    );
}

export function StartEnd() {
    const [start, setStart] = React.useState<string | null>("10:00");
    const [end, setEnd] = React.useState<string | null>("11:30");
    return (
        <div className="flex items-end gap-2">
            <Field className="w-fit">
                <FieldLabel htmlFor="ts-start">Start</FieldLabel>
                <TimeSelect
                    id="ts-start"
                    value={start}
                    onValueChange={(v) => {
                        setStart(v);
                        if (v && end && end <= v) {
                            setEnd(null);
                        }
                    }}
                />
            </Field>
            <span className="pb-1.5 text-muted-foreground">–</span>
            <Field className="w-fit">
                <FieldLabel htmlFor="ts-end">End</FieldLabel>
                <TimeSelect id="ts-end" value={end} onValueChange={setEnd} durationFrom={start} />
            </Field>
        </div>
    );
}

export function BusinessHours() {
    return (
        <Field className="w-fit">
            <FieldLabel htmlFor="ts-hours">Pickup (9 to 5)</FieldLabel>
            <TimeSelect id="ts-hours" min="09:00" max="17:00" step={15} hourCycle={12} />
        </Field>
    );
}

export function WithDate() {
    return (
        <div className="flex items-end gap-2">
            <Field className="w-fit">
                <FieldLabel>Release</FieldLabel>
                <DatePicker defaultValue={new Date(2026, 10, 20)} className="w-48" />
            </Field>
            <Field className="w-fit">
                <FieldLabel htmlFor="ts-release" className="sr-only">
                    Time
                </FieldLabel>
                <TimeSelect id="ts-release" defaultValue="16:00" />
            </Field>
        </div>
    );
}

export function SizesStates() {
    return (
        <div className="flex flex-wrap items-start gap-4">
            <TimeSelect size="sm" aria-label="Small" defaultValue="08:00" />
            <TimeSelect aria-label="Default" defaultValue="12:00" />
            <TimeSelect size="lg" aria-label="Large" defaultValue="18:00" />
            <TimeSelect aria-label="Disabled" disabled defaultValue="16:30" />
            <Field data-invalid className="w-fit">
                <TimeSelect aria-label="Invalid" aria-invalid defaultValue="03:00" />
                <FieldError>Outside the window.</FieldError>
            </Field>
        </div>
    );
}

export function Locales() {
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {LOCALES.map(([locale, name]) => (
                <Field key={locale} className="w-fit">
                    <FieldLabel htmlFor={`timeselect-${locale}`}>
                        {name} <span className="font-alt text-xs text-muted-foreground">{locale}</span>
                    </FieldLabel>
                    <TimeSelect
                        id={`timeselect-${locale}`}
                        locale={locale}
                        defaultValue="14:00"
                        step={30}
                        className="w-40"
                    />
                </Field>
            ))}
        </div>
    );
}
