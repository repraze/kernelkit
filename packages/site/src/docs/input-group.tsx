import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "kernelkit/components/input-group";
import {Kbd} from "kernelkit/components/kbd";
import {Spinner} from "kernelkit/components/spinner";
import {ArrowUpIcon, GlobeIcon, SearchIcon, XIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Input Group",
    category: "Inputs",
    description:
        "An input with icons, text, buttons or kbd hints inside the same field. The whole group rings on focus.",
    order: 3,
    demos: [
        {title: "Icon", component: Icon},
        {title: "Text addons", component: TextAddons},
        {title: "Buttons", component: Buttons},
        {title: "Sizes", component: Sizes},
        {title: "Textarea with toolbar", component: WithTextarea, description: "Block addons stack above or below."},
        {title: "States", component: States, description: "Loading, disabled and invalid."},
    ],
    props: [
        {component: "InputGroup", rows: [{name: "size", type: '"sm" | "default" | "lg"', default: '"default"'}]},
        {
            component: "InputGroupAddon",
            rows: [
                {
                    name: "align",
                    type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
                    default: '"inline-start"',
                    description: "Clicking an addon focuses the control.",
                },
            ],
        },
        {
            component: "InputGroupButton",
            rows: [
                {name: "size", type: '"xs" | "sm" | "icon-xs" | "icon-sm"', default: '"xs"'},
                {name: "variant", type: "Button variant", default: '"ghost"'},
            ],
        },
    ],
});

export function Icon() {
    return (
        <InputGroup className="max-w-sm">
            <InputGroupInput placeholder="Search services…" />
            <InputGroupAddon>
                <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
                <Kbd>⌘K</Kbd>
            </InputGroupAddon>
        </InputGroup>
    );
}

export function TextAddons() {
    return (
        <div className="grid w-full max-w-sm gap-3">
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="status.acme.dev" />
                <InputGroupAddon align="inline-end">
                    <GlobeIcon />
                </InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupInput placeholder="512" className="text-right font-mono" />
                <InputGroupAddon align="inline-end">
                    <InputGroupText>MiB</InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}

export function Buttons() {
    return (
        <div className="grid w-full max-w-sm gap-3">
            <InputGroup>
                <InputGroupInput defaultValue="level:error service:api" className="font-mono" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton size="icon-xs" aria-label="Clear">
                        <XIcon />
                    </InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupInput placeholder="Invite by email" />
                <InputGroupAddon align="inline-end">
                    <InputGroupButton variant="solid">Invite</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
}

export function Sizes() {
    return (
        <div className="grid w-full max-w-sm gap-3">
            {(["sm", "default", "lg"] as const).map((size) => (
                <InputGroup key={size} size={size}>
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                    <InputGroupInput placeholder={`Search · ${size}`} />
                    <InputGroupAddon align="inline-end">
                        <InputGroupButton size="icon-xs" aria-label="Clear">
                            <XIcon />
                        </InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>
            ))}
        </div>
    );
}

export function WithTextarea() {
    return (
        <InputGroup className="max-w-md">
            <InputGroupTextarea placeholder="Ask about this trace…" />
            <InputGroupAddon align="block-end" className="border-t">
                <InputGroupText className="font-mono text-xs">gpt · 2.1k tokens</InputGroupText>
                <InputGroupButton variant="solid" size="icon-xs" className="ml-auto" aria-label="Send">
                    <ArrowUpIcon />
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
}

export function States() {
    return (
        <div className="grid w-full max-w-sm gap-3">
            <InputGroup>
                <InputGroupInput defaultValue="payments-worker" aria-busy />
                <InputGroupAddon align="inline-end">
                    <Spinner />
                </InputGroupAddon>
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput disabled placeholder="Index rebuilding…" />
            </InputGroup>
            <InputGroup>
                <InputGroupAddon>
                    <InputGroupText>@</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput aria-invalid defaultValue="root" />
            </InputGroup>
        </div>
    );
}
