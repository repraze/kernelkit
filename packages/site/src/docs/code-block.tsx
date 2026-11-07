import {
    CodeBlock,
    CodeBlockActions,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFooter,
    CodeBlockHeader,
    CodeBlockLine,
    CodeBlockTitle,
} from "kernelkit/components/code-block";
import {useHighlightedCode} from "kernelkit/hooks/use-highlighted-code";
import {FileCodeIcon, TerminalIcon, TriangleAlertIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Code block",
    category: "Data display",
    description: "Monospaced, scrollable code with a header, copy action, line numbers and Shiki highlighting.",
    demos: [
        {title: "Highlighted", component: Highlighted, layout: "full"},
        {title: "Line numbers", component: LineNumbers, layout: "full"},
        {
            title: "Diff lines",
            component: Diff,
            layout: "full",
            description: "`CodeBlockLine` variants: added, removed, highlighted.",
        },
        {
            title: "Floating actions",
            component: Floating,
            layout: "full",
            description: "Without a header, `CodeBlockActions` floats top-right and shows on hover or focus.",
        },
        {title: "Danger and small", component: DangerSmall, layout: "full"},
    ],
    props: [
        {
            component: "CodeBlock",
            rows: [
                {
                    name: "variant",
                    type: '"default" | "danger"',
                    default: '"default"',
                    description: '"destructive" is an alias.',
                },
                {name: "size", type: '"default" | "sm"', default: '"default"'},
            ],
        },
        {
            component: "CodeBlockContent",
            rows: [
                {name: "lineNumbers", type: "boolean", default: "false", description: "Counter per CodeBlockLine."},
                {name: "startLine", type: "number", default: "1"},
                {name: "wrap", type: "boolean", default: "false", description: "Wrap long lines instead of scrolling."},
            ],
        },
        {
            component: "CodeBlockLine",
            rows: [{name: "variant", type: '"default" | "added" | "removed" | "highlighted"', default: '"default"'}],
        },
        {
            component: "useHighlightedCode(code, language)",
            rows: [
                {
                    name: "returns",
                    type: "ReactNode[]",
                    description:
                        "One node per line. Colors are --kk-code-* variables mapped to Termicolor syntax roles, so they follow the theme without re-highlighting.",
                },
            ],
        },
    ],
});

const DEPLOY = `import {deploy} from "@kernel/sdk";

// Roll out to every region, one at a time.
export async function release(tag: string) {
    for (const region of ["fra", "iad", "sin"]) {
        const result = await deploy({service: "api", tag, region, canary: 0.1});
        if (!result.healthy) throw new Error(\`rollback in \${region}\`);
    }
}`;

export function Highlighted() {
    const lines = useHighlightedCode(DEPLOY, "ts");
    return (
        <div className="w-full min-w-0 p-6">
            <CodeBlock>
                <CodeBlockHeader>
                    <CodeBlockTitle>
                        <FileCodeIcon />
                        release.ts
                    </CodeBlockTitle>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value={DEPLOY} />
                    </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent>
                    {lines.map((line, i) => (
                        <CodeBlockLine key={i}>{line}</CodeBlockLine>
                    ))}
                </CodeBlockContent>
            </CodeBlock>
        </div>
    );
}

const CONFIG = `service:
  name: api
  replicas: 3

resources:
  cpu: "2"
  memory: 4Gi`;

export function LineNumbers() {
    const lines = useHighlightedCode(CONFIG, "yaml");
    return (
        <div className="w-full min-w-0 p-6">
            <CodeBlock>
                <CodeBlockHeader>
                    <CodeBlockTitle>kernel.yaml</CodeBlockTitle>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value={CONFIG} />
                    </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent lineNumbers>
                    {lines.map((line, i) => (
                        <CodeBlockLine key={i}>{line}</CodeBlockLine>
                    ))}
                </CodeBlockContent>
            </CodeBlock>
        </div>
    );
}

export function Diff() {
    return (
        <div className="w-full min-w-0 p-6">
            <CodeBlock>
                <CodeBlockHeader>
                    <CodeBlockTitle>deploy.yaml</CodeBlockTitle>
                </CodeBlockHeader>
                <CodeBlockContent lineNumbers startLine={12}>
                    <CodeBlockLine>spec:</CodeBlockLine>
                    <CodeBlockLine variant="removed">{"  replicas: 2"}</CodeBlockLine>
                    <CodeBlockLine variant="added">{"  replicas: 4"}</CodeBlockLine>
                    <CodeBlockLine variant="highlighted">{"  strategy: RollingUpdate"}</CodeBlockLine>
                    <CodeBlockLine>{"  maxSurge: 25%"}</CodeBlockLine>
                </CodeBlockContent>
            </CodeBlock>
        </div>
    );
}

const INSTALL = "npm install kernelkit @base-ui/react";

export function Floating() {
    return (
        <div className="w-full min-w-0 p-6">
            <CodeBlock>
                <CodeBlockActions>
                    <CodeBlockCopyButton value={INSTALL} />
                </CodeBlockActions>
                <CodeBlockContent>
                    <CodeBlockLine>
                        <span className="text-muted-foreground">$ </span>
                        {INSTALL}
                    </CodeBlockLine>
                </CodeBlockContent>
            </CodeBlock>
        </div>
    );
}

export function DangerSmall() {
    return (
        <div className="flex w-full min-w-0 flex-col gap-4 p-6">
            <CodeBlock variant="danger">
                <CodeBlockHeader>
                    <CodeBlockTitle>
                        <TriangleAlertIcon />
                        stderr
                    </CodeBlockTitle>
                </CodeBlockHeader>
                <CodeBlockContent>
                    <CodeBlockLine>Error: connect ECONNREFUSED 10.0.4.12:5432</CodeBlockLine>
                    <CodeBlockLine>{"    at TCPConnectWrap.afterConnect (node:net:1595:16)"}</CodeBlockLine>
                </CodeBlockContent>
            </CodeBlock>
            <CodeBlock size="sm">
                <CodeBlockHeader>
                    <CodeBlockTitle>
                        <TerminalIcon />
                        shell
                    </CodeBlockTitle>
                    <CodeBlockActions>
                        <CodeBlockCopyButton value="kk logs api --follow" />
                    </CodeBlockActions>
                </CodeBlockHeader>
                <CodeBlockContent>kk logs api --follow</CodeBlockContent>
                <CodeBlockFooter>Streams until Ctrl+C</CodeBlockFooter>
            </CodeBlock>
        </div>
    );
}
