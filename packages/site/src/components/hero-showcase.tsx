import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@repraze/kernelkit/components/card";
import {Carousel, CarouselContent, CarouselDots, CarouselItem} from "@repraze/kernelkit/components/carousel";
import {Field, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {Label} from "@repraze/kernelkit/components/label";
import {Progress} from "@repraze/kernelkit/components/progress";
import {StatusDot} from "@repraze/kernelkit/components/status-dot";
import {Switch} from "@repraze/kernelkit/components/switch";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@repraze/kernelkit/components/table";
import {Tabs, TabsList, TabsTrigger} from "@repraze/kernelkit/components/tabs";
import {ThemeAccentPicker, ThemeRadiusPicker} from "@repraze/kernelkit/components/theme-menu";
import {useTheme} from "@repraze/kernelkit/provider";
import {FileTextIcon, SearchIcon, SlidersHorizontalIcon, TerminalIcon} from "lucide-react";
import type * as React from "react";

/** Every slide is the same height, so the hero keeps one size while it plays (and matches TermiColor's). */
const SLIDE = "h-88";

/** The hero's right column: the kit at work, then the knobs that restyle it. */
export function KitShowcase() {
    return (
        <Carousel autoplay={6000} opts={{loop: true}} aria-label="KernelKit showcase">
            <CarouselContent>
                <CarouselItem>
                    <DeploySlide />
                </CarouselItem>
                <CarouselItem>
                    <ProcessesSlide />
                </CarouselItem>
                <CarouselItem>
                    <CustomizeSlide />
                </CarouselItem>
                <CarouselItem>
                    <SearchSlide />
                </CarouselItem>
            </CarouselContent>
            <CarouselDots />
        </Carousel>
    );
}

function DeploySlide() {
    return (
        <Card className={SLIDE}>
            <CardHeader>
                <CardTitle>Deploy a service</CardTitle>
                <CardDescription>Forms with fields, descriptions and inline status.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="hs-service">Service</FieldLabel>
                            <Input id="hs-service" defaultValue="api-gateway" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="hs-branch">Branch</FieldLabel>
                            <Input id="hs-branch" defaultValue="main" />
                        </Field>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="hs-canary">Canary rollout</Label>
                        <Switch id="hs-canary" defaultChecked />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span>Rollout</span>
                            <span className="font-mono text-muted-foreground">64%</span>
                        </div>
                        <Progress value={64} />
                    </div>
                </FieldGroup>
            </CardContent>
            <CardFooter className="gap-2">
                <Button className="flex-1">Deploy</Button>
                <Button variant="outline">Preview</Button>
            </CardFooter>
        </Card>
    );
}

const PROCESSES = [
    {pid: 412, name: "kernelkit-docs", cpu: 12.4, status: "running"},
    {pid: 977, name: "tsc --watch", cpu: 3.8, status: "idle"},
    {pid: 1203, name: "vite", cpu: 41.0, status: "running"},
    {pid: 1388, name: "playwright", cpu: 0.0, status: "stopped"},
] as const;

const STATUS = {running: "success", idle: "warning", stopped: "danger"} as const;

function ProcessesSlide() {
    return (
        <Card className={SLIDE}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TerminalIcon className="size-4 text-primary-text" /> Processes
                </CardTitle>
                <CardDescription>Tables, tabs and status for dense consoles.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <Tabs defaultValue="all">
                    <TabsList variant="line">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="running">Running</TabsTrigger>
                        <TabsTrigger value="stopped">Stopped</TabsTrigger>
                    </TabsList>
                </Tabs>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>PID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">CPU</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PROCESSES.map((p) => (
                            <TableRow key={p.pid}>
                                <TableCell className="font-mono text-muted-foreground">{p.pid}</TableCell>
                                <TableCell className="font-mono">{p.name}</TableCell>
                                <TableCell>
                                    <StatusDot color={STATUS[p.status]}>{p.status}</StatusDot>
                                </TableCell>
                                <TableCell className="text-right font-mono">{p.cpu.toFixed(1)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

/** The real theme controls: changing them restyles the whole site, this slide included. */
function CustomizeSlide() {
    const theme = useTheme();
    return (
        <Card className={SLIDE}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontalIcon className="size-4 text-primary-text" /> Make it yours
                </CardTitle>
                <CardDescription>One accent, one radius, high contrast. Try them: the site follows.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
                <Knob label="Accent">
                    <ThemeAccentPicker />
                </Knob>
                <Knob label="Radius">
                    <ThemeRadiusPicker />
                </Knob>
                <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="hs-contrast" className="font-mono text-xs text-muted-foreground uppercase">
                        High contrast
                    </Label>
                    <Switch
                        id="hs-contrast"
                        checked={theme.contrast === "high"}
                        onCheckedChange={(on) => theme.setContrast(on ? "high" : "normal")}
                    />
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                    <Button size="sm">Save</Button>
                    <Button size="sm" variant="soft">
                        Preview
                    </Button>
                    <Button size="sm" variant="outline">
                        Reset
                    </Button>
                    <Badge variant="soft">beta</Badge>
                </div>
            </CardContent>
        </Card>
    );
}

function Knob({label, children}: {label: string; children: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-muted-foreground uppercase">{label}</span>
            {children}
        </div>
    );
}

const RESULTS = [
    {title: "Button", description: "Solid, soft, outline and ghost actions."},
    {title: "Sidebar", description: "Collapsible groups, badges, current row."},
    {title: "Site shell", description: "Header, layout, search, hero and footer."},
] as const;

/** A static picture of the search dialog (the real one opens with Ctrl K). */
function SearchSlide() {
    return (
        <Card className={SLIDE}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SearchIcon className="size-4 text-primary-text" /> Search everything
                </CardTitle>
                <CardDescription>
                    The suite's command palette: <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> or <Kbd>/</Kbd>.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-popover">
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-sm">
                        <SearchIcon className="size-4 text-muted-foreground" />
                        <span>side</span>
                        <span className="h-4 w-px animate-pulse bg-foreground motion-reduce:animate-none" />
                    </div>
                    <div className="flex flex-col gap-0.5 p-1">
                        {RESULTS.map((r, i) => (
                            <div
                                key={r.title}
                                className={
                                    i === 1
                                        ? "flex items-center gap-3 rounded-md bg-accent px-2 py-1.5 text-accent-foreground"
                                        : "flex items-center gap-3 rounded-md px-2 py-1.5"
                                }
                            >
                                <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                                <span className="flex min-w-0 flex-col">
                                    <span className="truncate text-sm font-medium">{r.title}</span>
                                    <span className="truncate text-sm text-muted-foreground">{r.description}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
