import {Badge} from "@repraze/kernelkit/components/badge";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@repraze/kernelkit/components/input-group";
import {FileTree, Tree, treeFromPaths, type TreeNode} from "@repraze/kernelkit/components/tree";
import {
    BoxIcon,
    CpuIcon,
    DatabaseIcon,
    GlobeIcon,
    HardDriveIcon,
    NetworkIcon,
    SearchIcon,
    ServerIcon,
    ShieldIcon,
} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Tree",
    category: "Navigation",
    description:
        "A hierarchical list with collapsible branches, single, multiple or checkbox selection and full keyboard support. Flattened and optionally virtualized, so it stays fast with thousands of nodes.",
    demos: [
        {
            title: "Single selection",
            component: Single,
            layout: "start",
            description:
                "Styled like the sidebar: hover wash, the selected row gets the accent tint and its indicator on the tree line. Click a branch to toggle it; arrow keys, Home/End, `*` and type-ahead work once focused.",
        },
        {
            title: "File tree",
            component: Files,
            layout: "start",
            description:
                "`FileTree` picks folder and file icons; `treeFromPaths` builds nodes from paths. `meta` holds a trailing slot, here a git status letter.",
        },
        {
            title: "Checkbox selection",
            component: Checkboxes,
            layout: "start",
            description:
                '`selectionMode="checkbox"`: checking a branch checks its children, a partly checked branch is indeterminate. `selected` lists every checked id.',
        },
        {
            title: "Multiple selection",
            component: Multiple,
            layout: "start",
            description: "Ctrl/⌘ click toggles, Shift click or Shift + arrows extends, Ctrl/⌘ A selects all.",
        },
        {
            title: "Filter",
            component: Filter,
            layout: "start",
            description: "`filter` keeps matches and their ancestors, shown expanded.",
        },
        {
            title: "Lazy children",
            component: Lazy,
            layout: "start",
            description:
                "Nodes with `hasChildren` and no `children` call `onLoadChildren` on expand; the chevron shows a spinner meanwhile.",
        },
        {
            title: "10,000 nodes, virtualized",
            component: Virtual,
            layout: "start",
            description: "`virtual` renders only the rows in view. Give the tree a height: it becomes the scroller.",
        },
        {
            title: "Sizes, no guides",
            component: Sizes,
            description: "`size` xs / sm / default (24 / 28 / 32px rows); `guides={false}` drops the indent lines.",
        },
    ],
    props: [
        {
            component: "Tree",
            rows: [
                {name: "nodes", type: "TreeNode[]", description: "The data. `id` must be unique across the tree."},
                {
                    name: "selectionMode",
                    type: '"none" | "single" | "multiple" | "checkbox"',
                    default: '"single"',
                },
                {
                    name: "selected / defaultSelected / onSelectedChange",
                    type: "string[]",
                    description: "Selected ids; in checkbox mode every checked id, parents included.",
                },
                {
                    name: "expanded / defaultExpanded / onExpandedChange",
                    type: "string[]",
                    description: "Open branch ids.",
                },
                {name: "onAction", type: "(node) => void", description: "Enter, or a click on a leaf."},
                {
                    name: "onLoadChildren",
                    type: "(node) => Promise<void>",
                    description: "Load a `hasChildren` branch; update `nodes` before resolving.",
                },
                {
                    name: "filter",
                    type: "string | (node) => boolean",
                    description: "Matches against `textValue` or a string label.",
                },
                {
                    name: "toggleOnClick",
                    type: "boolean",
                    default: "true",
                    description: "A click on a branch row also toggles it.",
                },
                {
                    name: "virtual",
                    type: "boolean",
                    default: "false",
                    description: "Render only the rows in view; needs a height.",
                },
                {name: "guides", type: "boolean", default: "true"},
                {name: "size", type: '"xs" | "sm" | "default"', default: '"default"'},
                {name: "renderLabel", type: "(node, state) => ReactNode"},
                {name: "getIcon", type: "(node, state) => ReactNode", description: "Icon for nodes without `icon`."},
                {name: "empty", type: "ReactNode", description: "Shown when no row is visible."},
            ],
        },
        {
            component: "TreeNode",
            rows: [
                {name: "id", type: "string"},
                {name: "label", type: "ReactNode"},
                {
                    name: "textValue",
                    type: "string",
                    description: "For type-ahead and filtering when `label` is not a string.",
                },
                {name: "icon / meta", type: "ReactNode", description: "Leading icon, trailing slot."},
                {name: "children", type: "TreeNode[]"},
                {name: "hasChildren", type: "boolean", description: "A branch whose children load lazily."},
                {name: "disabled", type: "boolean"},
                {name: "data", type: "T", description: "Your own payload."},
            ],
        },
        {
            component: "FileTree",
            rows: [{name: "…", type: "TreeProps", description: 'A Tree with file icons and `size="sm"`.'}],
        },
    ],
});

