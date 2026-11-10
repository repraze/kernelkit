"use client";

import {Button} from "@repraze/kernelkit/components/button";
import {Label} from "@repraze/kernelkit/components/label";
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@repraze/kernelkit/components/popover";
import {Switch} from "@repraze/kernelkit/components/switch";
import {ToggleGroup, ToggleGroupItem} from "@repraze/kernelkit/components/toggle-group";
import {Tooltip, TooltipContent, TooltipTrigger} from "@repraze/kernelkit/components/tooltip";
import {type Accent, ACCENTS, type Mode, RADII, type Radius, useTheme} from "@repraze/kernelkit/provider";
import {cn} from "cn";
import {CheckIcon, type LucideIcon, MonitorIcon, MoonIcon, RotateCcwIcon, SunIcon} from "lucide-react";
import * as React from "react";

/** Mode choices in display order, with the icon the trigger shows for each. */
const THEME_MODES: readonly {value: Mode; label: string; icon: LucideIcon}[] = [
    {value: "light", label: "Light", icon: SunIcon},
    {value: "dark", label: "Dark", icon: MoonIcon},
    {value: "system", label: "System", icon: MonitorIcon},
];

const modeOption = (mode: Mode) => THEME_MODES.find((m) => m.value === mode) ?? THEME_MODES[2]!;

/** The icon for the chosen mode (not the resolved one): sun, moon, or monitor for "system". */
function ThemeModeIcon({mode, ...props}: {mode?: Mode} & React.ComponentProps<LucideIcon>) {
    const theme = useTheme();
    const Icon = modeOption(mode ?? theme.mode).icon;
    return <Icon data-slot="theme-mode-icon" {...props} />;
}

