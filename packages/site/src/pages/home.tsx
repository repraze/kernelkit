import {Alert, AlertDescription, AlertTitle} from "@repraze/kernelkit/components/alert";
import {Avatar, AvatarFallback} from "@repraze/kernelkit/components/avatar";
import {Badge} from "@repraze/kernelkit/components/badge";
import {Button} from "@repraze/kernelkit/components/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    LinkCard,
    LinkCardArrow,
} from "@repraze/kernelkit/components/card";
import {Checkbox} from "@repraze/kernelkit/components/checkbox";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {
    Hero,
    HeroActions,
    HeroDescription,
    HeroEyebrow,
    HeroFooter,
    HeroMedia,
    HeroTitle,
} from "@repraze/kernelkit/components/hero";
import {Input} from "@repraze/kernelkit/components/input";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {Label} from "@repraze/kernelkit/components/label";
import {Progress} from "@repraze/kernelkit/components/progress";
import {
    Section,
    SectionAction,
    SectionDescription,
    SectionEyebrow,
    SectionHeader,
    SectionTitle,
} from "@repraze/kernelkit/components/section";
import {SiteContainer} from "@repraze/kernelkit/components/site-layout";
import {Slider} from "@repraze/kernelkit/components/slider";
import {Switch} from "@repraze/kernelkit/components/switch";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@repraze/kernelkit/components/table";
import {Tabs, TabsList, TabsTrigger} from "@repraze/kernelkit/components/tabs";
import {useTheme} from "@repraze/kernelkit/provider";
import {Link} from "@tanstack/react-router";
import {ArrowRightIcon, BoxIcon, CpuIcon, PackageIcon, PaletteIcon, TerminalIcon} from "lucide-react";

import {GithubIcon} from "@/components/github-icon";
import {LogoMark} from "@/components/logo";
import {AccentPicker, RadiusPicker} from "@/components/theme-customizer";
import {Code} from "@/lib/doc-kit";
import {DOCS} from "@/lib/docs-index";
import {GITHUB_URL, usePageTitle} from "@/lib/site";

const PROCESSES = [
    {pid: 1, name: "init", cpu: 0.1, status: "running"},
    {pid: 412, name: "kernelkit-docs", cpu: 12.4, status: "running"},
    {pid: 977, name: "tsc --watch", cpu: 3.8, status: "sleeping"},
    {pid: 1203, name: "vite", cpu: 41.0, status: "running"},
] as const;

