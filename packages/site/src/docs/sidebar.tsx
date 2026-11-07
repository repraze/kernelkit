import {Avatar, AvatarFallback} from "@repraze/kernelkit/components/avatar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@repraze/kernelkit/components/breadcrumb";
import {Separator} from "@repraze/kernelkit/components/separator";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@repraze/kernelkit/components/sidebar";
import {
    ActivityIcon,
    BoxesIcon,
    ChevronsUpDownIcon,
    GaugeIcon,
    MoreHorizontalIcon,
    PlusIcon,
    RocketIcon,
    ScrollTextIcon,
    ServerIcon,
    SettingsIcon,
    TerminalIcon,
} from "lucide-react";
import type * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Sidebar",
    category: "Navigation",
    description: "The app shell's side navigation: collapsible to icons, a sheet on mobile, Ctrl/Cmd+B to toggle.",
    demos: [
        {
            title: "Application shell",
            component: AppShell,
            layout: "full",
            description:
                "Collapses to icons with the trigger or the rail. The current item gets the accent tint, medium weight and a primary icon.",
        },
        {
            title: "Inset",
            component: Inset,
            layout: "full",
            description: '`variant="inset"` lifts the page onto a card; `floating` does the same for the sidebar.',
        },
        {title: "Floating", component: Floating, layout: "full"},
        {
            title: "Menu parts",
            component: MenuParts,
            layout: "full",
            description: "Group actions, badges, hover actions, sub menus and loading skeletons.",
        },
    ],
    props: [
        {
            component: "SidebarProvider",
            rows: [
                {
                    name: "defaultOpen / open / onOpenChange",
                    type: "boolean",
                    default: "true",
                    description: "Expanded state (persisted in the `sidebar_state` cookie).",
                },
                {
                    name: "keyboardShortcut",
                    type: "boolean",
                    default: "true",
                    description: "Register Ctrl/Cmd+B on `window`. Turn off to yield the key (e.g. to an editor).",
                },
            ],
        },
        {
            component: "Sidebar",
            rows: [
                {name: "side", type: '"left" | "right"', default: '"left"'},
                {name: "variant", type: '"sidebar" | "floating" | "inset"', default: '"sidebar"'},
                {name: "collapsible", type: '"offcanvas" | "icon" | "none"', default: '"offcanvas"'},
            ],
        },
        {
            component: "SidebarMenuButton",
            rows: [
                {name: "isActive", type: "boolean", default: "false", description: "Current page."},
                {name: "tooltip", type: "string | TooltipContent props", description: "Shown when collapsed to icons."},
                {name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "h-7 / h-8 / h-12."},
                {name: "variant", type: '"default" | "outline"', default: '"default"'},
                {name: "render", type: "ReactElement", description: "Router link element."},
            ],
        },
        {
            component: "SidebarInset",
            rows: [{name: "render", type: "ReactElement", default: "<main />", description: "Element to render as."}],
        },
    ],
    notes: Notes,
});

function Notes() {
    return (
        <p className="text-sm text-muted-foreground">
            The sidebar is fixed to the viewport (`h-svh`). The demos frame it in a box with a `transform`, which makes
            the box the containing block for fixed children, and pass `className="h-full"` to override the height. Below
            768px it renders as a sheet.
        </p>
    );
}

const NAV = [
    {title: "Overview", icon: GaugeIcon, active: true},
    {title: "Deployments", icon: RocketIcon, badge: "3"},
    {title: "Nodes", icon: ServerIcon},
    {title: "Logs", icon: ScrollTextIcon},
    {title: "Metrics", icon: ActivityIcon},
];

/** Bounded frame for the demos: the transform contains the sidebar's fixed positioning. */
function Frame({children}: {children: React.ReactNode}) {
    return <div className="h-[30rem] w-full overflow-hidden [transform:translateZ(0)]">{children}</div>;
}