/** Light / dark / system as a segmented control. */
function ThemeModePicker({className}: {className?: string}) {
    const theme = useTheme();
    return (
        <ToggleGroup
            data-slot="theme-mode-picker"
            aria-label="Mode"
            variant="outline"
            size="sm"
            value={[theme.mode]}
            onValueChange={(v) => v[0] && theme.setMode(v[0] as Mode)}
            className={cn("w-full", className)}
        >
            {THEME_MODES.map(({value, label, icon: Icon}) => (
                <ToggleGroupItem key={value} value={value} className="flex-1">
                    <Icon /> {label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

/** Swatch per accent: the vivid fill tier, with that accent's own on-fill color for the check mark. */
const swatch = (accent: Accent) => ({
    background: `var(--tc-accent-${accent}-accent-fill)`,
    color: `var(--tc-accent-${accent}-on-accent-fill)`,
});

/** The eight TermiColor accents as swatches; sets the theme's accent. */
function ThemeAccentPicker({className}: {className?: string}) {
    const theme = useTheme();
    return (
        <div
            data-slot="theme-accent-picker"
            role="group"
            aria-label="Accent"
            className={cn("grid grid-cols-8 gap-1.5", className)}
        >
            {ACCENTS.map((accent) => {
                const on = theme.accent === accent;
                return (
                    <Tooltip key={accent}>
                        <TooltipTrigger
                            render={
                                <button
                                    type="button"
                                    aria-label={accent}
                                    aria-pressed={on}
                                    onClick={() => theme.setAccent(accent)}
                                    style={swatch(accent)}
                                    className={cn(
                                        "flex aspect-square items-center justify-center rounded-md outline-none",
                                        "ring-offset-2 ring-offset-transparent transition-shadow duration-100 motion-reduce:transition-none",
                                        "hover:ring-2 hover:ring-input focus-visible:ring-2 focus-visible:ring-ring",
                                        on && "ring-2 ring-foreground hover:ring-foreground",
                                    )}
                                />
                            }
                        >
                            {on ? <CheckIcon className="size-3.5" strokeWidth={3} /> : null}
                        </TooltipTrigger>
                        <TooltipContent className="capitalize">{accent}</TooltipContent>
                    </Tooltip>
                );
            })}
        </div>
    );
}

/** The radius scale as a segmented control; sets the theme's radius. */
function ThemeRadiusPicker({className}: {className?: string}) {
    const theme = useTheme();
    return (
        <ToggleGroup
            data-slot="theme-radius-picker"
            aria-label="Radius"
            variant="outline"
            size="sm"
            value={[theme.radius]}
            onValueChange={(v) => v[0] && theme.setRadius(v[0] as Radius)}
            className={cn("w-full", className)}
        >
            {RADII.map((radius) => (
                <ToggleGroupItem key={radius} value={radius} className="flex-1 font-mono">
                    {radius}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

/** High contrast on/off, with its label. */
function ThemeContrastSwitch({className}: {className?: string}) {
    const theme = useTheme();
    const id = React.useId();
    return (
        <div data-slot="theme-contrast-switch" className={cn("flex items-center justify-between gap-2", className)}>
            <Label htmlFor={id}>High contrast</Label>
            <Switch
                id={id}
                checked={theme.contrast === "high"}
                onCheckedChange={(on) => theme.setContrast(on ? "high" : "normal")}
            />
        </div>
    );
}

/** A labelled block inside the menu. */
function ThemeMenuSection({
    label,
    children,
    className,
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div data-slot="theme-menu-section" className={cn("flex flex-col gap-2", className)}>
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            {children}
        </div>
    );
}

interface ThemeMenuProps extends Omit<React.ComponentProps<typeof Button>, "children" | "title"> {
    /** Popover title. */
    title?: React.ReactNode;
    /** Extra controls, after the built-in ones and before Reset. */
    children?: React.ReactNode;
    /** Popover alignment against the trigger. */
    align?: "start" | "center" | "end";
    contentClassName?: string;
}

/**
 * The suite's theme control (GUIDELINES §7b): one ghost icon button in `SiteHeaderActions` showing the
 * chosen mode (sun, moon, monitor), opening a popover with mode, accent, high contrast, radius and a
 * Reset to the provider's defaults. Reads and writes `useTheme()`, so it needs a `ThemeProvider`.
 * Trigger props (`aria-label`, `className`, `data-*`) pass through to the button.
 */
function ThemeMenu({title = "Theme", children, align = "end", contentClassName, className, ...props}: ThemeMenuProps) {
    const theme = useTheme();
    const {defaults} = theme;
    const isDefault =
        theme.mode === defaults.mode &&
        theme.accent === defaults.accent &&
        theme.contrast === defaults.contrast &&
        theme.radius === defaults.radius;
    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Theme: ${modeOption(theme.mode).label}`}
                        data-slot="theme-menu-trigger"
                        data-mode={theme.mode}
                        className={className}
                        {...props}
                    />
                }
            >
                <ThemeModeIcon />
            </PopoverTrigger>
            <PopoverContent data-slot="theme-menu-content" align={align} className={cn("w-72 gap-4", contentClassName)}>
                <PopoverHeader>
                    <PopoverTitle>{title}</PopoverTitle>
                </PopoverHeader>
                <ThemeMenuSection label="Mode">
                    <ThemeModePicker />
                </ThemeMenuSection>
                <ThemeMenuSection label="Accent">
                    <ThemeAccentPicker />
                </ThemeMenuSection>
                <ThemeContrastSwitch />
                <ThemeMenuSection label="Radius">
                    <ThemeRadiusPicker />
                </ThemeMenuSection>
                {children}
                <div className="-mx-3 -mb-3 border-t border-border p-3">
                    <Button
                        variant="outline"
                        size="sm"
                        data-slot="theme-menu-reset"
                        className="w-full"
                        disabled={isDefault}
                        onClick={theme.resetTheme}
                    >
                        <RotateCcwIcon data-icon="inline-start" /> Reset to defaults
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export {
    ThemeAccentPicker,
    ThemeContrastSwitch,
    ThemeMenu,
    ThemeMenuSection,
    ThemeModeIcon,
    ThemeModePicker,
    ThemeRadiusPicker,
};
export type {ThemeMenuProps};
