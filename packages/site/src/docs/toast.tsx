import {Button} from "kernelkit/components/button";
import {Toaster, useToastManager} from "kernelkit/components/toast";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Toast",
    category: "Overlays",
    baseUi: "toast",
    description:
        "A brief, non-blocking notification in the corner of the screen. Stacks, expands on hover, swipes away.",
    order: 11,
    demos: [
        {title: "Basic", component: Basic},
        {
            title: "Types",
            component: Types,
            description: "`type` picks the icon: success, info, warning, error (alias danger) and loading.",
        },
        {title: "With action", component: WithAction, description: "`actionProps` renders a button, e.g. undo."},
        {
            title: "Promise",
            component: PromiseToast,
            description: "`toast.promise` moves one toast through loading → success / error.",
        },
    ],
    props: [
        {
            component: "Toaster",
            rows: [
                {
                    name: "toastManager",
                    type: "ToastManager",
                    default: "toast",
                    description: "Mount one Toaster at the app root, then call `toast.add()` from anywhere.",
                },
                {name: "timeout", type: "number", default: "5000", description: "ms before auto-dismiss (0 = never)."},
                {name: "limit", type: "number", default: "3", description: "Toasts visible at once."},
            ],
        },
        {
            component: "toast.add(options)",
            rows: [
                {name: "title / description", type: "ReactNode"},
                {name: "type", type: '"success" | "info" | "warning" | "error" | "danger" | "loading"'},
                {
                    name: "actionProps",
                    type: "ButtonProps",
                    description: "Props of the action button (children = label).",
                },
                {name: "timeout", type: "number"},
            ],
        },
    ],
});

function ShowToast() {
    const toast = useToastManager();
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast.add({title: "Deploy queued", description: "api 4.12.0 → production, position 2 in queue."})
            }
        >
            Show toast
        </Button>
    );
}

export function Basic() {
    // In an app: mount <Toaster /> once at the root and call `toast.add()` from anywhere.
    // `toastManager={null}` scopes this demo's toasts to its own Toaster.
    return (
        <Toaster toastManager={null}>
            <ShowToast />
        </Toaster>
    );
}

const TYPES = [
    {type: "success", title: "Deploy complete", description: "api 4.12.0 is live on 6 replicas."},
    {type: "info", title: "Maintenance window", description: "eu-central-1 patches Sunday 02:00 UTC."},
    {type: "warning", title: "Disk at 85%", description: "edge-fra-03 /var/lib/containerd."},
    {type: "error", title: "Build failed", description: "step 4/9: tests exited with code 1."},
];

function TypeButtons() {
    const toast = useToastManager();
    return (
        <div className="flex flex-wrap items-center gap-2">
            {TYPES.map((t) => (
                <Button key={t.type} variant="outline" className="capitalize" onClick={() => toast.add(t)}>
                    {t.type}
                </Button>
            ))}
        </div>
    );
}

export function Types() {
    return (
        <Toaster toastManager={null}>
            <TypeButtons />
        </Toaster>
    );
}

function UndoButton() {
    const toast = useToastManager();
    return (
        <Button
            variant="outline"
            onClick={() => {
                const id = toast.add({
                    title: "Node cordoned",
                    description: "edge-fra-03 takes no new pods.",
                    actionProps: {
                        children: "Undo",
                        onClick: () => {
                            toast.close(id);
                            toast.add({type: "success", title: "Node uncordoned"});
                        },
                    },
                });
            }}
        >
            Cordon node
        </Button>
    );
}

export function WithAction() {
    return (
        <Toaster toastManager={null}>
            <UndoButton />
        </Toaster>
    );
}

function PromiseButtons() {
    const toast = useToastManager();
    const run = (ok: boolean) =>
        toast.promise(new Promise((resolve, reject) => setTimeout(ok ? resolve : reject, 2000)), {
            loading: {title: "Running migrations…", description: "0042_add_index_events_ts"},
            success: {title: "Migrations applied", description: "1 migration in 812ms."},
            error: {title: "Migration failed", description: "lock timeout on table events."},
        });
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => run(true)}>
                Migrate
            </Button>
            <Button variant="outline" onClick={() => run(false).catch(() => {})}>
                Migrate (fails)
            </Button>
        </div>
    );
}

export function PromiseToast() {
    return (
        <Toaster toastManager={null}>
            <PromiseButtons />
        </Toaster>
    );
}
