# Kernelkit plan

A professional, modern, techy React component library: every shadcn component, restyled to sit
between plain shadcn and the Termicolor look. Built on Base UI + Tailwind v4 + `cva`, themed through
CSS variables on top of the Termicolor palette.

Status (2026-11-07): published as `@repraze/kernelkit` (build to dist/, optional peer deps, staged
publish workflow, Pages deploy of docs + registry, docs pages code-split). Termicolor palette is
`@repraze/termicolor` on npm.
Earlier (2026-11-06, late): steps 1-6 done. 78 components in the lib, 80 docs pages, all through the
6-theme review matrix, design lint, state check (hover/focus) and console check. Also published as a
shadcn registry (`npm run registry`, `@kernelkit/<name>`). Next: step 7 (termicolor site refactor).
Earlier note: steps 1-3 done, step 6 started. Repo scaffolded; 63 shadcn base-nova components
installed fresh (pristine copy kept for diffs); token layer (`kernelkit.css`), ThemeProvider/ThemeScope/
ThemeScript; docs site running on :5175 with Introduction, Theming, Button and a home showcase.

---

## 1. Goals

- **Full shadcn coverage.** Every component shadcn ships (base-ui flavour), installed fresh from the
  CLI so we start from the latest fixes, then restyled. Plus the extras repraze-lib-ui has on top
  (data-table, navbar, toolbar, file-upload, typography, …), redesigned rather than copied.
- **Themeable by CSS variables only.** No rebuild to change look:
    - **mode**: `light` / `dark` (+ `hc` high contrast) — from Termicolor.
    - **accent**: any of the 8 Termicolor accents via `.accent-<name>`; **default pink**.
    - **radius**: one `--kk-radius` knob (0 → sharp Termicolor look, ~0.5rem → soft modern look).
      Every component derives its corners from it (`--kk-radius-sm/md/lg/xl`, `full` stays full).
    - later, maybe **density** (`--kk-density`) scaling control heights / paddings.
- **Theme provider inside.** `KernelkitProvider` + `useTheme()`: mode (system/light/dark), contrast,
  accent, radius; persisted, synced across tabs, scoped subtrees (`<ThemeScope>` for previews),
  and a pre-paint script (`themeScript()`) so SSR / Next.js apps don't flash.
- **Extendible.** Apps wrap and extend, they don't fork:
    - every variant via `cva`, variant maps exported (`buttonVariants`, …);
    - `data-slot` on every part (styling hooks, testing);
    - `render` prop / `useRender` for single-element components;
    - `className` merged last via `cn()`;
    - tokens as Tailwind utilities (`bg-primary`, `text-tc-pink`, `rounded-md` → radius var).
- **Professional look.** Neutral surfaces from Termicolor, one loud accent, crisp borders, mono
  for labels/titles/code, sans for reading. State shown with fills / indicator lines / borders,
  never by surface shade alone (Termicolor DESIGN.md §6 — keeps high contrast working).

Non-goals: the nullsec hacker kit (FX, intel widgets, pixel icons) stays a separate experiment.

## 2. Repo layout

Own repo, npm workspaces monorepo like Termicolor (the suite: termicolor, kernelkit, glaze, badges,
each its own mono with a docs site package).

```
kernelkit/
├── PLAN.md
├── packages/
│   ├── kernelkit/        # the library → npm `kernelkit`
│   │   ├── src/components/*.tsx   one file per component (shadcn names)
│   │   ├── src/hooks/              use-mobile, …
│   │   ├── src/lib/utils.ts        cn()
│   │   ├── src/provider/           KernelkitProvider, useTheme, ThemeScope, themeScript
│   │   ├── src/styles/kernelkit.css tokens (palette → shadcn → kk vars), base layer, @theme
│   │   └── components.json         shadcn CLI target
│   └── site/             # docs site (Vite + React + TanStack Router), port 5175
└── tsconfig.base.json, eslint, prettier (same config as Termicolor)
```

Dependency on the palette: `@repraze/termicolor` via `file:../termicolor/packages/palette` until it's
published to npm. No cycle: palette → kernelkit → (kernelkit site, termicolor site, repraze apps).

