import {
    Attachment,
    AttachmentAction,
    AttachmentActions,
    AttachmentContent,
    AttachmentDescription,
    AttachmentGroup,
    AttachmentMedia,
    AttachmentTitle,
    AttachmentTrigger,
} from "@repraze/kernelkit/components/attachment";
import {Spinner} from "@repraze/kernelkit/components/spinner";
import {
    AlertTriangleIcon,
    FileCodeIcon,
    FileJsonIcon,
    FileTextIcon,
    ImageIcon,
    PaperclipIcon,
    RotateCcwIcon,
    XIcon,
} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Attachment",
    category: "Chat",
    description: "A file attached to a prompt or a reply: icon or thumbnail, name, meta, and upload state.",
    order: 4,
    demos: [
        {title: "Basic", component: Basic},
        {
            title: "States",
            component: States,
            layout: "start",
            description:
                "`idle` is a dashed drop slot, `uploading`/`processing` shimmer the title, `error` turns the card danger.",
        },
        {title: "Sizes", component: Sizes, layout: "start"},
        {
            title: "Vertical",
            component: Vertical,
            layout: "start",
            description: "Thumbnail cards for images; actions float over the media.",
        },
        {
            title: "Clickable",
            component: Clickable,
            description: "An AttachmentTrigger covers the card: hover wash and keyboard ring on the whole card.",
        },
        {
            title: "Group",
            component: Group,
            layout: "start",
            description: "A horizontal, snap-scrolling row, as above a prompt input.",
        },
    ],
    props: [
        {
            component: "Attachment",
            rows: [
                {
                    name: "state",
                    type: '"idle" | "uploading" | "processing" | "error" | "done"',
                    default: '"done"',
                },
                {name: "size", type: '"default" | "sm" | "xs"', default: '"default"'},
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
            ],
        },
        {
            component: "AttachmentMedia",
            rows: [
                {
                    name: "variant",
                    type: '"icon" | "image"',
                    default: '"icon"',
                    description: "`image` crops an `<img>` to the square and dims it while uploading.",
                },
            ],
        },
        {
            component: "AttachmentAction",
            rows: [
                {
                    name: "variant / size",
                    type: "Button props",
                    default: '"ghost" / "icon-xs"',
                    description: "A Button; give it an `aria-label`.",
                },
            ],
        },
    ],
});

// A small inline SVG stands in for a screenshot thumbnail.
const thumb = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#1e293b"/><rect x="10" y="14" width="76" height="8" rx="2" fill="#38bdf8"/><rect x="10" y="30" width="52" height="6" rx="2" fill="#94a3b8"/><rect x="10" y="42" width="64" height="6" rx="2" fill="#94a3b8"/><rect x="10" y="54" width="40" height="6" rx="2" fill="#f472b6"/><rect x="10" y="66" width="58" height="6" rx="2" fill="#94a3b8"/></svg>`,
)}`;

export function Basic() {
    return (
        <Attachment>
            <AttachmentMedia>
                <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
                <AttachmentTitle>api-7f9c-crash.log</AttachmentTitle>
                <AttachmentDescription>Log · 48 KB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
                <AttachmentAction aria-label="Remove">
                    <XIcon />
                </AttachmentAction>
            </AttachmentActions>
        </Attachment>
    );
}

export function States() {
    return (
        <div className="flex max-w-xl flex-wrap gap-3">
            <Attachment state="idle">
                <AttachmentMedia>
                    <PaperclipIcon />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>Drop a file</AttachmentTitle>
                    <AttachmentDescription>.log, .json, .yaml up to 10 MB</AttachmentDescription>
                </AttachmentContent>
            </Attachment>
            <Attachment state="uploading">
                <AttachmentMedia>
                    <Spinner />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>heap-snapshot.json</AttachmentTitle>
                    <AttachmentDescription>Uploading · 62%</AttachmentDescription>
                </AttachmentContent>
            </Attachment>
            <Attachment state="processing">
                <AttachmentMedia>
                    <FileJsonIcon />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>openapi.json</AttachmentTitle>
                    <AttachmentDescription>Indexing 214 endpoints</AttachmentDescription>
                </AttachmentContent>
            </Attachment>
            <Attachment state="error">
                <AttachmentMedia>
                    <AlertTriangleIcon />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>core-dump.tar.gz</AttachmentTitle>
                    <AttachmentDescription>Too large: 2.1 GB, max 10 MB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                    <AttachmentAction aria-label="Retry">
                        <RotateCcwIcon />
                    </AttachmentAction>
                </AttachmentActions>
            </Attachment>
            <Attachment state="done">
                <AttachmentMedia>
                    <FileCodeIcon />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>worker.ts</AttachmentTitle>
                    <AttachmentDescription>TypeScript · 6 KB</AttachmentDescription>
                </AttachmentContent>
            </Attachment>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex flex-col items-start gap-3">
            {(["default", "sm", "xs"] as const).map((size) => (
                <Attachment key={size} size={size}>
                    <AttachmentMedia>
                        <FileTextIcon />
                    </AttachmentMedia>
                    <AttachmentContent>
                        <AttachmentTitle>deploy-{size}.yaml</AttachmentTitle>
                        {size !== "xs" && <AttachmentDescription>YAML · 2 KB</AttachmentDescription>}
                    </AttachmentContent>
                    <AttachmentActions>
                        <AttachmentAction aria-label="Remove">
                            <XIcon />
                        </AttachmentAction>
                    </AttachmentActions>
                </Attachment>
            ))}
        </div>
    );
}

export function Vertical() {
    return (
        <div className="flex flex-wrap items-start gap-3">
            <Attachment orientation="vertical">
                <AttachmentMedia variant="image">
                    <img src={thumb} alt="" />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>grafana-p99.png</AttachmentTitle>
                    <AttachmentDescription>PNG · 184 KB</AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                    <AttachmentAction aria-label="Remove">
                        <XIcon />
                    </AttachmentAction>
                </AttachmentActions>
            </Attachment>
            <Attachment orientation="vertical" state="uploading">
                <AttachmentMedia variant="image">
                    <img src={thumb} alt="" />
                </AttachmentMedia>
                <AttachmentContent>
                    <AttachmentTitle>trace-view.png</AttachmentTitle>
                    <AttachmentDescription>Uploading</AttachmentDescription>
                </AttachmentContent>
            </Attachment>
            <Attachment orientation="vertical">
                <AttachmentMedia>
                    <ImageIcon />
                </AttachmentMedia>
            </Attachment>
        </div>
    );
}

export function Clickable() {
    return (
        <Attachment>
            <AttachmentTrigger aria-label="Preview api-7f9c-crash.log" />
            <AttachmentMedia>
                <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
                <AttachmentTitle>api-7f9c-crash.log</AttachmentTitle>
                <AttachmentDescription>Click to preview</AttachmentDescription>
            </AttachmentContent>
        </Attachment>
    );
}

export function Group() {
    const files = ["worker.ts", "queue.ts", "retry-policy.ts", "worker.test.ts", "tsconfig.json", "package.json"];
    return (
        <AttachmentGroup className="w-full max-w-lg">
            {files.map((name) => (
                <Attachment key={name} size="sm">
                    <AttachmentMedia>
                        <FileCodeIcon />
                    </AttachmentMedia>
                    <AttachmentContent>
                        <AttachmentTitle>{name}</AttachmentTitle>
                        <AttachmentDescription>src/queue</AttachmentDescription>
                    </AttachmentContent>
                </Attachment>
            ))}
        </AttachmentGroup>
    );
}
