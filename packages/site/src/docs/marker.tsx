import {Marker, MarkerContent, MarkerIcon} from "@repraze/kernelkit/components/marker";
import {GitCommitHorizontalIcon, ShieldAlertIcon} from "lucide-react";

import {defineDoc} from "@/lib/doc-kit";

export const doc = defineDoc({
    title: "Marker",
    category: "Data display",
    description: "A quiet inline label that marks a point in a stream: a date break, a system event, a section cut.",
    demos: [
        {title: "Default", component: Default},
        {
            title: "Separator",
            component: Separator,
            description: '`variant="separator"` centers the label between two rules.',
        },
        {title: "Border", component: Border, description: '`variant="border"` underlines the marker as a section cap.'},
    ],
    props: [
        {
            component: "Marker",
            rows: [
                {name: "variant", type: '"default" | "separator" | "border"', default: '"default"'},
                {name: "render", type: "ReactElement | (props) => ReactElement", description: "Element to render as."},
            ],
        },
    ],
});

export function Default() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3">
            <Marker>
                <MarkerIcon>
                    <GitCommitHorizontalIcon />
                </MarkerIcon>
                <MarkerContent>
                    Deployed <a href="#default">api@a91f3c2</a> to production
                </MarkerContent>
            </Marker>
            <Marker>
                <MarkerIcon>
                    <ShieldAlertIcon />
                </MarkerIcon>
                <MarkerContent>Token rotated by ops-bot</MarkerContent>
            </Marker>
        </div>
    );
}

export function Separator() {
    return (
        <div className="flex w-full max-w-md flex-col gap-3 font-mono text-xs">
            <div className="text-muted-foreground">14:01:52 worker-3 heartbeat ok</div>
            <Marker variant="separator">
                <MarkerContent>Today</MarkerContent>
            </Marker>
            <div className="text-muted-foreground">00:00:03 cron nightly-backup started</div>
        </div>
    );
}

export function Border() {
    return (
        <div className="flex w-full max-w-md flex-col gap-2">
            <Marker variant="border">
                <MarkerContent>Incident #212 · resolved</MarkerContent>
            </Marker>
            <p className="text-sm">
                Packet loss on the fra edge, caused by a BGP flap upstream. Mitigated in 11 minutes.
            </p>
        </div>
    );
}
