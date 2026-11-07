"use client";

import type {DataTableViewListener} from "./data-table-view";
import {DataTableView} from "./data-table-view";

export type DataTableFilterFn = (cell: any) => boolean;

export type DataTableFiltersValue = {[K: string]: DataTableFilterFn};

export class DataTableFilterView<T> extends DataTableView<T> {
    private parent: DataTableView<T>;
    private filters: DataTableFiltersValue;
    private parentListener: DataTableViewListener<T>;

    constructor(parent: DataTableView<T>, filters: DataTableFiltersValue = {}) {
        super();
        this.parent = parent;
        this.filters = filters;

        this.parentListener = () => {
            this.filterParentData();
            this.emitUpdate();
        };
        this.setParent(parent);
    }
    setParent(parent: DataTableView<T>) {
        // unregister previous
        this.parent.offUpdate(this.parentListener);

        this.parent = parent;
        this.parent.onUpdate(this.parentListener);

        this.filterParentData();
        this.emitUpdate();
    }
    setFilters(filters: DataTableFiltersValue = {}) {
        this.filters = filters;
        this.filterParentData();
        this.emitUpdate();
    }
    getFilters() {
        return this.filters;
    }

    // process
    private filterParentData() {
        const parentData = this.parent.getData();
        const columns = this.getColumns();
        const filters = this.filters;
        this.data = parentData.filter((row) => {
            for (const {id, rawCell} of columns) {
                if (id in filters) {
                    const filter = filters[id];
                    if (filter !== undefined) {
                        const cellData = rawCell(row);
                        if (!filter(cellData)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        });
    }

    // data flow
    getColumns() {
        // columns same as parent
        return this.parent.getColumns();
    }
    getRowProps(row: T) {
        // row props same as parent
        return this.parent.getRowProps(row);
    }
}
