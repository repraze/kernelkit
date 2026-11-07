import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
} from "@repraze/kernelkit/components/item";
import {ChevronRightIcon, DatabaseIcon, GitBranchIcon, KeyRoundIcon, ServerIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Item",
    category: "Data display",
    description: "A flexible row with media, title, description and actions, for lists of resources and settings.",
    demos: [
        {title: "Variants", component: Variants},
        {title: "Sizes", component: Sizes},
        {
            title: "As link",
            component: AsLink,
            description:
                "Render as an anchor or button to get the hover wash and focus ring. `aria-current` marks the current one.",
        },
        {title: "Group", component: Group, description: "`ItemGroup` with `ItemSeparator` for a divided list."},
        {title: "Header and footer", component: HeaderFooter},
    ],
    props: [
        {
            component: "Item",
            rows: [
                {name: "variant", type: '"default" | "outline" | "muted"', default: '"default"'},
                {name: "size", type: '"default" | "sm" | "xs"', default: '"default"'},
                {name: "render", type: "ReactElement | (props) => ReactElement", description: "Element to render as."},
            ],
        },
        {
            component: "ItemMedia",
            rows: [
                {
                    name: "variant",
                    type: '"default" | "icon" | "tile" | "image"',
                    default: '"default"',
                    description: "`tile` boxes the icon on a muted square; `image` crops to a rounded square.",
                },
            ],
        },
    ],
});

export function Variants() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            {(["default", "outline", "muted"] as const).map((variant, i) => (
                <Item key={variant} variant={variant}>
                    <ItemMedia variant="tile">
                        <ServerIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>edge-fra-0{i + 1}</ItemTitle>
                        <ItemDescription>variant=&quot;{variant}&quot;</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Button variant="outline" size="sm">
                            Inspect
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            {(["default", "sm", "xs"] as const).map((size) => (
                <Item key={size} size={size} variant="outline">
                    <ItemMedia variant="icon">
                        <DatabaseIcon />
                    </ItemMedia>
                    <ItemContent>
                        <ItemTitle>orders-db</ItemTitle>
                        <ItemDescription>size=&quot;{size}&quot; · postgres 16</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                        <Badge variant="soft" color="success">
                            healthy
                        </Badge>
                    </ItemActions>
                </Item>
            ))}
        </div>
    );
}

export function AsLink() {
    return (
        <div className="flex w-full max-w-md flex-col gap-1">
            <Item size="sm" render={<a href="#as-link" aria-current="page" />}>
                <ItemMedia variant="icon">
                    <GitBranchIcon />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>main</ItemTitle>
                </ItemContent>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
            </Item>
            <Item size="sm" render={<a href="#as-link" />}>
                <ItemMedia variant="icon">
                    <GitBranchIcon />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>release/2.18</ItemTitle>
                </ItemContent>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
            </Item>
            <Item size="sm" render={<a href="#as-link" />}>
                <ItemMedia variant="icon">
                    <GitBranchIcon />
                </ItemMedia>
                <ItemContent>
                    <ItemTitle>feat/otel-tracing</ItemTitle>
                </ItemContent>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
            </Item>
        </div>
    );
}

const KEYS = [
    {name: "ci-deploy", scope: "deploy:write", used: "4 min ago"},
    {name: "grafana-read", scope: "metrics:read", used: "1 h ago"},
    {name: "backup-agent", scope: "storage:write", used: "never"},
];

export function Group() {
    return (
        <ItemGroup className="w-full max-w-md gap-0 rounded-xl border border-border">
            {KEYS.map((key, i) => (
                <div key={key.name} className="contents">
                    {i > 0 ? <ItemSeparator className="my-0" /> : null}
                    <Item className="rounded-none">
                        <ItemMedia variant="tile">
                            <KeyRoundIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle className="font-mono">{key.name}</ItemTitle>
                            <ItemDescription>
                                {key.scope} · last used {key.used}
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                            <Button variant="ghost" color="danger" size="sm">
                                Revoke
                            </Button>
                        </ItemActions>
                    </Item>
                </div>
            ))}
        </ItemGroup>
    );
}

export function HeaderFooter() {
    return (
        <Item variant="outline" className="max-w-md">
            <ItemHeader>
                <span className="text-xs font-medium text-muted-foreground">Pipeline #4182</span>
                <Badge variant="soft" color="warning">
                    running
                </Badge>
            </ItemHeader>
            <ItemContent>
                <ItemTitle>Build and push image</ItemTitle>
                <ItemDescription>Step 5 of 8 · docker buildx for linux/amd64, linux/arm64</ItemDescription>
            </ItemContent>
            <ItemFooter>
                <span className="font-mono text-xs text-muted-foreground">03:12 elapsed</span>
                <Button variant="outline" size="sm">
                    Cancel
                </Button>
            </ItemFooter>
        </Item>
    );
}
