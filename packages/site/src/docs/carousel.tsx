import {Badge} from "kernelkit/components/badge";
import {Card, CardDescription, CardHeader, CardTitle} from "kernelkit/components/card";
import {
    Carousel,
    CarouselContent,
    CarouselDots,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "kernelkit/components/carousel";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Carousel",
    category: "Data display",
    description: "A swipeable row of slides with previous/next buttons and dots, built on Embla.",
    demos: [
        {title: "Default", component: Default},
        {
            title: "Several per view",
            component: Multiple,
            description: "Set the item `basis` to show more than one slide.",
        },
        {title: "Vertical", component: Vertical, layout: "tall"},
    ],
    props: [
        {
            component: "Carousel",
            rows: [
                {name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"'},
                {name: "opts", type: "EmblaOptionsType", description: "Embla options (loop, align, dragFree…)."},
                {name: "plugins", type: "EmblaPluginType[]", description: "Embla plugins (autoplay…)."},
                {name: "setApi", type: "(api: CarouselApi) => void", description: "Receive the Embla API."},
            ],
        },
        {
            component: "CarouselDots",
            rows: [
                {
                    name: "className",
                    type: "string",
                    description: "One dot per snap; the current one is a wider primary pill. Arrow keys also navigate.",
                },
            ],
        },
    ],
});

const RELEASES = [
    {tag: "v2.18.0", title: "OpenTelemetry tracing", body: "Spans for every request, exported over OTLP."},
    {tag: "v2.17.0", title: "Canary deploys", body: "Ship to 10% of traffic, promote on healthy checks."},
    {tag: "v2.16.0", title: "ARM64 runners", body: "Graviton and Ampere nodes, 30% cheaper builds."},
    {tag: "v2.15.0", title: "Secret rotation", body: "Rotate tokens without restarting services."},
    {tag: "v2.14.0", title: "Log drains", body: "Stream logs to S3, Loki or any HTTP sink."},
];

function Slide({release}: {release: (typeof RELEASES)[number]}) {
    return (
        <Card size="sm">
            <CardHeader>
                <Badge variant="outline" className="font-mono">
                    {release.tag}
                </Badge>
                <CardTitle className="mt-2">{release.title}</CardTitle>
                <CardDescription>{release.body}</CardDescription>
            </CardHeader>
        </Card>
    );
}

export function Default() {
    return (
        <Carousel className="w-full max-w-xs">
            <CarouselContent>
                {RELEASES.map((release) => (
                    <CarouselItem key={release.tag}>
                        <Slide release={release} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots />
        </Carousel>
    );
}

export function Multiple() {
    return (
        <Carousel opts={{align: "start"}} className="w-full max-w-lg">
            <CarouselContent>
                {RELEASES.map((release) => (
                    <CarouselItem key={release.tag} className="basis-1/2">
                        <Slide release={release} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

export function Vertical() {
    return (
        <Carousel orientation="vertical" opts={{align: "start"}} className="my-12 w-full max-w-xs">
            <CarouselContent className="h-80">
                {RELEASES.map((release) => (
                    <CarouselItem key={release.tag} className="basis-1/2">
                        <Slide release={release} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
