# Kernelkit design guidelines

The contract every component is checked against. **Living document**: when a review finds a case these
rules don't cover, decide, write the rule here (and in the decision log at the bottom), then fix the
code. A component is done only when it passes the checklist in §9 in every theme listed in §8.

Look: between plain shadcn (base-nova) and Termicolor. Neutral grey surfaces, one loud accent, crisp
lines, mono for titles/labels/code, sans for reading. Professional first; techy in the details.

---

## 1. Tokens only

- Colors come from role tokens: `background foreground card popover primary secondary muted accent
hover border input ring danger warning success info` (+ `-foreground`, `-tint`), `chart-1..5`,
  `sidebar-*`, and Termicolor utilities `tc-<hue>`, `tc-<hue>-tint|fill|on|on-fill`. No hex, no
  `oklch(...)`, no `white`/`black`, no Tailwind palette colors (`neutral-500`, `pink-400`…).
- **Never use `foreground/NN` alpha for lines.** nova uses `ring-foreground/10` for card and popup
  outlines; in high contrast that stays faint. Lines are `border-border` (regions, cards, popups,
  separators) or `border-input` (interactive control outlines).
- **Primary has two tiers**: `bg-primary` / `text-primary-foreground` is the vivid fill (Termicolor
  `accentFill`, dark text on it in light mode); accent-colored **text, icons and links use
  `text-primary-text`** (Termicolor `accent`, darkened in light mode for contrast on white). Never
  `text-primary` for text: in light mode the fill tier fails contrast as text.
  **Thin indicators use the text tier too**: 1-2px lines, stand-alone borders, small dots, inset bars
  (`after:bg-primary-text`, `border-primary-text`, `shadow-[inset_2px_0_0_var(--primary-text)]`): WCAG
  1.4.11 wants 3:1 for state-carrying UI, the light fill is ~2.3:1 on white. The fill tier is for solid
  surfaces (with or without text) and bars of 6px or more; a border that is just the edge of a filled
  control (checked checkbox/radio/switch) matches its fill.
- Hover wash is `bg-hover` (Termicolor `bgHover`, visible in high contrast), not `bg-muted`.
- **Field backgrounds are tokens**: controls with a field surface use `bg-field`, `hover:bg-field-hover`,
  `disabled:bg-field-disabled`. Fields sit on Termicolor's `bgRaised` ("things that take input",
  palette DESIGN.md §4); hover steps 7% toward the foreground (18% in hc). Outline buttons are not fields:
  `bg-transparent hover:bg-hover`. Never
  `dark:bg-…` / `hc:bg-…` classes on a stateful part: variant-prefixed backgrounds outrank `hover:` and
  `data-*:`, so the state silently disappears in that mode.
- Alpha on a role is fine for fills (`bg-primary/10`, `bg-(--c)/10`), never for text.

## 2. Color axis (`lib/color.ts`)

Components that come in colors take a `color` prop, orthogonal to `variant`. A color sets local vars;
variants only read them:

| Var           | Meaning                                       | Example (`primary`)           |
| ------------- | --------------------------------------------- | ----------------------------- |
| `--c`         | the color, text tier: readable on any surface | `var(--primary)`              |
| `--c-fg`      | text on a solid `--c` fill                    | `var(--primary-foreground)`   |
| `--c-tint`    | opaque wash behind **foreground** text        | `var(--accent)` (accent tint) |
| `--c-fill`    | vivid solid surface (Termicolor fill tier)    | `var(--primary)`              |
| `--c-fill-fg` | text on `--c-fill`                            | `var(--primary-foreground)`   |

Solid variants use `--c-fill`/`--c-fill-fg` (vivid in light mode too: light text tiers are darkened for
contrast, fills are not). Text, borders, icons, soft/outline/ghost use `--c`.

Colors: `neutral primary danger warning success info red orange yellow green cyan blue purple pink`.
`neutral` maps to foreground / background / secondary.

