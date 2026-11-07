"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";

/** Placeholder block while content loads. Size it with `h-*`/`w-*`; `rounded-pill` for avatars and pills. */
const skeletonClass = "animate-pulse rounded-md bg-foreground/10 motion-reduce:animate-none hc:bg-border";

function Skeleton({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({"aria-hidden": true, className: cn(skeletonClass, className)}, props),
        render,
        state: {slot: "skeleton"},
    });
}

export {Skeleton, skeletonClass};
