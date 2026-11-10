"use client";

import {Button, buttonVariants} from "@repraze/kernelkit/components/button";
import {cn} from "cn";
import {ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import * as React from "react";
import {type DayButton, DayPicker, getDefaultClassNames, type Locale} from "react-day-picker";

/*
 * States must read in high contrast, where surface shades vanish (GUIDELINES.md §6):
 * - selected / range ends: primary fill
 * - range middle: translucent primary band (bg-primary/15), not a muted shade
 * - today: primary dot under the number + medium weight
 * - outside days: muted text; disabled: muted text + line-through
 */
function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "label",
    buttonVariant = "ghost",
    locale,
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
    const defaultClassNames = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                "group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(8)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent in-data-[slot=date-picker-content]:bg-transparent",
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className,
            )}
            captionLayout={captionLayout}
            locale={locale}
            formatters={{
                formatMonthDropdown: (date) => date.toLocaleString(locale?.code, {month: "short"}),
                ...formatters,
            }}
            classNames={{
                root: cn("w-fit", defaultClassNames.root),
                months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
                month: cn("flex w-full flex-col gap-2", defaultClassNames.month),
                nav: cn(
                    "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
                    defaultClassNames.nav,
                ),
                button_previous: cn(
                    buttonVariants({variant: buttonVariant, size: "icon"}),
                    "size-(--cell-size) rounded-(--cell-radius) p-0 select-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
                    defaultClassNames.button_previous,
                ),
                button_next: cn(
                    buttonVariants({variant: buttonVariant, size: "icon"}),
                    "size-(--cell-size) rounded-(--cell-radius) p-0 select-none aria-disabled:pointer-events-none aria-disabled:opacity-50",
                    defaultClassNames.button_next,
                ),
                month_caption: cn(
                    "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                    defaultClassNames.month_caption,
                ),
                dropdowns: cn(
                    "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
                    defaultClassNames.dropdowns,
                ),
                dropdown_root: cn(
                    "relative rounded-(--cell-radius) border border-input transition-[border-color,box-shadow] hover:bg-hover has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                    defaultClassNames.dropdown_root,
                ),
                dropdown: cn("absolute inset-0 cursor-pointer bg-popover opacity-0", defaultClassNames.dropdown),
                caption_label: cn(
                    "font-heading font-medium tracking-tight select-none",
                    captionLayout === "label"
                        ? "text-sm"
                        : "flex h-7 items-center gap-1 rounded-(--cell-radius) pr-1.5 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
                    defaultClassNames.caption_label,
                ),
                month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
                weekdays: cn("flex", defaultClassNames.weekdays),
                weekday: cn(
                    "flex-1 rounded-(--cell-radius) py-1 text-xs font-normal text-muted-foreground select-none",
                    defaultClassNames.weekday,
                ),
                week: cn("mt-1 flex w-full", defaultClassNames.week),
                week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
                week_number: cn("text-xs text-muted-foreground select-none", defaultClassNames.week_number),
                day: cn(
                    "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
                    props.showWeekNumber
                        ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
                        : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
                    defaultClassNames.day,
                ),
                // the band behind a range: ends get a half-cell strip so the band runs under the rounded fill
                range_start: cn(
                    "relative isolate z-0 rounded-l-(--cell-radius) rounded-r-none bg-primary/15 dark:bg-primary/20",
                    defaultClassNames.range_start,
                ),
                range_middle: cn("rounded-none bg-primary/15 dark:bg-primary/20", defaultClassNames.range_middle),
                range_end: cn(
                    "relative isolate z-0 rounded-l-none rounded-r-(--cell-radius) bg-primary/15 dark:bg-primary/20",
                    defaultClassNames.range_end,
                ),
                today: cn("rounded-(--cell-radius) data-[selected=true]:rounded-none", defaultClassNames.today),
                outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
                disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
                hidden: cn("invisible", defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Root: ({className, rootRef, ...props}) => {
                    return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />;
                },
                Chevron: ({className, orientation, ...props}) => {
                    if (orientation === "left") {
                        return <ChevronLeftIcon className={cn("size-4", className)} {...props} />;
                    }

                    if (orientation === "right") {
                        return <ChevronRightIcon className={cn("size-4", className)} {...props} />;
                    }

                    return <ChevronDownIcon className={cn("size-4", className)} {...props} />;
                },
                DayButton: ({...props}) => <CalendarDayButton locale={locale} {...props} />,
                WeekNumber: ({children, ...props}) => {
                    return (
                        <td {...props}>
                            <div className="flex size-(--cell-size) items-center justify-center text-center">
                                {children}
                            </div>
                        </td>
                    );
                },
                ...components,
            }}
            {...props}
        />
    );
}

function CalendarDayButton({
    className,
    day,
    modifiers,
    locale,
    // react-day-picker passes DOM props; `color` would collide with Button's color axis
    color: _color,
    ...props
}: React.ComponentProps<typeof DayButton> & {locale?: Partial<Locale>}) {
    const defaultClassNames = getDefaultClassNames();

    const ref = React.useRef<HTMLButtonElement>(null);
    React.useEffect(() => {
        if (modifiers.focused) {
            ref.current?.focus();
        }
    }, [modifiers.focused]);

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            data-slot="calendar-day"
            data-day={day.date.toLocaleDateString(locale?.code)}
            data-today={modifiers.today || undefined}
            data-outside={modifiers.outside || undefined}
            data-disabled={modifiers.disabled || undefined}
            data-selected-single={
                modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded-(--cell-radius) border-0 leading-none font-normal tabular-nums active:translate-y-0",
                "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-3 group-data-[focused=true]/day:ring-ring/50",
                // today: a dot, readable on every surface and in hc
                "data-today:font-medium data-today:after:absolute data-today:after:bottom-1 data-today:after:left-1/2 data-today:after:size-1 data-today:after:-translate-x-1/2 data-today:after:rounded-pill data-today:after:bg-primary-text",
                "data-outside:text-muted-foreground data-outside:hover:text-foreground",
                "data-disabled:line-through",
                "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-transparent data-[range-middle=true]:text-foreground data-[range-middle=true]:hover:bg-primary/15",
                "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-primary/85",
                "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-primary/85",
                "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary/85",
                // only today has the dot: an `after:` utility elsewhere would add a flex item and shift the number
                "data-today:data-[range-end=true]:after:bg-primary-foreground data-today:data-[range-start=true]:after:bg-primary-foreground data-today:data-[selected-single=true]:after:bg-primary-foreground",
                "[&>span]:text-xs [&>span]:opacity-70",
                defaultClassNames.day,
                className,
            )}
            {...props}
        />
    );
}

export {Calendar, CalendarDayButton};
