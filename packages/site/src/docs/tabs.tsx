import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {Input} from "@repraze/kernelkit/components/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@repraze/kernelkit/components/tabs";
import {ActivityIcon, CpuIcon, FileTextIcon, ServerIcon, SettingsIcon, TerminalIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Tabs",
    category: "Navigation",
    baseUi: "tabs",
    description: "Switches between views of the same object without leaving the page.",
    demos: [
        {
            title: "Default",
            component: Default,
            layout: "start",
            description:
                "The active tab takes the accent tint and a 2px pill along its bottom edge, like a current nav link. Chips stay concentric with the track at every radius.",
        },
        {
            title: "Line",
            component: Line,
            layout: "start",
            description: '`variant="line"` sits on a baseline and marks the active tab with a 2px primary indicator.',
        },
        {
            title: "Sizes",
            component: Sizes,
            description:
                "The list follows the control heights, so it lines up with a button or input of the same size.",
        },
        {title: "With icons and disabled", component: WithIcons},
        {title: "Vertical", component: Vertical, layout: "start"},
    ],
    props: [
        {
            component: "Tabs",
            rows: [
                {name: "defaultValue", type: "any", description: "Uncontrolled initial tab value."},
                {name: "value / onValueChange", type: "any / (value) => void", description: "Controlled value."},
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
            ],
        },
        {
            component: "TabsList",
            rows: [
                {name: "variant", type: '"default" | "line"', default: '"default"'},
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "h-7 / h-8 / h-9."},
                {
                    name: "activateOnFocus",
                    type: "boolean",
                    default: "false",
                    description: "Select a tab on arrow-key focus.",
                },
            ],
        },
        {
            component: "TabsTrigger",
            rows: [
                {name: "value", type: "any", description: "Matches a `TabsContent` value."},
                {name: "disabled", type: "boolean", default: "false"},
            ],
        },
    ],
});

export function Default() {
    return (
        <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="flex flex-col gap-1 rounded-lg border p-4">
                <span className="font-heading font-medium">api-gateway</span>
                <span className="text-muted-foreground">3 replicas running on cluster eu-west-1.</span>
            </TabsContent>
            <TabsContent value="logs" className="rounded-lg border p-4 font-mono text-xs text-muted-foreground">
                12:04:31 INFO listening on :8080
            </TabsContent>
            <TabsContent value="metrics" className="rounded-lg border p-4 text-muted-foreground">
                p95 latency 42ms · 1.2k req/s
            </TabsContent>
            <TabsContent value="settings" className="rounded-lg border p-4 text-muted-foreground">
                Autoscaling between 2 and 8 replicas.
            </TabsContent>
        </Tabs>
    );
}

export function Line() {
    return (
        <Tabs defaultValue="deployments" className="w-full max-w-md">
            <TabsList variant="line">
                <TabsTrigger value="deployments">Deployments</TabsTrigger>
                <TabsTrigger value="builds">
                    Builds
                    <Badge variant="soft" color="neutral">
                        12
                    </Badge>
                </TabsTrigger>
                <TabsTrigger value="incidents">Incidents</TabsTrigger>
            </TabsList>
            <TabsContent value="deployments" className="py-2 text-muted-foreground">
                v2.14.0 promoted to production 4 minutes ago.
            </TabsContent>
            <TabsContent value="builds" className="py-2 text-muted-foreground">
                12 builds queued on the shared runner pool.
            </TabsContent>
            <TabsContent value="incidents" className="py-2 text-muted-foreground">
                No open incidents.
            </TabsContent>
        </Tabs>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-col items-start gap-4">
            {(["sm", "default", "lg"] as const).map((size) => (
                <div key={size} className="flex items-center gap-2">
                    <Tabs defaultValue="1h">
                        <TabsList size={size}>
                            <TabsTrigger value="1h">1h</TabsTrigger>
                            <TabsTrigger value="24h">24h</TabsTrigger>
                            <TabsTrigger value="7d">7d</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Input
                        placeholder="Filter by host"
                        className={size === "sm" ? "h-7 w-40 rounded-md" : size === "lg" ? "h-9 w-40" : "w-40"}
                    />
                    <Button size={size} variant="outline">
                        Refresh
                    </Button>
                </div>
            ))}
        </div>
    );
}

export function WithIcons() {
    return (
        <div className="flex flex-col items-center gap-4">
            <Tabs defaultValue="shell">
                <TabsList>
                    <TabsTrigger value="shell">
                        <TerminalIcon data-icon="inline-start" /> Shell
                    </TabsTrigger>
                    <TabsTrigger value="files">
                        <FileTextIcon data-icon="inline-start" /> Files
                    </TabsTrigger>
                    <TabsTrigger value="profiler" disabled>
                        <CpuIcon data-icon="inline-start" /> Profiler
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            <Tabs defaultValue="shell">
                <TabsList variant="line">
                    <TabsTrigger value="shell">
                        <TerminalIcon data-icon="inline-start" /> Shell
                    </TabsTrigger>
                    <TabsTrigger value="files">
                        <FileTextIcon data-icon="inline-start" /> Files
                    </TabsTrigger>
                    <TabsTrigger value="profiler" disabled>
                        <CpuIcon data-icon="inline-start" /> Profiler
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}

export function Vertical() {
    return (
        <div className="flex flex-wrap gap-8">
            <Tabs defaultValue="nodes" orientation="vertical" className="w-72">
                <TabsList>
                    <TabsTrigger value="nodes">
                        <ServerIcon data-icon="inline-start" /> Nodes
                    </TabsTrigger>
                    <TabsTrigger value="activity">
                        <ActivityIcon data-icon="inline-start" /> Activity
                    </TabsTrigger>
                    <TabsTrigger value="config">
                        <SettingsIcon data-icon="inline-start" /> Config
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="nodes" className="text-muted-foreground">
                    18 nodes, 2 cordoned.
                </TabsContent>
                <TabsContent value="activity" className="text-muted-foreground">
                    Last drain 2h ago.
                </TabsContent>
                <TabsContent value="config" className="text-muted-foreground">
                    Edit cluster.yaml.
                </TabsContent>
            </Tabs>
            <Tabs defaultValue="nodes" orientation="vertical" className="w-72">
                <TabsList variant="line">
                    <TabsTrigger value="nodes">Nodes</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="config">Config</TabsTrigger>
                </TabsList>
                <TabsContent value="nodes" className="text-muted-foreground">
                    18 nodes, 2 cordoned.
                </TabsContent>
                <TabsContent value="activity" className="text-muted-foreground">
                    Last drain 2h ago.
                </TabsContent>
                <TabsContent value="config" className="text-muted-foreground">
                    Edit cluster.yaml.
                </TabsContent>
            </Tabs>
        </div>
    );
}
