"use client";

import {cva} from "class-variance-authority";
import {cn} from "cn";
import {buttonVariants} from "kernelkit/components/button";
import {Spinner} from "kernelkit/components/spinner";
import {focusRing, heading} from "kernelkit/lib/recipes";
import {UploadIcon} from "lucide-react";
import * as React from "react";

/** Drop zone classes, exported so other drop targets can share the look. */
const fileUploadVariants = cva([
    "group/upload relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-input p-6 text-center text-balance select-none",
    "transition-[color,background-color,border-color,box-shadow] duration-100 motion-reduce:transition-none",
    focusRing,
    "hover:bg-hover",
    "data-drag-over:border-primary data-drag-over:bg-primary/5",
    "aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40",
    "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
    "data-loading:pointer-events-none data-loading:cursor-progress",
]);

interface FileUploadProps extends Omit<React.ComponentProps<"div">, "onChange" | "title"> {
    /** Same as the file input's `accept` (".csv,application/json", "image/*"…). */
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    /** Shows a spinner and blocks new files while an upload runs. */
    isLoading?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    /** Replaces the default "Browse files" affordance. */
    children?: React.ReactNode;
    /** Called with the picked or dropped files (never empty). */
    onChange?: (files: File[]) => void;
    /** Name of the hidden file input, for native form posts. */
    name?: string;
}

/** Drag-and-drop zone that also opens the file picker on click, Enter or Space. */
function FileUpload({
    accept,
    multiple,
    disabled,
    isLoading,
    title = "Upload files",
    description,
    children,
    onChange,
    name,
    className,
    ...props
}: FileUploadProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = React.useState(false);
    const inactive = disabled || isLoading;
    const titleId = React.useId();
    const descriptionId = React.useId();

    function handleFiles(fileList: FileList) {
        const files = Array.from(fileList);
        if (files.length > 0) {
            onChange?.(multiple ? files : files.slice(0, 1));
        }
    }

    function open() {
        if (!inactive) {
            inputRef.current?.click();
        }
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!inactive) {
            setIsDragOver(true);
        }
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        // ignore leaving into a child of the zone
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) {
            return;
        }
        setIsDragOver(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        if (!inactive && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }

    return (
        <div
            data-slot="file-upload"
            data-drag-over={isDragOver || undefined}
            data-disabled={disabled || undefined}
            data-loading={isLoading || undefined}
            role="button"
            tabIndex={inactive ? -1 : 0}
            aria-disabled={disabled || undefined}
            aria-busy={isLoading || undefined}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(fileUploadVariants(), className)}
            onClick={open}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    open();
                }
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            {...props}
        >
            <input
                ref={inputRef}
                data-slot="file-upload-input"
                type="file"
                name={name}
                accept={accept}
                multiple={multiple}
                disabled={inactive}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                    if (e.target.files) {
                        handleFiles(e.target.files);
                        e.target.value = "";
                    }
                }}
            />
            <div data-slot="file-upload-header" className="flex max-w-sm flex-col items-center gap-1">
                <div
                    data-slot="file-upload-icon"
                    className="mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-data-drag-over/upload:border-primary group-data-drag-over/upload:text-primary-text"
                >
                    {isLoading ? <Spinner /> : <UploadIcon className="pointer-events-none size-4 shrink-0" />}
                </div>
                {title ? (
                    <p id={titleId} data-slot="file-upload-title" className={cn(heading, "text-sm")}>
                        {title}
                    </p>
                ) : null}
                {description ? (
                    <p id={descriptionId} data-slot="file-upload-description" className="text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            {isLoading
                ? null
                : (children ?? (
                      // Visual affordance only: the whole zone is the button.
                      <span
                          data-slot="file-upload-browse"
                          aria-hidden
                          className={buttonVariants({variant: "outline", size: "sm", className: "pointer-events-none"})}
                      >
                          Browse files
                      </span>
                  ))}
        </div>
    );
}

export {FileUpload, fileUploadVariants};
export type {FileUploadProps};
