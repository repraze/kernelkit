"use client";

import {checkboxVariants} from "@repraze/kernelkit/components/checkbox";
import {Spinner} from "@repraze/kernelkit/components/spinner";
import {rowIndicator} from "@repraze/kernelkit/lib/recipes";
import {useVirtualizer} from "@tanstack/react-virtual";
import {cva} from "class-variance-authority";
import {cn} from "cn";
import {
    CheckIcon,
    ChevronRightIcon,
    FileCodeIcon,
    FileIcon,
    FileImageIcon,
    FileJsonIcon,
    FileTextIcon,
    FolderIcon,
    FolderOpenIcon,
    MinusIcon,
} from "lucide-react";
import * as React from "react";

/* ------------------------------------------------------------------------------------------------
 * Data
 * ----------------------------------------------------------------------------------------------*/

interface TreeNode<T = unknown> {
    /** Unique across the whole tree. */
    id: string;
    label: React.ReactNode;
    /** Text for type-ahead and the default filter when `label` is not a string. */
    textValue?: string;
    /** Leading icon (FileTree picks one when omitted). */
    icon?: React.ReactNode;
    /** Trailing slot: a badge, a status dot, a size. */
    meta?: React.ReactNode;
    children?: TreeNode<T>[];
    /** A branch whose children are not loaded yet: expanding it calls `onLoadChildren`. */
    hasChildren?: boolean;
    disabled?: boolean;
    data?: T;
}

type TreeSelectionMode = "none" | "single" | "multiple" | "checkbox";
type TreeCheckState = "checked" | "indeterminate" | "unchecked";

/** One visible row: the flattened tree is a plain array, so expand/collapse and virtualization are O(rows). */
interface TreeRow<T = unknown> {
    node: TreeNode<T>;
    level: number;
    parentId: string | null;
    posInSet: number;
    setSize: number;
    isBranch: boolean;
}

const textOf = (node: TreeNode<unknown>) =>
    node.textValue ?? (typeof node.label === "string" || typeof node.label === "number" ? String(node.label) : "");

const isBranch = (node: TreeNode<unknown>) => !!node.children?.length || !!node.hasChildren;

/** id → node and id → parent id, built once per `nodes`. */
function indexTree<T>(nodes: TreeNode<T>[]) {
    const byId = new Map<string, TreeNode<T>>();
    const parentOf = new Map<string, string | null>();
    const stack: [TreeNode<T>, string | null][] = nodes.map((n) => [n, null]);
    while (stack.length) {
        const [node, parent] = stack.pop()!;
        byId.set(node.id, node);
        parentOf.set(node.id, parent);
        for (const child of node.children ?? []) {
            stack.push([child, node.id]);
        }
    }
    return {byId, parentOf};
}

/** Ids kept by a filter: matches plus their ancestors. Branches holding a match are shown expanded. */
function filterTree<T>(nodes: TreeNode<T>[], match: (node: TreeNode<T>) => boolean) {
    const keep = new Set<string>();
    const visit = (node: TreeNode<T>): boolean => {
        let kept = match(node);
        for (const child of node.children ?? []) {
            kept = visit(child) || kept;
        }
        if (kept) {
            keep.add(node.id);
        }
        return kept;
    };
    nodes.forEach(visit);
    return keep;
}

function flattenTree<T>(nodes: TreeNode<T>[], expanded: ReadonlySet<string>, keep: ReadonlySet<string> | null) {
    const rows: TreeRow<T>[] = [];
    const walk = (list: TreeNode<T>[], level: number, parentId: string | null) => {
        const shown = keep ? list.filter((n) => keep.has(n.id)) : list;
        shown.forEach((node, i) => {
            const branch = isBranch(node);
            rows.push({node, level, parentId, posInSet: i + 1, setSize: shown.length, isBranch: branch});
            const open = keep ? branch : expanded.has(node.id);
            if (open && node.children) {
                walk(node.children, level + 1, node.id);
            }
        });
    };
    walk(nodes, 0, null);
    return rows;
}

function descendantIds<T>(node: TreeNode<T>, out: string[] = []) {
    for (const child of node.children ?? []) {
        if (!child.disabled) {
            out.push(child.id);
            descendantIds(child, out);
        }
    }
    return out;
}

