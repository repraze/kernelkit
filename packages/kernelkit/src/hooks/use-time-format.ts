"use client";

import {useLocale} from "@repraze/kernelkit/components/locale";
import * as React from "react";

/** `"auto"` follows the locale: 12 in en-US, 24 in fr-FR, en-GB or ja-JP. */
type HourCyclePreference = 12 | 24 | "auto";

interface TimeFormat {
    locale: string;
    hourCycle: 12 | 24;
    /** Localized day periods: "AM" / "PM" in en-US, "a.m." / "p.m." in en-CA, "오전" / "오후" in ko. */
    am: string;
    pm: string;
    /** The day period comes before the hour (ko, zh). */
    periodFirst: boolean;
    /** "09:30" (24h) or "9:30 AM" / "오전 9:30" (12h), in the locale's own pattern. */
    format: (minutes: number) => string;
    /** A two-digit segment in the locale's digits: "05", "٠٥" in ar-EG. */
    digits: (n: number) => string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Hour cycle, day-period labels and a formatter, from `Intl` for the resolved locale (see `useLocale`:
 * prop › LocaleProvider › browser, hydration-safe). An explicit 12 / 24 overrides the locale's cycle.
 */
function useTimeFormat(preference: HourCyclePreference = "auto", explicitLocale?: string): TimeFormat {
    const locale = useLocale(explicitLocale);
    return React.useMemo(() => {
        let hourCycle: 12 | 24 = preference === "auto" ? 24 : preference;
        let am = "AM";
        let pm = "PM";
        let periodFirst = false;
        let formatter: Intl.DateTimeFormat | null = null;
        let numbers: Intl.NumberFormat | null = null;
        try {
            numbers = new Intl.NumberFormat(locale, {minimumIntegerDigits: 2, useGrouping: false});
            if (preference === "auto") {
                const hc = new Intl.DateTimeFormat(locale, {hour: "numeric"}).resolvedOptions().hourCycle;
                hourCycle = hc === "h11" || hc === "h12" ? 12 : 24;
            }
            const f = new Intl.DateTimeFormat(locale, {hour: "numeric", hourCycle: "h12"});
            const parts = (h: number) => f.formatToParts(new Date(2000, 0, 1, h));
            am = parts(9).find((p) => p.type === "dayPeriod")?.value ?? am;
            pm = parts(21).find((p) => p.type === "dayPeriod")?.value ?? pm;
            const types = parts(9).map((p) => p.type);
            periodFirst = types.includes("dayPeriod") && types.indexOf("dayPeriod") < types.indexOf("hour");
            formatter = new Intl.DateTimeFormat(locale, {
                hour: hourCycle === 24 ? "2-digit" : "numeric",
                minute: "2-digit",
                hourCycle: hourCycle === 24 ? "h23" : "h12",
            });
        } catch {
            formatter = null;
        }
        const format = (minutes: number) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            if (formatter) {
                return formatter.format(new Date(2000, 0, 1, h, m));
            }
            return hourCycle === 24 ? `${pad(h)}:${pad(m)}` : `${h % 12 || 12}:${pad(m)} ${h < 12 ? am : pm}`;
        };
        const digits = (n: number) => (numbers ? numbers.format(n) : pad(n));
        return {locale, hourCycle, am, pm, periodFirst, format, digits};
    }, [preference, locale]);
}

export {useTimeFormat};
export type {HourCyclePreference, TimeFormat};
