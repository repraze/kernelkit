import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from "@repraze/kernelkit/components/stepper";
import {ArrowLeftIcon, ArrowRightIcon, RotateCcwIcon} from "lucide-react";
import * as React from "react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Stepper",
    category: "Navigation",
    description:
        "Progress through a multi-step flow: numbered indicators joined by lines, a check once a step is done.",
    demos: [
        {
            title: "Horizontal",
            component: Horizontal,
            description: "Click a step to jump to it; arrow keys move between steps, Home / End to the ends.",
        },
        {
            title: "Vertical",
            component: Vertical,
            description: "With descriptions. The line hangs under each indicator.",
        },
        {
            title: "States",
            component: States,
            description: "`error`, `loading` and `disabled` per item; an optional step says so in its description.",
        },
        {title: "Read only", component: ReadOnly, description: "Leave out `StepperTrigger` for a status display."},
        {title: "Wizard", component: Wizard, description: "Controlled `value` with Back / Next and one pane per step."},
        {
            title: "CI job",
            component: Pipeline,
            layout: "start",
            description:
                "Like a GitHub Actions run: `value` is the step being viewed, `completed` / `error` / `skipped` its outcome. Steps after the failure are `skipped` and still open their pane; the line into a skipped step stays plain.",
        },
        {
            title: "Pipeline stages",
            component: Stages,
            description:
                "A Jenkins-style stage bar: the running stage is `loading`, finished ones complete. Re-run it, or make Test fail to see the rest skipped.",
        },
    ],
    props: [
        {
            component: "Stepper",
            rows: [
                {name: "value", type: "number", description: "The current step (a `StepperItem`'s `step`)."},
                {name: "defaultValue", type: "number", default: "1"},
                {name: "onValueChange", type: "(step: number) => void"},
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
            ],
        },
        {
            component: "StepperItem",
            rows: [
                {name: "step", type: "number", description: "Required. Shown in the indicator, compared with `value`."},
                {
                    name: "completed",
                    type: "boolean",
                    description: "Force the completed look. Default: every step before the current one.",
                },
                {name: "error", type: "boolean", description: "Danger indicator with an X."},
                {name: "loading", type: "boolean", description: "Spinner in the indicator."},
                {
                    name: "skipped",
                    type: "boolean",
                    description:
                        "Never ran: dashed indicator, skip glyph, muted title. Still clickable; the line into it stays plain.",
                },
                {name: "disabled", type: "boolean", description: "Its trigger can't be clicked or focused."},
            ],
        },
        {
            component: "StepperTrigger",
            rows: [{name: "render", type: "ReactElement", description: "Render as a link or another element."}],
        },
    ],
});

const STEPS = [
    {step: 1, title: "Repository", description: "Pick the source"},
    {step: 2, title: "Build", description: "Command and output"},
    {step: 3, title: "Environment", description: "Variables and secrets"},
    {step: 4, title: "Deploy", description: "Review and ship"},
];

export function Horizontal() {
    return (
        <Stepper defaultValue={2} className="max-w-xl">
            {STEPS.map(({step, title}) => (
                <StepperItem key={step} step={step}>
                    <StepperTrigger>
                        <StepperIndicator />
                        <StepperTitle>{title}</StepperTitle>
                    </StepperTrigger>
                    {step < STEPS.length && <StepperSeparator />}
                </StepperItem>
            ))}
        </Stepper>
    );
}

export function Vertical() {
    return (
        <Stepper defaultValue={3} orientation="vertical">
            {STEPS.map(({step, title, description}) => (
                <StepperItem key={step} step={step}>
                    <StepperTrigger>
                        <StepperIndicator />
                        <div>
                            <StepperTitle>{title}</StepperTitle>
                            <StepperDescription>{description}</StepperDescription>
                        </div>
                    </StepperTrigger>
                    {step < STEPS.length && <StepperSeparator />}
                </StepperItem>
            ))}
        </Stepper>
    );
}