/** Checkbox mode: a branch is checked when every enabled child is, indeterminate when some are. */
function checkStates<T>(nodes: TreeNode<T>[], checked: ReadonlySet<string>) {
    const states = new Map<string, TreeCheckState>();
    const visit = (node: TreeNode<T>): TreeCheckState => {
        const children = (node.children ?? []).filter((c) => !c.disabled);
        if (!children.length) {
            const state = checked.has(node.id) ? "checked" : "unchecked";
            states.set(node.id, state);
            node.children?.forEach(visit);
            return state;
        }
        const childStates = (node.children ?? []).map((c) => [c.disabled, visit(c)] as const);
        const enabled = childStates.filter(([disabled]) => !disabled).map(([, s]) => s);
        const state: TreeCheckState = enabled.every((s) => s === "checked")
            ? "checked"
            : enabled.some((s) => s !== "unchecked")
              ? "indeterminate"
              : "unchecked";
        states.set(node.id, state);
        return state;
    };
    nodes.forEach(visit);
    return states;
}

/** Uncontrolled-or-controlled `string[]` state, exposed as a Set. */
function useIdSet(value: string[] | undefined, defaultValue: string[] | undefined, onChange?: (ids: string[]) => void) {
    const [inner, setInner] = React.useState<string[]>(defaultValue ?? []);
    const current = value ?? inner;
    const set = React.useMemo(() => new Set(current), [current]);
    const controlled = value !== undefined;
    const onChangeRef = React.useRef(onChange);
    onChangeRef.current = onChange;
    const update = React.useCallback(
        (next: Set<string>) => {
            const ids = [...next];
            if (!controlled) {
                setInner(ids);
            }
            onChangeRef.current?.(ids);
        },
        [controlled],
    );
    return [set, update] as const;
}

/* ------------------------------------------------------------------------------------------------
 * Styles
 * ----------------------------------------------------------------------------------------------*/

const treeVariants = cva(
    "group/tree relative flex w-full min-w-0 flex-col text-sm outline-none select-none data-virtual:overflow-y-auto",
);

/**
 * Row content. Follows the sidebar (GUIDELINES §7c): hover wash, the selected row gets the accent tint,
 * medium weight and a primary icon, with the 2px indicator on the tree line (nested) or the row's left
 * edge (top level). The keyboard-focused row gets an inset ring while the tree has visible focus.
 */
