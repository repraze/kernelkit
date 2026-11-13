"use client";

import {cva} from "class-variance-authority";
import {cn} from "cn";
import * as React from "react";

type DescriptionListOrientation = "horizontal" | "vertical";

const DescriptionListContext = React.createContext<{orientation: DescriptionListOrientation; divided: boolean}>({
    orientation: "horizontal",
    divided: false,
});

const descriptionListVariants = cva("text-sm", {
    variants: {
        orientation: {
            // one shared term column: every item is a subgrid row, so terms line up across rows
            horizontal: "grid grid-cols-[minmax(0,max-content)_minmax(0,1fr)] gap-x-6",
            vertical: "flex flex-col",
        },
        divided: {
            true: "",
            false: "",
        },
    },
    compoundVariants: [
        {orientation: "horizontal", divided: false, class: "gap-y-2.5"},
        {orientation: "vertical", divided: false, class: "gap-4"},
    ],
    defaultVariants: {orientation: "horizontal", divided: false},
});

interface DescriptionListProps extends React.ComponentProps<"dl"> {
    /** `horizontal`: terms in a column beside their details. `vertical`: each term above its details. */
    orientation?: DescriptionListOrientation;
    /** Rule between items. */
    divided?: boolean;
}

/** Key / value pairs: properties of a server, an order, a file. Terms in the label face, details in the body face. */
function DescriptionList({orientation = "horizontal", divided = false, className, ...props}: DescriptionListProps) {
    const ctx = React.useMemo(() => ({orientation, divided}), [orientation, divided]);
    return (
        <DescriptionListContext.Provider value={ctx}>
            <dl
                data-slot="description-list"
                data-orientation={orientation}
                data-divided={divided ? "" : undefined}
                className={cn(descriptionListVariants({orientation, divided}), className)}
                {...props}
            />
        </DescriptionListContext.Provider>
    );
}

const descriptionItemVariants = cva("min-w-0", {
    variants: {
        orientation: {
            horizontal: "col-span-2 grid grid-cols-subgrid items-baseline",
            vertical: "flex flex-col gap-1",
        },
        divided: {
            true: "border-b border-border py-2.5 first:pt-0 last:border-b-0 last:pb-0",
            false: "",
        },
    },
    defaultVariants: {orientation: "horizontal", divided: false},
});

/** One term with its details (a `<div>`, which `<dl>` allows around each group). */
function DescriptionItem({className, ...props}: React.ComponentProps<"div">) {
    const {orientation, divided} = React.useContext(DescriptionListContext);
    return (
        <div
            data-slot="description-item"
            data-orientation={orientation}
            data-divided={divided ? "" : undefined}
            className={cn(descriptionItemVariants({orientation, divided}), className)}
            {...props}
        />
    );
}

function DescriptionTerm({className, ...props}: React.ComponentProps<"dt">) {
    return (
        <dt
            data-slot="description-term"
            className={cn("min-w-0 font-alt text-xs text-muted-foreground", className)}
            {...props}
        />
    );
}

/** The value. Inline content (a status dot, a copy button) sits on one row with `flex items-center gap-2`. */
function DescriptionDetails({className, ...props}: React.ComponentProps<"dd">) {
    return <dd data-slot="description-details" className={cn("min-w-0 text-foreground", className)} {...props} />;
}

export {
    DescriptionDetails,
    DescriptionItem,
    descriptionItemVariants,
    DescriptionList,
    descriptionListVariants,
    DescriptionTerm,
};
export type {DescriptionListOrientation, DescriptionListProps};
