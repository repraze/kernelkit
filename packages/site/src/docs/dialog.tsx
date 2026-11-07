import {Button} from "@repraze/kernelkit/components/button";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repraze/kernelkit/components/dialog";
import {Field, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";
import {PencilIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Dialog",
    category: "Overlays",
    baseUi: "dialog",
    description: "A modal window over the page for a focused task: a short form, a detail view, a choice.",
    order: 1,
    demos: [
        {title: "Form", component: FormDialog},
        {
            title: "Sizes",
            component: Sizes,
            description: "`size` sets the max width from the `sm` breakpoint up; below it the dialog spans the screen.",
        },
        {
            title: "Scrollable body",
            component: Scrollable,
            description: "Header and footer stay put; `DialogBody` scrolls.",
        },
        {
            title: "Without close button",
            component: NoCloseButton,
            description:
                "`showCloseButton={false}` drops the corner X; `DialogFooter showCloseButton` adds a Close button.",
        },
    ],
    props: [
        {
            component: "DialogContent",
            rows: [
                {
                    name: "size",
                    type: '"sm" | "default" | "lg" | "xl"',
                    default: '"default"',
                    description: "Max width: xs, sm, lg, 2xl.",
                },
                {
                    name: "showCloseButton",
                    type: "boolean",
                    default: "true",
                    description: "Ghost X in the top-right corner.",
                },
            ],
        },
        {
            component: "DialogFooter",
            rows: [
                {
                    name: "showCloseButton",
                    type: "boolean",
                    default: "false",
                    description: "Appends an outline Close button.",
                },
            ],
        },
        {
            component: "Dialog",
            rows: [
                {name: "open / onOpenChange", type: "boolean / (open) => void", description: "Controlled state."},
                {name: "modal", type: 'boolean | "trap-focus"', default: "true"},
            ],
        },
    ],
});

export function FormDialog() {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
                <PencilIcon data-icon="inline-start" /> Rename node
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename node</DialogTitle>
                    <DialogDescription>The hostname is used in logs, metrics and the cluster map.</DialogDescription>
                </DialogHeader>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="node-name">Hostname</FieldLabel>
                        <Input id="node-name" defaultValue="edge-fra-03" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="node-zone">Zone</FieldLabel>
                        <Input id="node-zone" defaultValue="eu-central-1b" />
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                    <Button>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {(["sm", "default", "lg", "xl"] as const).map((size) => (
                <Dialog key={size}>
                    <DialogTrigger render={<Button variant="outline" />}>{size}</DialogTrigger>
                    <DialogContent size={size}>
                        <DialogHeader>
                            <DialogTitle>Cluster quota</DialogTitle>
                            <DialogDescription>
                                prod-eu is using 46 of 64 vCPU and 182 of 256 GiB memory across 12 nodes.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter showCloseButton />
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    );
}

const LOG = [
    "pulling image registry.internal/api:4.12.0",
    "image pulled in 3.2s (148 MB)",
    "running migrations: 0042_add_index_events_ts",
    "migration applied in 812ms",
    "starting 6 replicas on pool general-purpose",
    "replica api-7f9c-1 ready",
    "replica api-7f9c-2 ready",
    "replica api-7f9c-3 ready",
    "replica api-7f9c-4 ready",
    "replica api-7f9c-5 ready",
    "replica api-7f9c-6 ready",
    "health check /healthz passed (6/6)",
    "shifting traffic 10% → 50% → 100%",
    "draining previous release 4.11.3",
    "deploy #1284 complete in 2m 41s",
];

export function Scrollable() {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>View deploy log</DialogTrigger>
            <DialogContent size="lg">
                <DialogHeader>
                    <DialogTitle>Deploy #1284</DialogTitle>
                    <DialogDescription>api · production · triggered by ci-bot</DialogDescription>
                </DialogHeader>
                <DialogBody className="-mx-4 max-h-64 overflow-y-auto border-y border-border bg-background px-4 py-3">
                    <ol className="flex flex-col gap-1 font-mono text-xs">
                        {LOG.map((line, i) => (
                            <li key={line} className="flex gap-3">
                                <span className="text-muted-foreground tabular-nums">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ol>
                </DialogBody>
                <DialogFooter className="-mt-4 border-t-0">
                    <Button variant="outline">Download</Button>
                    <DialogClose render={<Button />}>Done</DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function NoCloseButton() {
    return (
        <Dialog>
            <DialogTrigger render={<Button variant="secondary" />}>Show API token</DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Token created</DialogTitle>
                    <DialogDescription>Copy it now: it will not be shown again.</DialogDescription>
                </DialogHeader>
                <Input readOnly value="kk_live_9f3a1c7e2b8d4f60a5e1" className="font-mono" />
                <DialogFooter showCloseButton />
            </DialogContent>
        </Dialog>
    );
}
