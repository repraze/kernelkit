import {Link} from "@tanstack/react-router";
import {Button} from "kernelkit/components/button";
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle} from "kernelkit/components/empty";

export function NotFound() {
    return (
        <Empty className="flex-1">
            <EmptyHeader>
                <EmptyTitle className="font-mono text-4xl">404</EmptyTitle>
                <EmptyDescription>Segmentation fault: this page is not mapped.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button nativeButton={false} render={<Link to="/" />}>
                    Back home
                </Button>
            </EmptyContent>
        </Empty>
    );
}
