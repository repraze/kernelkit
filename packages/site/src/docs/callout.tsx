import {Callout} from "@repraze/kernelkit/components/callout";
import {InlineCode} from "@repraze/kernelkit/components/typography";
import {HUES} from "@repraze/kernelkit/lib/color";
import {CircleAlertIcon, InfoIcon, LightbulbIcon, NotebookPenIcon, TriangleAlertIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Callout",
    category: "Feedback",
    description:
        "An aside in long-form content (docs, changelogs, blog posts): a note, tip or warning marked by an accent pill on its left edge, like a current sidebar row. For app status use Alert.",
    demos: [
        {title: "Default", component: Default},
        {title: "Status colors", component: Statuses, layout: "start"},
        {
            title: "Collapsible",
            component: CollapsibleDemo,
            description: "`collapsible` turns the header into a toggle; `defaultCollapsed` starts it closed.",
        },
        {title: "Body only", component: BodyOnly, description: "Without `title` or `icon` the header is omitted."},
        {title: "Hues", component: Hues, layout: "start"},
    ],
    props: [
        {
            component: "Callout",
            rows: [
                {
                    name: "color",
                    type: '"neutral" | "primary" | "danger" | "warning" | "success" | "info" | Hue',
                    default: '"neutral"',
                },
                {name: "title", type: "ReactNode", description: "Header label, in the heading font."},
                {name: "icon", type: "ReactNode", description: "Leading icon element, e.g. <InfoIcon />."},
                {name: "collapsible", type: "boolean", default: "false", description: "Needs a title or icon."},
                {name: "defaultCollapsed", type: "boolean", default: "false"},
            ],
        },
    ],
});

export function Default() {
    return (
        <Callout title="Note" icon={<NotebookPenIcon />} className="max-w-xl">
            The scheduler re-reads <InlineCode>cluster.toml</InlineCode> on SIGHUP. No restart is needed for quota
            changes.
        </Callout>
    );
}

export function Statuses() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-3">
            <Callout color="info" title="Info" icon={<InfoIcon />}>
                Snapshots are incremental: only blocks changed since the previous snapshot are uploaded.
            </Callout>
            <Callout color="success" title="Tip" icon={<LightbulbIcon />}>
                Pin the image digest instead of a tag to make rollbacks deterministic.
            </Callout>
            <Callout color="warning" title="Warning" icon={<TriangleAlertIcon />}>
                Changing <InlineCode>replicas</InlineCode> on a stateful set reschedules pods one at a time.
            </Callout>
            <Callout color="danger" title="Danger" icon={<CircleAlertIcon />}>
                <p>
                    <InlineCode>kk volume purge</InlineCode> deletes data on every node. There is no undo.
                </p>
                <p>
                    Take a snapshot first, see <a href="#statuses">backups</a>.
                </p>
            </Callout>
        </div>
    );
}

export function CollapsibleDemo() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-3">
            <Callout collapsible color="info" title="How leader election works" icon={<InfoIcon />}>
                Each node holds a lease in etcd. When the leader misses three renewals, the lowest-id follower with a
                current log takes over.
            </Callout>
            <Callout collapsible defaultCollapsed title="Full error output" icon={<NotebookPenIcon />}>
                <pre className="font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                    error: connect ECONNREFUSED 10.0.3.12:5432{"\n"} at TCPConnectWrap.afterConnect
                </pre>
            </Callout>
        </div>
    );
}

export function BodyOnly() {
    return (
        <Callout color="primary" className="max-w-xl">
            Since v3.0, every endpoint accepts an <InlineCode>Idempotency-Key</InlineCode> header.
        </Callout>
    );
}

export function Hues() {
    return (
        <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
            {HUES.map((hue) => (
                <Callout key={hue} color={hue} title={hue} icon={<InfoIcon />} />
            ))}
        </div>
    );
}
