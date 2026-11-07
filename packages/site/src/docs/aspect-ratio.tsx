import {AspectRatio} from "kernelkit/components/aspect-ratio";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Aspect ratio",
    category: "Layout",
    description: "A box that keeps a width-to-height ratio; media inside fills it.",
    demos: [{title: "Ratios", component: Ratios}],
    props: [
        {
            component: "AspectRatio",
            rows: [
                {name: "ratio", type: "number", description: "Width / height, e.g. 16 / 9."},
                {name: "render", type: "ReactElement", description: "Element to render as."},
            ],
        },
    ],
});

export function Ratios() {
    return (
        <div className="grid w-full max-w-xl grid-cols-3 items-start gap-4">
            {[
                {label: "16 / 9", ratio: 16 / 9},
                {label: "4 / 3", ratio: 4 / 3},
                {label: "1 / 1", ratio: 1},
            ].map(({label, ratio}) => (
                <AspectRatio
                    key={label}
                    ratio={ratio}
                    className="flex items-center justify-center rounded-lg border bg-muted font-mono text-xs text-muted-foreground"
                >
                    {label}
                </AspectRatio>
            ))}
        </div>
    );
}
