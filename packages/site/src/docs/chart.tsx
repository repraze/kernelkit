import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "kernelkit/components/chart";
import {Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Chart",
    category: "Data display",
    description: "Recharts wrapped with theme colors (`--chart-1..5`), a token-styled tooltip and legend.",
    demos: [
        {title: "Area", component: AreaDemo, layout: "full"},
        {title: "Bar", component: BarDemo, layout: "full"},
        {title: "Line", component: LineDemo, layout: "full"},
        {
            title: "Tooltip indicators",
            component: Indicators,
            layout: "full",
            description: '`indicator="dot" | "line" | "dashed"`. Shown here pinned open with `defaultIndex`.',
        },
    ],
    props: [
        {
            component: "ChartContainer",
            rows: [
                {
                    name: "config",
                    type: "ChartConfig",
                    description:
                        "Per series: `label`, `icon`, and `color` (or `theme: {light, dark}`). Each color becomes `--color-<key>` for the chart's elements.",
                },
                {
                    name: "className",
                    type: "string",
                    description: "Defaults to `aspect-video`; set a height to change it.",
                },
            ],
        },
        {
            component: "ChartTooltipContent",
            rows: [
                {name: "indicator", type: '"dot" | "line" | "dashed"', default: '"dot"'},
                {name: "hideLabel", type: "boolean", default: "false"},
                {name: "hideIndicator", type: "boolean", default: "false"},
                {
                    name: "nameKey / labelKey",
                    type: "string",
                    description: "Payload keys for the series name and label.",
                },
            ],
        },
    ],
});

const TRAFFIC = [
    {hour: "00:00", api: 1820, web: 940, worker: 410},
    {hour: "03:00", api: 1310, web: 620, worker: 880},
    {hour: "06:00", api: 2140, web: 1180, worker: 520},
    {hour: "09:00", api: 4620, web: 2890, worker: 610},
    {hour: "12:00", api: 5210, web: 3340, worker: 700},
    {hour: "15:00", api: 4870, web: 3010, worker: 660},
    {hour: "18:00", api: 3960, web: 2420, worker: 590},
    {hour: "21:00", api: 2730, web: 1610, worker: 480},
];

const config = {
    api: {label: "api", color: "var(--chart-1)"},
    web: {label: "web", color: "var(--chart-2)"},
    worker: {label: "worker", color: "var(--chart-3)"},
} satisfies ChartConfig;

export function AreaDemo() {
    return (
        <div className="w-full min-w-0 p-6">
            <ChartContainer config={config} className="h-64 w-full">
                <AreaChart data={TRAFFIC} margin={{left: 0, right: 8, top: 8}}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={36} tickFormatter={(v: number) => `${v / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                    <Area
                        dataKey="web"
                        type="monotone"
                        stackId="a"
                        stroke="var(--color-web)"
                        fill="var(--color-web)"
                        fillOpacity={0.2}
                        isAnimationActive={false}
                    />
                    <Area
                        dataKey="api"
                        type="monotone"
                        stackId="a"
                        stroke="var(--color-api)"
                        fill="var(--color-api)"
                        fillOpacity={0.2}
                        isAnimationActive={false}
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>
        </div>
    );
}

export function BarDemo() {
    return (
        <div className="w-full min-w-0 p-6">
            <ChartContainer config={config} className="h-64 w-full">
                <BarChart data={TRAFFIC} margin={{left: 0, right: 8, top: 8}}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={36} tickFormatter={(v: number) => `${v / 1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="api" fill="var(--color-api)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="web" fill="var(--color-web)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    <Bar dataKey="worker" fill="var(--color-worker)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
                    <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}

const LATENCY = [
    {day: "Mon", p50: 42, p95: 168, p99: 402},
    {day: "Tue", p50: 40, p95: 171, p99: 388},
    {day: "Wed", p50: 45, p95: 190, p99: 455},
    {day: "Thu", p50: 39, p95: 160, p99: 371},
    {day: "Fri", p50: 41, p95: 158, p99: 349},
    {day: "Sat", p50: 36, p95: 132, p99: 298},
    {day: "Sun", p50: 35, p95: 129, p99: 287},
];

const latencyConfig = {
    p50: {label: "p50", color: "var(--chart-4)"},
    p95: {label: "p95", color: "var(--chart-2)"},
    p99: {label: "p99", color: "var(--chart-1)"},
} satisfies ChartConfig;

export function LineDemo() {
    return (
        <div className="w-full min-w-0 p-6">
            <ChartContainer config={latencyConfig} className="h-64 w-full">
                <LineChart data={LATENCY} margin={{left: 0, right: 8, top: 8}}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} width={48} unit="ms" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {(["p50", "p95", "p99"] as const).map((key) => (
                        <Line
                            key={key}
                            dataKey={key}
                            type="monotone"
                            stroke={`var(--color-${key})`}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{r: 4}}
                            isAnimationActive={false}
                        />
                    ))}
                    <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
            </ChartContainer>
        </div>
    );
}

export function Indicators() {
    return (
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 p-6 sm:grid-cols-3">
            {(["dot", "line", "dashed"] as const).map((indicator) => (
                <ChartContainer key={indicator} config={latencyConfig} className="h-48 w-full">
                    <BarChart data={LATENCY} margin={{left: 0, right: 0, top: 8}}>
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip defaultIndex={2} active content={<ChartTooltipContent indicator={indicator} />} />
                        <Bar dataKey="p95" fill="var(--color-p95)" radius={2} isAnimationActive={false} />
                        <Bar dataKey="p99" fill="var(--color-p99)" radius={2} isAnimationActive={false} />
                    </BarChart>
                </ChartContainer>
            ))}
        </div>
    );
}
