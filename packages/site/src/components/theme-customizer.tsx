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
import {cn} from "@repraze/kernelkit/lib/utils";
import {type Accent, ACCENTS, type Mode, RADII, type Radius, useTheme} from "@repraze/kernelkit/provider";
import {CheckIcon, MonitorIcon, MoonIcon, PaletteIcon, SunIcon} from "lucide-react";

const MODE_ICONS = {system: MonitorIcon, light: SunIcon, dark: MoonIcon} as const;

/** Swatch per accent: the vivid fill tier, with that accent's own on-fill color for the check mark. */
const swatch = (accent: Accent) => ({
    background: `var(--tc-accent-${accent}-accent-fill)`,
    color: `var(--tc-accent-${accent}-on-accent-fill)`,
});

export function ThemeCustomizer() {
    const theme = useTheme();
    return (
        <Popover>
            <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Customize theme" />}>
                <PaletteIcon />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 gap-4">
                <PopoverHeader>
                    <PopoverTitle className="font-mono">Theme</PopoverTitle>
                </PopoverHeader>
                <Field label="Mode">
                    <ToggleGroup
                        variant="outline"
                        size="sm"
                        value={[theme.mode]}
                        onValueChange={(v) => v[0] && theme.setMode(v[0] as Mode)}
                        className="w-full"
                    >
                        {(Object.keys(MODE_ICONS) as Mode[]).map((mode) => {
                            const Icon = MODE_ICONS[mode];
                            return (
                                <ToggleGroupItem key={mode} value={mode} className="flex-1 capitalize">
                                    <Icon /> {mode}
                                </ToggleGroupItem>
                            );
                        })}
                    </ToggleGroup>
                </Field>
                <Field label="Accent">
                    <AccentPicker />
                </Field>
                <Field label="Radius">
                    <RadiusPicker />
                </Field>
                <div className="flex items-center justify-between">
                    <Label htmlFor="kk-contrast">High contrast</Label>
                    <Switch
                        id="kk-contrast"
                        checked={theme.contrast === "high"}
                        onCheckedChange={(on) => theme.setContrast(on ? "high" : "normal")}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-muted-foreground uppercase">{label}</span>
            {children}
        </div>
    );
}

export function ModeToggle() {
    const {resolvedMode, setMode} = useTheme();
    const Icon = resolvedMode === "dark" ? MoonIcon : SunIcon;
    return (
        <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setMode(resolvedMode === "dark" ? "light" : "dark")}
        >
            <Icon />
        </Button>
    );
}

/** The eight TermiColor accents as swatches; sets the site's accent. */
export function AccentPicker({className}: {className?: string}) {
    const theme = useTheme();
    return (
        <div className={cn("grid grid-cols-8 gap-1.5", className)}>
            {ACCENTS.map((accent) => (
                <Tooltip key={accent}>
                    <TooltipTrigger
                        render={
                            <button
                                type="button"
                                aria-label={accent}
                                aria-pressed={theme.accent === accent}
                                onClick={() => theme.setAccent(accent)}
                                style={swatch(accent)}
                                className={cn(
                                    "flex aspect-square items-center justify-center rounded-md outline-none",
                                    "ring-offset-2 ring-offset-transparent focus-visible:ring-2 focus-visible:ring-ring",
                                    theme.accent === accent && "ring-2 ring-foreground",
                                )}
                            />
                        }
                    >
                        {theme.accent === accent ? <CheckIcon className="size-3.5" strokeWidth={3} /> : null}
                    </TooltipTrigger>
                    <TooltipContent className="capitalize">{accent}</TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}

/** The radius scale; sets the site's radius. */
export function RadiusPicker({className}: {className?: string}) {
    const theme = useTheme();
    return (
        <ToggleGroup
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
