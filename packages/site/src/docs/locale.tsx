import {Calendar} from "@repraze/kernelkit/components/calendar";
import {DatePicker, DateRangePicker} from "@repraze/kernelkit/components/date-picker";
import {Field, FieldLabel} from "@repraze/kernelkit/components/field";
import {LocaleProvider, useLocale} from "@repraze/kernelkit/components/locale";
import {NativeSelect, NativeSelectOption} from "@repraze/kernelkit/components/native-select";
import {TimeInput} from "@repraze/kernelkit/components/time-input";
import {TimeSelect} from "@repraze/kernelkit/components/time-select";
import * as React from "react";

import {Code, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Locale",
    category: "Foundations",
    description:
        "Dates and times follow the user's locale through Intl: month and weekday names, first day of the week, 12 or 24-hour clock, AM/PM labels and digits. No locale data to ship.",
    order: 6,
    demos: [
        {
            title: "Switch locale",
            component: Switcher,
            layout: "start",
            description:
                "`LocaleProvider` sets the locale for everything below it. Without one, components use the browser's language.",
        },
    ],
    notes: Notes,
    sections: [{id: "ssr", title: "Server rendering"}],
    props: [
        {
            component: "LocaleProvider",
            rows: [
                {
                    name: "locale",
                    type: "string",
                    description: "BCP 47 tag (`fr-FR`, `ja-JP`). Omit to follow the browser.",
                },
            ],
        },
        {
            component: "useLocale",
            rows: [
                {
                    name: "(explicit?)",
                    type: "string",
                    description: "Returns explicit › LocaleProvider › browser (after hydration) › `en-US`.",
                },
            ],
        },
    ],
});

const LOCALES = ["browser", "en-US", "en-GB", "fr-FR", "de-DE", "ja-JP", "ko-KR", "ar-EG", "pt-BR"] as const;

function Current() {
    return <span className="font-alt text-xs text-muted-foreground">resolved: {useLocale()}</span>;
}

export function Switcher() {
    const [choice, setChoice] = React.useState<(typeof LOCALES)[number]>("fr-FR");
    const [range, setRange] = React.useState<{from?: Date; to?: Date} | null>({
        from: new Date(2026, 10, 14),
        to: new Date(2026, 10, 20),
    });
    return (
        <div className="flex w-full flex-col gap-5">
            <div className="flex items-center gap-3">
                <NativeSelect
                    aria-label="Locale"
                    value={choice}
                    onChange={(e) => setChoice(e.target.value as (typeof LOCALES)[number])}
                >
                    {LOCALES.map((l) => (
                        <NativeSelectOption key={l} value={l}>
                            {l}
                        </NativeSelectOption>
                    ))}
                </NativeSelect>
            </div>
            <LocaleProvider locale={choice === "browser" ? undefined : choice}>
                <Current />
                <div className="flex flex-wrap items-start gap-6">
                    <div className="flex flex-col gap-4">
                        <Field className="w-fit">
                            <FieldLabel htmlFor="locale-date">Date</FieldLabel>
                            <DatePicker id="locale-date" defaultValue={new Date(2026, 10, 14)} />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="locale-range">Range</FieldLabel>
                            <DateRangePicker
                                id="locale-range"
                                value={range?.from ? {from: range.from, to: range.to} : null}
                                onValueChange={(r) => setRange(r)}
                            />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="locale-time">Time</FieldLabel>
                            <TimeInput id="locale-time" defaultValue="14:05" />
                        </Field>
                        <Field className="w-fit">
                            <FieldLabel htmlFor="locale-slot">Slot</FieldLabel>
                            <TimeSelect id="locale-slot" defaultValue="14:30" className="w-40" />
                        </Field>
                    </div>
                    <Calendar
                        mode="single"
                        defaultMonth={new Date(2026, 10, 1)}
                        selected={new Date(2026, 10, 14)}
                        className="rounded-xl border border-border"
                    />
                </div>
            </LocaleProvider>
        </div>
    );
}

function Notes() {
    return (
        <>
            <h2 id="ssr" className="scroll-mt-24 font-heading text-lg font-medium">
                Server rendering
            </h2>
            <p className="text-sm text-muted-foreground">
                The server doesn&apos;t know the browser&apos;s language, so the server render and the hydration pass
                both format with <code>en-US</code> (no hydration mismatch), then the client switches to the
                browser&apos;s locale. To be right from the first paint, pass the request&apos;s locale (a user setting
                or the Accept-Language header) to <code>LocaleProvider</code>.
            </p>
            <Code
                title="app/layout.tsx"
                code={`import {LocaleProvider} from "@repraze/kernelkit/components/locale";

export default async function Layout({children}) {
    const locale = (await headers()).get("accept-language")?.split(",")[0] ?? "en-US";
    return <LocaleProvider locale={locale}>{children}</LocaleProvider>;
}`}
            />
        </>
    );
}
