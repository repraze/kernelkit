import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "kernelkit/components/resizable";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Resizable",
    category: "Layout",
    description:
        "Panels split by draggable handles. Hover washes the hit area, dragging turns the line primary, arrow keys resize when focused.",
    demos: [
        {title: "Horizontal", component: Horizontal},
        {title: "Vertical with grip", component: Vertical, description: "`withHandle` shows a grip."},
        {title: "Nested", component: Nested},
    ],
    props: [
        {
            component: "ResizablePanelGroup",
            rows: [{name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'}],
        },
        {
            component: "ResizablePanel",
            rows: [
                {name: "defaultSize", type: 'number | "${n}%"', description: "Pixels, or a percentage string."},
                {name: "minSize / maxSize", type: 'number | "${n}%"'},
            ],
        },
        {component: "ResizableHandle", rows: [{name: "withHandle", type: "boolean", default: "false"}]},
    ],
});

function Pane({label}: {label: string}) {
    return (
        <div className="flex h-full items-center justify-center p-4 font-mono text-xs text-muted-foreground">
            {label}
        </div>
    );
}

export function Horizontal() {
    return (
        <ResizablePanelGroup className="min-h-48 max-w-lg rounded-lg border">
            <ResizablePanel defaultSize="30%" minSize="15%">
                <Pane label="explorer" />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <Pane label="editor" />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

export function Vertical() {
    return (
        <ResizablePanelGroup orientation="vertical" className="min-h-64 max-w-lg rounded-lg border">
            <ResizablePanel defaultSize="60%">
                <Pane label="terminal" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <Pane label="output" />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

export function Nested() {
    return (
        <ResizablePanelGroup className="min-h-64 max-w-lg rounded-lg border">
            <ResizablePanel defaultSize="35%">
                <Pane label="processes" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
                <ResizablePanelGroup orientation="vertical">
                    <ResizablePanel defaultSize="50%">
                        <Pane label="cpu" />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel>
                        <Pane label="memory" />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
