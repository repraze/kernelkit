import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@repraze/kernelkit/components/menubar";
import {PlayIcon, RotateCcwIcon, SquareIcon, Trash2Icon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Menubar",
    category: "Navigation",
    baseUi: "menubar",
    description: "A desktop-style row of menus for app-level commands, with arrow-key navigation between them.",
    demos: [
        {title: "Default", component: Default, layout: "tall"},
        {title: "Checkbox and radio items", component: Toggles, layout: "tall"},
    ],
    props: [
        {
            component: "Menubar",
            rows: [
                {name: "loopFocus", type: "boolean", default: "true", description: "Wrap arrow-key focus at the ends."},
                {name: "modal", type: "boolean", default: "true"},
                {name: "disabled", type: "boolean", default: "false"},
            ],
        },
        {
            component: "MenubarItem",
            rows: [
                {name: "variant", type: '"default" | "danger" | "destructive"', default: '"default"'},
                {name: "inset", type: "boolean", description: "Indent to line up with items that lead with an icon."},
            ],
        },
    ],
    notes: Notes,
});

function Notes() {
    return (
        <p className="text-sm text-muted-foreground">
            Menus, items, labels and separators are the dropdown-menu parts with menubar slots, so both share one look.
        </p>
    );
}

export function Default() {
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Service</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        <PlayIcon /> Start <MenubarShortcut>⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        <RotateCcwIcon /> Restart <MenubarShortcut>⇧⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>
                        <SquareIcon /> Stop
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>Deploy to</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>staging</MenubarItem>
                            <MenubarItem>production</MenubarItem>
                            <MenubarItem>canary (5%)</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem variant="danger">
                        <Trash2Icon /> Delete service
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        Copy service ID <MenubarShortcut>⌘C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Duplicate <MenubarShortcut>⌘D</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>Rename…</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Logs</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        Tail <MenubarShortcut>⌘L</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>Download archive</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu disabled>
                <MenubarTrigger>Billing</MenubarTrigger>
            </MenubarMenu>
        </Menubar>
    );
}

export function Toggles() {
    const [wrap, setWrap] = React.useState(true);
    const [timestamps, setTimestamps] = React.useState(false);
    const [level, setLevel] = React.useState("info");
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarGroup>
                        <MenubarLabel>Log output</MenubarLabel>
                        <MenubarCheckboxItem checked={wrap} onCheckedChange={setWrap}>
                            Wrap lines
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem checked={timestamps} onCheckedChange={setTimestamps}>
                            Show timestamps
                        </MenubarCheckboxItem>
                    </MenubarGroup>
                    <MenubarSeparator />
                    <MenubarLabel>Minimum level</MenubarLabel>
                    <MenubarRadioGroup value={level} onValueChange={setLevel}>
                        <MenubarRadioItem value="debug">debug</MenubarRadioItem>
                        <MenubarRadioItem value="info">info</MenubarRadioItem>
                        <MenubarRadioItem value="warn">warn</MenubarRadioItem>
                        <MenubarRadioItem value="error">error</MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Window</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>Split horizontally</MenubarItem>
                    <MenubarItem>Split vertically</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
