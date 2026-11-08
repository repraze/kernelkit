"use client";

import {mergeProps} from "@base-ui/react/merge-props";
import {useRender} from "@base-ui/react/use-render";
import {cn} from "cn";

/**
 * Top of a page: eyebrow (badges, breadcrumb), title, description, actions. Same scale on every site of
 * the suite.
 */
function PageHeader({className, render, ...props}: useRender.ComponentProps<"header">) {
    return useRender({
        defaultTagName: "header",
        props: mergeProps<"header">({className: cn("flex flex-col gap-3", className)}, props),
        render,
        state: {slot: "page-header"},
    });
}

/** Above the title: category badges, a breadcrumb, a status. */
function PageHeaderEyebrow({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn("flex flex-wrap items-center gap-2", className)}, props),
        render,
        state: {slot: "page-header-eyebrow"},
    });
}

function PageHeaderTitle({className, render, ...props}: useRender.ComponentProps<"h1">) {
    return useRender({
        defaultTagName: "h1",
        props: mergeProps<"h1">(
            {className: cn("font-heading text-3xl font-semibold tracking-tight text-balance", className)},
            props,
        ),
        render,
        state: {slot: "page-header-title"},
    });
}

function PageHeaderDescription({className, render, ...props}: useRender.ComponentProps<"p">) {
    return useRender({
        defaultTagName: "p",
        props: mergeProps<"p">(
            {className: cn("max-w-3xl text-base text-pretty text-muted-foreground md:text-lg", className)},
            props,
        ),
        render,
        state: {slot: "page-header-description"},
    });
}

function PageHeaderActions({className, render, ...props}: useRender.ComponentProps<"div">) {
    return useRender({
        defaultTagName: "div",
        props: mergeProps<"div">({className: cn("flex flex-wrap items-center gap-2 pt-1", className)}, props),
        render,
        state: {slot: "page-header-actions"},
    });
}

export {PageHeader, PageHeaderActions, PageHeaderDescription, PageHeaderEyebrow, PageHeaderTitle};