Package exports (source-first like Termicolor; a build step is added before publishing):

```
kernelkit/components/<name>   kernelkit/provider   kernelkit/hooks/<name>
kernelkit/lib/utils           kernelkit/styles.css
```

## 3. Dev ports (run everything side by side)

| Site            | Port | Command                      |
| --------------- | ---- | ---------------------------- |
| Termicolor site | 5170 | `npm run dev` in termicolor/ |
| Kernelkit docs  | 5175 | `npm run dev` in kernelkit/  |
| nullsec         | 5199 | `npm run dev` in nullsec/    |
| repraze website | 3000 | Next.js default              |

`strictPort: true` so a clash fails loudly instead of silently moving.

## 4. Token layer

```
@repraze/termicolor/palette.css   --tc-*        (modes, accents, roles; .dark/.light/.hc/.accent-*)
@repraze/termicolor/shadcn.css    --primary …   (shadcn names mapped to tc roles)
kernelkit/styles.css              --kk-radius*, --kk-font-*, status tokens, @theme inline utilities
```

- Default accent: kernelkit sets `pink` as the fallback when no `.accent-*` class is present.
- Status: `--danger --warning --success --info` (+ `-foreground`, `-tint`) from tc roles; never follow
  the accent.
- Radius: `--kk-radius` (default `0.375rem`), Tailwind `--radius-*` mapped to calc() of it, so stock
  shadcn `rounded-md`/`rounded-lg` follow automatically. `.radius-none|sm|md|lg|full` helper classes.

## 5. Steps

1. **Scaffold** repo, configs, palette link, ports. ✅
2. **Fresh shadcn install** of every component (`base-nova`) into `packages/kernelkit`. ✅
   Overlay portals patched to `usePortalContainer()` so popups keep a ThemeScope's theme.
3. **Token layer + provider** (styles.css, ThemeProvider, themeScript, ThemeScope). ✅
   Code highlighting: Shiki css-variables theme → `--tc-syntax-*`.
4. **Diff vs repraze-lib-ui** — list what repraze changed/added; decide per component
   (adopt / redesign / drop). Port extras (data-table, navbar, toolbar, file-upload, typography,
   set-utils, …) restyled.
5. **Design pass** — the middle ground: go component by component, Termicolor-inspired details
   (mono labels, indicator lines, crisp focus ring, hc-safe states), check light/dark/hc, every accent,
   radius 0 and soft.
6. **Docs site** — landing, theming page (live accent/radius/mode controls), one page per component
   (demos + code + props), search. Port 5175.
7. **Termicolor site refactor** — replace `src/components/ui/*` with kernelkit, keep red accent and
   radius 0 as site config.
8. **repraze-apps refactor** — replace `@repraze/lib-ui` with kernelkit; repraze-specific components
   become a thin local layer on top (wrap, don't fork).

## 6. Findings / todo

- ~~**Palette bug (fix upstream):**~~ fixed in termicolor build/src/web.ts (tripled self class).
- ~~Light accent dark~~: termicolor `accentFill`/`onAccentFill` roles; `--primary` is the fill.
- **Palette bug (was):** `.accent-x .light` and `.accent-x.light` have equal specificity, so an
  ancestor's accent beats a nested scope's own one. Patched in kernelkit.css with a self-match rule.
- `rounded-full` pills (switch, badge, avatar) ignore the radius knob: decide whether `radius-none`
  should square them (e.g. a `rounded-pill` utility = `calc(var(--kk-radius) * 999)`).
- Heavy deps (recharts, shiki, embla, cmdk, react-day-picker, date-fns) → optional peer deps before publish.
- Docs bundle is one 500 kB+ chunk (80 eagerly imported pages): lazy-load doc modules.
- Publish: build step (vite lib mode + d.ts) and optional peer deps before npm.

## 7. Open questions

- Density knob: worth it, or just sm/md/lg sizes?
- Publish: npm `kernelkit` unscoped, or `@kernelkit/react` scope to leave room for more packages?
- Build output (Vite lib mode + d.ts) vs shipping source — needed before npm publish / Next.js use.
- Fonts: ship none (apps choose) but document Geist + JetBrains Mono as the reference pairing.