Variants (same names everywhere):

| Variant   | Rest                                                  | Hover                             |
| --------- | ----------------------------------------------------- | --------------------------------- |
| `solid`   | `bg-(--c-fill) text-(--c-fill-fg)`                    | `bg-(--c-fill)/85`                |
| `soft`    | `bg-(--c)/12 text-(--c)` (dark: `/20`)                | `bg-(--c)/20` (dark `/30`)        |
| `outline` | `border-(--c)/40 text-(--c)`; neutral: `border-input` | `bg-(--c)/10`; neutral `bg-hover` |
| `ghost`   | `text-(--c)`; neutral: `text-foreground`              | same as outline                   |
| `link`    | `text-(--c)` underline on hover                       | -                                 |

- Default color depends on the variant: `solid`/`soft`/`link` → `primary`, `outline`/`ghost` → `neutral`.
  So `<Button>` is the primary action and `<Button variant="outline">` is chrome.
- shadcn aliases stay for drop-in use: `variant="default"` = solid, `"secondary"` = solid neutral
  (`bg-secondary`), `"destructive"` = soft danger.
- Status colors never follow the accent. Pair danger/warning with an icon or label, not color alone.
- Termicolor rule: on a `tint` surface the text is `foreground`; color comes from an icon, border or
  indicator (`[&_svg]:text-(--c)`). Accent text goes on `background`/`card`/`popover` or translucent fills.

## 3. Shape

- One knob: `--kk-radius` (default `0.5rem`). Scale: `rounded-xs ×0.25 · sm ×0.5 · md ×0.75 · lg ×1 ·
xl ×1.5 · 2xl ×2 · 4xl ×4`. `rounded-pill` = `×999` → fully round, but **square at radius-none**.
- Assignment:
    - controls (button, input, select trigger, toggle, input-group, textarea): `rounded-lg`
    - small controls (xs/sm buttons, icon-xs/sm): `rounded-md`
    - items inside a popup/list (menu items, command items, select items): `rounded-md`
    - boxes under 20px (checkbox, kbd, inline code, tiny chips): `rounded-box` (= `rounded-sm` capped at
      4px, so a 16px box never becomes a circle at radius-xl)
    - popups (popover, menus, select/combobox list, hover card, command): `rounded-lg` (+ `p-1`, so
      `rounded-md` items nest correctly)
    - cards, dialogs, alert dialogs, sheets/drawers (inner corner), large panels: `rounded-xl`
    - tooltip: `rounded-md`
    - pills (switch track/thumb, badge, avatar, radio, slider thumb, progress track, status dot): `rounded-pill`
- Never `rounded-full` on UI chrome (use `rounded-pill`), never hardcoded px radius
  (`rounded-[4px]`, `rounded-[min(…,10px)]`).
- Nested corners: inner radius = outer radius − padding. Use the next step down (xl card → lg control).

## 4. Size and spacing (4px grid)

| Size      | Height | Padding x | Text            | Icon       | Gap       |
| --------- | ------ | --------- | --------------- | ---------- | --------- |
| `xs`      | `h-6`  | `px-2`    | `text-xs`       | `size-3`   | `gap-1`   |
| `sm`      | `h-7`  | `px-2.5`  | `text-[0.8rem]` | `size-3.5` | `gap-1`   |
| `default` | `h-8`  | `px-2.5`  | `text-sm`       | `size-4`   | `gap-1.5` |
| `lg`      | `h-9`  | `px-3`    | `text-sm`       | `size-4`   | `gap-2`   |

- Every control family (button, input, select trigger, toggle, input-group, combobox, number field,
  native select, tabs list) uses this table, so a row of mixed controls lines up.
