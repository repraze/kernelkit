import {Button} from "kernelkit/components/button";
import {DirectionProvider} from "kernelkit/components/direction";
import {Progress, ProgressLabel, ProgressValue} from "kernelkit/components/progress";
import {ArrowRightIcon} from "lucide-react";

import {Code, defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Direction",
    category: "Foundations",
    baseUi: "direction-provider",
    description:
        "Tells Base UI parts the text direction (keyboard navigation, popup sides, slider and progress fill) for right-to-left apps.",
    order: 5,
    demos: [
        {
            title: "Right to left",
            component: RightToLeft,
            description: "Set `dir` on the element too: the provider informs behavior, `dir` flips layout.",
        },
    ],
    notes: Notes,
    props: [{component: "DirectionProvider", rows: [{name: "direction", type: '"ltr" | "rtl"', default: '"ltr"'}]}],
});

export function RightToLeft() {
    return (
        <DirectionProvider direction="rtl">
            <div dir="rtl" className="flex w-full max-w-sm flex-col gap-4">
                <Progress value={70}>
                    <ProgressLabel>جارٍ النشر</ProgressLabel>
                    <ProgressValue />
                </Progress>
                <Button className="self-start">
                    متابعة <ArrowRightIcon data-icon="inline-end" className="rtl:rotate-180" />
                </Button>
            </div>
        </DirectionProvider>
    );
}

function Notes() {
    return (
        <Code
            title="read it"
            code={`import {useDirection} from "kernelkit/components/direction";

const dir = useDirection(); // "ltr" | "rtl"`}
        />
    );
}
