"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@repraze/kernelkit/components/sidebar";

import type {DocLinkFor} from "./doc-page";
import type {DocsIndex} from "./docs-index";

export interface DocsNavProps {
    index: DocsIndex;
    /** The open page's slug (`index.slugOf(pathname)`), marked current. */
    current?: string;
    linkFor: DocLinkFor;
    /** Called when a link is clicked (the phone menu closes). */
    onNavigate?: () => void;
}

/** Docs navigation, one Sidebar group per category: the desktop SiteSidebar and the phone menu share it. */
export function DocsNav({index, current, linkFor, onNavigate}: DocsNavProps) {
    return (
        <nav aria-label="Docs" className="flex flex-col">
            {index.byCategory.map(({category, docs}) => (
                <SidebarGroup key={category}>
                    <SidebarGroupLabel className="font-mono uppercase">{category}</SidebarGroupLabel>
                    <SidebarMenu>
                        {docs.map((doc) => (
                            <SidebarMenuItem key={doc.slug}>
                                <SidebarMenuButton
                                    isActive={doc.slug === current}
                                    render={linkFor(doc.slug)}
                                    onClick={onNavigate}
                                >
                                    <span>{doc.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </nav>
    );
}