- Icon-only controls are square at the same height (`size-8` default).
- Popups: `p-1` on the popup (groups add no padding), items `min-h-8 px-2 py-1.5 gap-2`, separators
  `-mx-1 my-1`, group labels `px-2 py-1.5 text-xs`. Use the `listItem`/`listLabel`/`listSeparator`/
  `popupSurface`/`popupMotion` recipes. Menus (dropdown, context, menubar) share `menuItemVariants` /
  `menuContentClass` from dropdown-menu.tsx. Danger items: `variant="danger"` (`"destructive"` is an alias;
  both render `data-variant="danger"`) → `text-danger`, highlighted `bg-danger/10`.
- cmdk (Command) sets `data-selected`/`data-disabled` to `"true"`/`"false"`, so presence-based variants
  (`data-highlighted:`) don't apply: use `data-[selected=true]:` / `data-[disabled=true]:` there.
- Cards `p-4` (`sm`: `p-3`), header gap `gap-1`, sections `gap-4`. Dialogs/sheets `p-4`, footer
  `gap-2`. Field stacks `gap-2` label→control, `gap-5` between fields (nova `FieldGroup`).
- RTL: use logical spacing (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`) so layouts
  flip under `dir="rtl"`; physical left/right only for things that must not flip.
- Empty tracks, skeletons, unlit segments use the `placeholderFill` recipe (`bg-muted` vanishes on cards
  in light mode).
- Orientation-aware components style themselves from their **own** `data-orientation`
  (`data-[orientation=vertical]:`), never `group-data-*` on an ancestor: that leaks into nested instances.
- Hit area: controls smaller than 24px (checkbox, radio, switch) extend it with an `after:` inset.

## 5. Typography

- Title sizes: dialog/sheet/drawer/alert-dialog `text-base`, card `text-base` (sm card `text-sm`),
  popover/empty/alert `text-sm`.
- `font-sans` body; `font-heading` (= `--kk-font-heading`, defaults to mono) for card/dialog/sheet/
  popover/empty/alert titles and page headings; `font-mono` for code, kbd, numbers in tables/stats.
- Sizes: body `text-sm`; descriptions `text-sm text-muted-foreground`; meta/labels `text-xs`.
- Micro label (section captions, table heads in dense views, group labels): `text-xs font-medium
text-muted-foreground` - mono uppercase only for site chrome, not in components.
- Inputs use `text-base md:text-sm` (iOS zoom guard).

## 6. States

Every interactive part must show each state that applies, and they must be distinguishable in
high contrast (`hc`), where `bgSunken = bg` and surface shade differences disappear.

- **Hover**: `bg-hover` wash or the variant's hover. Never only a cursor change.
- **Focus-visible** (keyboard): the shared ring `focus-visible:border-ring focus-visible:ring-3
focus-visible:ring-ring/50` (`focusRing` recipe). Items inside popups use the highlight instead.
  Composite controls (input-group, chips) ring the container via `has-[…:focus-visible]`.
- **Active/pressed**: buttons `active:translate-y-px` (not on menu triggers).
- **Selected row** (table, data table, list, highlighted code line): `selectedRow` recipe = accent tint +
  2px inset primary indicator on the start edge.
- **Current navigation item** (sidebar, nav menu, docs nav, toolbar toggles): accent tint `bg-accent
text-accent-foreground` + `font-medium` + primary-colored icon. Use an indicator line only where the
  component is a line by nature (tabs `line`, vertical rails).
- **Selected / on / checked / current**: a fill (`bg-primary`), an indicator line (2px `bg-primary`
  bar), or a border, **never surface shade alone** (tabs, toggle, sidebar item, pagination current,
  nav link). Highlighted popup item: `bg-accent text-accent-foreground` (accent tint).
- **Disabled**: `opacity-50` + `pointer-events-none`/`cursor-not-allowed`; inputs also `bg-input/50`.
- **Invalid** (`aria-invalid`): `border-danger ring-3 ring-danger/20`.
- **Open** (`data-popup-open`, `aria-expanded`): triggers keep their hover look while open.
- **Loading**: `Spinner` replaces/leads the icon, control `aria-busy`, stays the same width.
- **hc overrides**: a bare `hc:` class outranks `data-*:`/`hover:` classes on the same element. If you
  add `hc:bg-x`, also restate its states as `hc:data-checked:…`, `hc:hover:…`.
- Motion: `transition-[color,background-color,border-color,box-shadow,opacity]` short (≤150ms);
  popups use tw-animate `fade-in-0 zoom-in-95` 100ms; respect `motion-reduce`.

## 7. Composition API

- Plain function components, `ref` as a prop, `"use client"` at the top of every component file.
- Every rendered part has `data-slot="<component>-<part>"`; state flags as `data-*` (`data-size`,
  `data-variant`, `data-color`).
- Variants via `cva`, exported (`buttonVariants`) so apps can reuse them on other elements.
- Wrap Base UI parts 1:1 with shadcn names; pass `...props` through so `render` works. Single-element
  non-Base-UI components support `render` via `useRender` + `mergeProps`.
- `className` merged last via `cn`; apps extend by wrapping, never by forking.
- `color` prop omits the DOM `color` attribute from the props type.
- Overlays: `*.Portal` gets `container={usePortalContainer()}` so popups keep a ThemeScope's theme.
- Base UI `Button` with a non-button `render` gets `nativeButton={false}` automatically.

- Scrolling regions use `ScrollArea` (themed thumb, keyboard focus ring), with `fade` for edge fades
  (shadcn `scroll-fade-*` utilities, scroll-driven, no JS). `SidebarContent` does this by default.
- Vertical `Separator` stretches to its row (`data-vertical:self-stretch`). For a short centered rule override with the same variant: `data-vertical:h-5 data-vertical:self-center` (a bare `self-center` loses to the variant).

## 7b. Site shell (one design language across the suite)

Termicolor, kernelkit, glaze and repraze.com share the same chrome; a site picks its **accent, radius
and brand mark** and may add its own components, never its own header or docs layout. No banners or
decorations above the header row.

- Header: `SiteHeader` › `SiteHeaderContent` (h-14, `--kk-site-width` container, `px-4 md:px-6`) ›
  `SiteHeaderMenu` (phones) · `SiteHeaderBrand` · `SiteNav`/`SiteNavLink` (mono) · `SiteHeaderActions`
  (`SearchTrigger`, a vertical `Separator`, theme controls, repository icon button).
- Brand: a 32×32 pixel-art mark in Termicolor's sprite style (dark-mode palette colors only, light
  from the top left, dithered falloff, accent rim light on the right), sized `size-7`, then the name in
  mono semibold lowercase with its second word in the accent text tier: termi**color**, kernel**kit**.
  Generate the favicon from the same sprite.
- Pages with navigation: `SiteLayout` › `SiteSidebar` · `SiteMain` (`PageHeader`, content, `Pager`) ·
  `SiteAside` (`Toc`). Pages without: `SiteContainer`. The layout has no vertical padding; each column
  carries `py-8 lg:py-10`, so the sidebar's right border runs from the header to the footer.
- Sidebar: Sidebar menu parts, sticky, own scroll with fades, keeps the current item in view. Rows never
  wrap (`whitespace-nowrap`); wrap the label in a `<span>` to get an ellipsis. An expanded collapsible
  group is not "open" (no persistent wash): only real popups use `data-popup-open`.
- Search: `SearchTrigger` + `useSearchHotkeys` (Ctrl/⌘ K, `/`), results in a `CommandDialog`.
- Section anchors get `scroll-mt-24` so jumps clear the sticky header.

## 7c. Navigation states (header, sidebar, phone menu, tree, table of contents)

One rule, the same as `line` Tabs:

| State   | Text                                                      | Surface                      | Indicator                                               |
| ------- | --------------------------------------------------------- | ---------------------------- | ------------------------------------------------------- |
| rest    | `muted-foreground` (top-level sidebar rows: `foreground`) | none                         | none                                                    |
| hover   | `foreground`                                              | `bg-hover` wash (not Toc)    | none                                                    |
| current | `foreground`, medium in lists                             | list rows: `bg-primary-tint` | 2px `bg-primary-text`, on the edge facing the structure |

Where the indicator sits: header links, on the header's bottom border; sidebar and phone-menu rows, the
row's left edge (inset `top-1.5 bottom-1.5`, pill); sub-rows and Toc items, on the tree line. Icons in a
current row take `text-primary-text`. Never mark current with color alone or with an underline under the
text.

## 8. Test matrix (headless screenshots, `scripts/shot.mjs`)

Every component docs page, checked in:

1. dark, md radius, pink (default)
2. light
3. dark + hc, and light + hc
4. radius-none and radius-xl
5. one other accent (cyan or yellow: yellow has a dark on-color, catches `text-white` bugs)
6. interaction: hover, keyboard focus (`--press=Tab`), open state for overlays (`--click=…`)
7. phone width 390px for layout components

Tools (dev server must be running on :5175, it hot-reloads):

- `node scripts/shot.mjs /review/<slug> out.png --full` - every demo of a docs page in the 6-theme
  matrix (dark, light, dark·hc, light·hc, radius-none·cyan, radius-xl·yellow). Start here.
- `node scripts/shot.mjs /docs/<slug> out.png --el="[data-slot=demo-frame]" --nth=<i> --dpr=2` - one demo
  up close. Add `--theme=light`, `--hc`, `--radius=none`, `--accent=yellow`.
- States: `--hover=<sel>`, `--focus=<sel>` (keyboard focus-visible), `--click=<sel>` (open overlays),
  `--rclick=<sel>` (context menu), `--wait=<ms>` (hover cards), `--press=ArrowDown,Enter`. Overlays portal to the end of `<body>`: screenshot the page, not the frame.
- `node scripts/lint-design.mjs [files]` - mechanical checks for §1, §3, §7.
- `node scripts/check-states.mjs [slugs] [--modes=dark,light,dark-hc]` - hovers and keyboard-focuses every
  interactive element of every demo and reports the ones whose look doesn't change (dead hover, invisible
  focus). Run it after any change to backgrounds or state classes.
- `node scripts/check-docs.mjs` - console errors on every docs + review page.

## 9. Checklist (per component)

- [ ] No raw colors, no `foreground/NN` lines, no `rounded-full`/px radii (`npm run lint:design`)
- [ ] Heights/paddings/icon sizes match §4; mixed rows align on a baseline
- [ ] Radius follows the knob (looks right at none and xl)
- [ ] Hover, focus-visible, active, selected, disabled, invalid states exist and read in hc
- [ ] Titles use `font-heading`
- [ ] `data-slot` on every part, `"use client"`, variants exported, `render` passthrough
- [ ] Docs page: description, a demo per variant/size/state, props table, Base UI link
- [ ] No console errors on the docs page

---

## Decision log

- 2026-11-06 Base = shadcn **base-nova** (rounded tokens, compact h-8); lyra hardcodes `rounded-none`.
- 2026-11-06 Default accent pink; status tokens from Termicolor roles; `destructive` kept as alias of danger.
- 2026-11-06 Adopted from repraze-lib-ui: color × variant axes, `danger` naming, nativeButton auto,
  table flags, sidebar `keyboardShortcut`, ScrollArea viewport props, `font-heading`, avatar `xs`,
  checkbox indeterminate, `"use client"`.
- 2026-11-06 Lines use `border`/`input` tokens, not `foreground/10` (hc readability).
- 2026-11-06 Pills use `rounded-pill` so `radius-none` gives a fully square UI.
- 2026-11-06 Solid fills use the Termicolor fill tier (`--c-fill`): light-mode warning/yellow solid was
  brown with the text tier. `primary` stays on the accent role (deliberately more contrasty than the
  plain pink fill).
- 2026-11-06 Neutral soft is a faint `--c/6` wash so it sits below neutral solid (secondary).
- 2026-11-06 Popups `rounded-lg` + `p-1` (nested `rounded-md` items), cards/dialogs `rounded-xl`.
- 2026-11-06 `--radius` aliases `--kk-radius` for shadcn snippets.
- 2026-11-06 `rounded-box` token for <20px boxes (checkbox was a circle at radius-xl).
- 2026-11-06 hc: field surfaces and outline buttons drop the `dark:bg-input/30` wash (`--input` is bright
  in hc, the wash became a solid grey fill). Labels wrapping a disabled control dim (`has-data-disabled`).
- 2026-11-06 Input gets `size` sm/default/lg (native attribute renamed `htmlSize`). Toolbar container
  `p-px` so it is 32px like other default controls.
- 2026-11-06 Light `--secondary` mixed 5% toward foreground: Termicolor bgRaised was ~2% off the page.
- 2026-11-06 Field background tokens (`--field`, `--field-hover`, `--field-disabled`) replace
  `dark:bg-input/30`: the dark variant's specificity killed hover on outline buttons and selects in dark.
- 2026-11-06 Pressed toggles use the accent tint (`bg-accent`, an "on" state among peers); `bg-primary` is
  for a single checked control (checkbox, radio, switch) and the primary action.
- 2026-11-06 Light-mode accent was dark everywhere: `--primary` was the accent text tier. Termicolor now
  has `accentFill`/`onAccentFill` roles; `--primary` = fill, new `--primary-text` = text tier.
- 2026-11-06 `dark:<state>:bg-*` banned by lint (it outranks `hover:`): checkbox/radio lost hover when
  checked in dark. Use tokens or pair with `dark:hover:`.
- 2026-11-06 Docs nav is the kit's Sidebar; SidebarContent scrolls with ScrollArea + `fade`.
- 2026-11-06 shadcn registry: `npm run registry` builds `@kernelkit/*` items (imports rewritten to
  consumer aliases, tokens bundled as `@kernelkit/styles`). Verified with the real shadcn CLI in a fresh app.
- 2026-11-08 Site shell components (site-header, site-layout, page-header, toc, pager, search-trigger):
  one header / docs layout for every site of the suite. SidebarMenuButton works without a provider.
  Base UI ScrollArea sets `position` inline: sticky goes on a wrapper.
- 2026-11-07 Fields on `bgRaised` (Termicolor DESIGN.md §4), found by the termicolor site's e2e when it
  moved onto the kit; outline buttons transparent + `bg-hover`. CommandDialog forwards
  `initialFocus`/`finalFocus`.
- 2026-11-07 Thin accent indicators (tab line, selected-row bar, current/selected borders, drag-over,
  today dot, carousel dot, slider thumb ring) moved to `primary-text` (3:1 non-text contrast in light).
- 2026-11-06 `selectedRow` recipe shared by Table, DataTable, CodeBlock.
- 2026-11-06 `animate-indeterminate` keyframe for indeterminate bars; `placeholderFill` recipe.
- 2026-11-06 Typography `Title` has no built-in margins (repraze had `mb-6 last:mb-0`): spacing belongs
  to the layout. Note for the repraze migration.
- 2026-11-08 Navigation states unified (§7c): hover wash + 2px accent indicator everywhere; sidebar current
  rows tint with the accent (`--color-primary-tint`) instead of the grey `sidebar-accent`. `SiteHeaderBanner`
  removed (termicolor's spectrum bar went with it). Sidebar border runs header to footer.
- 2026-11-08 Brand marks: kernelkit gets a pixel-art CRT console matching termicolor's head; wordmarks are
  mono lowercase with the second word in the accent.