function Workspace() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <BoxesIcon className="text-primary-foreground" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                        <span className="truncate font-heading font-medium">acme-infra</span>
                        <span className="truncate text-xs text-muted-foreground">eu-west-1</span>
                    </span>
                    <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function User() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                    <Avatar size="default">
                        <AvatarFallback>OP</AvatarFallback>
                    </Avatar>
                    <span className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">ops-oncall</span>
                        <span className="truncate text-xs text-muted-foreground">sre@acme.dev</span>
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function MainNav() {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {NAV.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton isActive={item.active} tooltip={item.title}>
                                <item.icon />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function Page({title}: {title: string}) {
    return (
        <>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="my-auto h-4 self-center" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#">acme-infra</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <div className="grid flex-1 auto-rows-min grid-cols-3 gap-3 p-4">
                {["Requests", "Error rate", "p95"].map((label, i) => (
                    <div key={label} className="flex flex-col gap-1 rounded-xl border p-3">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className="font-mono text-lg">{["1.2k/s", "0.03%", "42ms"][i]}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

export function AppShell() {
    return (
        <Frame>
            <SidebarProvider keyboardShortcut={false} className="h-full min-h-0">
                <Sidebar collapsible="icon" className="h-full">
                    <SidebarHeader>
                        <Workspace />
                    </SidebarHeader>
                    <SidebarContent>
                        <MainNav />
                    </SidebarContent>
                    <SidebarFooter>
                        <User />
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
                <SidebarInset>
                    <Page title="Overview" />
                </SidebarInset>
            </SidebarProvider>
        </Frame>
    );
}

export function Inset() {
    return (
        <Frame>
            <SidebarProvider keyboardShortcut={false} className="h-full min-h-0">
                <Sidebar variant="inset" collapsible="icon" className="h-full">
                    <SidebarHeader>
                        <Workspace />
                    </SidebarHeader>
                    <SidebarContent>
                        <MainNav />
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <Page title="Overview" />
                </SidebarInset>
            </SidebarProvider>
        </Frame>
    );
}

export function Floating() {
    return (
        <Frame>
            <SidebarProvider keyboardShortcut={false} className="h-full min-h-0">
                <Sidebar variant="floating" collapsible="icon" className="h-full">
                    <SidebarHeader>
                        <Workspace />
                    </SidebarHeader>
                    <SidebarContent>
                        <MainNav />
                    </SidebarContent>
                </Sidebar>
                <SidebarInset>
                    <Page title="Overview" />
                </SidebarInset>
            </SidebarProvider>
        </Frame>
    );
}

export function MenuParts() {
    return (
        <Frame>
            <SidebarProvider keyboardShortcut={false} className="h-full min-h-0">
                <Sidebar collapsible="none" className="h-full border-r">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Services</SidebarGroupLabel>
                            <SidebarGroupAction title="New service">
                                <PlusIcon />
                                <span className="sr-only">New service</span>
                            </SidebarGroupAction>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <TerminalIcon />
                                            <span>api-gateway</span>
                                        </SidebarMenuButton>
                                        <SidebarMenuSub>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton href="#">Deployments</SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton href="#" isActive>
                                                    Environment
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                            <SidebarMenuSubItem>
                                                <SidebarMenuSubButton href="#">Logs</SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        </SidebarMenuSub>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton>
                                            <TerminalIcon />
                                            <span>billing-worker</span>
                                        </SidebarMenuButton>
                                        <SidebarMenuAction showOnHover>
                                            <MoreHorizontalIcon />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton disabled>
                                            <TerminalIcon />
                                            <span>legacy-cron</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel>Loading</SidebarGroupLabel>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuSkeleton showIcon />
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuSkeleton showIcon />
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton variant="outline">
                                    <SettingsIcon />
                                    <span>Project settings</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarFooter>
                </Sidebar>
                <SidebarInset className="items-center justify-center text-sm text-muted-foreground">
                    Select a service
                </SidebarInset>
            </SidebarProvider>
        </Frame>
    );
}
