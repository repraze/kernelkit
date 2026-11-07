import {
    AsideTitle,
    Blockquote,
    InlineCode,
    Lead,
    List,
    Muted,
    Text,
    TextLink,
    Title,
    TitleAnchor,
} from "kernelkit/components/typography";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Typography",
    category: "Foundations",
    description:
        "Headings in the heading font, prose in the sans. Visual size is separate from the element: pick the tag with `render`.",
    order: 3,
    demos: [
        {title: "Title scale", component: Scale, layout: "start"},
        {
            title: "Subtitle",
            component: Subtitle,
            layout: "start",
            description: '`variant="subtitle"`: muted, regular weight.',
        },
        {
            title: "Anchored heading",
            component: Anchored,
            layout: "start",
            description: "`render={<h2 id=… />}` sets the element; `TitleAnchor` links to it.",
        },
        {title: "Prose", component: Prose, layout: "start"},
        {title: "Links", component: Links, layout: "start"},
    ],
    props: [
        {
            component: "Title",
            rows: [
                {name: "size", type: "1 | 2 | 3 | 4 | 5 | 6", default: "1", description: "Visual size only."},
                {name: "variant", type: '"title" | "subtitle"', default: '"title"'},
                {name: "render", type: "ReactElement", default: "<p />", description: "e.g. <h1 />, <h2 id=… />."},
            ],
        },
        {
            component: "TextLink",
            rows: [
                {
                    name: "variant",
                    type: '"muted" | "prose"',
                    default: '"muted"',
                    description: "muted: nav and footer links. prose: underlined accent link inside text.",
                },
            ],
        },
        {
            component: "Text · Lead · Muted · InlineCode · Blockquote · List · AsideTitle",
            rows: [
                {name: "render", type: "ReactElement", description: "Every part accepts render to swap its element."},
            ],
        },
    ],
});

export function Scale() {
    return (
        <div className="flex flex-col gap-4">
            {([1, 2, 3, 4, 5, 6] as const).map((size) => (
                <div key={size} className="grid grid-cols-[2rem_1fr] items-baseline gap-4">
                    <span className="font-mono text-xs text-muted-foreground">{size}</span>
                    <Title size={size} render={<div />}>
                        Cluster overview
                    </Title>
                </div>
            ))}
        </div>
    );
}

export function Subtitle() {
    return (
        <div className="flex flex-col gap-2">
            <Title size={2} render={<h2 />}>
                Deployments
            </Title>
            <Title size={4} variant="subtitle">
                Every release across 3 regions, newest first.
            </Title>
        </div>
    );
}

export function Anchored() {
    return (
        <Title size={3} render={<h2 id="rolling-restarts" />}>
            Rolling restarts
            <TitleAnchor href="#rolling-restarts" />
        </Title>
    );
}

export function Prose() {
    return (
        <article className="flex max-w-prose flex-col gap-4">
            <Title size={2} render={<h1 />}>
                Scheduling
            </Title>
            <Lead>How the scheduler places workloads on nodes, and how to steer it.</Lead>
            <Text>
                Each pending process is scored against every healthy node. The highest score wins; ties go to the node
                with the most free memory. Set <InlineCode>affinity</InlineCode> to pin a workload to a label.
            </Text>
            <AsideTitle render={<h3 />}>Scoring inputs</AsideTitle>
            <List>
                <li>Free CPU and memory after reservations</li>
                <li>Spread across failure domains</li>
                <li>Image already cached on the node</li>
            </List>
            <Blockquote>
                A process that cannot be placed stays pending; it is never placed on a draining node.
            </Blockquote>
            <Muted>Last updated for scheduler v2.14.</Muted>
        </article>
    );
}

export function Links() {
    return (
        <div className="flex flex-col gap-3">
            <nav className="flex gap-4 text-sm">
                <TextLink href="#links">Status</TextLink>
                <TextLink href="#links">Changelog</TextLink>
                <TextLink href="#links">API</TextLink>
            </nav>
            <Text>
                See the{" "}
                <TextLink variant="prose" href="#links">
                    node lifecycle guide
                </TextLink>{" "}
                before draining a node in production.
            </Text>
        </div>
    );
}