export function HomePage() {
    usePageTitle();
    const componentCount = DOCS.filter((d) => d.category !== "Foundations").length;
    return (
        <main className="flex flex-1 flex-col">
            <Hero>
                <HeroMedia>
                    <LogoMark className="size-16 md:size-20" />
                </HeroMedia>
                <HeroEyebrow>
                    <Badge variant="outline" className="font-mono">
                        <span className="size-1.5 rounded-full bg-success" /> v0.1 alpha · {componentCount} components
                    </Badge>
                </HeroEyebrow>
                <HeroTitle>
                    Components with a <span className="text-primary-text">kernel</span> of contrast.
                </HeroTitle>
                <HeroDescription>
                    Every shadcn component on Base UI and Tailwind v4, themed by TermiColor. One accent, one radius,
                    light, dark and high contrast. Install the package or copy the source.
                </HeroDescription>
                <HeroActions>
                    <Button
                        size="lg"
                        nativeButton={false}
                        render={<Link to="/docs/$slug" params={{slug: "introduction"}} />}
                    >
                        Get started <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        nativeButton={false}
                        render={<Link to="/docs/$slug" params={{slug: "button"}} />}
                    >
                        Browse components
                    </Button>
                </HeroActions>
                <HeroFooter>
                    <Code language="bash" code="npm install @repraze/kernelkit" className="w-full max-w-sm text-left" />
                </HeroFooter>
            </Hero>

            <SiteContainer className="flex flex-col divide-y divide-border">
                <Section>
                    <SectionHeader>
                        <SectionEyebrow>Components</SectionEyebrow>
                        <SectionTitle>Built for dense, technical interfaces</SectionTitle>
                        <SectionDescription>
                            Forms, tables, consoles and dashboards: the shadcn set with tight spacing, mono where it
                            helps, and hover, focus and disabled states checked on every component.
                        </SectionDescription>
                        <SectionAction>
                            <Button
                                variant="outline"
                                nativeButton={false}
                                render={<Link to="/docs/$slug" params={{slug: "button"}} />}
                            >
                                All {componentCount} components <ArrowRightIcon data-icon="inline-end" />
                            </Button>
                        </SectionAction>
                    </SectionHeader>
                    <Showcase />
                </Section>

                <Section>
                    <SectionHeader>
                        <SectionEyebrow>Theming</SectionEyebrow>
                        <SectionTitle>Accent, radius, contrast</SectionTitle>
                        <SectionDescription>
                            Pick an accent, a radius and high contrast: the whole site follows, and so does every
                            component in your app. Contrast is checked for each accent in each mode.
                        </SectionDescription>
                        <SectionAction>
                            <Button
                                variant="outline"
                                nativeButton={false}
                                render={<Link to="/docs/$slug" params={{slug: "theming"}} />}
                            >
                                Theming guide <ArrowRightIcon data-icon="inline-end" />
                            </Button>
                        </SectionAction>
                    </SectionHeader>
                    <ThemePlayground />
                </Section>

                <Section>
                    <SectionHeader>
                        <SectionEyebrow>Install</SectionEyebrow>
                        <SectionTitle>Use the package, or own the code</SectionTitle>
                        <SectionDescription>
                            Both are built from the same source. Start with the package and copy a component into your
                            app the day you need to change it.
                        </SectionDescription>
                        <SectionAction>
                            <Button
                                variant="outline"
                                nativeButton={false}
                                render={<Link to="/docs/$slug" params={{slug: "introduction"}} />}
                            >
                                Installation <ArrowRightIcon data-icon="inline-end" />
                            </Button>
                        </SectionAction>
                    </SectionHeader>
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PackageIcon className="size-4 text-primary-text" /> Package
                                </CardTitle>
                                <CardDescription>Updates with the library. Import the styles once.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Code
                                    language="bash"
                                    code={`npm install @repraze/kernelkit\n# in your CSS, after tailwindcss\n@import "@repraze/kernelkit/styles.css";`}
                                />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BoxIcon className="size-4 text-primary-text" /> shadcn registry
                                </CardTitle>
                                <CardDescription>Copies the source into your app, imports rewritten.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Code
                                    language="bash"
                                    code={`npx shadcn add https://repraze.github.io/kernelkit/r/styles.json\nnpx shadcn add https://repraze.github.io/kernelkit/r/button.json`}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </Section>

                <Section>
                    <SectionHeader>
                        <SectionEyebrow>The suite</SectionEyebrow>
                        <SectionTitle>One design language</SectionTitle>
                        <SectionDescription>
                            TermiColor, KernelKit and repraze.com share the header, sidebar, spacing and states. Each
                            keeps its own accent and radius.
                        </SectionDescription>
                        <SectionAction>
                            <Button variant="outline" nativeButton={false} render={<a href={GITHUB_URL} />}>
                                <GithubIcon data-icon="inline-start" className="size-4" /> Source on GitHub
                            </Button>
                        </SectionAction>
                    </SectionHeader>
                    <div className="grid gap-4 md:grid-cols-3">
                        {SUITE.map((site) => (
                            <LinkCard key={site.name} href={site.href} className="h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <site.icon className="size-4 text-primary-text" /> {site.name}
                                    </CardTitle>
                                    <CardDescription>{site.description}</CardDescription>
                                    <CardAction>
                                        <LinkCardArrow external />
                                    </CardAction>
                                </CardHeader>
                            </LinkCard>
                        ))}
                    </div>
                </Section>
            </SiteContainer>
        </main>
    );
}

