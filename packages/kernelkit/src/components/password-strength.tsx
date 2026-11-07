"use client";

import {cn} from "cn";

type PasswordScore = 0 | 1 | 2 | 3 | 4;

const LABELS: Record<PasswordScore, string> = {0: "Too weak", 1: "Weak", 2: "Fair", 3: "Good", 4: "Strong"};

/** Segment / label color per score: danger → warning → success. Literal strings for Tailwind. */
const TONE: Record<PasswordScore, string> = {
    0: "[--c:var(--danger)] [--c-fill:var(--tc-red-fill)]",
    1: "[--c:var(--danger)] [--c-fill:var(--tc-red-fill)]",
    2: "[--c:var(--warning)] [--c-fill:var(--tc-yellow-fill)]",
    3: "[--c:var(--success)] [--c-fill:var(--tc-green-fill)]",
    4: "[--c:var(--success)] [--c-fill:var(--tc-green-fill)]",
};

const COMMON = new Set(["password", "123456", "12345678", "qwerty", "letmein", "admin", "welcome", "iloveyou"]);

/**
 * Tiny, dependency-free strength heuristic (length + character classes + a handful of common passwords).
 * UX guidance only: enforce your real policy on the server.
 */
function estimateStrength(password: string): PasswordScore {
    if (!password || password.length < 6 || COMMON.has(password.toLowerCase())) {
        return 0;
    }
    const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^a-zA-Z0-9]/].filter((re) => re.test(password)).length;
    let points = 0;
    if (password.length >= 8) {
        points++;
    }
    if (password.length >= 12) {
        points++;
    }
    if (password.length >= 16) {
        points++;
    }
    if (classes >= 2) {
        points++;
    }
    if (classes >= 3) {
        points++;
    }
    if (/(.)\1{2,}/.test(password)) {
        points--;
    }
    return Math.max(1, Math.min(4, points - 1)) as PasswordScore;
}

interface PasswordStrengthProps extends Omit<React.ComponentProps<"div">, "children"> {
    /** 0 (too weak) … 4 (strong). Compute it with `estimateStrength` or a real estimator (zxcvbn). */
    score: number;
    /** Text after "Strength:". Defaults to Too weak / Weak / Fair / Good / Strong. */
    label?: React.ReactNode;
    /** Hide the text row (keep the bar). */
    hideLabel?: boolean;
    /** Render the empty state (no password typed yet): grey segments, no label color. */
    empty?: boolean;
}

/** Segmented 4-step strength bar + label. Presentational: you pass the score. */
function PasswordStrength({className, score, label, hideLabel, empty, ...props}: PasswordStrengthProps) {
    const s = Math.max(0, Math.min(4, Math.round(score))) as PasswordScore;
    // score 0 still lights the first segment in danger so "too weak" is visible
    const lit = empty ? 0 : Math.max(1, s);
    return (
        <div
            data-slot="password-strength"
            data-score={empty ? undefined : s}
            className={cn("flex flex-col gap-1.5", !empty && TONE[s], className)}
            {...props}
        >
            <div data-slot="password-strength-bar" className="grid grid-cols-4 gap-1" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        data-slot="password-strength-segment"
                        data-active={i <= lit ? "" : undefined}
                        className="h-1 rounded-pill bg-foreground/10 transition-colors duration-150 hc:bg-transparent hc:inset-ring hc:inset-ring-border data-active:bg-(--c-fill) hc:data-active:bg-(--c-fill) hc:data-active:inset-ring-0"
                    />
                ))}
            </div>
            {hideLabel ? null : (
                <p data-slot="password-strength-label" aria-live="polite" className="text-xs text-muted-foreground">
                    <span>
                        Strength:{" "}
                        <span className={cn("font-medium", empty ? "text-muted-foreground" : "text-(--c)")}>
                            {empty ? "-" : (label ?? LABELS[s])}
                        </span>
                    </span>
                </p>
            )}
        </div>
    );
}

export {estimateStrength, PasswordStrength};
export type {PasswordScore, PasswordStrengthProps};