export function States() {
    return (
        <div className="flex w-full max-w-xl flex-col gap-10">
            <Stepper defaultValue={3}>
                <StepperItem step={1}>
                    <StepperTrigger>
                        <StepperIndicator />
                        <StepperTitle>Lint</StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                </StepperItem>
                <StepperItem step={2} error>
                    <StepperTrigger>
                        <StepperIndicator />
                        <StepperTitle>Test</StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                </StepperItem>
                <StepperItem step={3} loading>
                    <StepperTrigger>
                        <StepperIndicator />
                        <StepperTitle>Build</StepperTitle>
                    </StepperTrigger>
                    <StepperSeparator />
                </StepperItem>
                <StepperItem step={4} disabled>
                    <StepperTrigger>
                        <StepperIndicator />
                        <StepperTitle>Release</StepperTitle>
                    </StepperTrigger>
                </StepperItem>
            </Stepper>
            <Stepper defaultValue={2} orientation="vertical">
                <StepperItem step={1}>
                    <StepperTrigger>
                        <StepperIndicator />
                        <div>
                            <StepperTitle>Account</StepperTitle>
                            <StepperDescription>Done</StepperDescription>
                        </div>
                    </StepperTrigger>
                    <StepperSeparator />
                </StepperItem>
                <StepperItem step={2}>
                    <StepperTrigger>
                        <StepperIndicator />
                        <div>
                            <StepperTitle>Team</StepperTitle>
                            <StepperDescription>Optional: invite people later</StepperDescription>
                        </div>
                    </StepperTrigger>
                    <StepperSeparator />
                </StepperItem>
                <StepperItem step={3} error>
                    <StepperTrigger>
                        <StepperIndicator />
                        <div>
                            <StepperTitle>Billing</StepperTitle>
                            <StepperDescription>Card declined</StepperDescription>
                        </div>
                    </StepperTrigger>
                </StepperItem>
            </Stepper>
        </div>
    );
}

export function ReadOnly() {
    return (
        <Stepper value={3} className="max-w-md">
            {["Queued", "Building", "Deploying", "Live"].map((title, i) => (
                <StepperItem key={title} step={i + 1} loading={i + 1 === 3}>
                    <StepperIndicator />
                    <StepperTitle>{title}</StepperTitle>
                    {i < 3 && <StepperSeparator />}
                </StepperItem>
            ))}
        </Stepper>
    );
}

export function Wizard() {
    const [step, setStep] = React.useState(1);
    const current = STEPS[step - 1]!;
    return (
        <div className="flex w-full max-w-xl flex-col gap-6">
            <Stepper value={step} onValueChange={setStep}>
                {STEPS.map(({step: s, title}) => (
                    <StepperItem key={s} step={s}>
                        <StepperTrigger>
                            <StepperIndicator />
                            <StepperTitle className="hidden sm:block">{title}</StepperTitle>
                        </StepperTrigger>
                        {s < STEPS.length && <StepperSeparator />}
                    </StepperItem>
                ))}
            </Stepper>
            <div className="flex min-h-24 flex-col gap-1 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                    <span className="font-heading text-base font-medium">{current.title}</span>
                    <Badge variant="outline">
                        {step} / {STEPS.length}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{current.description}.</p>
            </div>
            <div className="flex justify-between">
                <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
                    <ArrowLeftIcon data-icon="inline-start" />
                    Back
                </Button>
                <Button disabled={step === STEPS.length} onClick={() => setStep(step + 1)}>
                    Next
                    <ArrowRightIcon data-icon="inline-end" />
                </Button>
            </div>
        </div>
    );
}

type JobStep = {
    step: number;
    title: string;
    duration?: string;
    status: "success" | "failure" | "skipped";
    log?: string[];
};

const JOB: JobStep[] = [
    {
        step: 1,
        title: "Set up job",
        duration: "2s",
        status: "success",
        log: ["Runner image: ubuntu-24.04", "Job is about to start running on the runner"],
    },
    {
        step: 2,
        title: "Checkout",
        duration: "1s",
        status: "success",
        log: ["git fetch --depth=1 origin main", "HEAD is now at a3f9c21 Add tree component"],
    },
    {step: 3, title: "Install", duration: "18s", status: "success", log: ["npm ci", "added 412 packages in 17.6s"]},
    {
        step: 4,
        title: "Test",
        duration: "41s",
        status: "failure",
        log: [
            "npm test",
            "✓ 212 passed",
            "✗ tree › keyboard › ArrowLeft moves to parent",
            "Error: Process completed with exit code 1.",
        ],
    },
    {step: 5, title: "Build", status: "skipped"},
    {step: 6, title: "Deploy", status: "skipped"},
];

