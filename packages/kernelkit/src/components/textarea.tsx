"use client";

import {cn} from "cn";
import {fieldSurface, focusRing, invalidRing} from "kernelkit/lib/recipes";
import * as React from "react";

function Textarea({className, ...props}: React.ComponentProps<"textarea">) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                fieldSurface,
                focusRing,
                invalidRing,
                "flex field-sizing-content min-h-16 w-full px-2.5 py-2 text-base md:text-sm",
                className,
            )}
            {...props}
        />
    );
}

export {Textarea};
