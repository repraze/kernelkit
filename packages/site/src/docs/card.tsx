import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repraze/kernelkit/components/card";
import {Input} from "@repraze/kernelkit/components/input";
import {MoreHorizontalIcon, ServerIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Card",
    category: "Data display",
    description: "A bordered surface that groups a header, content and an optional footer about one subject.",
    demos: [
        {title: "Default", component: Default},
        {title: "Sizes", component: Sizes, description: '`size="sm"` drops the padding from p-4 to p-3.'},
        {
            title: "With action",
            component: WithAction,
            description: "`CardAction` sits top-right of the header, next to the title and description.",
        },
        {title: "Form", component: FormCard},
        {title: "Divided header", component: DividedHeader, description: "Add `border-b` to the header."},
    ],
    props: [
        {
            component: "Card",
            rows: [
                {
                    name: "size",
                    type: '"default" | "sm"',
                    default: '"default"',
                    description: "Sets `--card-spacing` (16px / 12px), used by every part for padding and gaps.",
                },
            ],
        },
        {
            component: "CardHeader",
            rows: [
                {
                    name: "className",
                    type: "string",
                    description: "Add `border-b` for a divided header; the bottom padding follows `--card-spacing`.",
                },
            ],
        },
    ],
});

export function Default() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>edge-fra-01</CardTitle>
                <CardDescription>Ingress node, Frankfurt region.</CardDescription>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-2 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Uptime</dt>
                    <dd className="text-right font-mono">41d 06h</dd>
                    <dt className="text-muted-foreground">Load</dt>
                    <dd className="text-right font-mono">0.42</dd>
                    <dt className="text-muted-foreground">Version</dt>
                    <dd className="text-right font-mono">v2.18.3</dd>
                </dl>
            </CardContent>
            <CardFooter className="justify-end">
                <Button variant="outline" size="sm">
                    Drain
                </Button>
                <Button size="sm">Open shell</Button>
            </CardFooter>
        </Card>
    );
}

export function Sizes() {
    return (
        <div className="flex w-full flex-wrap items-start justify-center gap-4">
            <Card className="w-64">
                <CardHeader>
                    <CardTitle>Default</CardTitle>
                    <CardDescription>Build #4182 passed.</CardDescription>
                </CardHeader>
                <CardContent className="font-mono text-xs text-muted-foreground">main · 3m 12s</CardContent>
            </Card>
            <Card size="sm" className="w-64">
                <CardHeader>
                    <CardTitle>Small</CardTitle>
                    <CardDescription>Build #4183 passed.</CardDescription>
                </CardHeader>
                <CardContent className="font-mono text-xs text-muted-foreground">main · 2m 58s</CardContent>
            </Card>
        </div>
    );
}

export function WithAction() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ServerIcon className="size-4 text-muted-foreground" /> postgres-primary
                </CardTitle>
                <CardDescription>16 vCPU · 64 GB · eu-west-1</CardDescription>
                <CardAction>
                    <Button variant="ghost" size="icon-sm" aria-label="More">
                        <MoreHorizontalIcon />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
                <Badge variant="soft" color="success">
                    healthy
                </Badge>
                <Badge variant="outline">replica ×2</Badge>
                <Badge variant="outline">pitr</Badge>
            </CardContent>
        </Card>
    );
}

export function FormCard() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create API token</CardTitle>
                <CardDescription>Tokens are shown once. Store it in your secret manager.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <label htmlFor="token-name" className="text-sm font-medium">
                    Name
                </label>
                <Input id="token-name" placeholder="ci-deploy" />
            </CardContent>
            <CardFooter className="justify-between">
                <span className="text-xs text-muted-foreground">Expires in 90 days</span>
                <Button size="sm">Generate</Button>
            </CardFooter>
        </Card>
    );
}

export function DividedHeader() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="border-b">
                <CardTitle>Recent deploys</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex justify-between">
                    <span>api@a91f3c2</span>
                    <span className="text-muted-foreground">12m ago</span>
                </div>
                <div className="flex justify-between">
                    <span>web@77be0d4</span>
                    <span className="text-muted-foreground">2h ago</span>
                </div>
                <div className="flex justify-between">
                    <span>worker@0c1e9aa</span>
                    <span className="text-muted-foreground">9h ago</span>
                </div>
            </CardContent>
        </Card>
    );
}