const treeItemVariants = cva(
    [
        "relative flex min-w-0 flex-1 items-center gap-1.5 rounded-md ps-1 pe-2 text-muted-foreground",
        "transition-[color,background-color,box-shadow] duration-100 motion-reduce:transition-none",
        "group-data-[branch]/tree-item:text-foreground group-hover/tree-item:bg-hover group-hover/tree-item:text-foreground",
        "group-focus-visible/tree:group-data-focused/tree-item:inset-ring-2 group-focus-visible/tree:group-data-focused/tree-item:inset-ring-ring",
        rowIndicator,
        "group-data-[level='0']/tree-item:group-data-selected/tree-item:after:opacity-100",
        "group-data-selected/tree-item:bg-primary-tint group-data-selected/tree-item:font-medium group-data-selected/tree-item:text-foreground group-data-selected/tree-item:[&_[data-slot=tree-item-icon]>svg:not([class*='text-'])]:text-primary-text",
        "group-data-disabled/tree-item:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    ],
    {
        variants: {
            size: {
                xs: "h-6 text-xs [&_[data-slot=tree-item-icon]>svg]:size-3.5",
                sm: "h-7 text-[0.8rem] [&_[data-slot=tree-item-icon]>svg]:size-3.5",
                default: "h-8 text-sm [&_[data-slot=tree-item-icon]>svg]:size-4",
            },
        },
        defaultVariants: {size: "default"},
    },
);

const ROW_HEIGHT = {xs: 24, sm: 28, default: 32} as const;

/* ------------------------------------------------------------------------------------------------
 * Tree
 * ----------------------------------------------------------------------------------------------*/

interface TreeRenderState {
    level: number;
    expanded: boolean;
    selected: boolean;
    checked: TreeCheckState;
    loading: boolean;
}

interface TreeProps<T = unknown> extends Omit<React.ComponentProps<"div">, "children" | "onSelect"> {
    nodes: TreeNode<T>[];
    /** `none`: click only expands. `single`/`multiple` (Ctrl/⌘ toggles, Shift extends). `checkbox`: tri-state boxes. */
    selectionMode?: TreeSelectionMode;
    /** Selected ids (checked ids in checkbox mode, parents included when all their children are). */
    selected?: string[];
    defaultSelected?: string[];
    onSelectedChange?: (ids: string[]) => void;
    /** Expanded branch ids. */
    expanded?: string[];
    defaultExpanded?: string[];
    onExpandedChange?: (ids: string[]) => void;
    /** Enter or click on a row (open a file, navigate). */
    onAction?: (node: TreeNode<T>) => void;
    /** Load a lazy branch (`hasChildren` without `children`); the row shows a spinner until it resolves. */
    onLoadChildren?: (node: TreeNode<T>) => Promise<void>;
    /** Show only matching nodes and their ancestors (expanded). */
    filter?: string | ((node: TreeNode<T>) => boolean);
    /** Clicking a branch row toggles it as well as selecting it. */
    toggleOnClick?: boolean;
    /** Render only the rows in view. Give the tree a height (`className="h-80"`): it becomes the scroller. */
    virtual?: boolean;
    /** Indent guides under each branch. */
    guides?: boolean;
    size?: "xs" | "sm" | "default";
    /** Custom label content; the row keeps its toggle, checkbox, icon and meta slots. */
    renderLabel?: (node: TreeNode<T>, state: TreeRenderState) => React.ReactNode;
    /** Icon when the node has none (FileTree uses this). */
    getIcon?: (node: TreeNode<T>, state: TreeRenderState) => React.ReactNode;
    /** Shown when there are no rows (nothing matches the filter). */
    empty?: React.ReactNode;
}

function Tree<T = unknown>({
    nodes,
    selectionMode = "single",
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    expanded: expandedProp,
    defaultExpanded,
    onExpandedChange,
    onAction,
    onLoadChildren,
    filter,
    toggleOnClick = true,
    virtual = false,
    guides = true,
    size = "default",
    renderLabel,
    getIcon,
    empty,
    className,
    id: idProp,
    onKeyDown,
    onFocus,
    ...props
}: TreeProps<T>) {
    const autoId = React.useId();
    const treeId = idProp ?? autoId;
    const rowId = (nodeId: string) => `${treeId}-${nodeId}`;

    const [expanded, setExpanded] = useIdSet(expandedProp, defaultExpanded, onExpandedChange);
    const [selected, setSelected] = useIdSet(selectedProp, defaultSelected, onSelectedChange);
    const [loading, setLoading] = React.useState<ReadonlySet<string>>(() => new Set());

    const index = React.useMemo(() => indexTree(nodes), [nodes]);
    const keep = React.useMemo(() => {
        if (filter === undefined || filter === "") {
            return null;
        }
        if (typeof filter === "function") {
            return filterTree(nodes, filter);
        }
        const q = filter.toLowerCase();
        return filterTree(nodes, (n) => textOf(n).toLowerCase().includes(q));
    }, [nodes, filter]);
    const rows = React.useMemo(() => flattenTree(nodes, expanded, keep), [nodes, expanded, keep]);
    const rowIndex = React.useMemo(() => new Map(rows.map((r, i) => [r.node.id, i])), [rows]);
    const checks = React.useMemo(
        () => (selectionMode === "checkbox" ? checkStates(nodes, selected) : null),
        [selectionMode, nodes, selected],
    );

    const [focusedId, setFocusedId] = React.useState<string | null>(null);
    // tabbing in lands on the first visible selected row (WAI-ARIA tree), else the first row; this also
    // covers a focused row that disappeared (collapsed ancestor, filter)
    const focused =
        focusedId !== null && rowIndex.has(focusedId)
            ? focusedId
            : (rows.find((r) => selected.has(r.node.id))?.node.id ?? rows[0]?.node.id ?? null);
    const anchor = React.useRef<string | null>(null);

    /* ---------- actions ---------- */

    const toggleExpanded = (node: TreeNode<T>, open?: boolean) => {
        if (!isBranch(node) || keep) {
            return;
        }
        const isOpen = expanded.has(node.id);
        const next = open ?? !isOpen;
        if (next === isOpen) {
            return;
        }
        const ids = new Set(expanded);
        if (next) {
            ids.add(node.id);
        } else {
            ids.delete(node.id);
        }
        setExpanded(ids);
        if (next && !node.children && node.hasChildren && onLoadChildren && !loading.has(node.id)) {
            setLoading((s) => new Set(s).add(node.id));
            onLoadChildren(node).finally(() =>
                setLoading((s) => {
                    const n = new Set(s);
                    n.delete(node.id);
                    return n;
                }),
            );
        }
    };

    const toggleChecked = (node: TreeNode<T>) => {
        const state = checks?.get(node.id) ?? "unchecked";
        const ids = new Set(selected);
        const affected = [node.id, ...descendantIds(node)];
        for (const id of affected) {
            if (state === "checked") {
                ids.delete(id);
            } else {
                ids.add(id);
            }
        }
        // ancestors follow their children
        let parent = index.parentOf.get(node.id) ?? null;
        while (parent) {
            const p = index.byId.get(parent)!;
            const enabled = (p.children ?? []).filter((c) => !c.disabled);
            if (enabled.every((c) => ids.has(c.id))) {
                ids.add(parent);
            } else {
                ids.delete(parent);
            }
            parent = index.parentOf.get(parent) ?? null;
        }
        setSelected(ids);
    };

    const select = (node: TreeNode<T>, mode: "replace" | "toggle" | "range") => {
        if (node.disabled || selectionMode === "none") {
            return;
        }
        if (selectionMode === "checkbox") {
            toggleChecked(node);
            return;
        }
        if (selectionMode === "single" || mode === "replace") {
            anchor.current = node.id;
            setSelected(new Set([node.id]));
            return;
        }
        if (mode === "toggle") {
            anchor.current = node.id;
            const ids = new Set(selected);
            if (ids.has(node.id)) {
                ids.delete(node.id);
            } else {
                ids.add(node.id);
            }
            setSelected(ids);
            return;
        }
        const from = rowIndex.get(anchor.current ?? node.id) ?? rowIndex.get(node.id)!;
        const to = rowIndex.get(node.id)!;
        const [a, b] = from < to ? [from, to] : [to, from];
        setSelected(
            new Set(
                rows
                    .slice(a, b + 1)
                    .filter((r) => !r.node.disabled)
                    .map((r) => r.node.id),
            ),
        );
    };

    /* ---------- focus & scrolling ---------- */

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const [scrollEl, setScrollEl] = React.useState<HTMLDivElement | null>(null);
    const virtualizer = useVirtualizer({
        count: virtual ? rows.length : 0,
        getScrollElement: () => scrollEl,
        estimateSize: () => ROW_HEIGHT[size],
        overscan: 12,
    });

    const focusRow = (i: number) => {
        const row = rows[Math.max(0, Math.min(rows.length - 1, i))];
        if (!row) {
            return;
        }
        setFocusedId(row.node.id);
        if (virtual) {
            virtualizer.scrollToIndex(rowIndex.get(row.node.id)!, {align: "auto"});
        } else {
            document.getElementById(rowId(row.node.id))?.scrollIntoView({block: "nearest"});
        }
    };

    /* ---------- keyboard (WAI-ARIA tree pattern) ---------- */

    const typeahead = React.useRef({text: "", at: 0});

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || !rows.length) {
            return;
        }
        const i = focused !== null ? rowIndex.get(focused)! : 0;
        const row = rows[i]!;
        const node = row.node;
        const multi = selectionMode === "multiple";
        const handled = () => e.preventDefault();

        switch (e.key) {
            case "ArrowDown":
            case "ArrowUp": {
                handled();
                const next = i + (e.key === "ArrowDown" ? 1 : -1);
                focusRow(next);
                if (multi && e.shiftKey && rows[next]) {
                    select(rows[next].node, "range");
                }
                return;
            }
            case "ArrowRight":
                handled();
                if (row.isBranch && !keep && !expanded.has(node.id)) {
                    toggleExpanded(node, true);
                } else if (row.isBranch && rows[i + 1]?.parentId === node.id) {
                    focusRow(i + 1);
                }
                return;
            case "ArrowLeft":
                handled();
                if (row.isBranch && !keep && expanded.has(node.id)) {
                    toggleExpanded(node, false);
                } else if (row.parentId !== null) {
                    focusRow(rowIndex.get(row.parentId)!);
                }
                return;
            case "Home":
                handled();
                focusRow(0);
                return;
            case "End":
                handled();
                focusRow(rows.length - 1);
                return;
            case "Enter":
                handled();
                if (selectionMode !== "checkbox") {
                    select(node, "replace");
                }
                if (onAction) {
                    onAction(node);
                } else {
                    toggleExpanded(node);
                }
                return;
            case " ":
                handled();
                if (selectionMode === "none") {
                    toggleExpanded(node);
                } else {
                    select(node, multi ? (e.shiftKey ? "range" : "toggle") : "replace");
                }
                return;
            case "*": {
                handled();
                const siblings = rows.filter((r) => r.parentId === row.parentId && r.isBranch).map((r) => r.node.id);
                setExpanded(new Set([...expanded, ...siblings]));
                return;
            }
            case "a":
                if (multi && (e.ctrlKey || e.metaKey)) {
                    handled();
                    setSelected(new Set(rows.filter((r) => !r.node.disabled).map((r) => r.node.id)));
                    return;
                }
                break;
        }

        // type-ahead: printable characters jump to the next row whose text starts with what was typed
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const now = Date.now();
            const t = typeahead.current;
            t.text = now - t.at > 600 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
            t.at = now;
            const start = t.text.length === 1 ? i + 1 : i;
            for (let k = 0; k < rows.length; k++) {
                const j = (start + k) % rows.length;
                if (textOf(rows[j]!.node).toLowerCase().startsWith(t.text)) {
                    handled();
                    focusRow(j);
                    return;
                }
            }
        }
    };

    const handleRowClick = (e: React.MouseEvent, row: TreeRow<T>) => {
        const node = row.node;
        setFocusedId(node.id);
        if (selectionMode === "checkbox") {
            if (row.isBranch && toggleOnClick) {
                toggleExpanded(node);
            } else {
                toggleChecked(node);
            }
            return;
        }
        select(node, e.shiftKey ? "range" : e.metaKey || e.ctrlKey ? "toggle" : "replace");
        if (row.isBranch && toggleOnClick && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
            toggleExpanded(node);
        }
        if (!row.isBranch || !toggleOnClick) {
            onAction?.(node);
        }
    };

    /* ---------- render ---------- */

    // actions read the latest render's state through this ref, so memoized rows don't re-render on every change
    const handlers = React.useRef({handleRowClick, toggleExpanded, toggleChecked});
    handlers.current = {handleRowClick, toggleExpanded, toggleChecked};
    const ctx = React.useMemo<RowContext<T>>(
        () => ({
            size,
            guides,
            selectionMode,
            renderLabel,
            getIcon,
            onRowClick: (e, row) => handlers.current.handleRowClick(e, row),
            onToggle: (row) => handlers.current.toggleExpanded(row.node),
            onCheck: (row) => handlers.current.toggleChecked(row.node),
        }),
        [size, guides, selectionMode, renderLabel, getIcon],
    );

    const renderRow = (row: TreeRow<T>, style?: React.CSSProperties) => (
        <TreeItemRow<T>
            key={row.node.id}
            id={rowId(row.node.id)}
            row={row}
            ctx={ctx}
            style={style}
            expanded={keep ? row.isBranch : expanded.has(row.node.id)}
            selected={selectionMode !== "checkbox" && selected.has(row.node.id)}
            checked={checks?.get(row.node.id) ?? "unchecked"}
            loading={loading.has(row.node.id)}
            focused={row.node.id === focused}
        />
    );

    return (
        <div
            ref={(el) => {
                rootRef.current = el;
                setScrollEl(el);
            }}
            id={treeId}
            role="tree"
            tabIndex={rows.length ? 0 : -1}
            aria-multiselectable={selectionMode === "multiple" || selectionMode === "checkbox" || undefined}
            aria-activedescendant={focused !== null ? rowId(focused) : undefined}
            data-slot="tree"
            data-size={size}
            data-virtual={virtual ? "" : undefined}
            className={cn(treeVariants(), className)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
                onFocus?.(e);
                if (focusedId === null && focused !== null) {
                    setFocusedId(focused);
                }
            }}
            {...props}
        >
            {!rows.length && empty}
            {virtual ? (
                <div
                    data-slot="tree-virtual-content"
                    role="presentation"
                    className="relative w-full shrink-0"
                    style={{height: virtualizer.getTotalSize()}}
                >
                    {virtualizer.getVirtualItems().map((item) =>
                        renderRow(rows[item.index]!, {
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: item.size,
                            transform: `translateY(${item.start}px)`,
                        }),
                    )}
                </div>
            ) : (
                rows.map((row) => renderRow(row))
            )}
        </div>
    );
}

