import {useEffect} from "react";

/** Same key as the pre-paint script injected by vite.config.ts. */
export const THEME_STORAGE_KEY = "kernelkit-docs-theme";

export const GITHUB_URL = "https://github.com/repraze/kernelkit";

/** The brand as the nav and the tab show it. */
export const SITE_NAME = "KernelKit";

/** Sets the tab title: "Page · KernelKit", or the bare name on the home page. */
export function usePageTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    }, [title]);
}
