import {useEffect} from "react";

/** Sets the tab title: "Page · Brand", or the bare brand on the home page (GUIDELINES §7b). */
export function usePageTitle(title: string | undefined, brand: string) {
    useEffect(() => {
        document.title = title ? `${title} · ${brand}` : brand;
    }, [title, brand]);
}
