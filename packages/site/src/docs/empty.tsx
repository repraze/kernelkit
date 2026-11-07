import {Button} from "@repraze/kernelkit/components/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@repraze/kernelkit/components/empty";
import {PlusIcon, ServerOffIcon, UploadCloudIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Empty",
    category: "Feedback",
    description: "What a view shows when there is nothing in it yet, and the action that fills it.",
    demos: [
        {title: "Default", component: Default},
        {
            title: "Outline",
            component: Outline,
            description: '`variant="outline"` draws a dashed border: a drop zone or a slot waiting for content.',
        },
        {title: "Minimal", component: Minimal, description: "Title and description only, for small panels."},
    ],
    props: [
        {component: "Empty", rows: [{name: "variant", type: '"default" | "outline"', default: '"default"'}]},
        {
            component: "EmptyMedia",
            rows: [
                {
                    name: "variant",
                    type: '"default" | "icon"',
                    default: '"default"',
                    description: '"icon" puts the icon in a muted tile.',
                },
            ],
        },
    ],
});

export function Default() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ServerOffIcon />
                </EmptyMedia>
                <EmptyTitle>No nodes registered</EmptyTitle>
                <EmptyDescription>
                    Join a machine to this cluster with <code className="font-mono text-xs">kk node join</code> or
                    provision one.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button>
                        <PlusIcon data-icon="inline-start" /> Provision node
                    </Button>
                    <Button variant="outline">Read the docs</Button>
                </div>
            </EmptyContent>
        </Empty>
    );
}

export function Outline() {
    return (
        <Empty variant="outline" className="max-w-md">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <UploadCloudIcon />
                </EmptyMedia>
                <EmptyTitle>Drop a build artifact</EmptyTitle>
                <EmptyDescription>.tar.gz or .zip, up to 2 GB.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button size="sm" variant="outline">
                    Browse files
                </Button>
            </EmptyContent>
        </Empty>
    );
}

export function Minimal() {
    return (
        <Empty className="max-w-xs">
            <EmptyHeader>
                <EmptyTitle>No logs in this range</EmptyTitle>
                <EmptyDescription>Widen the time window or clear the level filter.</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}
