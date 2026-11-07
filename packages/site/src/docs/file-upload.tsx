import {Button} from "kernelkit/components/button";
import {FileUpload} from "kernelkit/components/file-upload";
import {FileIcon, XIcon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "File Upload",
    category: "Inputs",
    description:
        "Drop zone for files: drag them in, click it, or focus it and press Enter or Space to open the picker.",
    demos: [
        {
            title: "Basic",
            component: Basic,
            layout: "start",
            description:
                "`onChange` gets the dropped or picked files. Drag a file over the zone to see the drop state.",
        },
        {title: "With file list", component: WithList, layout: "start"},
        {
            title: "Loading",
            component: Loading,
            layout: "start",
            description: "`isLoading` shows a spinner and blocks new files.",
        },
        {title: "Disabled", component: Disabled, layout: "start"},
        {
            title: "Custom content",
            component: Custom,
            layout: "start",
            description: "`children` replace the Browse files affordance.",
        },
    ],
    props: [
        {
            component: "FileUpload",
            rows: [
                {name: "onChange", type: "(files: File[]) => void", description: "Never called with an empty list."},
                {name: "accept", type: "string", description: 'Input accept list, e.g. ".json,.yaml" or "image/*".'},
                {name: "multiple", type: "boolean", default: "false"},
                {name: "title", type: "ReactNode", default: '"Upload files"'},
                {name: "description", type: "ReactNode"},
                {name: "isLoading", type: "boolean", default: "false"},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "aria-invalid", type: "boolean", description: "Danger border and ring."},
                {name: "name", type: "string", description: "Name of the hidden file input."},
            ],
        },
    ],
});

export function Basic() {
    return (
        <FileUpload
            className="w-full max-w-md"
            accept=".yaml,.yml,.json"
            description="Kubernetes manifests (.yaml, .json), up to 1 MB."
        />
    );
}

function formatSize(bytes: number) {
    return bytes < 1024
        ? `${bytes} B`
        : bytes < 1024 ** 2
          ? `${(bytes / 1024).toFixed(1)} KB`
          : `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

export function WithList() {
    const [files, setFiles] = React.useState<{name: string; size: number}[]>([
        {name: "nginx-ingress.yaml", size: 4812},
        {name: "postgres-statefulset.yaml", size: 12_604},
    ]);
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <FileUpload
                multiple
                title="Attach config files"
                description="Drop several files at once."
                onChange={(picked) => setFiles((f) => [...f, ...picked.map(({name, size}) => ({name, size}))])}
            />
            <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
                {files.map((file, i) => (
                    <li key={`${file.name}-${i}`} className="flex items-center gap-2 py-1.5 pr-1.5 pl-3 text-sm">
                        <FileIcon className="size-4 text-muted-foreground" />
                        <span className="flex-1 truncate font-mono">{file.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{formatSize(file.size)}</span>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Remove ${file.name}`}
                            onClick={() => setFiles((f) => f.filter((_, j) => j !== i))}
                        >
                            <XIcon />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function Loading() {
    return (
        <FileUpload
            className="w-full max-w-md"
            isLoading
            title="Uploading build-artifacts.tar.gz"
            description="Verifying checksum…"
        />
    );
}

export function Disabled() {
    return (
        <FileUpload
            className="w-full max-w-md"
            disabled
            title="Uploads paused"
            description="The artifact store is in read-only mode during the migration."
        />
    );
}

export function Custom() {
    return (
        <FileUpload className="w-full max-w-md" accept=".pem,.crt" title="Import TLS certificate">
            <p className="font-mono text-xs text-muted-foreground">.pem · .crt</p>
        </FileUpload>
    );
}
