import {Avatar, AvatarFallback} from "kernelkit/components/avatar";
import {Button} from "kernelkit/components/button";
import {Input} from "kernelkit/components/input";
import {Kbd} from "kernelkit/components/kbd";
import {Navbar, NavbarContent, NavbarMenu, NavbarSection} from "kernelkit/components/navbar";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "kernelkit/components/navigation-menu";
import {BellIcon, BoxesIcon, MenuIcon, SearchIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Navbar",
    category: "Navigation",
    description: "The sticky top bar of an app or site: brand, primary links and global actions.",
    demos: [
        {
            title: "Default",
            component: Default,
            layout: "full",
            description:
                "Sticky with a translucent, blurred background: scroll the frame to see content pass under it.",
        },
        {
            title: "Constrained width",
            component: Constrained,
            layout: "full",
            description: "Constrain `NavbarContent` to line up with a centered page column.",
        },
    ],
    props: [
        {
            component: "Navbar",
            rows: [{name: "render", type: "ReactElement", default: "<header />", description: "Element to render as."}],
        },
        {
            component: "NavbarContent",
            rows: [
                {
                    name: "className",
                    type: "string",
                    description: "The `h-14` row; add `max-w-*` / `mx-auto` to constrain it.",
                },
            ],
        },
        {
            component: "NavbarSection / NavbarMenu",
            rows: [
                {
                    name: "render",
                    type: "ReactElement",
                    default: "<div /> / <nav />",
                    description: "Clusters of items; push one right with `ml-auto`.",
                },
            ],
        },
    ],
});

function Brand() {
    return (
        <a
            href="#"
            className="flex items-center gap-2 rounded-md font-heading font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BoxesIcon className="size-4" />
            </span>
            orbit
        </a>
    );
}

export function Default() {
    return (
        <div className="@container h-80 w-full overflow-auto">
            <Navbar>
                <NavbarContent>
                    <NavbarSection>
                        <Button variant="ghost" size="icon-sm" aria-label="Open menu" className="@lg:hidden">
                            <MenuIcon />
                        </Button>
                        <Brand />
                    </NavbarSection>
                    <NavbarMenu className="ml-2 hidden @lg:flex">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="#" active>
                                        Dashboard
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="#">Deployments</NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink href="#">Clusters</NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </NavbarMenu>
                    <NavbarSection className="ml-auto">
                        <div className="relative hidden @2xl:block">
                            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search" className="w-48 pr-10 pl-8" />
                            <Kbd className="absolute top-1/2 right-1.5 -translate-y-1/2">⌘K</Kbd>
                        </div>
                        <Button variant="ghost" size="icon" aria-label="Notifications">
                            <BellIcon />
                        </Button>
                        <Avatar>
                            <AvatarFallback>OP</AvatarFallback>
                        </Avatar>
                    </NavbarSection>
                </NavbarContent>
            </Navbar>
            <div className="flex flex-col gap-2 p-4">
                {Array.from({length: 12}, (_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
                        <span className="font-mono">deploy-{4120 - i}</span>
                        <span className="text-muted-foreground">{i + 2}m ago</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Constrained() {
    return (
        <div className="h-40 w-full overflow-auto bg-muted/40">
            <Navbar render={<div />}>
                <NavbarContent className="mx-auto max-w-3xl">
                    <Brand />
                    <NavbarMenu className="ml-auto">
                        <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#" />}>
                            Docs
                        </Button>
                        <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#" />}>
                            Status
                        </Button>
                        <Button size="sm">Sign in</Button>
                    </NavbarMenu>
                </NavbarContent>
            </Navbar>
        </div>
    );
}
