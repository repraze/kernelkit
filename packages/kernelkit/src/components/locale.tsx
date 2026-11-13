"use client";

import * as React from "react";

/**
 * Locale for the kit's dates and times (Calendar, DatePicker, TimeInput, TimeSelect), all formatted with
 * `Intl`. Resolution: a component's own `locale` prop › the nearest `LocaleProvider` › the browser's
 * language. Hydration-safe: the server render and the hydration pass use `FALLBACK_LOCALE` (the browser's
 * language is unknown on the server), then the client re-renders with the browser's. To get it right from
 * the first paint in SSR, pass the request's locale (Accept-Language, user setting) to `LocaleProvider`.
 */
const FALLBACK_LOCALE = "en-US";

const LocaleContext = React.createContext<string | undefined>(undefined);

function LocaleProvider({locale, children}: {locale?: string; children: React.ReactNode}) {
    return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

function browserLocale(): string | null {
    try {
        const tag = navigator.languages?.[0] ?? navigator.language;
        return tag && Intl.DateTimeFormat.supportedLocalesOf(tag).length ? tag : null;
    } catch {
        return null;
    }
}

function subscribe(onChange: () => void) {
    window.addEventListener("languagechange", onChange);
    return () => window.removeEventListener("languagechange", onChange);
}

/** The locale to format with: `explicit` › LocaleProvider › browser (after hydration) › `FALLBACK_LOCALE`. */
function useLocale(explicit?: string): string {
    const provided = React.useContext(LocaleContext);
    const browser = React.useSyncExternalStore(subscribe, browserLocale, () => null);
    return explicit ?? provided ?? browser ?? FALLBACK_LOCALE;
}

// Regions whose week starts on Sunday or Saturday (CLDR), for engines without Intl.Locale#getWeekInfo.
const SUNDAY = new Set(
    "AG AS AU BD BR BS BT BW BZ CA CN CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(
        " ",
    ),
);
const SATURDAY = new Set("AE AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" "));

/** First day of the week for a locale: 0 Sunday … 6 Saturday. */
function weekStart(locale: string): 0 | 1 | 6 {
    try {
        const loc = new Intl.Locale(locale) as Intl.Locale & {
            getWeekInfo?: () => {firstDay: number};
            weekInfo?: {firstDay: number};
        };
        const info = loc.getWeekInfo?.() ?? loc.weekInfo;
        if (info) {
            return (info.firstDay % 7) as 0 | 1 | 6;
        }
        const region = loc.maximize().region ?? "";
        return SUNDAY.has(region) ? 0 : SATURDAY.has(region) ? 6 : 1;
    } catch {
        return 0;
    }
}

export {FALLBACK_LOCALE, LocaleProvider, useLocale, weekStart};
