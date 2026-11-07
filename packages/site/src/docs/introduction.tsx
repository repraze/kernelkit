import {Badge} from "kernelkit/components/badge";
import {Button} from "kernelkit/components/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "kernelkit/components/card";

import {Code, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Introduction",
    category: "Foundations",
    description:
        "Kernelkit is a React component library on Base UI, Tailwind v4 and the Termicolor palette. Every shadcn component, restyled, themed by CSS variables.",
    order: 0,
    demos: [{title: "At a glance", component: Glance}],
    notes: Notes,
});

export function Glance() {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>kernel.sys</CardTitle>
                <CardDescription>One accent, crisp lines, every state readable in high contrast.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                <Button>Boot</Button>
                <Button variant="outline">Logs</Button>
                <Badge variant="secondary">v0.1.0</Badge>
            </CardContent>
        </Card>
    );
}

function Notes() {
    return (
        <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-3">
                <h2 className="font-mono text-xl font-semibold">Install the package</h2>
                <Code language="bash" code="npm install kernelkit @base-ui/react" />
                <p className="text-sm text-muted-foreground">
                    Import the styles once, after Tailwind, in your app stylesheet:
                </p>
                <Code language="css" title="app.css" code={'@import "tailwindcss";\n@import "kernelkit/styles.css";'} />
            </section>
            <section className="flex flex-col gap-3">
                <h2 className="font-mono text-xl font-semibold">Or own the code: shadcn CLI</h2>
                <p className="text-sm text-muted-foreground">
                    Kernelkit is also a shadcn registry. Components install as source into your app, imports rewritten
                    to your aliases, dependencies (recipes, color axis, tokens, other components) pulled in
                    automatically. Edit them freely. Add the registry to{" "}
                    <code className="font-mono text-foreground">components.json</code>:
                </p>
                <Code
                    language="json"
                    title="components.json"
                    code={`{
    "registries": {
        "@kernelkit": "https://repraze.github.io/kernelkit/r/{name}.json"
    }
}`}
                />
                <Code
                    language="bash"
                    code={`npx shadcn@latest add @kernelkit/styles @kernelkit/theme-provider
npx shadcn@latest add @kernelkit/button @kernelkit/select @kernelkit/data-table`}
                />
                <p className="text-sm text-muted-foreground">
                    <code className="font-mono text-foreground">@kernelkit/styles</code> writes{" "}
                    <code className="font-mono text-foreground">styles/kernelkit.css</code> (every token in one file);
                    import it after Tailwind. Package and registry are built from the same source, so you can start with
                    the package and eject a component later.
                </p>
            </section>
            <section className="flex flex-col gap-3">
                <h2 className="font-mono text-xl font-semibold">Provider</h2>
                <p className="text-sm text-muted-foreground">
                    Wrap the app in <code className="font-mono text-foreground">ThemeProvider</code>, and add{" "}
                    <code className="font-mono text-foreground">ThemeScript</code> to the document head so the stored
                    theme applies before first paint.
                </p>
                <Code
                    code={`import {ThemeProvider, ThemeScript} from "kernelkit/provider";
import {Button} from "kernelkit/components/button";

export function App() {
    return (
        <ThemeProvider defaultTheme={{accent: "pink", radius: "md"}}>
            <Button>Boot</Button>
        </ThemeProvider>
    );
}`}
                />
            </section>
            <section className="flex flex-col gap-3">
                <h2 className="font-mono text-xl font-semibold">Principles</h2>
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted-foreground">
                    <li>Tokens only: components use roles (primary, muted, border…), never raw colors.</li>
                    <li>State is a fill, an indicator line or a border, never a surface shade alone.</li>
                    <li>Every variant is a cva map you can extend; every part has a data-slot.</li>
                    <li>Wrap, don&apos;t fork: compose with className and render instead of editing the lib.</li>
                </ul>
            </section>
        </div>
    );
}
