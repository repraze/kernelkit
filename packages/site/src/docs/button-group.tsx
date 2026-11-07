import {Button} from "@repraze/kernelkit/components/button";
import {ButtonGroup, ButtonGroupSeparator, ButtonGroupText} from "@repraze/kernelkit/components/button-group";
import {Input} from "@repraze/kernelkit/components/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@repraze/kernelkit/components/select";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronDownIcon,
    CopyIcon,
    GitForkIcon,
    PauseIcon,
    PlayIcon,
    RotateCwIcon,
    SearchIcon,
    SquareIcon,
} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Button Group",
    category: "Actions",
    description: "Joins related buttons, inputs and selects into one control with shared borders.",
    order: 2,
    demos: [
        {title: "Outline", component: Outline},
        {title: "Split button", component: Split, description: "Solid buttons need a `ButtonGroupSeparator`."},
        {title: "Sizes", component: Sizes},
        {title: "With input", component: WithInput},
        {title: "With text", component: WithText},
        {title: "Nested", component: Nested, description: "Groups inside a group get a gap."},
        {title: "Vertical", component: Vertical},
    ],
    props: [
        {
            component: "ButtonGroup",
            rows: [{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'}],
        },
        {
            component: "ButtonGroupText",
            rows: [{name: "render", type: "ReactElement", description: "e.g. a <label> for an attached input."}],
        },
        {
            component: "ButtonGroupSeparator",
            rows: [{name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"'}],
        },
    ],
});

export function Outline() {
    return (
        <ButtonGroup>
            <Button variant="outline">
                <PlayIcon data-icon="inline-start" /> Start
            </Button>
            <Button variant="outline">
                <PauseIcon data-icon="inline-start" /> Pause
            </Button>
            <Button variant="outline">
                <SquareIcon data-icon="inline-start" /> Stop
            </Button>
        </ButtonGroup>
    );
}

export function Split() {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <ButtonGroup>
                <Button>Deploy</Button>
                <ButtonGroupSeparator />
                <Button size="icon" aria-label="More deploy options">
                    <ChevronDownIcon />
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button variant="secondary">
                    <GitForkIcon data-icon="inline-start" /> Fork
                </Button>
                <ButtonGroupSeparator />
                <Button variant="secondary" className="font-mono tabular-nums">
                    128
                </Button>
            </ButtonGroup>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-col items-start gap-3">
            {(
                [
                    ["xs", "icon-xs"],
                    ["sm", "icon-sm"],
                    ["default", "icon"],
                    ["lg", "icon-lg"],
                ] as const
            ).map(([size, iconSize]) => (
                <ButtonGroup key={size}>
                    <Button size={size} variant="outline">
                        Previous
                    </Button>
                    <Button size={size} variant="outline">
                        Next
                    </Button>
                    <Button size={iconSize} variant="outline" aria-label="Reload">
                        <RotateCwIcon />
                    </Button>
                </ButtonGroup>
            ))}
        </div>
    );
}

export function WithInput() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <ButtonGroup className="w-full">
                <Input placeholder="Search pods…" />
                <Button variant="outline" size="icon" aria-label="Search">
                    <SearchIcon />
                </Button>
            </ButtonGroup>
            <ButtonGroup className="w-full">
                <Select defaultValue="https">
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="https">https://</SelectItem>
                        <SelectItem value="grpc">grpc://</SelectItem>
                    </SelectContent>
                </Select>
                <Input placeholder="api.internal:8443" />
            </ButtonGroup>
        </div>
    );
}

export function WithText() {
    return (
        <ButtonGroup className="w-full max-w-md">
            <ButtonGroupText render={<label htmlFor="bg-webhook" />}>Webhook</ButtonGroupText>
            <Input id="bg-webhook" defaultValue="https://hooks.acme.dev/ci/7f3a" readOnly />
            <Button variant="outline" size="icon" aria-label="Copy webhook URL">
                <CopyIcon />
            </Button>
        </ButtonGroup>
    );
}

export function Nested() {
    return (
        <ButtonGroup>
            <ButtonGroup>
                <Button variant="outline" size="sm">
                    1
                </Button>
                <Button variant="outline" size="sm">
                    2
                </Button>
                <Button variant="outline" size="sm">
                    3
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button variant="outline" size="icon-sm" aria-label="Previous page">
                    <ArrowUpIcon />
                </Button>
                <Button variant="outline" size="icon-sm" aria-label="Next page">
                    <ArrowDownIcon />
                </Button>
            </ButtonGroup>
        </ButtonGroup>
    );
}

export function Vertical() {
    return (
        <ButtonGroup orientation="vertical">
            <Button variant="outline" size="icon" aria-label="Scale up">
                <ArrowUpIcon />
            </Button>
            <Button variant="outline" size="icon" aria-label="Scale down">
                <ArrowDownIcon />
            </Button>
        </ButtonGroup>
    );
}