const SUITE = [
    {
        name: "TermiColor",
        icon: PaletteIcon,
        href: "https://repraze.github.io/termicolor/",
        description: "The palette: themes for your editor, terminal and prompt, and the colors behind this kit.",
    },
    {
        name: "KernelKit",
        icon: TerminalIcon,
        href: GITHUB_URL,
        description: "The components: shadcn on Base UI, the site shell every suite site is built from.",
    },
    {
        name: "repraze.com",
        icon: CpuIcon,
        href: "https://repraze.com",
        description: "Posts on projects, reviews and tutorials, moving onto the kit next.",
    },
] as const;

/** Accent and radius controls next to a live sample. */
function ThemePlayground() {
    const theme = useTheme();
    return (
        <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
            <Card>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-xs text-muted-foreground uppercase">Accent</span>
                        <AccentPicker />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-xs text-muted-foreground uppercase">Radius</span>
                        <RadiusPicker />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="pg-contrast" className="font-mono text-xs text-muted-foreground uppercase">
                            High contrast
                        </Label>
                        <Switch
                            id="pg-contrast"
                            checked={theme.contrast === "high"}
                            onCheckedChange={(on) => theme.setContrast(on ? "high" : "normal")}
                        />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Button>Deploy</Button>
                        <Button variant="soft">Preview</Button>
                        <Button variant="outline">Logs</Button>
                        <Button variant="ghost">Cancel</Button>
                        <Badge>stable</Badge>
                        <Badge variant="soft">beta</Badge>
                        <Badge variant="outline">v0.1</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="pg-branch">Branch</FieldLabel>
                            <Input id="pg-branch" defaultValue="main" />
                        </Field>
                        <div className="flex flex-col justify-end gap-3">
                            <Progress value={64} />
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pg-auto">Auto deploy</Label>
                                <Switch id="pg-auto" defaultChecked />
                            </div>
                        </div>
                    </div>
                    <Tabs defaultValue="build">
                        <TabsList variant="line">
                            <TabsTrigger value="build">Build</TabsTrigger>
                            <TabsTrigger value="test">Test</TabsTrigger>
                            <TabsTrigger value="release">Release</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

/** The kit at work: a form, a table and a few status parts. */
function Showcase() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Connect a node</CardTitle>
                    <CardDescription>Register this machine with the cluster.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="host">Hostname</FieldLabel>
                            <Input id="host" placeholder="node-07.local" />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="token">Join token</FieldLabel>
                            <Input id="token" type="password" defaultValue="hunter2hunter2" />
                            <FieldDescription>Expires in 24 hours.</FieldDescription>
                        </Field>
                        <Field orientation="horizontal">
                            <Checkbox id="tls" defaultChecked />
                            <FieldLabel htmlFor="tls">Require TLS</FieldLabel>
                        </Field>
                    </FieldGroup>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button className="flex-1">Connect</Button>
                    <Button variant="outline">Cancel</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Processes</CardTitle>
                    <CardDescription>4 tasks, 2 cores busy</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="running">Running</TabsTrigger>
                            <TabsTrigger value="sleeping">Sleeping</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">CPU</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {PROCESSES.map((p) => (
                                <TableRow key={p.pid}>
                                    <TableCell className="font-mono text-muted-foreground">{p.pid}</TableCell>
                                    <TableCell className="font-mono">{p.name}</TableCell>
                                    <TableCell className="text-right font-mono">{p.cpu.toFixed(1)}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
                <Alert>
                    <TerminalIcon />
                    <AlertTitle>Build finished</AlertTitle>
                    <AlertDescription>63 modules compiled in 412ms.</AlertDescription>
                </Alert>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CpuIcon className="size-4 text-primary-text" /> Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span>Memory</span>
                                <span className="font-mono text-muted-foreground">6.2 / 16 GB</span>
                            </div>
                            <Progress value={39} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label>Thread limit</Label>
                            <Slider defaultValue={[8]} max={16} step={1} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="turbo">Turbo boost</Label>
                            <Switch id="turbo" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
                <Card size="sm">
                    <CardContent className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>RZ</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-1 flex-col">
                            <span className="text-sm font-medium">root@kernelkit</span>
                            <span className="text-xs text-muted-foreground">last login 2m ago</span>
                        </div>
                        <Kbd>⌘K</Kbd>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
