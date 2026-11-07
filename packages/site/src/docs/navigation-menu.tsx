import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "kernelkit/components/navigation-menu";
import {ActivityIcon, BoxIcon, DatabaseIcon, GitBranchIcon, NetworkIcon, ShieldIcon} from "lucide-react";
import type * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Navigation menu",
    category: "Navigation",
    baseUi: "navigation-menu",
    description: "Site-level links with rich dropdown panels that share one animated viewport.",
    demos: [
        {title: "Default", component: Default, layout: "tall"},
        {
            title: "Links only",
            component: LinksOnly,
            description:
                "Top-level `NavigationMenuLink`s look like triggers; `active` marks the current page with the accent tint.",
        },
    ],
    props: [
        {
            component: "NavigationMenu",
            rows: [
                {
                    name: "align",
                    type: '"start" | "center" | "end"',
                    default: '"start"',
                    description: "Popup alignment against the trigger.",
                },
                {name: "value / onValueChange", type: "any", description: "Controlled open item."},
                {name: "viewport", type: "boolean", description: "Accepted for shadcn (Radix) compatibility; ignored."},
            ],
        },
        {
            component: "NavigationMenuLink",
            rows: [
                {
                    name: "active",
                    type: "boolean",
                    default: "false",
                    description: "Current page: accent tint + medium weight, `aria-current`.",
                },
                {name: "render", type: "ReactElement", description: "Router link element."},
            ],
        },
        {
            component: "navigationMenuTriggerStyle",
            rows: [{name: "()", type: "() => string", description: "Trigger classes for links or custom elements."}],
        },
    ],
});

function Feature({icon, title, children}: {icon: React.ReactNode; title: string; children: React.ReactNode}) {
    return (
        <NavigationMenuLink href="#" className="items-start [&>svg]:mt-0.5">
            {icon}
            <span className="flex flex-col gap-0.5">
                <span className="font-medium">{title}</span>
                <span className="text-xs text-muted-foreground">{children}</span>
            </span>
        </NavigationMenuLink>
    );
}

export function Default() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid w-[30rem] grid-cols-2 gap-1">
                            <Feature icon={<BoxIcon />} title="Containers">
                                Run images on managed nodes.
                            </Feature>
                            <Feature icon={<DatabaseIcon />} title="Databases">
                                Postgres with point-in-time restore.
                            </Feature>
                            <Feature icon={<NetworkIcon />} title="Networking">
                                Private links, load balancers, DNS.
                            </Feature>
                            <Feature icon={<ShieldIcon />} title="Secrets">
                                Encrypted at rest, rotated on deploy.
                            </Feature>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Observability</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="flex w-64 flex-col gap-1">
                            <Feature icon={<ActivityIcon />} title="Metrics">
                                Dashboards and alert rules.
                            </Feature>
                            <Feature icon={<GitBranchIcon />} title="Traces">
                                Follow a request across services.
                            </Feature>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Changelog</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export function LinksOnly() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#" active>
                        Overview
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Deployments</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Logs</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink href="#">Settings</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
