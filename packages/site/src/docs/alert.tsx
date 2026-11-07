import {Alert, AlertAction, AlertDescription, AlertTitle} from "@repraze/kernelkit/components/alert";
import {Button} from "@repraze/kernelkit/components/button";
import {HUES} from "@repraze/kernelkit/lib/color";
import {CircleAlertIcon, CircleCheckIcon, InfoIcon, TerminalIcon, TriangleAlertIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Alert",
    category: "Feedback",
    description:
        "An inline status message in the flow of a page: a failed deploy, a degraded region, a finished migration.",
    demos: [
        {title: "Default", component: Default},
        {
            title: "Status colors",
            component: Statuses,
            description:
                "Soft variant: an opaque tint behind foreground text; the hue lives in the border and the icon. Pair a status color with an icon, never color alone.",
        },
        {
            title: "Outline",
            component: Outline,
            description: "No wash: a card surface with a hue border, for dense views.",
        },
        {title: "Hues", component: Hues},
        {title: "With action", component: WithAction},
        {
            title: "Destructive alias",
            component: Destructive,
            description: 'shadcn\'s `variant="destructive"` still works and maps to soft danger.',
        },
        {title: "Title only", component: TitleOnly},
    ],
    props: [
        {
            component: "Alert",
            rows: [
                {
                    name: "variant",
                    type: '"soft" | "outline"',
                    default: '"soft"',
                    description: 'shadcn aliases: "default" = soft, "destructive" = soft danger.',
                },
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: '"neutral"',
                },
                {name: "render", type: "ReactElement", description: "Element to render as (role=alert is kept)."},
            ],
        },
        {
            component: "AlertAction",
            rows: [
                {name: "children", type: "ReactNode", description: "Pinned top-right; the alert reserves room for it."},
            ],
        },
    ],
});

export function Default() {
    return (
        <Alert className="max-w-lg">
            <TerminalIcon />
            <AlertTitle>Shell session restored</AlertTitle>
            <AlertDescription>
                Reattached to tty3 on node-04. Scrollback from the last 24 hours is available.
            </AlertDescription>
        </Alert>
    );
}

export function Statuses() {
    return (
        <div className="flex w-full max-w-lg flex-col gap-3">
            <Alert color="info">
                <InfoIcon />
                <AlertTitle>Maintenance window</AlertTitle>
                <AlertDescription>eu-west-1 control plane upgrades Sunday 02:00-04:00 UTC.</AlertDescription>
            </Alert>
            <Alert color="success">
                <CircleCheckIcon />
                <AlertTitle>Migration complete</AlertTitle>
                <AlertDescription>42 tables moved to the new cluster with zero dropped writes.</AlertDescription>
            </Alert>
            <Alert color="warning">
                <TriangleAlertIcon />
                <AlertTitle>Disk at 87%</AlertTitle>
                <AlertDescription>
                    /var/log on db-primary will fill in roughly 6 hours at the current rate.
                </AlertDescription>
            </Alert>
            <Alert color="danger">
                <CircleAlertIcon />
                <AlertTitle>Deploy failed</AlertTitle>
                <AlertDescription>
                    Health check timed out after 30s on 3 of 5 replicas. Rolled back to v2.13.0.
                </AlertDescription>
            </Alert>
        </div>
    );
}

export function Outline() {
    return (
        <div className="flex w-full max-w-lg flex-col gap-3">
            <Alert variant="outline" color="warning">
                <TriangleAlertIcon />
                <AlertTitle>Certificate expires in 9 days</AlertTitle>
                <AlertDescription>api.internal uses a manually issued cert. Enable auto-renew.</AlertDescription>
            </Alert>
            <Alert variant="outline" color="primary">
                <InfoIcon />
                <AlertTitle>New runtime available</AlertTitle>
                <AlertDescription>Node 24 LTS images are ready for your build pipelines.</AlertDescription>
            </Alert>
        </div>
    );
}

export function Hues() {
    return (
        <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
            {HUES.map((hue) => (
                <Alert key={hue} color={hue}>
                    <InfoIcon />
                    <AlertTitle>{hue}</AlertTitle>
                </Alert>
            ))}
        </div>
    );
}

export function WithAction() {
    return (
        <Alert color="danger" className="max-w-lg">
            <CircleAlertIcon />
            <AlertTitle>Worker pool degraded</AlertTitle>
            <AlertDescription>2 of 8 workers stopped responding to heartbeats.</AlertDescription>
            <AlertAction>
                <Button size="sm" variant="outline">
                    Restart
                </Button>
            </AlertAction>
        </Alert>
    );
}

export function Destructive() {
    return (
        <Alert variant="destructive" className="max-w-lg">
            <CircleAlertIcon />
            <AlertTitle>Token revoked</AlertTitle>
            <AlertDescription>The CI token was rotated. Update the secret in your pipeline settings.</AlertDescription>
        </Alert>
    );
}

export function TitleOnly() {
    return (
        <Alert color="success" className="max-w-lg">
            <CircleCheckIcon />
            <AlertTitle>All 128 checks passed.</AlertTitle>
        </Alert>
    );
}
