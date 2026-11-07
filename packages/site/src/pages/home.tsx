import {Alert, AlertDescription, AlertTitle} from "@repraze/kernelkit/components/alert";
import {Avatar, AvatarFallback} from "@repraze/kernelkit/components/avatar";
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
import {Checkbox} from "@repraze/kernelkit/components/checkbox";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@repraze/kernelkit/components/field";
import {Input} from "@repraze/kernelkit/components/input";
import {Kbd} from "@repraze/kernelkit/components/kbd";
import {Label} from "@repraze/kernelkit/components/label";
import {Progress} from "@repraze/kernelkit/components/progress";
import {Slider} from "@repraze/kernelkit/components/slider";
import {Switch} from "@repraze/kernelkit/components/switch";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@repraze/kernelkit/components/table";
import {Tabs, TabsList, TabsTrigger} from "@repraze/kernelkit/components/tabs";
import {Link} from "@tanstack/react-router";
import {ArrowRightIcon, CpuIcon, TerminalIcon} from "lucide-react";

import {Code} from "@/lib/doc-kit";
import {DOCS} from "@/lib/docs-index";

const PROCESSES = [
    {pid: 1, name: "init", cpu: 0.1, status: "running"},
    {pid: 412, name: "kernelkit-docs", cpu: 12.4, status: "running"},
    {pid: 977, name: "tsc --watch", cpu: 3.8, status: "sleeping"},
    {pid: 1203, name: "vite", cpu: 41.0, status: "running"},
] as const;

export function HomePage() {
    const componentCount = DOCS.filter((d) => d.category !== "Foundations").length;
    return (
        <main className="flex flex-1 flex-col">
            <section className="mx-auto flex w-full max-w-screen-xl flex-col items-start gap-6 px-4 pt-20 pb-14 md:px-6">
                <Badge variant="outline" className="font-mono">
                    <span className="size-1.5 rounded-full bg-success" /> v0.1.0 · {componentCount} components
                </Badge>
                <h1 className="max-w-3xl font-mono text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                    Components with a <span className="text-primary-text">kernel</span> of contrast.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                    Every shadcn component on Base UI and Tailwind v4, themed by Termicolor. One accent, one radius
                    knob, light, dark and high contrast. Built to be wrapped and extended.
                </p>
                <div className="flex flex-wrap gap-2">
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
                </div>
                <Code language="bash" code="npm install @repraze/kernelkit" className="w-full max-w-md" />
            </section>

            <section className="mx-auto grid w-full max-w-screen-xl gap-4 px-4 pb-24 md:grid-cols-2 md:px-6 lg:grid-cols-3">
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
            </section>
        </main>
    );
}
