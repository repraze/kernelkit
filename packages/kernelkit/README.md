# @repraze/kernelkit

Modern, techy React components: every shadcn component on Base UI, Tailwind v4 and `cva`, themed by the
[Termicolor](https://www.npmjs.com/package/@repraze/termicolor) palette. One accent (pink by default), one
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

Prefer owning the code? Every component is also a shadcn registry item:
`npx shadcn@latest add @kernelkit/button` (see the docs).

## License

MIT
