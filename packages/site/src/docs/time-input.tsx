import {DatePicker} from "@repraze/kernelkit/components/date-picker";
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {TimeColumns, TimeInput} from "@repraze/kernelkit/components/time-input";
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
    title: "Time input",
    category: "Inputs",
    description:
        "A time of day in segments: type it, step it with the arrows, or open the clock for a tap-friendly column picker.",
    order: 8.5,
    demos: [
        {
            title: "Default",
            component: Default,
            description:
                "The clock follows the user's locale (12h in en-US, 24h in most others); the value is always 24-hour `HH:mm`.",
        },
        {
            title: "Picker",
            component: Picker,
            description:
                "The clock opens hours | minutes columns: tap or click to pick, ↑↓ within a column, ← → between them, Enter to close. Works on phones without a keyboard.",
        },
        {
            title: "Picker, 12-hour with seconds",
            component: PickerFull,
            description: "One column per segment; `step` thins the minutes.",
        },
        {
            title: "Columns inline",
            component: Inline,
            description: "`TimeColumns` on its own, for a panel or a custom popover.",
        },
        {title: "Typing only", component: TypingOnly, description: "`picker={false}`: the clock is a plain icon."},
        {
            title: "12-hour",
            component: TwelveHour,
            description: "`hourCycle={12}` forces it: an AM/PM segment; the value stays 24-hour.",
        },
        {
            title: "Locales",
            component: Locales,
            description:
                '`hourCycle="auto"` (the default) reads the hour cycle, day-period labels and their position from `Intl` for `locale` (the browser\'s when omitted).',
        },
        {
            title: "Seconds and step",
            component: SecondsStep,
            description: "`seconds` adds a segment, `step` sets the minute arrows.",
        },
        {title: "Sizes", component: Sizes},
        {title: "Controlled", component: Controlled},
        {title: "With a date", component: WithDate, description: "Next to a DatePicker, same height and surface."},
        {title: "States", component: States, description: "Disabled and invalid."},
    ],
    props: [
        {
            component: "TimeInput",
            rows: [
                {
                    name: "value / defaultValue",
                    type: "string | null",
                    description: '24-hour `"HH:mm"` or `"HH:mm:ss"`.',
                },
                {
                    name: "onValueChange",
                    type: "(value: string | null) => void",
                    description: "The full time once every segment is set, `null` when one is cleared.",
                },
                {
                    name: "hourCycle",
                    type: '12 | 24 | "auto"',
                    default: '"auto"',
                    description: "`auto` follows the locale.",
                },
                {
                    name: "locale",
                    type: "string",
                    description: "BCP 47 tag for `auto` and AM/PM labels; browser's by default.",
                },
                {name: "seconds", type: "boolean", default: "false"},
                {name: "step", type: "number", default: "1", description: "Minutes per arrow press."},
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"'},
                {name: "icon", type: "boolean", default: "true", description: "Leading clock icon."},
                {
                    name: "picker",
                    type: "boolean",
                    default: "true",
                    description: "The clock icon opens the column picker in a popover.",
                },
                {name: "id", type: "string", description: "On the first segment, for `FieldLabel htmlFor`."},
                {name: "name", type: "string", description: "Hidden input with the value, for forms."},
                {name: "disabled / aria-invalid", type: "boolean"},
            ],
        },
        {
            component: "TimeColumns",
            rows: [
                {name: "value", type: "string | null", description: '24-hour `"HH:mm"` / `"HH:mm:ss"`.'},
                {name: "onValueChange", type: "(value: string) => void", description: "Every pick, as a full time."},
                {name: "onCommit", type: "() => void", description: "Enter in a column."},
                {
                    name: "hourCycle / seconds / step",
                    type: "12 | 24 / boolean / number",
                    description: "As on TimeInput.",
                },
            ],
        },
    ],
});

export function Default() {
    return (
        <Field className="w-fit">
            <FieldLabel htmlFor="time-default">Start</FieldLabel>
            <TimeInput id="time-default" defaultValue="09:30" />
        </Field>
    );
}

