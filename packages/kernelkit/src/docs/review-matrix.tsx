"use client";

import type {Accent, Radius, ResolvedMode} from "@repraze/kernelkit/provider";
import {ThemeScope, type ThemeScopeProps} from "@repraze/kernelkit/provider";
import {cn} from "cn";

import type {DocEntry} from "./doc-kit";

export interface ReviewScope {
    label: string;
    scope: Omit<ThemeScopeProps, "children">;
}

/**
 * The GUIDELINES §8 scopes: dark, light and both high-contrast modes in the site's own accent and radius,
 * then two variants (by default dark · radius-none · cyan and light · radius-xl · yellow).
 */
export function reviewScopes(
    site: {accent: Accent; radius: Radius},
    variants: {mode: ResolvedMode; accent: Accent; radius: Radius}[] = [
        {mode: "dark", accent: "cyan", radius: "none"},
        {mode: "light", accent: "yellow", radius: "xl"},
    ],
): ReviewScope[] {
    return [
        {label: "dark", scope: {mode: "dark", contrast: "normal", ...site}},
        {label: "light", scope: {mode: "light", contrast: "normal", ...site}},
        {label: "dark · hc", scope: {mode: "dark", contrast: "high", ...site}},
        {label: "light · hc", scope: {mode: "light", contrast: "high", ...site}},
        ...variants.map(({mode, accent, radius}) => ({
            label: `${mode} · radius-${radius} · ${accent}`,
            scope: {mode, contrast: "normal" as const, accent, radius},
        })),
    ];
}

/** Every demo of a page in each scope, side by side, for visual review (GUIDELINES §8). */
export function ReviewMatrix({doc, scopes}: {doc: DocEntry; scopes: ReviewScope[]}) {
    return (
        <div className="flex flex-col gap-6 p-6" data-slot="review">
            <h1 className="font-mono text-lg font-semibold">{doc.title} · review</h1>
            {doc.demos.map((demo) => {
                const Component = demo.component;
                return (
                    <section key={demo.title} className="flex flex-col gap-2">
                        <h2 className="font-mono text-sm text-muted-foreground">{demo.title}</h2>
                        <div className="grid grid-cols-2 gap-px overflow-hidden border bg-border">
                            {scopes.map(({label, scope}) => (
                                <ThemeScope key={label} {...scope} className="flex flex-col gap-3 p-4">
                                    <span className="font-mono text-[10px] text-muted-foreground">{label}</span>
                                    <div
                                        className={cn(
                                            "flex min-h-24 flex-1",
                                            demo.layout === "full" ? "" : "items-center justify-center",
                                        )}
                                    >
                                        <Component />
                                    </div>
                                </ThemeScope>
                            ))}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
