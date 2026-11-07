import {Button} from "@repraze/kernelkit/components/button";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {Tooltip, TooltipContent, TooltipTrigger} from "@repraze/kernelkit/components/tooltip";
import {CopyIcon, RefreshCwIcon, SquareTerminalIcon, Trash2Icon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Tooltip",
    category: "Overlays",
    baseUi: "tooltip",
    description: "A short label for an icon-only control, shown on hover and keyboard focus.",
    order: 7,
    demos: [
        {title: "Icon buttons", component: IconButtons},
        {title: "With shortcut", component: WithShortcut, description: "A trailing `Kbd` adopts the inverted look."},
        {title: "Sides", component: Sides},
    ],
    props: [
        {
            component: "TooltipProvider",
            rows: [
                {
                    name: "delay",
                    type: "number",
                    default: "0",
                    description: "ms before opening. Wrap the app once so adjacent tooltips open instantly.",
                },
            ],
        },
        {
            component: "TooltipContent",
            rows: [
                {name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"'},
                {name: "align", type: '"start" | "center" | "end"', default: '"center"'},
                {name: "sideOffset", type: "number", default: "6"},
            ],
        },
    ],
});

export function IconButtons() {
    const actions = [
        {label: "Open shell", icon: SquareTerminalIcon},
        {label: "Copy node ID", icon: CopyIcon},
        {label: "Restart", icon: RefreshCwIcon},
        {label: "Drain and remove", icon: Trash2Icon},
    ];
    return (
        <div className="flex items-center gap-1">
            {actions.map(({label, icon: Icon}) => (
                <Tooltip key={label}>
                    <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label={label} />}>
                        <Icon />
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}

export function WithShortcut() {
    return (
        <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>Deploy</TooltipTrigger>
            <TooltipContent>
                Deploy to staging <Kbd>⌘D</Kbd>
            </TooltipContent>
        </Tooltip>
    );
}

export function Sides() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
                <Tooltip key={side}>
                    <TooltipTrigger render={<Button variant="outline" className="capitalize" />}>{side}</TooltipTrigger>
                    <TooltipContent side={side}>Last synced 4s ago</TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
