import {Badge} from "kernelkit/components/badge";
import {COLORS, FILL_VARIANTS} from "kernelkit/lib/color";
import {CircleAlertIcon, CircleCheckIcon, GitBranchIcon, LoaderCircleIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Badge",
    category: "Data display",
    description: "A compact pill for status, counts and tags. Same color × variant axes as Button.",
    demos: [
        {title: "Variants", component: Variants},
        {
            title: "Colors",
            component: Colors,
            layout: "start",
            description:
                "`color` is orthogonal to `variant`. Solid, soft and link default to primary; outline and ghost default to neutral.",
        },
        {
            title: "Status",
            component: Status,
            description: "Pair status colors with an icon or a word, never color alone.",
        },
        {title: "As link", component: AsLink, description: "Render an anchor with `render`; links get a hover wash."},
    ],
    props: [
        {
            component: "Badge",
            rows: [
                {
                    name: "variant",
                    type: '"solid" | "soft" | "outline" | "ghost" | "link"',
                    default: '"solid"',
                    description:
                        'shadcn aliases: "default" = solid, "secondary" = solid neutral, "destructive" = soft danger.',
                },
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: "per variant",
                    description: "Hue: red, orange, yellow, green, cyan, blue, purple, pink.",
                },
                {name: "render", type: "ReactElement | (props) => ReactElement", description: "Element to render as."},
            ],
        },
    ],
});

export function Variants() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge>v2.4.1</Badge>
            <Badge variant="soft">beta</Badge>
            <Badge variant="outline">linux/amd64</Badge>
            <Badge variant="secondary">cached</Badge>
            <Badge variant="ghost">draft</Badge>
            <Badge variant="destructive">deprecated</Badge>
        </div>
    );
}

export function Colors() {
    return (
        <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-x-3 gap-y-1.5 text-xs">
            <span />
            {FILL_VARIANTS.map((variant) => (
                <span key={variant} className="font-mono text-muted-foreground">
                    {variant}
                </span>
            ))}
            {COLORS.map((color) => (
                <div key={color} className="contents">
                    <span className="pr-2 font-mono text-muted-foreground">{color}</span>
                    {FILL_VARIANTS.map((variant) => (
                        <span key={variant}>
                            <Badge variant={variant} color={color}>
                                {color}
                            </Badge>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function Status() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge variant="soft" color="success">
                <CircleCheckIcon data-icon="inline-start" /> healthy
            </Badge>
            <Badge variant="soft" color="warning">
                <CircleAlertIcon data-icon="inline-start" /> degraded
            </Badge>
            <Badge variant="solid" color="danger">
                <CircleAlertIcon data-icon="inline-start" /> 3 failing
            </Badge>
            <Badge variant="outline" color="info">
                <LoaderCircleIcon data-icon="inline-start" className="animate-spin" /> syncing
            </Badge>
            <Badge variant="outline">
                <GitBranchIcon data-icon="inline-start" /> main
            </Badge>
            <Badge className="min-w-5 px-1 font-mono tabular-nums">12</Badge>
        </div>
    );
}

export function AsLink() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" render={<a href="#as-link" />}>
                #incident-4821
            </Badge>
            <Badge variant="soft" color="purple" render={<a href="#as-link" />}>
                area/scheduler
            </Badge>
        </div>
    );
}
