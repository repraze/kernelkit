import {cn} from "kernelkit/lib/utils";

/** Kernelkit mark: a "K" bracket and a cursor block, in the accent. */
export function Logo({className}: {className?: string}) {
    return (
        <span
            className={cn("inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight", className)}
        >
            <svg viewBox="0 0 32 32" className="size-6" aria-hidden>
                <rect width="32" height="32" rx="calc(var(--kk-radius) * 0.9)" className="fill-foreground" />
                <path d="M10 8v16M10 16l8-8M10 16l8 8" className="stroke-background" strokeWidth="3" fill="none" />
                <rect x="20" y="20" width="4" height="4" className="fill-primary" />
            </svg>
            <span>
                kernel<span className="text-primary-text">kit</span>
            </span>
        </span>
    );
}
