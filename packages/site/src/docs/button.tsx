import {Button} from "@repraze/kernelkit/components/button";
import {Spinner} from "@repraze/kernelkit/components/spinner";
import {COLORS, FILL_VARIANTS} from "@repraze/kernelkit/lib/color";
import {ArrowRightIcon, PlusIcon, TerminalIcon, Trash2Icon} from "lucide-react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Button",
    category: "Actions",
    source: baseUi("button"),
    description: "Triggers an action. One primary per view; everything else steps down to outline, secondary or ghost.",
    order: 1,
    demos: [
        {title: "Variants", component: Variants},
        {
            title: "Colors",
            component: Colors,
            layout: "start",
            description:
                "`color` is orthogonal to `variant`. Solid, soft and link default to primary; outline and ghost default to neutral.",
        },
        {title: "Sizes", component: Sizes},
        {title: "With icons", component: WithIcons},
        {title: "As link", component: AsLink, description: "Render any element with the `render` prop."},
    ],
    props: [
        {
            component: "Button",
            rows: [
                {
                    name: "variant",
                    type: '"solid" | "soft" | "outline" | "ghost" | "link"',
                    default: '"solid"',
                    description:
                        'shadcn aliases: "default" = solid, "secondary" = solid neutral, "destructive" = soft danger.',
                },
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: "per variant",
                    description: "Hue: red, orange, yellow, green, cyan, blue, purple, pink.",
                },
                {
                    name: "size",
                    type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
                    default: '"default"',
                },
                {name: "render", type: "ReactElement | (props) => ReactElement", description: "Element to render as."},
            ],
        },
    ],
});

export function Variants() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button>Deploy</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destroy</Button>
            <Button variant="link">Link</Button>
        </div>
    );
}

export function Colors() {
    return (
        <div className="grid grid-cols-[auto_repeat(5,auto)] items-center gap-x-2 gap-y-1.5 text-xs">
            <span />
            {FILL_VARIANTS.map((variant) => (
                <span key={variant} className="font-mono text-muted-foreground">
                    {variant}
                </span>
            ))}
            {COLORS.map((color) => (
                <div key={color} className="contents">
                    <span className="pr-2 font-mono text-muted-foreground">{color}</span>
                    {FILL_VARIANTS.map((variant) => (
                        <Button key={variant} size="sm" variant={variant} color={color}>
                            {color}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline" aria-label="Add">
                <PlusIcon />
            </Button>
        </div>
    );
}

export function WithIcons() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button>
                <TerminalIcon data-icon="inline-start" /> Open shell
            </Button>
            <Button variant="outline">
                Continue <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="destructive">
                <Trash2Icon data-icon="inline-start" /> Purge cache
            </Button>
            <Button disabled>
                <Spinner data-icon="inline-start" /> Compiling
            </Button>
        </div>
    );
}

export function AsLink() {
    return (
        <Button variant="outline" nativeButton={false} render={<a href="#as-link" />}>
            Anchor styled as a button
        </Button>
    );
}