/* ------------------------------------------------------------------------------------------------
 * Row
 * ----------------------------------------------------------------------------------------------*/

interface RowContext<T> {
    size: "xs" | "sm" | "default";
    guides: boolean;
    selectionMode: TreeSelectionMode;
    renderLabel?: (node: TreeNode<T>, state: TreeRenderState) => React.ReactNode;
    getIcon?: (node: TreeNode<T>, state: TreeRenderState) => React.ReactNode;
    onRowClick: (e: React.MouseEvent, row: TreeRow<T>) => void;
    onToggle: (row: TreeRow<T>) => void;
    onCheck: (row: TreeRow<T>) => void;
}

interface TreeItemRowProps<T> {
    id: string;
    row: TreeRow<T>;
    ctx: RowContext<T>;
    style?: React.CSSProperties;
    expanded: boolean;
    selected: boolean;
    checked: TreeCheckState;
    loading: boolean;
    focused: boolean;
}

function TreeItemRowImpl<T>({id, row, ctx, style, expanded, selected, checked, loading, focused}: TreeItemRowProps<T>) {
    const {node, level, isBranch: branch} = row;
    const state: TreeRenderState = {level, expanded, selected, checked, loading};
    const icon = node.icon ?? ctx.getIcon?.(node, state);
    const checkbox = ctx.selectionMode === "checkbox";

    return (
        <div
            id={id}
            role="treeitem"
            aria-level={level + 1}
            aria-posinset={row.posInSet}
            aria-setsize={row.setSize}
            aria-expanded={branch ? expanded : undefined}
            aria-selected={!checkbox && ctx.selectionMode !== "none" ? selected : undefined}
            aria-checked={checkbox ? (checked === "indeterminate" ? "mixed" : checked === "checked") : undefined}
            aria-disabled={node.disabled || undefined}
            aria-busy={loading || undefined}
            data-slot="tree-item"
            data-level={level}
            data-branch={branch ? "" : undefined}
            data-expanded={branch && expanded ? "" : undefined}
            data-selected={selected ? "true" : undefined}
            data-focused={focused ? "" : undefined}
            data-disabled={node.disabled ? "" : undefined}
            className="group/tree-item flex cursor-pointer items-stretch ps-1"
            style={style}
            onClick={(e) => ctx.onRowClick(e, row)}
        >
            {ctx.guides
                ? Array.from({length: level}, (_, d) => (
                      <span
                          key={d}
                          aria-hidden
                          data-slot="tree-guide"
                          className={cn(
                              // one column per ancestor; the line sits under that ancestor's chevron
                              "relative w-5 shrink-0 before:absolute before:inset-y-0 before:start-[11px] before:w-px before:bg-border",
                              // current row (§7c): the 2px accent indicator sits on its parent's line
                              d === level - 1 &&
                                  "group-data-selected/tree-item:before:start-[10.5px] group-data-selected/tree-item:before:w-0.5 group-data-selected/tree-item:before:bg-primary-text",
                          )}
                      />
                  ))
                : level > 0 && <span aria-hidden className="shrink-0" style={{width: `${level * 1.25}rem`}} />}
            <div data-slot="tree-item-content" className={treeItemVariants({size: ctx.size})}>
                <span
                    data-slot="tree-item-toggle"
                    aria-hidden
                    className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
                    onClick={(e) => {
                        if (branch) {
                            e.stopPropagation();
                            ctx.onToggle(row);
                        }
                    }}
                >
                    {loading ? (
                        <Spinner size="xs" role="presentation" aria-label={undefined} />
                    ) : branch ? (
                        <ChevronRightIcon className="size-3.5 transition-transform duration-100 group-data-expanded/tree-item:rotate-90 motion-reduce:transition-none rtl:-scale-x-100 rtl:group-data-expanded/tree-item:-rotate-90" />
                    ) : null}
                </span>
                {checkbox && (
                    <span
                        aria-hidden
                        data-slot="tree-item-checkbox"
                        data-checked={checked === "checked" ? "" : undefined}
                        data-indeterminate={checked === "indeterminate" ? "" : undefined}
                        className={cn(checkboxVariants(), "after:hidden")}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!node.disabled) {
                                ctx.onCheck(row);
                            }
                        }}
                    >
                        {checked === "checked" && <CheckIcon strokeWidth={3} className="size-3.5" />}
                        {checked === "indeterminate" && <MinusIcon strokeWidth={3} className="size-3.5" />}
                    </span>
                )}
                {icon && (
                    <span data-slot="tree-item-icon" className="flex shrink-0 text-muted-foreground">
                        {icon}
                    </span>
                )}
                <span data-slot="tree-item-label" className="min-w-0 flex-1 truncate">
                    {ctx.renderLabel ? ctx.renderLabel(node, state) : node.label}
                </span>
                {node.meta && (
                    <span
                        data-slot="tree-item-meta"
                        className="flex shrink-0 items-center gap-1 font-alt text-xs font-normal text-muted-foreground"
                    >
                        {node.meta}
                    </span>
                )}
            </div>
        </div>
    );
}

