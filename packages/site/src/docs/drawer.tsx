import {Button} from "kernelkit/components/button";
import {
    Drawer,
    DrawerBody,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "kernelkit/components/drawer";
import {MinusIcon, PlusIcon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Drawer",
    category: "Overlays",
    baseUi: "drawer",
    description:
        "A swipeable panel from a screen edge. On touch, drag it to dismiss; prefer Sheet for desktop side panels.",
    order: 4,
    demos: [
        {title: "Bottom", component: Bottom, description: "`showSwipeHandle` adds the grab bar."},
        {title: "Directions", component: Directions, description: "`swipeDirection` is the edge it dismisses toward."},
    ],
    props: [
        {
            component: "Drawer",
            rows: [
                {name: "swipeDirection", type: '"down" | "up" | "left" | "right"', default: '"down"'},
                {name: "showSwipeHandle", type: "boolean", default: "false"},
                {name: "snapPoints", type: "(number | string)[]", description: "Heights the drawer rests at."},
                {name: "modal", type: "boolean", default: "true", description: "Renders the scrim and traps focus."},
            ],
        },
    ],
});

export function Bottom() {
    const [replicas, setReplicas] = React.useState(6);
    return (
        <Drawer showSwipeHandle>
            <DrawerTrigger render={<Button variant="outline" />}>Scale deployment</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto flex w-full max-w-sm flex-col">
                    <DrawerHeader>
                        <DrawerTitle>Scale api</DrawerTitle>
                        <DrawerDescription>Replicas across pool general-purpose.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerBody className="flex-row items-center justify-center gap-6 py-4">
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Remove replica"
                            onClick={() => setReplicas((n) => Math.max(1, n - 1))}
                        >
                            <MinusIcon />
                        </Button>
                        <div className="flex flex-col items-center">
                            <span className="font-mono text-5xl font-semibold tabular-nums">{replicas}</span>
                            <span className="text-xs text-muted-foreground">replicas</span>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Add replica"
                            onClick={() => setReplicas((n) => Math.min(24, n + 1))}
                        >
                            <PlusIcon />
                        </Button>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button>Apply</Button>
                        <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export function Directions() {
    return (
        <div className="grid grid-cols-2 gap-2">
            {(["up", "right", "down", "left"] as const).map((direction) => (
                <Drawer key={direction} swipeDirection={direction} showSwipeHandle>
                    <DrawerTrigger render={<Button variant="outline" className="capitalize" />}>
                        {direction}
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Incident #482</DrawerTitle>
                            <DrawerDescription>p95 latency above 800ms on api for 6 minutes.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <DrawerClose render={<Button variant="outline" />}>Dismiss</DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ))}
        </div>
    );
}
