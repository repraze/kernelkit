import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    ComboboxValue,
    useComboboxAnchor,
} from "@repraze/kernelkit/components/combobox";
import {Field, FieldError, FieldLabel} from "@repraze/kernelkit/components/field";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Combobox",
    category: "Inputs",
    baseUi: "combobox",
    description: "A text input that filters a list as you type. Single value, or multiple as chips.",
    order: 6,
    demos: [
        {title: "Default", component: Default, layout: "tall"},
        {title: "Clearable", component: Clearable},
        {title: "Groups", component: Groups},
        {title: "Multiple (chips)", component: Multiple},
        {title: "States", component: States, description: "Disabled and invalid."},
    ],
    props: [
        {
            component: "Combobox",
            rows: [
                {name: "items", type: "T[] | {value, items}[]", description: "Filtered automatically as you type."},
                {name: "multiple", type: "boolean", default: "false"},
                {name: "value / defaultValue / onValueChange", type: "T | T[]"},
                {name: "autoHighlight", type: "boolean", default: "false", description: "Highlight the first match."},
            ],
        },
        {
            component: "ComboboxInput",
            rows: [
                {
                    name: "showTrigger",
                    type: "boolean",
                    default: "true",
                    description: "Chevron button that opens the list.",
                },
                {
                    name: "showClear",
                    type: "boolean",
                    default: "false",
                    description: "Clear button (replaces the chevron).",
                },
            ],
        },
        {
            component: "ComboboxChip",
            rows: [
                {
                    name: "showRemove",
                    type: "boolean",
                    default: "true",
                    description: "Renders ComboboxChipRemove; use it directly to customise the remove button.",
                },
            ],
        },
        {
            component: "ComboboxContent",
            rows: [{name: "anchor", type: "Ref", description: "Pass useComboboxAnchor() from ComboboxChips."}],
        },
    ],
});

const services = ["api-gateway", "auth", "billing", "ingest", "notifier", "scheduler", "search", "web"];

export function Default() {
    return (
        <Combobox items={services}>
            <ComboboxInput placeholder="Select a service" className="w-56" />
            <ComboboxContent>
                <ComboboxEmpty>No service found.</ComboboxEmpty>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export function Clearable() {
    return (
        <Combobox items={services} defaultValue="scheduler">
            <ComboboxInput showClear placeholder="Select a service" className="w-56" />
            <ComboboxContent>
                <ComboboxEmpty>No service found.</ComboboxEmpty>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

const zones = [
    {value: "Europe", items: ["eu-west-1", "eu-west-3", "eu-central-1"]},
    {value: "Americas", items: ["us-east-1", "us-west-2", "sa-east-1"]},
];

export function Groups() {
    return (
        <Combobox items={zones}>
            <ComboboxInput placeholder="Select a zone" className="w-56" />
            <ComboboxContent>
                <ComboboxEmpty>No zone found.</ComboboxEmpty>
                <ComboboxList>
                    {(group: (typeof zones)[number], index: number) => (
                        <ComboboxGroup key={group.value} items={group.items}>
                            {index > 0 && <ComboboxSeparator />}
                            <ComboboxLabel>{group.value}</ComboboxLabel>
                            <ComboboxCollection>
                                {(item: string) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item}
                                    </ComboboxItem>
                                )}
                            </ComboboxCollection>
                        </ComboboxGroup>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export function Multiple() {
    const anchor = useComboboxAnchor();
    return (
        <Combobox multiple autoHighlight items={services} defaultValue={["auth", "billing"]}>
            <ComboboxChips ref={anchor} className="w-80">
                <ComboboxValue>
                    {(values: string[]) => (
                        <>
                            {values.map((value) => (
                                <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}
                            <ComboboxChipsInput placeholder={values.length ? "" : "Add services"} />
                        </>
                    )}
                </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>No service found.</ComboboxEmpty>
                <ComboboxList>
                    {(item: string) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

export function States() {
    return (
        <div className="flex flex-wrap items-start gap-4">
            <Combobox items={services} disabled>
                <ComboboxInput placeholder="Locked during deploy" className="w-52" disabled />
                <ComboboxContent>
                    <ComboboxList>
                        {(item: string) => (
                            <ComboboxItem key={item} value={item}>
                                {item}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            <Field data-invalid className="w-52">
                <FieldLabel>Owner service</FieldLabel>
                <Combobox items={services}>
                    <ComboboxInput placeholder="Select a service" aria-invalid className="w-full" />
                    <ComboboxContent>
                        <ComboboxEmpty>No service found.</ComboboxEmpty>
                        <ComboboxList>
                            {(item: string) => (
                                <ComboboxItem key={item} value={item}>
                                    {item}
                                </ComboboxItem>
                            )}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
                <FieldError>Every alert needs an owner.</FieldError>
            </Field>
        </div>
    );
}
