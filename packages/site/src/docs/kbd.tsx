import {Button} from "@repraze/kernelkit/components/button";
import {Kbd, KbdGroup} from "@repraze/kernelkit/components/kbd";
import {CommandIcon, CornerDownLeftIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Kbd",
    category: "Data display",
    description: "A keyboard key or shortcut, rendered as a small mono keycap.",
    demos: [
        {title: "Keys", component: Keys},
        {title: "Sizes", component: Sizes},
        {title: "Shortcut group", component: Group, description: "`KbdGroup` spaces keys and separators."},
        {title: "In context", component: InContext, description: "Inline in text and inside a button."},
    ],
    props: [
        {
            component: "Kbd",
            rows: [{name: "size", type: '"sm" | "default"', default: '"default"', description: "16px / 20px tall."}],
        },
    ],
});

export function Keys() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Kbd>Esc</Kbd>
            <Kbd>Tab</Kbd>
            <Kbd>Shift</Kbd>
            <Kbd>
                <CommandIcon />
            </Kbd>
            <Kbd>
                <CornerDownLeftIcon />
            </Kbd>
            <Kbd>K</Kbd>
            <Kbd>F5</Kbd>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex items-center gap-2">
            <Kbd size="sm">⌘</Kbd>
            <Kbd size="sm">K</Kbd>
            <span className="w-4" />
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
        </div>
    );
}

export function Group() {
    return (
        <div className="flex flex-col items-center gap-3">
            <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <span>+</span>
                <Kbd>Shift</Kbd>
                <span>+</span>
                <Kbd>P</Kbd>
            </KbdGroup>
            <KbdGroup>
                <Kbd>g</Kbd>
                <span>then</span>
                <Kbd>d</Kbd>
            </KbdGroup>
        </div>
    );
}

export function InContext() {
    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette, <Kbd>Esc</Kbd> to close it.
            </p>
            <div className="flex gap-2">
                <Button variant="outline">
                    Search logs
                    <Kbd size="sm" data-icon="inline-end">
                        /
                    </Kbd>
                </Button>
                <Button>
                    Deploy
                    <KbdGroup>
                        <Kbd size="sm" className="border-transparent bg-primary-foreground/20 text-primary-foreground">
                            ⌘
                        </Kbd>
                        <Kbd size="sm" className="border-transparent bg-primary-foreground/20 text-primary-foreground">
                            ↵
                        </Kbd>
                    </KbdGroup>
                </Button>
            </div>
        </div>
    );
}
