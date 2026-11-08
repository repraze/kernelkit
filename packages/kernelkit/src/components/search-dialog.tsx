"use client";

import {CommandDialog, CommandItem} from "@repraze/kernelkit/components/command";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {cn} from "cn";
import {CornerDownLeftIcon} from "lucide-react";
import type * as React from "react";

/**
 * The suite's site search, opened by SearchTrigger / useSearchHotkeys. A CommandDialog with the search
 * defaults; put a Command inside with a CommandInput, a CommandList of SearchItem groups and a
 * SearchFooter.
 *
 * ```tsx
 * <SearchDialog open={open} onOpenChange={setOpen} description="Search docs">
 *   <Command>
 *     <CommandInput placeholder="Search…" />
 *     <CommandList>
 *       <CommandEmpty>No results.</CommandEmpty>
 *       <CommandGroup heading="Pages">
 *         <SearchItem icon={<FileTextIcon />} title="Intro" description="…" onSelect={go} />
 *       </CommandGroup>
 *     </CommandList>
 *     <SearchFooter />
 *   </Command>
 * </SearchDialog>
 * ```
 */
function SearchDialog({
    title = "Search",
    description = "Search this site",
    ...props
}: React.ComponentProps<typeof CommandDialog>) {
    return <CommandDialog title={title} description={description} {...props} />;
}

interface SearchItemProps extends Omit<React.ComponentProps<typeof CommandItem>, "title" | "children"> {
    /** A lucide icon for the result's kind (muted). */
    icon?: React.ReactNode;
    title: React.ReactNode;
    /** One line under the title, truncated. */
    description?: React.ReactNode;
    /** Trailing content before the enter hint (a Badge). */
    meta?: React.ReactNode;
}

/** A result row: kind icon, title over a one-line description, optional meta, ↵ on the selected row. */
function SearchItem({icon, title, description, meta, className, ...props}: SearchItemProps) {
    return (
        <CommandItem data-slot="search-item" className={cn("gap-3 [&>svg:last-child]:hidden", className)} {...props}>
            {icon ? <span className="flex shrink-0 text-muted-foreground [&_svg]:size-4">{icon}</span> : null}
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{title}</span>
                {description ? <span className="truncate text-muted-foreground">{description}</span> : null}
            </span>
            {meta}
            <CornerDownLeftIcon
                aria-hidden
                className="text-muted-foreground opacity-0 group-data-[selected=true]/command-item:opacity-100"
            />
        </CommandItem>
    );
}

/** Keyboard hints under the results. */
function SearchFooter({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="search-footer"
            className={cn("flex items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground", className)}
            {...props}
        >
            <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> move
            </span>
            <span className="flex items-center gap-1">
                <Kbd>↵</Kbd> open
            </span>
            <span className="flex items-center gap-1">
                <Kbd>esc</Kbd> close
            </span>
        </div>
    );
}

export {SearchDialog, SearchFooter, SearchItem};
