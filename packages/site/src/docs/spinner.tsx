import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@repraze/kernelkit/components/card";
import {Progress} from "@repraze/kernelkit/components/progress";
import {Shimmer} from "@repraze/kernelkit/components/shimmer";
import {Spinner, SpinnerProvider, type SpinnerVariant} from "@repraze/kernelkit/components/spinner";
import {ToggleGroup, ToggleGroupItem} from "@repraze/kernelkit/components/toggle-group";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

const VARIANTS = ["ring", "dots", "braille", "scan", "blink", "bars"] as const;
const SIZES = ["xs", "sm", "default", "lg", "xl"] as const;

export const doc = defineDoc({
    title: "Spinner",
    category: "Feedback",
    description:
        "An indeterminate loading indicator at icon size: a spinning ring or a techy variant (dot matrix, braille, scan line, block cursor, equalizer bars). Inherits the text color, so it stands in for an icon anywhere.",
    demos: [
        {title: "Variants", component: Variants},
        {
            title: "Sizes",
            component: Sizes,
            description: "xs 12px, sm 14px, default 16px, lg 20px, xl 24px: the icon column, for every variant.",
        },
        {
            title: "Color",
            component: Colors,
            description: "It uses `currentColor`: set a text color on it or its parent, or pass `color`.",
        },
        {
            title: "App-wide default",
            component: Provider,
            description:
                "`SpinnerProvider` sets the variant of every Spinner below it, including the ones the kit renders (tree rows loading, stepper, file upload, loading toasts).",
        },
        {
            title: "In controls",
            component: InControls,
            description: "Replace the leading icon, keep the label, set `aria-busy` on the control.",
        },
        {title: "In context", component: InContext},
    ],
    props: [
        {
            component: "Spinner",
            rows: [
                {
                    name: "variant",
                    type: '"ring" | "dots" | "braille" | "scan" | "blink" | "bars"',
                    default: 'from SpinnerProvider, else "ring"',
                },
                {name: "size", type: '"xs" | "sm" | "default" | "lg" | "xl"', default: '"default"'},
                {name: "color", type: "Color", description: "Defaults to `currentColor`."},
                {name: "aria-label", type: "string", default: '"Loading"'},
            ],
        },
        {
            component: "SpinnerProvider",
            rows: [{name: "variant", type: "SpinnerVariant", description: "Default for every Spinner inside."}],
        },
    ],
});

export function Variants() {
    return (
        <div className="grid grid-cols-3 gap-x-10 gap-y-6 sm:grid-cols-6">
            {VARIANTS.map((v) => (
                <div key={v} className="flex flex-col items-center gap-3">
                    <Spinner variant={v} size="xl" />
                    <span className="font-alt text-xs text-muted-foreground">{v}</span>
                </div>
            ))}
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-col gap-4">
            {VARIANTS.map((v) => (
                <div key={v} className="flex items-center gap-4">
                    {SIZES.map((s) => (
                        <Spinner key={s} variant={v} size={s} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function Colors() {
    return (
        <div className="flex flex-col gap-4">
            {(["ring", "dots", "bars"] as const).map((v) => (
                <div key={v} className="flex items-center gap-4">
                    <Spinner variant={v} className="text-muted-foreground" />
                    <Spinner variant={v} color="primary" />
                    <Spinner variant={v} color="info" />
                    <Spinner variant={v} color="success" />
                    <Spinner variant={v} color="warning" />
                    <Spinner variant={v} color="danger" />
                </div>
            ))}
        </div>
    );
}

export function Provider() {
    const [variant, setVariant] = React.useState<SpinnerVariant>("braille");
    return (
        <div className="flex flex-col items-center gap-5">
            <ToggleGroup
                aria-label="Spinner variant"
                variant="outline"
                size="sm"
                value={[variant]}
                onValueChange={(v) => v[0] && setVariant(v[0] as SpinnerVariant)}
            >
                {VARIANTS.map((v) => (
                    <ToggleGroupItem key={v} value={v} className="font-alt text-xs">
                        {v}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
            <SpinnerProvider variant={variant}>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button aria-busy disabled>
                        <Spinner data-icon="inline-start" /> Deploying
                    </Button>
                    <Button variant="outline" aria-busy disabled>
                        <Spinner data-icon="inline-start" /> Syncing
                    </Button>
                    <Badge variant="soft">
                        <Spinner size="xs" data-icon="inline-start" /> building
                    </Badge>
                </div>
            </SpinnerProvider>
        </div>
    );
}

export function InControls() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button aria-busy disabled>
                <Spinner data-icon="inline-start" /> Deploying
            </Button>
            <Button variant="outline" aria-busy disabled>
                <Spinner variant="dots" data-icon="inline-start" /> Syncing
            </Button>
            <Button size="sm" variant="secondary" aria-busy disabled>
                <Spinner variant="braille" size="sm" data-icon="inline-start" /> Fetching logs
            </Button>
            <Button size="icon" variant="ghost" aria-label="Refreshing" aria-busy disabled>
                <Spinner />
            </Button>
            <Badge variant="soft">
                <Spinner variant="bars" size="xs" data-icon="inline-start" /> live
            </Badge>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" /> Waiting for 3 nodes…
            </span>
        </div>
    );
}

export function InContext() {
    return (
        <div className="flex w-full flex-col items-center gap-6">
            <span className="flex items-center gap-1 font-mono text-sm">
                $ npm run build
                <Spinner variant="blink" size="sm" aria-label="Running" />
            </span>
            <Card size="sm" className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>edge-eu-2</CardTitle>
                    <CardDescription>Rolling out v2.14.0</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Spinner variant="scan" size="sm" color="info" />
                        <Shimmer className="flex-1">Health checks</Shimmer>
                        <span className="font-alt text-xs text-muted-foreground">3/8</span>
                    </div>
                    <Progress variant="segmented" value={38} color="info" size="sm" aria-label="Rollout" />
                </CardContent>
            </Card>
        </div>
    );
}
