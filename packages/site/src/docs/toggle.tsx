import {Toggle} from "@repraze/kernelkit/components/toggle";
import {BoldIcon, BookmarkIcon, EyeIcon, ItalicIcon, PinIcon, WrapTextIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Toggle",
    category: "Actions",
    baseUi: "toggle",
    description: "A two-state button. On is an accent fill (outline adds a primary border), readable in high contrast.",
    order: 3,
    demos: [
        {title: "Variants", component: Variants, description: "Each pair: off, then on."},
        {title: "Sizes", component: Sizes, description: "Icon-only toggles are square at the control height."},
        {title: "With text", component: WithText},
        {title: "Disabled", component: Disabled},
    ],
    props: [
        {
            component: "Toggle",
            rows: [
                {name: "variant", type: '"default" | "outline"', default: '"default"'},
                {
                    name: "size",
                    type: '"xs" | "sm" | "default" | "lg"',
                    default: '"default"',
                    description: "h-6 / h-7 / h-8 / h-9.",
                },
                {name: "pressed", type: "boolean", description: "Controlled state. Pair with onPressedChange."},
                {name: "defaultPressed", type: "boolean", default: "false"},
                {name: "onPressedChange", type: "(pressed: boolean, details) => void"},
            ],
        },
    ],
});

export function Variants() {
    return (
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
                <Toggle aria-label="Wrap lines">
                    <WrapTextIcon />
                </Toggle>
                <Toggle aria-label="Wrap lines" defaultPressed>
                    <WrapTextIcon />
                </Toggle>
            </div>
            <div className="flex items-center gap-2">
                <Toggle variant="outline" aria-label="Pin process">
                    <PinIcon />
                </Toggle>
                <Toggle variant="outline" aria-label="Pin process" defaultPressed>
                    <PinIcon />
                </Toggle>
            </div>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
                <Toggle key={size} size={size} variant="outline" aria-label="Bold" defaultPressed={size === "default"}>
                    <BoldIcon />
                </Toggle>
            ))}
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
                <Toggle key={`t-${size}`} size={size} variant="outline">
                    Follow
                </Toggle>
            ))}
        </div>
    );
}

export function WithText() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Toggle variant="outline" defaultPressed>
                <EyeIcon data-icon="inline-start" /> Watch logs
            </Toggle>
            <Toggle variant="outline">
                <BookmarkIcon data-icon="inline-start" /> Bookmark
            </Toggle>
            <Toggle>
                <ItalicIcon data-icon="inline-start" /> Italic
            </Toggle>
        </div>
    );
}

export function Disabled() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Toggle variant="outline" disabled aria-label="Pin">
                <PinIcon />
            </Toggle>
            <Toggle variant="outline" disabled defaultPressed aria-label="Pin">
                <PinIcon />
            </Toggle>
        </div>
    );
}
