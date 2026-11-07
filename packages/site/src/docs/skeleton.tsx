import {Skeleton} from "@repraze/kernelkit/components/skeleton";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Skeleton",
    category: "Feedback",
    description:
        "A placeholder shaped like the content that is loading. Size it with utilities; it pulses unless reduced motion is on.",
    demos: [
        {title: "Card row", component: CardRow},
        {title: "Table", component: TableSkeleton},
        {
            title: "Shapes",
            component: Shapes,
            description: "`rounded-md` by default; `rounded-pill` for avatars and badges.",
        },
    ],
    props: [
        {
            component: "Skeleton",
            rows: [
                {name: "className", type: "string", description: "Give it a size: h-4 w-32, size-8…"},
                {name: "render", type: "ReactElement", description: "Element to render as (e.g. <span />)."},
            ],
        },
    ],
});

export function CardRow() {
    return (
        <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border p-4">
            <Skeleton className="size-10 rounded-pill" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-[1fr_4rem_5rem] items-center gap-4">
                    <Skeleton className="h-4" />
                    <Skeleton className="h-5 rounded-pill" />
                    <Skeleton className="h-4" />
                </div>
            ))}
        </div>
    );
}

export function Shapes() {
    return (
        <div className="flex items-center gap-4">
            <Skeleton className="size-8 rounded-pill" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-5 w-14 rounded-pill" />
            <Skeleton className="h-24 w-36 rounded-xl" />
        </div>
    );
}
