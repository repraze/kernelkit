import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
} from "@repraze/kernelkit/components/sidebar";
import {Link, Outlet, useRouterState} from "@tanstack/react-router";
import {useEffect} from "react";

import {DOCS_BY_CATEGORY} from "@/lib/docs-index";

/** Docs navigation: the kit's own Sidebar (sheet drawer on phones, ScrollArea with edge fades). */
function DocsSidebar() {
    const pathname = useRouterState({select: (s) => s.location.pathname});
    const {setOpenMobile} = useSidebar();
    // close the phone drawer after navigating
    useEffect(() => setOpenMobile(false), [pathname, setOpenMobile]);
    // keep the current page's entry in view (deep links to pages far down the list)
    useEffect(() => {
        const item = document.querySelector<HTMLElement>(
            '[data-slot=sidebar] [data-active]:not([data-active="false"])',
        );
        const viewport = item?.closest<HTMLElement>("[data-slot=scroll-area-viewport]");
        if (item && viewport) {
            // scroll only the sidebar's viewport (scrollIntoView would also move the page)
            const top = item.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
            viewport.scrollTop += top - viewport.clientHeight / 2;
        }
    }, [pathname]);

    return (
        // below the sticky 3.5rem site header instead of full viewport height
        <Sidebar className="top-14 h-[calc(100svh-3.5rem)]!">
            <SidebarContent className="py-2">
                {DOCS_BY_CATEGORY.map(({category, docs}) => (
                    <SidebarGroup key={category}>
                        <SidebarGroupLabel className="font-mono uppercase">{category}</SidebarGroupLabel>
                        <SidebarMenu>
                            {docs.map((doc) => {
                                const href = `/docs/${doc.slug}`;
                                return (
                                    <SidebarMenuItem key={doc.slug}>
                                        <SidebarMenuButton
                                            isActive={pathname.endsWith(href)}
                                            render={<Link to="/docs/$slug" params={{slug: doc.slug}} />}
                                        >
                                            {doc.title}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    );
}

export function DocsLayout() {
    return (
        <SidebarProvider keyboardShortcut={false} className="min-h-[calc(100svh-3.5rem)]">
            <DocsSidebar />
            <SidebarInset>
                {/* phone: a sub-bar with the drawer trigger */}
                <div className="sticky top-14 z-30 flex h-11 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur md:hidden">
                    <SidebarTrigger />
                    <span className="font-mono text-xs text-muted-foreground uppercase">Docs</span>
                </div>
                <main className="min-w-0 flex-1 px-4 py-10 md:px-10">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
