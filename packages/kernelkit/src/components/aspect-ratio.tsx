"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";

interface AspectRatioProps extends useRender.ComponentProps<"div"> {
    /** Width / height, e.g. `16 / 9`. */
    ratio: number;
}

/** Box that keeps a width/height ratio; children (img, video, iframe) fill it. */
function AspectRatio({ratio, className, style, render, ...props}: AspectRatioProps) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(
            {
                style: {"--ratio": ratio, ...style} as React.CSSProperties,
                className: cn("relative aspect-(--ratio)", className),
            },
            props,
        ),
        render,
        state: {slot: "aspect-ratio"},
    });
}

export {AspectRatio};
export type {AspectRatioProps};
