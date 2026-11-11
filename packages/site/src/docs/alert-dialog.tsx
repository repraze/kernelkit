import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@repraze/kernelkit/components/alert-dialog";
import {Button} from "@repraze/kernelkit/components/button";
import {PowerIcon, RotateCcwIcon, Trash2Icon} from "lucide-react";

import {baseUi, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Alert Dialog",
    category: "Overlays",
    source: baseUi("alert-dialog"),
    description: "A modal confirmation that interrupts the user. It does not close on outside click.",
    order: 2,
    demos: [
        {title: "Basic", component: Basic},
        {
            title: "Destructive",
            component: Destructive,
            description:
                "Action and cancel take Button `variant` and `color`. Pair danger with an icon, not color alone.",
        },
        {
            title: "Small",
            component: Small,
            description: '`size="sm"` centers the content and splits the footer into two equal buttons.',
        },
    ],
    props: [
        {
            component: "AlertDialogContent",
            rows: [{name: "size", type: '"default" | "sm"', default: '"default"'}],
        },
        {
            component: "AlertDialogMedia",
            rows: [
                {
                    name: "color",
                    type: "Color",
                    description: "Tints the icon tile: tint surface, colored icon and border.",
                },
            ],
        },
        {
            component: "AlertDialogAction",
            rows: [
                {
                    name: "variant / color / size",
                    type: "Button props",
                    default: '"solid" / primary',
                    description: "A plain Button: close the dialog yourself once the action succeeds.",
                },
            ],
        },
        {
            component: "AlertDialogCancel",
            rows: [
                {
                    name: "variant / color / size",
                    type: "Button props",
                    default: '"outline"',
                    description: "Closes the dialog.",
                },
            ],
        },
    ],
});

export function Basic() {
    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
                <RotateCcwIcon data-icon="inline-start" /> Roll back
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Roll back to 4.11.3?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Traffic shifts back to the previous release. Migrations applied by 4.12.0 stay in place.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Roll back</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function Destructive() {
    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
                <Trash2Icon data-icon="inline-start" /> Delete cluster
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia color="danger">
                        <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete prod-eu?</AlertDialogTitle>
                    <AlertDialogDescription>
                        12 nodes, 3 volumes and every snapshot are destroyed. This cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep cluster</AlertDialogCancel>
                    <AlertDialogAction color="danger">Delete cluster</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export function Small() {
    return (
        <AlertDialog>
            <AlertDialogTrigger render={<Button variant="secondary" />}>
                <PowerIcon data-icon="inline-start" /> Restart node
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia color="warning">
                        <PowerIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Restart edge-fra-03?</AlertDialogTitle>
                    <AlertDialogDescription>Open connections drop for about 20 seconds.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction color="warning">Restart</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