export function Pipeline() {
    const [step, setStep] = React.useState(4);
    const current = JOB[step - 1]!;
    return (
        <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Stepper value={step} onValueChange={setStep} orientation="vertical" className="sm:w-56 sm:shrink-0">
                {JOB.map(({step: s, title, duration, status}) => (
                    <StepperItem
                        key={s}
                        step={s}
                        completed={status === "success"}
                        error={status === "failure"}
                        skipped={status === "skipped"}
                    >
                        <StepperTrigger className="w-full">
                            <StepperIndicator />
                            <StepperTitle className="flex-1">{title}</StepperTitle>
                            {duration && (
                                <span className="font-alt text-xs leading-6 text-muted-foreground tabular-nums">
                                    {duration}
                                </span>
                            )}
                        </StepperTrigger>
                        {s < JOB.length && <StepperSeparator />}
                    </StepperItem>
                ))}
            </Stepper>
            <div className="flex min-h-40 min-w-0 flex-1 flex-col gap-2 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                    <span className="font-heading text-sm font-medium">{current.title}</span>
                    {current.duration && <Badge variant="outline">{current.duration}</Badge>}
                </div>
                {current.log ? (
                    <pre className="overflow-x-auto font-mono text-xs leading-5 text-muted-foreground">
                        {current.log.map((line, i) => (
                            <div
                                key={i}
                                className={line.startsWith("✗") || line.startsWith("Error") ? "text-danger" : undefined}
                            >
                                <span className="me-3 inline-block w-4 text-end opacity-60 select-none">{i + 1}</span>
                                {line}
                            </div>
                        ))}
                    </pre>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        This step was skipped because a previous step failed.
                    </p>
                )}
            </div>
        </div>
    );
}

const STAGES = ["Checkout", "Build", "Test", "Deploy", "Smoke"];

export function Stages() {
    // running: index of the running stage; done past the end; failAt: the stage that fails (or -1)
    const [running, setRunning] = React.useState(2);
    const [failAt, setFailAt] = React.useState(-1);
    const [failed, setFailed] = React.useState(false);
    const busy = running < STAGES.length && !failed;

    React.useEffect(() => {
        if (!busy) {
            return;
        }
        const t = setTimeout(() => {
            if (running === failAt) {
                setFailed(true);
            } else {
                setRunning(running + 1);
            }
        }, 1100);
        return () => clearTimeout(t);
    }, [busy, running, failAt]);

    const run = (fail: boolean) => {
        setFailAt(fail ? 2 : -1);
        setFailed(false);
        setRunning(0);
    };

    return (
        <div className="flex w-full max-w-xl flex-col gap-6">
            <Stepper value={running + 1}>
                {STAGES.map((title, i) => (
                    <StepperItem
                        key={title}
                        step={i + 1}
                        loading={busy && i === running}
                        error={failed && i === running}
                        skipped={failed && i > running}
                    >
                        <StepperIndicator />
                        <StepperTitle className="hidden sm:block">{title}</StepperTitle>
                        {i < STAGES.length - 1 && <StepperSeparator />}
                    </StepperItem>
                ))}
            </Stepper>
            <div className="flex items-center justify-between gap-2">
                <span className="font-alt text-xs text-muted-foreground" aria-live="polite">
                    {busy
                        ? `Running ${STAGES[running]}…`
                        : failed
                          ? `Failed at ${STAGES[running]}`
                          : "All stages passed"}
                </span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={busy} onClick={() => run(true)}>
                        Fail at Test
                    </Button>
                    <Button size="sm" disabled={busy} onClick={() => run(false)}>
                        <RotateCcwIcon data-icon="inline-start" />
                        Re-run
                    </Button>
                </div>
            </div>
        </div>
    );
}