export function Picker() {
    const [time, setTime] = React.useState<string | null>("14:30");
    return (
        <div className="flex flex-col items-center gap-2">
            <Field className="w-fit">
                <FieldLabel htmlFor="time-picker">Maintenance window</FieldLabel>
                <TimeInput id="time-picker" value={time} onValueChange={setTime} step={5} />
            </Field>
            <pre className="font-mono text-xs text-muted-foreground">{JSON.stringify(time)}</pre>
        </div>
    );
}

export function PickerFull() {
    return (
        <Field className="w-fit">
            <FieldLabel htmlFor="time-picker-12">Cron run</FieldLabel>
            <TimeInput id="time-picker-12" hourCycle={12} seconds step={15} defaultValue="21:15:30" />
        </Field>
    );
}

export function Inline() {
    const [time, setTime] = React.useState<string | null>("08:45");
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border border-border bg-popover p-1">
                <TimeColumns value={time} onValueChange={setTime} step={15} />
            </div>
            <pre className="font-mono text-xs text-muted-foreground">{JSON.stringify(time)}</pre>
        </div>
    );
}

export function TypingOnly() {
    return <TimeInput aria-label="Time" picker={false} defaultValue="06:00" />;
}

export function TwelveHour() {
    return (
        <Field className="w-fit">
            <FieldLabel htmlFor="time-12">Reminder</FieldLabel>
            <TimeInput id="time-12" hourCycle={12} defaultValue="14:05" />
        </Field>
    );
}

export function SecondsStep() {
    return (
        <div className="flex flex-wrap items-end gap-4">
            <Field className="w-fit">
                <FieldLabel htmlFor="time-seconds">Timestamp</FieldLabel>
                <TimeInput id="time-seconds" seconds defaultValue="23:59:42" />
            </Field>
            <Field className="w-fit">
                <FieldLabel htmlFor="time-step">Slot (15 min)</FieldLabel>
                <TimeInput id="time-step" step={15} defaultValue="10:00" />
            </Field>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <TimeInput size="sm" aria-label="Small" defaultValue="08:00" />
            <TimeInput aria-label="Default" defaultValue="12:00" />
            <TimeInput size="lg" aria-label="Large" defaultValue="18:00" />
        </div>
    );
}

export function Controlled() {
    const [time, setTime] = React.useState<string | null>("07:45");
    return (
        <div className="flex flex-col items-center gap-2">
            <TimeInput aria-label="Alarm" value={time} onValueChange={setTime} />
            <pre className="font-mono text-xs text-muted-foreground">{JSON.stringify(time)}</pre>
        </div>
    );
}

export function WithDate() {
    return (
        <FieldGroup className="w-fit flex-row items-end gap-2">
            <Field className="w-fit">
                <FieldLabel>Deploy window</FieldLabel>
                <DatePicker defaultValue={new Date(2026, 10, 14)} className="w-48" />
            </Field>
            <Field className="w-fit">
                <FieldLabel htmlFor="time-deploy" className="sr-only">
                    Time
                </FieldLabel>
                <TimeInput id="time-deploy" defaultValue="02:00" />
            </Field>
        </FieldGroup>
    );
}

export function States() {
    return (
        <div className="flex flex-wrap items-start gap-5">
            <Field data-disabled className="w-fit">
                <FieldLabel htmlFor="time-disabled">Disabled</FieldLabel>
                <TimeInput id="time-disabled" disabled defaultValue="16:20" />
            </Field>
            <Field data-invalid className="w-fit">
                <FieldLabel htmlFor="time-invalid">Invalid</FieldLabel>
                <TimeInput id="time-invalid" aria-invalid defaultValue="03:00" />
                <FieldError>Out of hours.</FieldError>
            </Field>
            <Field className="w-fit">
                <FieldLabel htmlFor="time-empty">Empty</FieldLabel>
                <TimeInput id="time-empty" />
                <FieldDescription>Type 0930.</FieldDescription>
            </Field>
        </div>
    );
}

export function Locales() {
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            {LOCALES.map(([locale, name]) => (
                <Field key={locale} className="w-fit">
                    <FieldLabel htmlFor={`timeinput-${locale}`}>
                        {name} <span className="font-alt text-xs text-muted-foreground">{locale}</span>
                    </FieldLabel>
                    <TimeInput id={`timeinput-${locale}`} locale={locale} defaultValue="14:05" />
                </Field>
            ))}
        </div>
    );
}
