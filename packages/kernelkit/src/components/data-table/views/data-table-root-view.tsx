"use client";

import type {DataTableColumn} from "./data-table-view";
import {convertColumn, DataTableView} from "./data-table-view";

export class DataTableRootView<T> extends DataTableView<T> {
    constructor(columns: DataTableColumn<T>[], data: T[]) {
        super();
        this.columns = columns.map(convertColumn);
        this.data = data;
    }
    setColumns(columns: DataTableColumn<T>[]) {
        this.columns = columns.map(convertColumn);
        this.emitUpdate();
    }
    setData(data: T[]) {
        this.data = data;
        this.emitUpdate();
    }
}
