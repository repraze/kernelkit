import {Card, CardContent} from "kernelkit/components/card";
import {
    Stat,
    StatDelta,
    StatDescription,
    StatLabel,
    StatSparkline,
    StatUnit,
    StatValue,
} from "kernelkit/components/stat";
import {ActivityIcon, CpuIcon, GaugeIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Stat",
    category: "Data display",
    description: "One metric at a glance: a label, a mono value, its change and an optional sparkline.",
    demos: [
        {title: "Basic", component: Basic},
        {
            title: "Delta",
            component: Deltas,
            description:
                "`trend` picks the arrow; up reads as success, down as danger. Set `invert` for metrics where lower is better.",
        },
        {
            title: "Sparkline",
            component: WithSparkline,
            description: "`StatSparkline` is a right-hand slot for any small chart.",
        },
        {title: "Sizes", component: Sizes},
        {title: "Dashboard row", component: Dashboard, layout: "full"},
    ],
    props: [
        {
            component: "Stat",
            rows: [
                {
                    name: "size",
                    type: '"sm" | "default" | "lg"',
                    default: '"default"',
                    description: "Value text-xl / 2xl / 3xl.",
                },
                {name: "render", type: "ReactElement | (props) => ReactElement", description: "Element to render as."},
            ],
        },
        {
            component: "StatDelta",
            rows: [
                {name: "trend", type: '"up" | "down" | "flat"', default: '"flat"'},
                {
                    name: "invert",
                    type: "boolean",
                    default: "false",
                    description: "Down is good (latency, error rate, cost): swaps success and danger.",
                },
            ],
        },
    ],
});

export function Basic() {
    return (
        <Stat>
            <StatLabel>Requests / s</StatLabel>
            <StatValue>12,481</StatValue>
            <StatDelta trend="up">+8.2% vs last hour</StatDelta>
        </Stat>
    );
}

export function Deltas() {
    return (
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <Stat>
                <StatLabel>Throughput</StatLabel>
                <StatValue>
                    3.2<StatUnit>GB/s</StatUnit>
                </StatValue>
                <StatDelta trend="up">+12.4%</StatDelta>
            </Stat>
            <Stat>
                <StatLabel>p95 latency</StatLabel>
                <StatValue>
                    184<StatUnit>ms</StatUnit>
                </StatValue>
                <StatDelta trend="down" invert>
                    −22 ms
                </StatDelta>
            </Stat>
            <Stat>
                <StatLabel>Error rate</StatLabel>
                <StatValue>
                    0.41<StatUnit>%</StatUnit>
                </StatValue>
                <StatDelta trend="up" invert>
                    +0.09 pts
                </StatDelta>
            </Stat>
            <Stat>
                <StatLabel>Active nodes</StatLabel>
                <StatValue>48</StatValue>
                <StatDelta>no change</StatDelta>
            </Stat>
        </div>
    );
}

const SERIES = [12, 18, 15, 22, 19, 27, 24, 31, 29, 36, 33, 40];

function Sparkline({values}: {values: number[]}) {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const points = values
        .map((v, i) => `${(i / (values.length - 1)) * 100},${36 - ((v - min) / (max - min)) * 32}`)
        .join(" ");
    return (
        <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="h-10 w-full overflow-visible"
            aria-hidden="true"
        >
            <polyline points={`0,40 ${points} 100,40`} className="fill-current opacity-15" />
            <polyline
                points={points}
                className="fill-none stroke-current"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}

export function WithSparkline() {
    return (
        <Card className="w-72">
            <CardContent>
                <Stat>
                    <StatLabel>
                        <ActivityIcon /> Deploys this week
                    </StatLabel>
                    <StatValue>40</StatValue>
                    <StatDelta trend="up">+11 vs last week</StatDelta>
                    <StatSparkline>
                        <Sparkline values={SERIES} />
                    </StatSparkline>
                </Stat>
            </CardContent>
        </Card>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-start gap-10">
            {(["sm", "default", "lg"] as const).map((size) => (
                <Stat key={size} size={size}>
                    <StatLabel>{size}</StatLabel>
                    <StatValue>
                        99.98<StatUnit>%</StatUnit>
                    </StatValue>
                    <StatDescription>30-day uptime</StatDescription>
                </Stat>
            ))}
        </div>
    );
}

export function Dashboard() {
    return (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-6 sm:grid-cols-3">
            <Card size="sm">
                <CardContent>
                    <Stat>
                        <StatLabel>
                            <CpuIcon /> CPU
                        </StatLabel>
                        <StatValue>
                            63<StatUnit>%</StatUnit>
                        </StatValue>
                        <StatDelta trend="up" invert>
                            +4%
                        </StatDelta>
                        <StatSparkline className="text-tc-orange">
                            <Sparkline values={[40, 44, 52, 48, 55, 61, 58, 63]} />
                        </StatSparkline>
                    </Stat>
                </CardContent>
            </Card>
            <Card size="sm">
                <CardContent>
                    <Stat>
                        <StatLabel>
                            <GaugeIcon /> p99 latency
                        </StatLabel>
                        <StatValue>
                            412<StatUnit>ms</StatUnit>
                        </StatValue>
                        <StatDelta trend="down" invert>
                            −38 ms
                        </StatDelta>
                        <StatSparkline className="text-tc-cyan">
                            <Sparkline values={[520, 498, 470, 480, 455, 440, 431, 412]} />
                        </StatSparkline>
                    </Stat>
                </CardContent>
            </Card>
            <Card size="sm">
                <CardContent>
                    <Stat>
                        <StatLabel>
                            <ActivityIcon /> Jobs queued
                        </StatLabel>
                        <StatValue>1,204</StatValue>
                        <StatDelta trend="up">+96</StatDelta>
                        <StatSparkline>
                            <Sparkline values={[900, 950, 1010, 980, 1100, 1150, 1180, 1204]} />
                        </StatSparkline>
                    </Stat>
                </CardContent>
            </Card>
        </div>
    );
}
