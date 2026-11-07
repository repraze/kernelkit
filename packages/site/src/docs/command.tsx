import {Button} from "kernelkit/components/button";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "kernelkit/components/command";
import {Kbd} from "kernelkit/components/kbd";
import {
    BoxIcon,
    FileTextIcon,
    GitBranchIcon,
    RocketIcon,
    ServerIcon,
    SettingsIcon,
    SquareTerminalIcon,
} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Command",
    category: "Overlays",
    description: "A searchable list of commands, inline or as a ⌘K palette. Built on cmdk.",
    order: 10,
    demos: [
        {title: "Inline", component: Inline},
        {
            title: "Palette",
            component: Palette,
            description:
                "`CommandDialog` wraps it in a dialog. Press ⌘J / Ctrl+J on this page (⌘K is the site search), or use the button.",
        },
    ],
    props: [
        {
            component: "CommandDialog",
            rows: [
                {name: "title / description", type: "string", description: "Screen-reader labels of the dialog."},
                {name: "showCloseButton", type: "boolean", default: "false"},
                {name: "open / onOpenChange", type: "boolean / (open) => void"},
            ],
        },
        {
            component: "CommandItem",
            rows: [
                {name: "value", type: "string", description: "Search key; defaults to the text content."},
                {name: "keywords", type: "string[]", description: "Extra search terms."},
                {name: "onSelect", type: "(value) => void"},
                {name: "disabled", type: "boolean"},
            ],
        },
    ],
});

function Items() {
    return (
        <>
            <CommandEmpty>No matching command.</CommandEmpty>
            <CommandGroup heading="Deploy">
                <CommandItem>
                    <RocketIcon /> Deploy to staging <CommandShortcut>⌘D</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <GitBranchIcon /> Promote release
                </CommandItem>
                <CommandItem disabled>
                    <BoxIcon /> Rebuild image (queue full)
                </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Cluster">
                <CommandItem>
                    <ServerIcon /> Go to nodes <CommandShortcut>G N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <FileTextIcon /> Tail logs <CommandShortcut>G L</CommandShortcut>
                </CommandItem>
                <CommandItem>
                    <SquareTerminalIcon /> Open shell
                </CommandItem>
                <CommandItem>
                    <SettingsIcon /> Settings <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
            </CommandGroup>
        </>
    );
}

export function Inline() {
    return (
        <Command className="max-w-sm shadow-md">
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
                <Items />
            </CommandList>
        </Command>
    );
}

export function Palette() {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);
    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                Command palette <Kbd>⌘J</Kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="Type a command or search…" />
                    <CommandList>
                        <Items />
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
}
