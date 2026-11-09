import {cn} from "@repraze/kernelkit/lib/utils";

import {markSvg} from "@/brand/mark";

const SVG = markSvg();

/** The KernelKit monitor, inlined. Size it in multiples of 32px (default `size-8`) so it stays pixel-sharp. */
export function LogoMark({className}: {className?: string}) {
    return (
        <span
            aria-hidden
            className={cn("inline-block size-8 shrink-0 leading-0", className)}
            // Static markup generated from our own mark shapes, never from user input.
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
