import {Shimmer} from "@repraze/kernelkit/components/shimmer";
import {Spinner} from "@repraze/kernelkit/components/spinner";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Shimmer",
    category: "Feedback",
    description:
        "Text with a highlight band sweeping across it, for work in progress: “Thinking…”, “Indexing files…”. Plain muted text under reduced motion.",
    demos: [
        {title: "Default", component: Default},
        {title: "With a spinner", component: WithSpinner, description: "Pair it with a Spinner for a status line."},
    ],
    props: [
        {
            component: "Shimmer",
            rows: [
                {name: "duration", type: "number", default: "2", description: "Seconds per sweep."},
                {name: "render", type: "ReactElement", description: "Render as another element."},
            ],
        },
    ],
});

export function Default() {
    return (
        <div className="flex flex-col items-start gap-2 text-sm">
            <Shimmer>Thinking…</Shimmer>
            <Shimmer className="font-alt text-xs">indexing 1,284 files</Shimmer>
            <Shimmer render={<h3 />} className="font-heading text-base font-medium" duration={3}>
                Generating report
            </Shimmer>
        </div>
    );
}

export function WithSpinner() {
    return (
        <div className="flex flex-col items-start gap-2 text-sm">
            <span className="flex items-center gap-2">
                <Spinner variant="braille" size="sm" className="text-primary-text" />
                <Shimmer>Running 214 tests</Shimmer>
            </span>
            <span className="flex items-center gap-2">
                <Spinner variant="dots" size="sm" className="text-info" />
                <Shimmer>Waiting for health checks</Shimmer>
            </span>
        </div>
    );
}
