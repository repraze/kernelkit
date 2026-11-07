import {createRootRoute, createRoute, Outlet, redirect} from "@tanstack/react-router";

import {SiteHeader} from "@/components/site-header";
import {DocPage} from "@/pages/doc-page";
import {DocsLayout} from "@/pages/docs-layout";
import {HomePage} from "@/pages/home";
import {NotFound} from "@/pages/not-found";
import {ReviewPage} from "@/pages/review-page";

const rootRoute = createRootRoute({
    component: () => (
        <div className="flex min-h-svh flex-col">
            <SiteHeader />
            <Outlet />
        </div>
    ),
    notFoundComponent: NotFound,
});

const homeRoute = createRoute({getParentRoute: () => rootRoute, path: "/", component: HomePage});

const docsRoute = createRoute({getParentRoute: () => rootRoute, path: "/docs", component: DocsLayout});

const docsIndexRoute = createRoute({
    getParentRoute: () => docsRoute,
    path: "/",
    beforeLoad: () => {
        throw redirect({to: "/docs/$slug", params: {slug: "introduction"}});
    },
});

const docRoute = createRoute({getParentRoute: () => docsRoute, path: "$slug", component: DocPage});

/** Visual review matrix (GUIDELINES.md §8), outside the site chrome. */
const reviewRoute = createRoute({getParentRoute: () => rootRoute, path: "/review/$slug", component: ReviewPage});

export const routeTree = rootRoute.addChildren([
    homeRoute,
    docsRoute.addChildren([docsIndexRoute, docRoute]),
    reviewRoute,
]);