const INFRA: TreeNode[] = [
    {
        id: "eu-west",
        label: "eu-west-1",
        icon: <GlobeIcon />,
        children: [
            {
                id: "eu-k8s",
                label: "k8s-prod",
                icon: <BoxIcon />,
                children: [
                    {id: "eu-api", label: "api-gateway", icon: <NetworkIcon />, meta: "3/3"},
                    {id: "eu-worker", label: "queue-worker", icon: <CpuIcon />, meta: "8/8"},
                    {id: "eu-auth", label: "auth", icon: <ShieldIcon />, meta: "2/2"},
                ],
            },
            {id: "eu-db", label: "postgres-primary", icon: <DatabaseIcon />},
            {id: "eu-cache", label: "redis-cache", icon: <HardDriveIcon />},
        ],
    },
    {
        id: "us-east",
        label: "us-east-1",
        icon: <GlobeIcon />,
        children: [
            {id: "us-edge", label: "edge-01", icon: <ServerIcon />},
            {id: "us-edge2", label: "edge-02", icon: <ServerIcon />, disabled: true, meta: "drained"},
        ],
    },
];

export function Single() {
    return (
        <Tree
            aria-label="Infrastructure"
            nodes={INFRA}
            defaultExpanded={["eu-west", "eu-k8s"]}
            defaultSelected={["eu-worker"]}
            className="w-72"
        />
    );
}

const STATUS: Record<string, [string, string]> = {
    "src/components/tree.tsx": ["A", "text-success"],
    "src/components/sidebar.tsx": ["M", "text-warning"],
    "src/lib/recipes.ts": ["M", "text-warning"],
    "README.md": ["U", "text-info"],
};

const FILES = (() => {
    const nodes = treeFromPaths([
        "src/components/button.tsx",
        "src/components/sidebar.tsx",
        "src/components/tree.tsx",
        "src/hooks/use-mobile.ts",
        "src/lib/recipes.ts",
        "src/lib/utils.ts",
        "src/styles/kernelkit.css",
        "public/favicon.svg",
        "package.json",
        "README.md",
        "tsconfig.json",
    ]);
    const decorate = (list: TreeNode[]) =>
        list.forEach((n) => {
            const s = STATUS[n.id];
            if (s) {
                n.meta = <span className={s[1]}>{s[0]}</span>;
            }
            if (n.children) {
                decorate(n.children);
            }
        });
    decorate(nodes);
    return nodes;
})();

export function Files() {
    return (
        <FileTree
            aria-label="Files"
            nodes={FILES}
            defaultExpanded={["src", "src/components", "src/lib"]}
            defaultSelected={["src/components/tree.tsx"]}
            className="w-64"
        />
    );
}

const SCOPES: TreeNode[] = [
    {
        id: "repo",
        label: "repo",
        children: [
            {id: "repo:read", label: "repo:read"},
            {id: "repo:write", label: "repo:write"},
            {id: "repo:admin", label: "repo:admin", disabled: true},
        ],
    },
    {
        id: "deploy",
        label: "deploy",
        children: [
            {id: "deploy:staging", label: "deploy:staging"},
            {id: "deploy:production", label: "deploy:production"},
        ],
    },
    {
        id: "billing",
        label: "billing",
        children: [{id: "billing:read", label: "billing:read"}],
    },
];

