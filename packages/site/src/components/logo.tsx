import {cn} from "@repraze/kernelkit/lib/utils";

import {spriteSvg} from "@/brand/sprite";

/** Fill the wrapper box instead of the sprite's intrinsic pixel size. */
const SVG = spriteSvg().replace(/width="\d+" height="\d+"/, 'width="100%" height="100%"');

/** The kernelkit console, inlined. Size it with className; the SVG fills the box. */
export function LogoMark({className}: {className?: string}) {
    return (
        <span
            aria-hidden
            className={cn("inline-block size-7 shrink-0 leading-0", className)}
            // Static markup generated from our own sprite grid, never from user input.
            dangerouslySetInnerHTML={{__html: SVG}}
        />
    );
}

/** Mark + wordmark: "Kernel" in the foreground, "Kit" in the accent (the suite's brand pattern). */
export function Logo({className}: {className?: string}) {
    return (
        <span className={cn("inline-flex items-center gap-2", className)}>
            <LogoMark />
            <span className="font-mono text-sm font-semibold tracking-tight">
                Kernel<span className="text-primary-text">Kit</span>
            </span>
        </span>
    );
}
