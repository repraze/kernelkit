# @repraze/kernelkit

Modern, techy React components: every shadcn component on Base UI, Tailwind v4 and `cva`, themed by the
[TermiColor](https://www.npmjs.com/package/@repraze/termicolor) palette. One accent (pink by default), one
radius knob, light / dark / high contrast, all CSS variables.

Docs: https://repraze.github.io/kernelkit/

```bash
npm install @repraze/kernelkit @base-ui/react
```

```css
/* app.css */
@import "tailwindcss";
@import "@repraze/kernelkit/styles.css";
```

```tsx
import {Button} from "@repraze/kernelkit/components/button";
import {ThemeProvider} from "@repraze/kernelkit/provider";

export function App() {
    return (
        <ThemeProvider defaultTheme={{accent: "pink", radius: "md"}}>
            <Button>Deploy</Button>
        </ThemeProvider>
    );
}
```

Heavier components need their library installed alongside (optional peer dependencies): `chart` → recharts,
`hooks/use-highlighted-code` (syntax highlighting for `code-block`) → shiki, `carousel` → embla-carousel-react, `command` → cmdk, `calendar` / `date-picker` →
react-day-picker (+ date-fns), `input-otp` → input-otp, `resizable` → react-resizable-panels, `data-table` →
@tanstack/react-virtual, `questionnaire` / `message-scroller` → @shadcn/react.

### Suite sites

The repraze docs sites (TermiColor, KernelKit, GlazeEngine) share their shell and docs machinery from the kit,
so each site only picks a brand, an accent, a radius and its content:

- `@repraze/kernelkit/site`: `SuiteHeader` (brand, nav, search, theme menu, repository, phone menu),
  `SuiteFooter` (the suite credit + links), `BrandLogo` / `BrandMark`, `GithubIcon`, `usePageTitle(title, brand)`.
- `@repraze/kernelkit/site.css`: `styles.css` plus the suite fonts (needs `@fontsource-variable/geist` and
  `@fontsource-variable/jetbrains-mono`).
- `@repraze/kernelkit/docs`: `defineDoc`, `createDocsIndex`, `DocPage`, `DocsLayout`, `DocsNav`, `DocsSearch`,
  `Demo`, `PropsTable`, `Code`, `ReviewMatrix` (router-agnostic: links are passed as `render` elements).
- `@repraze/kernelkit/vite` (Node, for `vite.config.ts`): `themeScriptPlugin`, `faviconPlugin`, `spaFallback`,
  `docsMetaPlugin` (the docs manifest and each demo's source; needs `typescript`) and `suiteSourceConditions`.
  Types for its virtual modules: `"types": ["@repraze/kernelkit/vite/client"]`.
- `@repraze/kernelkit/hooks/use-theme-palette`: the TermiColor mode that applies here (nearest `ThemeScope`), for
  canvas, chart and WebGPU code.

Prefer owning the code? Every component is also a shadcn registry item:
`npx shadcn@latest add @kernelkit/button` (see the docs).

## License

MIT