export function Checkboxes() {
    const [selected, setSelected] = React.useState<string[]>(["repo:read", "deploy:staging"]);
    return (
        <div className="flex w-72 flex-col gap-3">
            <Tree
                aria-label="Token scopes"
                nodes={SCOPES}
                selectionMode="checkbox"
                selected={selected}
                onSelectedChange={setSelected}
                defaultExpanded={["repo", "deploy"]}
                size="sm"
            />
            <p className="font-alt text-xs text-muted-foreground">
                {selected.filter((id) => id.includes(":")).length} scopes granted
            </p>
        </div>
    );
}

export function Multiple() {
    const [selected, setSelected] = React.useState<string[]>([]);
    return (
        <div className="flex w-72 flex-col gap-3">
            <Tree
                aria-label="Infrastructure"
                nodes={INFRA}
                selectionMode="multiple"
                selected={selected}
                onSelectedChange={setSelected}
                defaultExpanded={["eu-west", "eu-k8s", "us-east"]}
                toggleOnClick={false}
            />
            <div className="flex min-h-5 flex-wrap gap-1">
                {selected.map((id) => (
                    <Badge key={id} variant="outline">
                        {id}
                    </Badge>
                ))}
            </div>
        </div>
    );
}

export function Filter() {
    const [query, setQuery] = React.useState("ts");
    return (
        <div className="flex w-64 flex-col gap-2">
            <InputGroup>
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                    aria-label="Filter files"
                    placeholder="Filter files…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </InputGroup>
            <FileTree
                aria-label="Files"
                nodes={FILES}
                filter={query}
                empty={<p className="px-2 py-1.5 text-sm text-muted-foreground">No files match.</p>}
            />
        </div>
    );
}

const lazyRoot = (): TreeNode[] => [
    {id: "/", label: "/", hasChildren: true},
    {id: "/etc", label: "etc", hasChildren: true},
];

export function Lazy() {
    const [nodes, setNodes] = React.useState(lazyRoot);
    const load = async (node: TreeNode) => {
        await new Promise((r) => setTimeout(r, 900));
        const children: TreeNode[] = ["bin", "home", "var", "config.yml"].map((name) => ({
            id: `${node.id}/${name}`,
            label: name,
            hasChildren: !name.includes("."),
        }));
        const attach = (list: TreeNode[]): TreeNode[] =>
            list.map((n) =>
                n.id === node.id ? {...n, children} : n.children ? {...n, children: attach(n.children)} : n,
            );
        setNodes((prev) => attach(prev));
    };
    return <FileTree aria-label="Remote file system" nodes={nodes} onLoadChildren={load} className="w-64" />;
}

const BIG: TreeNode[] = Array.from({length: 100}, (_, i) => ({
    id: `svc-${i}`,
    label: `service-${String(i).padStart(3, "0")}`,
    children: Array.from({length: 100}, (_, j) => ({
        id: `svc-${i}-pod-${j}`,
        label: `pod-${String(i).padStart(3, "0")}-${j.toString(16).padStart(2, "0")}`,
        meta: `${(i * 7 + j * 13) % 100}%`,
    })),
}));

export function Virtual() {
    return (
        <Tree
            aria-label="Services"
            nodes={BIG}
            virtual
            size="sm"
            defaultExpanded={["svc-0", "svc-1", "svc-2"]}
            getIcon={(_node, state) => (state.level === 0 ? <ServerIcon /> : <BoxIcon />)}
            className="h-80 w-72 rounded-lg border border-border p-1"
        />
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-start gap-6">
            {(["xs", "sm", "default"] as const).map((size) => (
                <Tree
                    key={size}
                    aria-label={`Tree ${size}`}
                    nodes={INFRA.slice(0, 1)}
                    size={size}
                    defaultExpanded={["eu-west"]}
                    defaultSelected={["eu-db"]}
                    className="w-52"
                />
            ))}
            <Tree
                aria-label="Tree without guides"
                nodes={INFRA.slice(0, 1)}
                guides={false}
                defaultExpanded={["eu-west"]}
                className="w-52"
            />
        </div>
    );
}
