import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@repraze/kernelkit/components/accordion";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Accordion",
    category: "Data display",
    baseUi: "accordion",
    description: "A stack of headings that each expand to reveal a section of content.",
    demos: [
        {title: "Default", component: Default},
        {title: "Outline", component: Outline, description: '`variant="outline"` puts the rows in a bordered panel.'},
        {title: "Multiple", component: Multiple, description: "`multiple` lets several sections stay open."},
        {title: "Disabled item", component: Disabled},
    ],
    props: [
        {
            component: "Accordion",
            rows: [
                {name: "variant", type: '"default" | "outline"', default: '"default"'},
                {name: "multiple", type: "boolean", default: "false", description: "Allow several open items."},
                {name: "defaultValue", type: "any[]", description: "Values of the items open on mount."},
            ],
        },
        {
            component: "AccordionItem",
            rows: [
                {name: "value", type: "any", description: "Identifies the item for `value` / `defaultValue`."},
                {name: "disabled", type: "boolean", default: "false"},
            ],
        },
    ],
});

const FAQ = [
    {
        value: "rollback",
        q: "How do I roll back a deploy?",
        a: "Run `kk deploy rollback <service>`. The previous release is kept warm for 24 hours, so the switch is instant.",
    },
    {
        value: "regions",
        q: "Which regions are available?",
        a: "fra, ams, iad, sjc and sin. Each region runs at least three availability zones.",
    },
    {
        value: "limits",
        q: "What are the default resource limits?",
        a: "2 vCPU and 4 GB per container. Raise them per service in kernel.toml under `resources`.",
    },
];

export function Default() {
    return (
        <Accordion defaultValue={["rollback"]} className="max-w-md">
            {FAQ.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function Outline() {
    return (
        <Accordion variant="outline" defaultValue={["regions"]} className="max-w-md">
            {FAQ.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function Multiple() {
    return (
        <Accordion multiple defaultValue={["rollback", "limits"]} className="max-w-md">
            {FAQ.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function Disabled() {
    return (
        <Accordion variant="outline" className="max-w-md">
            <AccordionItem value="logs">
                <AccordionTrigger>Log retention</AccordionTrigger>
                <AccordionContent>Logs are kept for 30 days, then archived to cold storage.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="sso" disabled>
                <AccordionTrigger>SSO (enterprise plan)</AccordionTrigger>
                <AccordionContent>SAML and OIDC single sign-on.</AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
