# Changelog

## 0.2.0 — 2026-11-04

The design system moves into Enterprise Library: one repo for foundations, components and patterns. The package is now `@jothish-uxd/enterprise-library`, installed with `npm install github:jothish-uxd/enterprise-library#v0.2.0`. `jothish-uxd/design-system` is retired.

- Docs: the Enterprise Library page now has four sections in the header, Overview, Foundations, Components and Patterns, each with its own sidebar. New pages: Use cases, Getting started, every foundation and every component, with live demos.
- Foundations: an eight-step type ramp (`--text-*`, `.t-*`; title and display are fluid), line height, tracking and weight tokens; spacing (`--space-*`), radius (`--radius-*`), shadow (`--shadow-*`) and control-height tokens. Message colours (`--error`, `--warning`, `--success` and their `-bg`) join the tokens; `--ok` stays as an alias of `--success`.
- Every component now uses tokens only. StatFilter numbers are 20px (`--text-title-sm`, was 24px); HoverCard and ResetButton use the 8px popover radius (was 10px).
- Buttons: `--ghost`, `--danger`, `--lg`, `--icon`, `.btn__icon`, the pressed state, `.btn-row`, `.link-button--danger`, forced-colors borders.
- Table: `--selectable`, `--hover`, `--sticky`, `.center`, and `SortHeader`, `TableCheck`, `TableEmpty`.
- Card: `.card` with header, body, footer and stats; `Card` and `ChoiceCard`.
- Required fields are marked, not optional ones: `.field__required` puts an ink asterisk after the label (hidden from screen readers, which hear "required" from `aria-required`). `required` on Input, Checkbox and CheckboxGroup; `.field__optional` is gone. Input and CheckboxGroup take `description` (was `help`), matching Checkbox and Switch. Docs: every form playground has Required and Description switches.
- Every component page is now a playground: Table, Card and ChoiceCard, StatFilter and BrowserFrame joined the rest. Code blocks handle tags without attributes.
- Hover tooltips (`Tooltip`, `useTooltip`) follow their trigger when the page scrolls instead of closing. Focus scrolls controls into view, and closing then hid the text from keyboard users.
- ChoiceCard: `disabledReason`; unavailable cards use `aria-disabled` (still reachable, never chosen, say why).
- SegmentedControl: options take `disabledReason`; unavailable options use `aria-disabled` (reached by the arrow keys, never chosen, say why) and fade their content, not the focus ring. Icon-only options use the library tooltip instead of `title`. Docs: the Segmented control page is a playground.
- ResetButton: `confirmVariant` (`'danger'` makes the confirm's Reset button red), `disabled` with `disabledReason` (focusable, won't open, says why), and the library tooltip in place of `title`; `to` is optional. Existing props are unchanged. Docs: the ResetButton page is a playground, shown at the end of a browser bar.
- TextArea component (`TextArea`): label, description, required, an error, a character counter (`limit`) that never cuts off text, read only, and disabled with a reason. Fields now inherit the page font (`font-family: inherit`), so typed text is in Geist. Docs: the Text area page is a playground.
- Select and MultiSelect: `description`, `error`, `required` and `disabled` with `disabledReason`, as on Input (unavailable selects stay focusable, won't open, and say why). `describedBy` and `invalid` still work. Docs: the Select page is one playground with a Multiple switch.
- Radio and RadioGroup components: a radio with label, description and disabled with a reason (still reached by the arrow keys, never chosen); a group with legend, options, vertical or horizontal, required (`aria-required` on a `role="radiogroup"` fieldset), a description and an error. Docs: the Radio button and Radio group pages are playgrounds; playground previews grow to fit at phone width.
- Input component (`Input`): label, description, required, a decorative leading icon, an error that replaces the description, read only, and disabled with a reason (`aria-disabled`, still focusable, as on Checkbox and Button); other input attributes pass through. Docs: the Input page is a playground.
- CheckboxGroup component: legend, options, vertical or horizontal, an optional "select all" with the mixed state, a description and error. Docs: the Checkbox group page is one playground.
- Checkbox component (`Checkbox`): label, description, mixed state, an error message under the label (`error`), and disabled with a reason, as on Button and Switch. Docs: the Checkbox page is a playground.
- Danger buttons are red: new `--danger` and `--on-danger` tokens, the one place colour appears outside a message.
- Button component (`Button`): the `.btn` classes with variant (default primary), size, icon on the left or right (`iconPosition`), icon-only (label as name and tooltip), toggle (`pressed`) and an explained disabled state (`disabledReason`, as on Switch). Docs: the Buttons page is a playground.
- Switch (`.switch`, `Switch`): one setting on or off, applied straight away; a native checkbox with `role="switch"`. Unavailable switches stay focusable (`aria-disabled`) and explain why in a tooltip on hover and focus. New `useTooltip` hook for that kind of tooltip on any control. The Tiles demo's picture button is now an "Include image" switch.
- Tooltip replaces HoverCard: `trigger="hover"` (text only, as before) or `trigger="click"` (a native popover that can hold links; Tab reaches them, Escape returns to the button). `tooltip.css` replaces `hover-card.css`; `HoverCard` and the old class names still work as deprecated aliases. Docs: the Tooltip page is one playground for both versions; turning on Links switches it to On click, and On hover turns Links off.
- Forms: "Fields" becomes Forms, an accordion in the docs with a page each for Input, Text area, Select, Checkbox, Checkbox group, Radio button and Radio group. New `MultiSelect` (Select's look and keyboard, for several options). New classes: `.field__required`, `.field__control` and `.field__icon`, `.field__foot` and `.field__counter`, `.field-error`, `.checks--stack`, `.checks--nested`, `.check--desc` with `.check__label` and `.check__desc`; read-only and disabled field states.
- Segmented control (`.segmented`, `SegmentedControl`): choose one of a few options in a tray; a radio group, with counts, icon-only, small and full-width versions. From Online Assessments' asset and module filters and grid/list switch.
- Chips (`.chip`, `ChipGroup`): pill toggle buttons that filter, single- or multi-select (with a check when on). The docs page's own chips now use them.
- Docs: Segmented control, Chips and StatFilter form a "Filters and views" group, each page with the same guide to choosing between them. New token `--space-0-5` (2px), for the segmented tray.
- Tiles: a grid of links into other pages, joined (no gap, shared hairlines) or separate (a gap, each tile its own box); `Tiles` and `Tile`. `layout="tiled"`/`"cards"` and `.tiles--cards` still work as the old names. Docs: the Tiles page is a playground; playground previews scroll inside their 420px when the component is taller. The docs' Patterns, Components and Foundations index pages use it.
- Fields: `aria-invalid` styling. Stylesheets split into `base`, `type`, `forms`, `buttons`, `table` and `card`.

## 0.1.0 — 2026-11-04

First release, gathered from the copies in Cipher Lab and Online Assessments (the newer of the two where they differed).

- Tokens: colour (light and dark), type, base classes for buttons, fields, checks, tables and links.
- BrowserFrame and `useFrameHistory`.
- Select, with `placeholder`, `invalid` and `buttonId`. It now looks for any `[data-scroll]` region (it used to look for app-specific class names).
- StatFilter, new: counts that also filter, with the chosen card marked like a tab.
- HoverCard, with `.card-title`, `.card-dl` and `.card-note` for content.
- ResetButton.
- Docs site with live previews in light and dark.
