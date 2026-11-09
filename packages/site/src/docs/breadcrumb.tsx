import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@repraze/kernelkit/components/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repraze/kernelkit/components/dropdown-menu";
import {FolderIcon, HomeIcon, SlashIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Breadcrumb",
    category: "Navigation",
    description: "Shows where the current page sits in a hierarchy, with links back up each level.",
    demos: [
        {title: "Default", component: Default},
        {title: "With icons", component: WithIcons},
        {
            title: "Collapsed",
            component: Collapsed,
            description: "Fold the middle levels into a `BreadcrumbEllipsis` that opens a menu.",
        },
        {title: "Custom separator", component: CustomSeparator},
        {
            title: "Router links",
            component: RouterLinks,
            description: "`BreadcrumbLink` takes `render` to become your router's link component.",
        },
    ],
    props: [
        {
            component: "BreadcrumbLink",
            rows: [
                {
                    name: "render",
                    type: "ReactElement | (props) => ReactElement",
                    description: "Element to render as (e.g. a router `<Link>`).",
                },
            ],
        },
        {
            component: "BreadcrumbPage",
            rows: [
                {
                    name: "children",
                    type: "ReactNode",
                    description: 'The current page: foreground, medium weight, `aria-current="page"`.',
                },
            ],
        },
        {
            component: "BreadcrumbSeparator",
            rows: [
                {
                    name: "children",
                    type: "ReactNode",
                    default: "<ChevronRightIcon />",
                    description: "Replace the chevron.",
                },
            ],
        },
    ],
});

export function Default() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Clusters</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">eu-west-1</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Nodes</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>node-07</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function WithIcons() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                        <HomeIcon /> Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">
                        <FolderIcon /> services
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="font-mono">deploy.yaml</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function Collapsed() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Org</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            aria-label="Show hidden levels"
                            className="rounded-sm transition-colors outline-none hover:bg-hover hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            <BreadcrumbEllipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-auto">
                            <DropdownMenuItem>Projects</DropdownMenuItem>
                            <DropdownMenuItem>platform</DropdownMenuItem>
                            <DropdownMenuItem>Environments</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">production</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>Secrets</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export function CustomSeparator() {
    return (
        <Breadcrumb>
            <BreadcrumbList className="font-mono">
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">repraze</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">KernelKit</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                    <SlashIcon />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                    <BreadcrumbPage>main</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

// Stand-in for a router's <Link to="…">.
function RouterLink({to, ...props}: React.ComponentProps<"a"> & {to: string}) {
    return <a href={`#${to}`} {...props} />;
}

export function RouterLinks() {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink render={<RouterLink to="/pipelines" />}>Pipelines</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink render={<RouterLink to="/pipelines/1284" />}>run 1284</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>build-arm64</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
