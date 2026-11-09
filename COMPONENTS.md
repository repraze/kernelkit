# KernelKit component inventory

**Status 2026-11-06: v0.1 inventory complete** - 77 components, every one with a docs page, checked
in the 6-theme review matrix, design lint clean. Form: nova ships no base-ui form wrapper; Field +
Fieldset cover it.

Status per component: **src** (in lib) · **design** (passes GUIDELINES §9) · **docs** (docs page).
Legend: ✅ done · ✅ in progress · ✅ todo · ➖ n/a. Origin: `nova` (shadcn base-nova install),
`repraze` (port from repraze-lib-ui / repraze website), `baseui` (Base UI primitive with no shadcn
wrapper), `new` (kernelkit original).

## Foundations

| Component                                 | Origin  | src | design | docs |
| ----------------------------------------- | ------- | --- | ------ | ---- |
| Theme provider / ThemeScope / ThemeScript | new     | ✅  | ✅     | ✅   |
| Tokens & color axis (`lib/color.ts`)      | new     | ✅  | ✅     | ✅   |
| Typography (Title, Text, TextLink, Code…) | repraze | ✅  | ✅     | ✅   |
| Direction                                 | nova    | ✅  | ➖     | ✅   |

## Actions

| Component    | Origin         | src | design | docs |
| ------------ | -------------- | --- | ------ | ---- |
| Button       | nova           | ✅  | ✅     | ✅   |
| Button group | nova           | ✅  | ✅     | ✅   |
| Toggle       | nova           | ✅  | ✅     | ✅   |
| Toggle group | nova           | ✅  | ✅     | ✅   |
| Toolbar      | repraze/baseui | ✅  | ✅     | ✅   |
| Copy button  | new            | ✅  | ✅     | ✅   |

## Inputs

| Component          | Origin            | src | design | docs |
| ------------------ | ----------------- | --- | ------ | ---- |
| Input              | nova              | ✅  | ✅     | ✅   |
| Input group        | nova              | ✅  | ✅     | ✅   |
| Textarea           | nova              | ✅  | ✅     | ✅   |
| Password input     | repraze           | ✅  | ✅     | ✅   |
| Number field       | baseui            | ✅  | ✅     | ✅   |
| Input OTP          | nova              | ✅  | ✅     | ✅   |
| Select             | nova              | ✅  | ✅     | ✅   |
| Native select      | nova              | ✅  | ✅     | ✅   |
| Combobox           | nova              | ✅  | ✅     | ✅   |
| Checkbox           | nova              | ✅  | ✅     | ✅   |
| Checkbox group     | baseui            | ✅  | ✅     | ✅   |
| Radio group        | nova              | ✅  | ✅     | ✅   |
| Switch             | nova              | ✅  | ✅     | ✅   |
| Slider             | nova              | ✅  | ✅     | ✅   |
| Calendar           | nova              | ✅  | ✅     | ✅   |
| Date picker        | new (nova recipe) | ✅  | ✅     | ✅   |
| File upload        | repraze           | ✅  | ✅     | ✅   |
| Field (+ Fieldset) | nova              | ✅  | ✅     | ✅   |
| Label              | nova              | ✅  | ✅     | ✅   |

## Overlays

| Component     | Origin | src | design | docs |
| ------------- | ------ | --- | ------ | ---- |
| Dialog        | nova   | ✅  | ✅     | ✅   |
| Alert dialog  | nova   | ✅  | ✅     | ✅   |
| Sheet         | nova   | ✅  | ✅     | ✅   |
| Drawer        | nova   | ✅  | ✅     | ✅   |
| Popover       | nova   | ✅  | ✅     | ✅   |
| Hover card    | nova   | ✅  | ✅     | ✅   |
| Tooltip       | nova   | ✅  | ✅     | ✅   |
| Dropdown menu | nova   | ✅  | ✅     | ✅   |
| Context menu  | nova   | ✅  | ✅     | ✅   |
| Command       | nova   | ✅  | ✅     | ✅   |
| Toast         | nova   | ✅  | ✅     | ✅   |

## Navigation

