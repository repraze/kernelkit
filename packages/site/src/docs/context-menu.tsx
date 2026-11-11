import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@repraze/kernelkit/components/context-menu";
import {CopyIcon, FileTextIcon, RefreshCwIcon, Trash2Icon} from "lucide-react";
import * as React from "react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Context Menu",
    category: "Overlays",
    source: baseUi("context-menu"),
    description: "A menu on right-click or long-press over an area. Same items as Dropdown Menu.",
    order: 9,
    demos: [{title: "Node row", component: NodeRow, description: "Right-click the area."}],
    props: [
        {
            component: "ContextMenuItem",
            rows: [
                {name: "variant", type: '"default" | "danger" | "destructive"', default: '"default"'},
                {name: "inset", type: "boolean", default: "false"},
            ],
        },
        {
            component: "ContextMenuLabel",
            rows: [{name: "inset", type: "boolean", default: "false", description: "A plain div: no Group required."}],
        },
    ],
});

export function NodeRow() {
    const [follow, setFollow] = React.useState(true);
    return (
        <ContextMenu>
            <ContextMenuTrigger className="flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
                Right-click edge-fra-03
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
                <ContextMenuLabel>edge-fra-03</ContextMenuLabel>
                <ContextMenuItem>
                    <FileTextIcon /> View logs <ContextMenuShortcut>⌘L</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                    <CopyIcon /> Copy node ID <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Move to pool</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-44">
                        <ContextMenuItem>general-purpose</ContextMenuItem>
                        <ContextMenuItem>memory-optimized</ContextMenuItem>
                        <ContextMenuItem>gpu-a100</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked={follow} onCheckedChange={setFollow}>
                    Follow log tail
                </ContextMenuCheckboxItem>
                <ContextMenuItem>
                    <RefreshCwIcon /> Restart
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem variant="danger">
                    <Trash2Icon /> Drain and remove
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
