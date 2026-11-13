import {Badge} from "@repraze/kernelkit/components/badge";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@repraze/kernelkit/components/card";
import {CopyButton} from "@repraze/kernelkit/components/copy-button";
import {
    DescriptionDetails,
    DescriptionItem,
    DescriptionList,
    DescriptionTerm,
} from "@repraze/kernelkit/components/description-list";
import {StatusDot} from "@repraze/kernelkit/components/status-dot";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Description list",
    category: "Data display",
    description:
        "Key / value pairs on a `<dl>`: the properties of a server, an order, a file. Terms share one column so they line up.",
    demos: [
        {title: "Horizontal", component: Horizontal, description: "Terms in a column beside their details."},
        {title: "Vertical", component: Vertical, description: "Each term above its details: narrow panels, grids."},
        {title: "Divided", component: Divided, description: "`divided` puts a rule between items."},
        {title: "In a card", component: InCard, description: "Inline details (status, copy button) on one row."},
    ],
    props: [
        {
            component: "DescriptionList",
            rows: [
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
                {name: "divided", type: "boolean", default: "false", description: "Rule between items."},
            ],
        },
    ],
});

export function Horizontal() {
    return (
        <DescriptionList className="w-full max-w-sm">
            <DescriptionItem>
                <DescriptionTerm>Hostname</DescriptionTerm>
                <DescriptionDetails>api-eu-west-3</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Region</DescriptionTerm>
                <DescriptionDetails>eu-west (Paris)</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Runtime</DescriptionTerm>
                <DescriptionDetails>Node 26.2 · 2 vCPU · 4 GB</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Created</DescriptionTerm>
                <DescriptionDetails>Nov 3, 2026</DescriptionDetails>
            </DescriptionItem>
        </DescriptionList>
    );
}

export function Vertical() {
    return (
        <DescriptionList orientation="vertical" className="grid w-full max-w-md grid-cols-2 gap-x-6">
            <DescriptionItem>
                <DescriptionTerm>Requests / min</DescriptionTerm>
                <DescriptionDetails className="font-alt text-base">12,480</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Error rate</DescriptionTerm>
                <DescriptionDetails className="font-alt text-base">0.04%</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>p95 latency</DescriptionTerm>
                <DescriptionDetails className="font-alt text-base">182 ms</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Uptime (30d)</DescriptionTerm>
                <DescriptionDetails className="font-alt text-base">99.98%</DescriptionDetails>
            </DescriptionItem>
        </DescriptionList>
    );
}

export function Divided() {
    return (
        <DescriptionList divided className="w-full max-w-sm">
            <DescriptionItem>
                <DescriptionTerm>Order</DescriptionTerm>
                <DescriptionDetails>KK-10482</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Status</DescriptionTerm>
                <DescriptionDetails>
                    <Badge variant="soft" color="success">
                        Paid
                    </Badge>
                </DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Plan</DescriptionTerm>
                <DescriptionDetails>Team, billed yearly</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
                <DescriptionTerm>Notes</DescriptionTerm>
                <DescriptionDetails className="text-muted-foreground">
                    Invoice sent to billing@example.dev. Long details wrap under themselves, not under the term.
                </DescriptionDetails>
            </DescriptionItem>
        </DescriptionList>
    );
}

export function InCard() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>api-eu-west-3</CardTitle>
                <CardDescription>Production API node</CardDescription>
            </CardHeader>
            <CardContent>
                <DescriptionList divided>
                    <DescriptionItem>
                        <DescriptionTerm>Status</DescriptionTerm>
                        <DescriptionDetails>
                            <StatusDot color="success" pulse>
                                Running
                            </StatusDot>
                        </DescriptionDetails>
                    </DescriptionItem>
                    <DescriptionItem>
                        <DescriptionTerm>Region</DescriptionTerm>
                        <DescriptionDetails>eu-west (Paris)</DescriptionDetails>
                    </DescriptionItem>
                    <DescriptionItem>
                        <DescriptionTerm>Uptime</DescriptionTerm>
                        <DescriptionDetails>41d 6h 12m</DescriptionDetails>
                    </DescriptionItem>
                    <DescriptionItem>
                        <DescriptionTerm>IPv4</DescriptionTerm>
                        <DescriptionDetails className="flex items-center gap-1">
                            <code className="font-mono text-xs">10.24.3.118</code>
                            <CopyButton value="10.24.3.118" size="icon-xs" aria-label="Copy IP address" />
                        </DescriptionDetails>
                    </DescriptionItem>
                </DescriptionList>
            </CardContent>
        </Card>
    );
}
