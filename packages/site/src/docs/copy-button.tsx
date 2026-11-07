import {CopyButton} from "kernelkit/components/copy-button";
import {InputGroup, InputGroupAddon, InputGroupInput} from "kernelkit/components/input-group";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Copy Button",
    category: "Actions",
    description:
        "Copies a value to the clipboard and confirms with a check for two seconds, announced to screen readers.",
    order: 5,
    demos: [
        {title: "Icon", component: Icon},
        {title: "Sizes", component: Sizes, description: "Same sizes as Button: icon-xs, icon-sm, icon, icon-lg."},
        {title: "With label", component: WithLabel, description: "Pass children for a text button."},
        {title: "In an input group", component: InInputGroup},
    ],
    props: [
        {
            component: "CopyButton",
            rows: [
                {name: "value", type: "string | () => string", description: "Read at click time when a function."},
                {name: "onCopy", type: "(value: string) => void", description: "After a successful write."},
                {name: "timeout", type: "number", default: "2000", description: "How long the check shows (ms)."},
                {name: "label / copiedLabel", type: "string", default: '"Copy to clipboard" / "Copied"'},
                {name: "variant / color / size", type: "Button props", default: '"ghost" / - / "icon"'},
            ],
        },
    ],
});

export function Icon() {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-background py-1 pr-1 pl-3 font-mono text-sm">
            <span>kubectl rollout restart deploy/api</span>
            <CopyButton value="kubectl rollout restart deploy/api" size="icon-sm" />
        </div>
    );
}

export function Sizes() {
    return (
        <div className="flex items-center gap-2">
            <CopyButton value="sha256:9f86d081" size="icon-xs" />
            <CopyButton value="sha256:9f86d081" size="icon-sm" />
            <CopyButton value="sha256:9f86d081" />
            <CopyButton value="sha256:9f86d081" size="icon-lg" />
            <CopyButton value="sha256:9f86d081" variant="outline" />
        </div>
    );
}

export function WithLabel() {
    return (
        <div className="flex items-center gap-2">
            <CopyButton value="ssh deploy@10.0.4.12" variant="outline" size="sm">
                Copy SSH
            </CopyButton>
            <CopyButton value="ssh deploy@10.0.4.12" variant="outline">
                Copy command
            </CopyButton>
        </div>
    );
}

export function InInputGroup() {
    return (
        <InputGroup className="max-w-sm">
            <InputGroupInput readOnly defaultValue="kk_live_4f9a2c7e1b" className="font-mono" aria-label="API token" />
            <InputGroupAddon align="inline-end">
                <CopyButton value="kk_live_4f9a2c7e1b" size="icon-xs" />
            </InputGroupAddon>
        </InputGroup>
    );
}
