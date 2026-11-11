import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@repraze/kernelkit/components/avatar";
import {BotIcon} from "lucide-react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

// Inline SVG portraits so the demo works offline (no external image hosts).
function portrait(hue: string) {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='${hue}'/><circle cx='20' cy='16' r='7' fill='rgba(255,255,255,.85)'/><rect x='8' y='26' width='24' height='16' rx='12' fill='rgba(255,255,255,.85)'/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const ADA = portrait("hsl(330 70% 55%)");
const LIN = portrait("hsl(190 70% 40%)");

export const doc = defineDoc({
    title: "Avatar",
    category: "Data display",
    source: baseUi("avatar"),
    description: "A user or service picture with a text fallback while it loads or when it fails.",
    demos: [
        {title: "Image and fallback", component: Basic},
        {title: "Sizes", component: Sizes, description: "xs 16px · sm 24px · default 32px · lg 40px."},
        {title: "Badge", component: WithBadge, description: "A status dot pinned to the corner."},
        {title: "Group", component: Group, description: "Overlapping stack with an overflow count."},
    ],
    props: [
        {
            component: "Avatar",
            rows: [
                {name: "size", type: '"xs" | "sm" | "default" | "lg"', default: '"default"'},
                {
                    name: "className",
                    type: "string",
                    description: "Shape is `rounded-pill`: round by default, square at radius-none.",
                },
            ],
        },
        {
            component: "AvatarFallback",
            rows: [{name: "delay", type: "number", description: "ms to wait before showing, avoids a flash."}],
        },
    ],
});

export function Basic() {
    return (
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={ADA} alt="Ada" />
                <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>OP</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>
                    <BotIcon />
                </AvatarFallback>
            </Avatar>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex items-center gap-3">
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
                <Avatar key={size} size={size}>
                    <AvatarImage src={LIN} alt="Lin" />
                    <AvatarFallback>LN</AvatarFallback>
                </Avatar>
            ))}
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
                <Avatar key={`f-${size}`} size={size}>
                    <AvatarFallback>LN</AvatarFallback>
                </Avatar>
            ))}
        </div>
    );
}

export function WithBadge() {
    return (
        <div className="flex items-center gap-4">
            {(["sm", "default", "lg"] as const).map((size) => (
                <Avatar key={size} size={size}>
                    <AvatarImage src={ADA} alt="Ada" />
                    <AvatarFallback>AD</AvatarFallback>
                    <AvatarBadge className="bg-success" />
                </Avatar>
            ))}
            <Avatar size="lg">
                <AvatarFallback>CI</AvatarFallback>
                <AvatarBadge className="bg-danger" />
            </Avatar>
        </div>
    );
}

export function Group() {
    return (
        <div className="flex flex-col items-center gap-4">
            {(["sm", "default", "lg"] as const).map((size) => (
                <AvatarGroup key={size}>
                    <Avatar size={size}>
                        <AvatarImage src={ADA} alt="Ada" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <Avatar size={size}>
                        <AvatarImage src={LIN} alt="Lin" />
                        <AvatarFallback>LN</AvatarFallback>
                    </Avatar>
                    <Avatar size={size}>
                        <AvatarFallback>KT</AvatarFallback>
                    </Avatar>
                    <AvatarGroupCount>+4</AvatarGroupCount>
                </AvatarGroup>
            ))}
        </div>
    );
}