| Component       | Origin  | src | design | docs |
| --------------- | ------- | --- | ------ | ---- |
| Tabs            | nova    | ✅  | ✅     | ✅   |
| Breadcrumb      | nova    | ✅  | ✅     | ✅   |
| Pagination      | nova    | ✅  | ✅     | ✅   |
| Navigation menu | nova    | ✅  | ✅     | ✅   |
| Menubar         | nova    | ✅  | ✅     | ✅   |
| Sidebar         | nova    | ✅  | ✅     | ✅   |
| Navbar          | repraze | ✅  | ✅     | ✅   |

## Data display

| Component   | Origin  | src | design | docs |
| ----------- | ------- | --- | ------ | ---- |
| Badge       | nova    | ✅  | ✅     | ✅   |
| Avatar      | nova    | ✅  | ✅     | ✅   |
| Card        | nova    | ✅  | ✅     | ✅   |
| Table       | nova    | ✅  | ✅     | ✅   |
| Data table  | repraze | ✅  | ✅     | ✅   |
| Item        | nova    | ✅  | ✅     | ✅   |
| Kbd         | nova    | ✅  | ✅     | ✅   |
| Code block  | nova    | ✅  | ✅     | ✅   |
| Chart       | nova    | ✅  | ✅     | ✅   |
| Carousel    | nova    | ✅  | ✅     | ✅   |
| Accordion   | nova    | ✅  | ✅     | ✅   |
| Collapsible | nova    | ✅  | ✅     | ✅   |
| Marker      | nova    | ✅  | ✅     | ✅   |
| Stat        | new     | ✅  | ✅     | ✅   |
| Status dot  | new     | ✅  | ✅     | ✅   |

## Feedback

| Component         | Origin  | src | design | docs |
| ----------------- | ------- | --- | ------ | ---- |
| Alert             | nova    | ✅  | ✅     | ✅   |
| Callout           | repraze | ✅  | ✅     | ✅   |
| Progress          | nova    | ✅  | ✅     | ✅   |
| Meter             | baseui  | ✅  | ✅     | ✅   |
| Spinner           | nova    | ✅  | ✅     | ✅   |
| Skeleton          | nova    | ✅  | ✅     | ✅   |
| Empty             | nova    | ✅  | ✅     | ✅   |
| Password strength | repraze | ✅  | ✅     | ✅   |

## Layout

| Component    | Origin | src | design | docs |
| ------------ | ------ | --- | ------ | ---- |
| Separator    | nova   | ✅  | ✅     | ✅   |
| Scroll area  | nova   | ✅  | ✅     | ✅   |
| Resizable    | nova   | ✅  | ✅     | ✅   |
| Aspect ratio | nova   | ✅  | ✅     | ✅   |

## Site shell (suite chrome)

| Component                                     | Origin | src | design | docs |
| --------------------------------------------- | ------ | --- | ------ | ---- |
| Site header (+ nav, menu, actions, banner)    | new    | ✅  | ✅     | ✅   |
| Site layout (container, sidebar, main, aside) | new    | ✅  | ✅     | ✅   |
| Page header                                   | new    | ✅  | ✅     | ✅   |
| Table of contents (+ `useTocActive`)          | new    | ✅  | ✅     | ✅   |
| Pager                                         | new    | ✅  | ✅     | ✅   |
| Search trigger (+ `useSearchHotkeys`)         | new    | ✅  | ✅     | ✅   |

## Chat (nova AI set)

| Component        | Origin | src | design | docs |
| ---------------- | ------ | --- | ------ | ---- |
| Message          | nova   | ✅  | ✅     | ✅   |
| Bubble           | nova   | ✅  | ✅     | ✅   |
| Message scroller | nova   | ✅  | ✅     | ✅   |
| Attachment       | nova   | ✅  | ✅     | ✅   |
| Questionnaire    | nova   | ✅  | ✅     | ✅   |
| Trace            | nova   | ✅  | ✅     | ✅   |

## Later (not v0.1)

Tree view, timeline, stepper, tag input, date range picker, time input, terminal/console output,
diff view, JSON viewer, description list, sortable list. repraze website admin pieces (bulk action
bar, list toolbar, entity combobox, delete dialog) stay app-level unless they generalise.
