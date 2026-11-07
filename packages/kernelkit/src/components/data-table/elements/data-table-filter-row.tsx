"use client";

import {cn} from "cn";
import {Input} from "kernelkit/components/input";
import {NativeSelect, NativeSelectOption} from "kernelkit/components/native-select";
import type {ChangeEventHandler, ComponentProps, ComponentType} from "react";
import {useCallback} from "react";

import type {DataTableFilterFn, DataTableFilterView} from "../views/data-table-filter-view";
import type {DataTableView, DataTableViewColumn} from "../views/data-table-view";
import {useDataTableViewDetector} from "../views/data-table-view";
import type {DataTableCellProps} from "./data-table-cell";
import {DataTableRow} from "./data-table-row";

export type DataTableFilterCellProps = DataTableCellProps & {
    onFilter: (filter: DataTableFilterFn) => void;
};

export type DataTableFilterRowProps<T> = {
    className?: string;
    view: DataTableView<T>;
    filterView: DataTableFilterView<T>;
    filters?: {[K: string]: ComponentType<DataTableFilterCellProps>};
};

export function DataTableFilterRow<T>({className, view, filterView, filters, ...props}: DataTableFilterRowProps<T>) {
    const {columns} = useDataTableViewDetector<T>({view});
    const handleFilter = useCallback(
        (columnId: string, filter: DataTableFilterFn) => {
            const filters = filterView.getFilters();
            // not making a copy for speed
            filters[columnId] = filter;
            filterView.setFilters(filters);
        },
        [filterView],
    );
    const filterColumns = columns.map<DataTableViewColumn<undefined>>((column) => ({
        ...column,
        cell: () => {
            const columnId = column.id;
            const FilterCell = filters && columnId in filters ? filters[columnId] : undefined;
            if (FilterCell) {
                return <FilterCell onFilter={(filter) => handleFilter(columnId, filter)} />;
            } else {
                return null;
            }
        },
        cellProps: () => ({
            className: "px-1.5",
        }),
        rawCell: () => undefined,
    }));
    return (
        <DataTableRow
            className={cn("data-table-filter-row", className)}
            columns={filterColumns}
            data={undefined}
            head
            {...props}
        />
    );
}

type InputProps = ComponentProps<typeof Input>;

export type DataTableStringFilterProps = {
    exact?: boolean;
    sensitive?: boolean;
    inputProps?: InputProps;
};

export function createDataTableStringFilter({
    exact,
    sensitive,
    inputProps,
}: DataTableStringFilterProps = {}): ComponentType<DataTableFilterCellProps> {
    let method = (_fv: string, _rv: any) => false; // dummy
    if (exact) {
        if (sensitive) {
            method = (fv: string, rv: any) => !fv || `${rv}` === fv;
        } else {
            method = (fv: string, rv: any) => !fv || `${rv}`.toLowerCase() === fv.toLowerCase();
        }
    } else {
        if (sensitive) {
            method = (fv: string, rv: any) => !fv || `${rv}`.includes(fv);
        } else {
            method = (fv: string, rv: any) => !fv || `${rv}`.toLowerCase().includes(fv.toLowerCase());
        }
    }
    return function StringFilter({onFilter}) {
        return (
            <Input
                type="text"
                className="h-7 rounded-md px-2"
                onChange={(e) => onFilter(method.bind(undefined, e.target.value))}
                {...inputProps}
            />
        );
    };
}

export type DataTableNumberFilterProps = {
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    inputProps?: InputProps;
};

export function createDataTableNumberFilter({
    min,
    max,
    step,
    pattern,
    inputProps,
}: DataTableNumberFilterProps = {}): ComponentType<DataTableFilterCellProps> {
    const method = (fv: number, cv: any) => !fv || cv == fv; // weak equality to match strings to numbers
    return function NumberFilter({onFilter}) {
        return (
            <Input
                type="number"
                className="h-7 rounded-md px-2"
                min={min}
                max={max}
                step={step}
                pattern={pattern}
                onChange={(e) => onFilter(method.bind(undefined, e.target.valueAsNumber))}
                {...inputProps}
            />
        );
    };
}

export type DataTableDateFilterProps = DataTableNumberFilterProps;

const DAY = 1000 * 60 * 60 * 24;
export function createDataTableDateFilter({
    min,
    max,
    step,
    pattern,
    inputProps,
}: DataTableDateFilterProps = {}): ComponentType<DataTableFilterCellProps> {
    function withinDay(fv: Date, cv: any) {
        if (cv !== undefined) {
            const b = fv.getTime();
            const t = "getTime" in cv ? cv.getTime() : cv;
            return t >= b && t < b + DAY;
        }
        return false;
    }
    const method = (fv: Date | undefined, cv: any) => fv === undefined || withinDay(fv, cv); // within 1 day
    return function DateFilter({onFilter}) {
        const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
            (event) => {
                const date = event.target.valueAsDate;
                if (date) {
                    // force beginning of local day
                    date.setMilliseconds(0);
                    date.setSeconds(0);
                    date.setMinutes(0);
                    date.setHours(0);
                    onFilter(method.bind(undefined, date));
                } else {
                    onFilter(method.bind(undefined, undefined));
                }
            },
            [onFilter],
        );
        return (
            <Input
                type="date"
                className="h-7 rounded-md px-2"
                min={min}
                max={max}
                step={step}
                pattern={pattern}
                onChange={handleChange}
                {...inputProps}
            />
        );
    };
}

export type DataTableBooleanFilterProps = {
    selectProps?: Omit<ComponentProps<"select">, "size">;
};

enum BOOLEAN_FILTER_VALUE {
    All = "all",
    True = "true",
    False = "false",
}

export function createDataTableBooleanFilter({
    selectProps,
}: DataTableBooleanFilterProps = {}): ComponentType<DataTableFilterCellProps> {
    const method = (fv: boolean | undefined, cv: any) => fv === undefined || fv == cv; // weak equality
    return function BooleanFilter({onFilter}) {
        const handleChange: ChangeEventHandler<HTMLSelectElement> = useCallback(
            (event) => {
                const value = event.target.value;
                if (value === BOOLEAN_FILTER_VALUE.All) {
                    onFilter(method.bind(undefined, undefined));
                } else if (value === BOOLEAN_FILTER_VALUE.True) {
                    onFilter(method.bind(undefined, true));
                } else {
                    onFilter(method.bind(undefined, false));
                }
            },
            [onFilter],
        );
        return (
            <NativeSelect size="sm" className="w-full" onChange={handleChange} {...selectProps}>
                <NativeSelectOption value={BOOLEAN_FILTER_VALUE.All}>All</NativeSelectOption>
                <NativeSelectOption value={BOOLEAN_FILTER_VALUE.True}>Yes</NativeSelectOption>
                <NativeSelectOption value={BOOLEAN_FILTER_VALUE.False}>No</NativeSelectOption>
            </NativeSelect>
        );
    };
}
