# Kernelkit

A modern, techy React component library: every shadcn component on Base UI, Tailwind v4 and `cva`,
themed by the [Termicolor](https://github.com/repraze/termicolor) palette. One accent (pink by default),
one radius knob, light / dark / high contrast, all CSS variables.

Use it as a package, or install components as source with the shadcn CLI.

## Packages

| Package              | What                                                   |
| -------------------- | ------------------------------------------------------ |
| `packages/kernelkit` | the library (`kernelkit`)                              |
| `packages/site`      | docs site (Vite + TanStack Router), dev on port `5175` |

## Use

```css
@import "tailwindcss";
@import "kernelkit/styles.css";
```

```tsx
import {Button} from "kernelkit/components/button";
import {ThemeProvider} from "kernelkit/provider";
```

As a shadcn registry (code lands in your app, imports rewritten to your aliases):

```json
{"registries": {"@kernelkit": "https://repraze.github.io/kernelkit/r/{name}.json"}}
```

```bash
npx shadcn@latest add @kernelkit/styles @kernelkit/theme-provider @kernelkit/button
```

## Develop

```bash
npm install
npm run dev          # builds the registry, then docs on http://localhost:5175
npm run typecheck && npm run lint && npm run lint:design
npm run check:docs   # console errors on every docs page (dev server running)
npm run check:states # hover / focus visible on every interactive element
node scripts/shot.mjs /review/<slug> out.png --full   # 6-theme screenshot matrix
```

Design rules and the review checklist: [GUIDELINES.md](GUIDELINES.md). Inventory:
[COMPONENTS.md](COMPONENTS.md). Plan: [PLAN.md](PLAN.md).

### Iterating on the palette

Kernelkit depends on [`@repraze/termicolor`](https://www.npmjs.com/package/@repraze/termicolor) from npm.
To work against a local termicolor checkout, link it (don't commit the lockfile while linked):

```bash
(cd ../termicolor/packages/palette && npm link)
npm link @repraze/termicolor        # node_modules/@repraze/termicolor -> ../termicolor/packages/palette
# after `npm run build:ports` in termicolor, kernelkit's dev server picks the changes up
npm install                         # back to the published version
```

## License

MIT
