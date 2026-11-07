import {Button} from "@repraze/kernelkit/components/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@repraze/kernelkit/components/dropdown-menu";
import {
    ChevronDownIcon,
    CopyIcon,
    EllipsisIcon,
    FileTextIcon,
    PauseIcon,
    RefreshCwIcon,
    SquareTerminalIcon,
    Trash2Icon,
} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Dropdown Menu",
    category: "Overlays",
    baseUi: "menu",
    description: "A list of actions or options that opens from a button.",
    order: 8,
    demos: [
        {
            title: "Actions",
            component: Actions,
            description:
                'Icons, shortcuts, a disabled item and a `variant="danger"` item (`"destructive"` also works).',
        },
        {
            title: "Checkbox and radio items",
            component: Options,
            description: "Checked state shows as a trailing check, never as shading alone.",
        },
        {title: "Submenu", component: Submenu},
        {
            title: "Labels and inset",
            component: Labels,
            description: "`DropdownMenuLabel` works with or without a group. `inset` lines text up with icon rows.",
        },
    ],
    props: [
        {
            component: "DropdownMenuItem",
            rows: [
                {
                    name: "variant",
                    type: '"default" | "danger" | "destructive"',
                    default: '"default"',
                    description: '"destructive" is an alias of "danger".',
                },
                {name: "inset", type: "boolean", default: "false", description: "Indents to align with icon rows."},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "closeOnClick", type: "boolean", default: "true"},
            ],
        },
        {
            component: "DropdownMenuContent",
            rows: [
                {name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"'},
                {name: "align", type: '"start" | "center" | "end"', default: '"start"'},
                {name: "sideOffset", type: "number", default: "4"},
            ],
        },
        {
            component: "DropdownMenuLabel",
            rows: [{name: "inset", type: "boolean", default: "false", description: "A plain div: no Group required."}],
        },
    ],
});

export function Actions() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
                Actions <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                    <SquareTerminalIcon /> Open shell <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <FileTextIcon /> View logs <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CopyIcon /> Copy node ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <RefreshCwIcon /> Restart
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <PauseIcon /> Cordon (already cordoned)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="danger">
                    <Trash2Icon /> Drain and remove <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function Options() {
    const [columns, setColumns] = React.useState({Status: true, CPU: true, Memory: false});
    const [level, setLevel] = React.useState("info");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
                View <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Columns</DropdownMenuLabel>
                    {(Object.keys(columns) as (keyof typeof columns)[]).map((key) => (
                        <DropdownMenuCheckboxItem
                            key={key}
                            checked={columns[key]}
                            onCheckedChange={(checked) => setColumns((c) => ({...c, [key]: checked}))}
                            closeOnClick={false}
                        >
                            {key}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Log level</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={level} onValueChange={setLevel}>
                        {["debug", "info", "warn", "error"].map((l) => (
                            <DropdownMenuRadioItem key={l} value={l} closeOnClick={false}>
                                {l}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function Submenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More" />}>
                <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuItem>Redeploy</DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Promote to</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-40">
                        <DropdownMenuItem>staging</DropdownMenuItem>
                        <DropdownMenuItem>canary</DropdownMenuItem>
                        <DropdownMenuItem>production</DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem>Pin release</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Roll back</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function Labels() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" />}>
                ci-bot <ChevronDownIcon data-icon="inline-end" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Signed in as ci-bot@kernel.dev</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <SquareTerminalIcon /> API tokens
                </DropdownMenuItem>
                <DropdownMenuItem inset>Audit log</DropdownMenuItem>
                <DropdownMenuItem inset>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem inset>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
