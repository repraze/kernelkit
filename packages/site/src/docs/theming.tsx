import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {Input} from "@repraze/kernelkit/components/input";
import {Switch} from "@repraze/kernelkit/components/switch";
import {type Accent, ACCENTS, RADII, ThemeScope} from "@repraze/kernelkit/provider";

import {Code, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Theming",
    category: "Foundations",
    description:
        "Mode, contrast, accent and radius are classes on <html> (or any subtree). Everything else derives from CSS variables.",
    order: 1,
    demos: [
        {title: "Accents", component: Accents, layout: "full"},
        {title: "Radius", component: Radius, layout: "full"},
        {title: "Modes", component: Modes, layout: "full"},
    ],
    notes: Notes,
    props: [
        {
            component: "ThemeProvider",
            rows: [
                {name: "defaultTheme", type: "Partial<ThemeState>", default: "system / normal / pink / md"},
                {
                    name: "storageKey",
                    type: "string | null",
                    default: '"kernelkit-theme"',
                    description: "null disables persistence.",
                },
                {
                    name: "forcedTheme",
                    type: "Partial<ThemeState>",
                    description: "Pins values, ignoring the user's choice.",
                },
            ],
        },
        {
            component: "ThemeScope",
            rows: [
                {name: "mode", type: '"light" | "dark"', description: "Inherits from the provider when omitted."},
                {name: "contrast", type: '"normal" | "high"'},
                {name: "accent", type: "Accent"},
                {name: "radius", type: '"none" | "sm" | "md" | "lg" | "xl"'},
            ],
        },
    ],
});

function Sample({accent}: {accent?: Accent}) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Run</Button>
                <Button size="sm" variant="outline">
                    Stop
                </Button>
                <Switch defaultChecked aria-label="Enabled" />
            </div>
            <Input placeholder={accent ?? "search…"} className="h-8" />
            <div className="flex gap-1.5">
                <Badge>live</Badge>
                <Badge variant="secondary">{accent ?? "idle"}</Badge>
            </div>
        </div>
    );
}

export function Accents() {
    return (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-4">
            {ACCENTS.map((accent) => (
                <ThemeScope key={accent} accent={accent} className="p-4">
                    <Sample accent={accent} />
                </ThemeScope>
            ))}
        </div>
    );
}

export function Radius() {
    return (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-border lg:grid-cols-5">
            {RADII.map((radius) => (
                <ThemeScope key={radius} radius={radius} className="flex flex-col gap-3 p-4">
                    <span className="font-mono text-xs text-muted-foreground">radius-{radius}</span>
                    <Sample />
                </ThemeScope>
            ))}
        </div>
    );
}

export function Modes() {
    return (
        <div className="grid gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-4">
            {(["light", "dark"] as const).flatMap((mode) =>
                (["normal", "high"] as const).map((contrast) => (
                    <ThemeScope
                        key={mode + contrast}
                        mode={mode}
                        contrast={contrast}
                        className="flex flex-col gap-3 p-4"
                    >
                        <span className="font-mono text-xs text-muted-foreground">
                            {mode}
                            {contrast === "high" ? " · hc" : ""}
                        </span>
                        <Sample />
                    </ThemeScope>
                )),
            )}
        </div>
    );
}

function Notes() {
    return (
        <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
                <h2 className="font-mono text-xl font-semibold">Classes</h2>
                <p className="text-sm text-muted-foreground">
                    The provider manages these on {"<html>"}; you can also set them by hand on any element.
                </p>
                <Code
                    language="html"
                    code={`<html class="dark hc accent-cyan radius-none">
<section class="light accent-orange radius-lg">…</section>`}
                />
            </section>
            <section className="flex flex-col gap-3">
                <h2 className="font-mono text-xl font-semibold">Variables</h2>
                <p className="text-sm text-muted-foreground">
                    Override any token in CSS. Radius is a single knob: every rounded-* step is a multiple of it.
                </p>
                <Code
                    language="css"
                    code={`:root {
    --kk-radius: 0.375rem;          /* rounded-lg; sm = ×0.5, xl = ×1.5 … */
    --kk-font-sans: "Geist Variable", sans-serif;
    --kk-font-mono: "JetBrains Mono Variable", monospace;
}

/* TermiColor roles drive shadcn tokens: --primary → --tc-accent, --border → --tc-border … */
.brand {
    --primary: var(--tc-cyan);
}`}
                />
            </section>
        </div>
    );
}
