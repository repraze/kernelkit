import {Button} from "@repraze/kernelkit/components/button";
import {Toggle} from "@repraze/kernelkit/components/toggle";
import {
    Toolbar,
    ToolbarButton,
    ToolbarGroup,
    ToolbarInput,
    ToolbarLink,
    ToolbarSeparator,
} from "@repraze/kernelkit/components/toolbar";
import {
    CopyIcon,
    DownloadIcon,
    FilterIcon,
    PauseIcon,
    PlayIcon,
    RefreshCwIcon,
    Trash2Icon,
    WrapTextIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Toolbar",
    category: "Navigation",
    baseUi: "toolbar",
    description: "Groups related controls into one bordered bar with a single tab stop and arrow-key navigation.",
    demos: [
        {
            title: "Default",
            component: Default,
            description:
                "Items are ghost `icon-sm` buttons. Tab enters the toolbar once; arrow keys move between items.",
        },
        {
            title: "Toggles, inputs and links",
            component: Mixed,
            description: "`render` any control into a toolbar item: a `Toggle`, a labelled `Button`…",
        },
        {title: "Disabled items", component: Disabled},
        {title: "Vertical", component: Vertical},
    ],
    props: [
        {
            component: "Toolbar",
            rows: [
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
                {name: "loopFocus", type: "boolean", default: "true", description: "Wrap arrow-key focus at the ends."},
                {name: "disabled", type: "boolean", default: "false"},
            ],
        },
        {
            component: "ToolbarButton",
            rows: [
                {
                    name: "render",
                    type: "ReactElement",
                    description: "Control to render (keeps toolbar focus handling). Without it: ghost icon-sm button.",
                },
                {
                    name: "focusableWhenDisabled",
                    type: "boolean",
                    default: "true",
                    description: "Disabled items stay reachable by arrow keys.",
                },
            ],
        },
        {
            component: "ToolbarInput / ToolbarLink",
            rows: [{name: "className", type: "string", description: "Compact `h-7` field and link sized for the bar."}],
        },
    ],
});

export function Default() {
    return (
        <Toolbar aria-label="Log viewer">
            <ToolbarGroup aria-label="Stream">
                <ToolbarButton aria-label="Resume">
                    <PlayIcon />
                </ToolbarButton>
                <ToolbarButton aria-label="Pause">
                    <PauseIcon />
                </ToolbarButton>
                <ToolbarButton aria-label="Reload">
                    <RefreshCwIcon />
                </ToolbarButton>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup aria-label="Output">
                <ToolbarButton aria-label="Copy">
                    <CopyIcon />
                </ToolbarButton>
                <ToolbarButton aria-label="Download">
                    <DownloadIcon />
                </ToolbarButton>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarButton aria-label="Clear" render={<Button variant="ghost" color="danger" size="icon-sm" />}>
                <Trash2Icon />
            </ToolbarButton>
        </Toolbar>
    );
}

export function Mixed() {
    return (
        <Toolbar aria-label="Log filters">
            <ToolbarButton render={<Toggle size="sm" defaultPressed aria-label="Wrap lines" />}>
                <WrapTextIcon />
            </ToolbarButton>
            <ToolbarButton render={<Toggle size="sm" aria-label="Filter errors" />}>
                <FilterIcon />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarInput placeholder="grep pattern" aria-label="Filter pattern" className="font-mono" />
            <ToolbarButton render={<Button variant="ghost" size="sm" />}>Apply</ToolbarButton>
            <ToolbarSeparator />
            <ToolbarLink href="#">Tailing 3 pods</ToolbarLink>
        </Toolbar>
    );
}

export function Disabled() {
    return (
        <Toolbar aria-label="Zoom">
            <ToolbarButton aria-label="Zoom out" disabled>
                <ZoomOutIcon />
            </ToolbarButton>
            <ToolbarButton render={<Button variant="ghost" size="sm" className="font-mono" />}>100%</ToolbarButton>
            <ToolbarButton aria-label="Zoom in">
                <ZoomInIcon />
            </ToolbarButton>
        </Toolbar>
    );
}

export function Vertical() {
    return (
        <Toolbar orientation="vertical" aria-label="Canvas tools">
            <ToolbarButton aria-label="Zoom in">
                <ZoomInIcon />
            </ToolbarButton>
            <ToolbarButton aria-label="Zoom out">
                <ZoomOutIcon />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton aria-label="Download">
                <DownloadIcon />
            </ToolbarButton>
        </Toolbar>
    );
}
