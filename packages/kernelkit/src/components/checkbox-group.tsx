"use client";

import {CheckboxGroup as CheckboxGroupPrimitive} from "@base-ui/react/checkbox-group";
import {cn} from "cn";

/**
 * Shared state for a set of checkboxes: `value` is the array of checked `Checkbox` values. Give the
 * group `allValues` and one `<Checkbox parent />` to get a "select all" box that turns indeterminate
 * when only some children are checked.
 */
function CheckboxGroup({className, ...props}: CheckboxGroupPrimitive.Props) {
    return (
        <CheckboxGroupPrimitive
            data-slot="checkbox-group"
            className={cn("flex flex-col items-start gap-3", className)}
            {...props}
        />
    );
}

export {CheckboxGroup};
