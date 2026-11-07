import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoiceDescription,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireInput,
    QuestionnaireItem,
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireProgress,
    QuestionnaireSkip,
    QuestionnaireSubmit,
    QuestionnaireTitle,
} from "@repraze/kernelkit/components/questionnaire";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Questionnaire",
    category: "Chat",
    description:
        "A step-by-step form the assistant asks inline before acting: one question at a time, with keyboard shortcuts for the choices.",
    order: 6,
    demos: [
        {
            title: "Clarifying questions",
            component: Clarify,
            layout: "start",
            description: "Single choice, multiple choice and free text. Press a letter to pick, Enter to continue.",
        },
        {
            title: "Choice states",
            component: ChoiceStates,
            layout: "start",
            description:
                "Selected choices get a primary border and indicator; disabled ones dim; invalid ones turn danger.",
        },
        {
            title: "Text answer",
            component: TextAnswer,
            layout: "start",
            description: "A required free-text question shows its error on submit.",
        },
    ],
    props: [
        {
            component: "Questionnaire",
            rows: [
                {
                    name: "shortcuts",
                    type: '"letters" | "numbers"',
                    description: "Keyboard shortcuts for choices, shown as a chip on each one.",
                },
                {name: "defaultItem / item", type: "string", description: "Which question is shown (by `name`)."},
                {name: "onItemChange", type: "(item: string) => void"},
                {name: "onSubmit", type: "FormEventHandler", description: "The root is a `<form>`."},
            ],
        },
        {
            component: "QuestionnaireItem",
            rows: [
                {name: "name", type: "string", description: "Form field name and step id."},
                {name: "multiple", type: "boolean", default: "false", description: "Checkboxes instead of radios."},
                {name: "required", type: "boolean", default: "false", description: "Hides Skip, validates on Next."},
                {name: "invalid", type: "boolean", default: "false"},
            ],
        },
        {
            component: "QuestionnaireChoice",
            rows: [
                {name: "value", type: "string"},
                {name: "disabled", type: "boolean", default: "false"},
                {name: "defaultChecked / checked", type: "boolean"},
            ],
        },
        {
            component: "QuestionnaireNext / Previous / Skip / Submit",
            rows: [
                {
                    name: "variant / size",
                    type: "Button props",
                    default: '"default" (Next, Submit), "outline"',
                    description: "Styled with `buttonVariants`.",
                },
            ],
        },
    ],
});

export function Clarify() {
    return (
        <Questionnaire shortcuts="letters" className="max-w-md" onSubmit={(event) => event.preventDefault()}>
            <QuestionnaireProgress />
            <QuestionnaireItem name="env" required>
                <QuestionnaireTitle>Which environment should I roll back?</QuestionnaireTitle>
                <QuestionnaireDescription>Both run api v2.31.5.</QuestionnaireDescription>
                <QuestionnaireChoices>
                    <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
                    <QuestionnaireChoice value="production">
                        Production
                        <QuestionnaireChoiceDescription>6 pods, 2.4k req/s</QuestionnaireChoiceDescription>
                    </QuestionnaireChoice>
                </QuestionnaireChoices>
                <QuestionnaireError>Pick an environment.</QuestionnaireError>
            </QuestionnaireItem>
            <QuestionnaireItem name="notify" multiple>
                <QuestionnaireTitle>Who should I notify?</QuestionnaireTitle>
                <QuestionnaireChoices>
                    <QuestionnaireChoice value="oncall">#oncall-api</QuestionnaireChoice>
                    <QuestionnaireChoice value="status">Status page</QuestionnaireChoice>
                    <QuestionnaireChoice value="author">The PR author</QuestionnaireChoice>
                </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireItem name="reason">
                <QuestionnaireTitle>Reason for the rollback</QuestionnaireTitle>
                <QuestionnaireInput placeholder="OOMKilled after 14:02 rollout" />
            </QuestionnaireItem>
            <QuestionnaireActions>
                <QuestionnairePrevious />
                <QuestionnaireSkip />
                <QuestionnaireNext />
                <QuestionnaireSubmit>Roll back</QuestionnaireSubmit>
            </QuestionnaireActions>
        </Questionnaire>
    );
}

export function ChoiceStates() {
    return (
        <Questionnaire className="max-w-md" onSubmit={(event) => event.preventDefault()}>
            <QuestionnaireItem name="strategy">
                <QuestionnaireTitle>Deploy strategy</QuestionnaireTitle>
                <QuestionnaireChoices>
                    <QuestionnaireChoice value="canary" defaultChecked>
                        Canary
                        <QuestionnaireChoiceDescription>5% of traffic for 10 minutes</QuestionnaireChoiceDescription>
                    </QuestionnaireChoice>
                    <QuestionnaireChoice value="rolling">
                        Rolling
                        <QuestionnaireChoiceDescription>One pod at a time</QuestionnaireChoiceDescription>
                    </QuestionnaireChoice>
                    <QuestionnaireChoice value="bluegreen" disabled>
                        Blue/green
                        <QuestionnaireChoiceDescription>Needs a second cluster</QuestionnaireChoiceDescription>
                    </QuestionnaireChoice>
                </QuestionnaireChoices>
            </QuestionnaireItem>
        </Questionnaire>
    );
}

export function TextAnswer() {
    return (
        <Questionnaire className="max-w-md" onSubmit={(event) => event.preventDefault()}>
            <QuestionnaireItem name="branch" required>
                <QuestionnaireTitle>Which branch has the fix?</QuestionnaireTitle>
                <QuestionnaireDescription>I will open the PR against main.</QuestionnaireDescription>
                <QuestionnaireInput placeholder="fix/api-memory-limit" />
                <QuestionnaireError>Enter a branch name.</QuestionnaireError>
            </QuestionnaireItem>
            <QuestionnaireActions>
                <QuestionnaireSubmit>Open PR</QuestionnaireSubmit>
            </QuestionnaireActions>
        </Questionnaire>
    );
}