const TreeItemRow = React.memo(TreeItemRowImpl) as typeof TreeItemRowImpl;

/* ------------------------------------------------------------------------------------------------
 * FileTree
 * ----------------------------------------------------------------------------------------------*/

const CODE = /\.(tsx?|jsx?|mjs|cjs|css|scss|html|py|rs|go|rb|java|c|cpp|h|sh|sql|vue|svelte)$/i;
const IMAGE = /\.(png|jpe?g|gif|svg|webp|avif|ico)$/i;
const TEXT = /\.(md|mdx|txt|rst|log)$/i;

/** Folder / file icons by extension. */
function fileIcon(node: TreeNode<unknown>, state: TreeRenderState): React.ReactNode {
    if (isBranch(node)) {
        return state.expanded ? <FolderOpenIcon /> : <FolderIcon />;
    }
    const name = textOf(node);
    if (/\.json$/i.test(name)) {
        return <FileJsonIcon />;
    }
    if (CODE.test(name)) {
        return <FileCodeIcon />;
    }
    if (IMAGE.test(name)) {
        return <FileImageIcon />;
    }
    if (TEXT.test(name)) {
        return <FileTextIcon />;
    }
    return <FileIcon />;
}

/** A Tree preset for paths: folder/file icons, compact rows. */
function FileTree<T = unknown>({size = "sm", getIcon = fileIcon, ...props}: TreeProps<T>) {
    return <Tree<T> data-variant="file" size={size} getIcon={getIcon} {...props} />;
}

/** Build TreeNodes from slash-separated paths (`src/components/tree.tsx`). Folders sort first. */
function treeFromPaths(paths: string[]): TreeNode[] {
    const root: TreeNode[] = [];
    const folders = new Map<string, TreeNode>();
    for (const path of paths) {
        const parts = path.split("/").filter(Boolean);
        let list = root;
        parts.forEach((part, i) => {
            const id = parts.slice(0, i + 1).join("/");
            const leaf = i === parts.length - 1;
            if (leaf) {
                list.push({id, label: part});
                return;
            }
            let folder = folders.get(id);
            if (!folder) {
                folder = {id, label: part, children: []};
                folders.set(id, folder);
                list.push(folder);
            }
            list = folder.children!;
        });
    }
    const sort = (list: TreeNode[]) => {
        list.sort((a, b) => Number(isBranch(b)) - Number(isBranch(a)) || textOf(a).localeCompare(textOf(b)));
        list.forEach((n) => n.children && sort(n.children));
    };
    sort(root);
    return root;
}

export {fileIcon, FileTree, flattenTree, Tree, treeFromPaths, treeItemVariants, treeVariants};
export type {TreeCheckState, TreeNode, TreeProps, TreeRenderState, TreeRow, TreeSelectionMode};
