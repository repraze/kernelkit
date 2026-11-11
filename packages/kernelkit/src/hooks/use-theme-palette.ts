import {useResolvedTheme} from "@repraze/kernelkit/provider";
import {allModes, createPalette, type Mode} from "@repraze/termicolor";
import {useMemo} from "react";

const cache = new Map<string, Mode>();

/**
 * The TermiColor mode that applies here (nearest ThemeScope, else the ThemeProvider): neutrals, accents
 * and roles as hex strings, with `roles.accent` & co. in the current accent. For canvas, chart and WebGPU
 * code that can't read CSS variables. Memoised per mode, contrast and accent.
 */
export function useThemePalette(): Mode {
    const {mode, contrast, accent} = useResolvedTheme();
    return useMemo(() => {
        const id = `${mode}${contrast === "high" ? "-hc" : ""}`;
        const key = `${id}:${accent}`;
        let found = cache.get(key);
        if (!found) {
            const modes = allModes(createPalette({accent}));
            found = modes.find((m) => m.id === id) ?? modes[0]!;
            cache.set(key, found);
        }
        return found;
    }, [mode, contrast, accent]);
}
