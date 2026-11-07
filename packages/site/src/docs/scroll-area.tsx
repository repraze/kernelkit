import {Button} from "kernelkit/components/button";
import {ScrollArea} from "kernelkit/components/scroll-area";
import {Separator} from "kernelkit/components/separator";
import {useEffect, useRef, useState} from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Scroll area",
    category: "Layout",
    baseUi: "scroll-area",
    description: "A scroll container with thin, themed overlay scrollbars that stay visible in high contrast.",
    demos: [
        {title: "Vertical", component: Vertical},
        {title: "Horizontal", component: Horizontal, description: '`orientation="horizontal"` (or `"both"`).'},
        {
            title: "Viewport ref",
            component: ViewportRef,
            description:
                "`viewportRef` reaches the scrolling element (scrollTo, virtualizers); `viewportClassName` styles it.",
        },
    ],
    props: [
        {
            component: "ScrollArea",
            rows: [
                {name: "orientation", type: '"vertical" | "horizontal" | "both"', default: '"vertical"'},
                {name: "viewportRef", type: "Ref<HTMLDivElement>", description: "The element that scrolls."},
                {name: "viewportClassName", type: "string", description: "Padding, snap, etc. on the viewport."},
            ],
        },
    ],
});

const LOG = Array.from({length: 40}, (_, i) => {
    const level = i % 11 === 0 ? "WARN" : i % 17 === 0 ? "ERROR" : "INFO";
    return `12:04:${String(i).padStart(2, "0")} ${level} worker-${(i % 4) + 1} processed batch ${1200 + i}`;
});

export function Vertical() {
    return (
        <ScrollArea className="h-64 w-full max-w-md rounded-lg border">
            <div className="p-3 font-mono text-xs leading-6">
                {LOG.map((line) => (
                    <div key={line}>{line}</div>
                ))}
            </div>
        </ScrollArea>
    );
}

export function Horizontal() {
    const regions = [
        "us-east-1",
        "us-west-2",
        "eu-west-1",
        "eu-central-1",
        "ap-south-1",
        "ap-northeast-1",
        "sa-east-1",
    ];
    return (
        <ScrollArea orientation="horizontal" className="w-full max-w-md rounded-lg border">
            <div className="flex w-max gap-3 p-3">
                {regions.map((r) => (
                    <div
                        key={r}
                        className="flex h-20 w-36 shrink-0 flex-col justify-between rounded-md border bg-background p-2"
                    >
                        <span className="font-mono text-xs">{r}</span>
                        <span className="text-xs text-muted-foreground">12 nodes</span>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}

export function ViewportRef() {
    const ref = useRef<HTMLDivElement>(null);
    const [top, setTop] = useState(0);
    useEffect(() => {
        const el = ref.current;
        if (!el) {
            return;
        }
        const onScroll = () => setTop(Math.round(el.scrollTop));
        el.addEventListener("scroll", onScroll, {passive: true});
        return () => el.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className="flex w-full max-w-md flex-col gap-2">
            <ScrollArea viewportRef={ref} viewportClassName="p-3" className="h-48 rounded-lg border">
                {LOG.map((line, i) => (
                    <div key={line} className="font-mono text-xs leading-6">
                        {i > 0 && i % 10 === 0 ? <Separator className="my-1" /> : null}
                        {line}
                    </div>
                ))}
            </ScrollArea>
            <div className="flex items-center gap-2">
                <Button size="xs" variant="outline" onClick={() => ref.current?.scrollTo({top: 0, behavior: "smooth"})}>
                    Top
                </Button>
                <Button
                    size="xs"
                    variant="outline"
                    onClick={() => ref.current?.scrollTo({top: ref.current.scrollHeight, behavior: "smooth"})}
                >
                    Tail
                </Button>
                <span className="ml-auto font-mono text-xs text-muted-foreground">scrollTop: {top}px</span>
            </div>
        </div>
    );
}
