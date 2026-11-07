import {Badge} from "kernelkit/components/badge";
import {Button} from "kernelkit/components/button";
import {Spinner} from "kernelkit/components/spinner";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Spinner",
    category: "Feedback",
    description:
        "An indeterminate loading indicator. Inherits the text color and matches the icon sizes, so it can stand in for an icon.",
    demos: [
        {title: "Sizes", component: Sizes, description: "xs 12px, sm 14px, default 16px, lg 20px, xl 24px."},
        {
            title: "Color",
            component: Colors,
            description: "It uses `currentColor`: set a text color on it or its parent.",
        },
        {
            title: "In controls",
            component: InControls,
            description: "Replace the leading icon, keep the label, set `aria-busy` on the control.",
        },
    ],
    props: [
        {
            component: "Spinner",
            rows: [
                {name: "size", type: '"xs" | "sm" | "default" | "lg" | "xl"', default: '"default"'},
                {name: "aria-label", type: "string", default: '"Loading"'},
            ],
        },
    ],
});

export function Sizes() {
    return (
        <div className="flex items-center gap-4">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <Spinner size="xl" />
        </div>
    );
}

export function Colors() {
    return (
        <div className="flex items-center gap-4">
            <Spinner className="text-muted-foreground" />
            <Spinner className="text-primary-text" />
            <Spinner className="text-info" />
            <Spinner className="text-success" />
            <Spinner className="text-warning" />
            <Spinner className="text-danger" />
        </div>
    );
}

export function InControls() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button aria-busy disabled>
                <Spinner data-icon="inline-start" /> Deploying
            </Button>
            <Button variant="outline" aria-busy disabled>
                <Spinner data-icon="inline-start" /> Syncing
            </Button>
            <Button size="sm" variant="secondary" aria-busy disabled>
                <Spinner size="sm" data-icon="inline-start" /> Fetching logs
            </Button>
            <Button size="icon" variant="ghost" aria-label="Refreshing" aria-busy disabled>
                <Spinner />
            </Button>
            <Badge variant="soft">
                <Spinner data-icon="inline-start" /> building
            </Badge>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" /> Waiting for 3 nodes…
            </span>
        </div>
    );
}
