import {StatusDot} from "kernelkit/components/status-dot";
import {COLORS} from "kernelkit/lib/color";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Status dot",
    category: "Data display",
    description: "A small colored dot with a label for the state of a node, job or connection.",
    demos: [
        {
            title: "States",
            component: States,
            description: "Pair the color with a label: color is never the only signal.",
        },
        {
            title: "Pulse",
            component: Pulse,
            description: "`pulse` adds a ping ring for live or in-progress states. Hidden under reduced motion.",
        },
        {title: "Sizes", component: Sizes},
        {title: "Colors", component: Colors, layout: "start"},
        {title: "Dot only", component: DotOnly, description: "Without children, give it a `label` (role=img)."},
    ],
    props: [
        {
            component: "StatusDot",
            rows: [
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: '"neutral"',
                },
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "6 / 8 / 10px dot."},
                {name: "pulse", type: "boolean", default: "false", description: "Animated ping ring."},
                {name: "label", type: "string", description: "Accessible name when there are no children."},
                {name: "render", type: "ReactElement | (props) => ReactElement", description: "Element to render as."},
            ],
        },
    ],
});

export function States() {
    return (
        <div className="grid grid-cols-2 gap-x-10 gap-y-3">
            <StatusDot color="success">Running</StatusDot>
            <StatusDot color="warning">Degraded</StatusDot>
            <StatusDot color="danger">Crash loop</StatusDot>
            <StatusDot color="info">Provisioning</StatusDot>
            <StatusDot>Stopped</StatusDot>
            <StatusDot color="primary">Selected</StatusDot>
        </div>
    );
}

export function Pulse() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <StatusDot color="success" pulse>
                Live
            </StatusDot>
            <StatusDot color="info" pulse>
                Deploying
            </StatusDot>
            <StatusDot color="danger" pulse>
                Incident open
            </StatusDot>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <StatusDot color="success" size="sm">
                sm
            </StatusDot>
            <StatusDot color="success">default</StatusDot>
            <StatusDot color="success" size="lg">
                lg
            </StatusDot>
        </div>
    );
}

export function Colors() {
    return (
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-xs sm:grid-cols-4">
            {COLORS.map((color) => (
                <StatusDot key={color} color={color} size="sm">
                    {color}
                </StatusDot>
            ))}
        </div>
    );
}

export function DotOnly() {
    return (
        <div className="flex items-center gap-3 font-mono text-sm">
            <span>worker-07</span>
            <StatusDot color="success" label="Healthy" />
            <span className="ml-4">worker-08</span>
            <StatusDot color="danger" label="Unreachable" pulse />
        </div>
    );
}
