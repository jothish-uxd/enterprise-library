# Changelog

## 0.2.0 — 2026-11-04

The design system moves into Enterprise Library: one repo for foundations, components and patterns. The package is now `@jothish-uxd/enterprise-library`, installed with `npm install github:jothish-uxd/enterprise-library#v0.2.0`. `jothish-uxd/design-system` is retired.

- Docs: the Enterprise Library page now has four sections in the header, Overview, Foundations, Components and Patterns, each with its own sidebar. New pages: Use cases, Getting started, every foundation and every component, with live demos.
- Foundations: an eight-step type ramp (`--text-*`, `.t-*`; title and display are fluid), line height, tracking and weight tokens; spacing (`--space-*`), radius (`--radius-*`), shadow (`--shadow-*`) and control-height tokens. Message colours (`--error`, `--warning`, `--success` and their `-bg`) join the tokens; `--ok` stays as an alias of `--success`.
- Every component now uses tokens only. StatFilter numbers are 20px (`--text-title-sm`, was 24px); HoverCard and ResetButton use the 8px popover radius (was 10px).
- Buttons: `--ghost`, `--danger`, `--lg`, `--icon`, `.btn__icon`, the pressed state, `.btn-row`, `.link-button--danger`, forced-colors borders.
- Table: `--selectable`, `--hover`, `--sticky`, `.center`, and `SortHeader`, `TableCheck`, `TableEmpty`.
- Card: `.card` with header, body, footer and stats; `Card` and `ChoiceCard`.
- Tiles: a grid of links into other pages, tiled (shared hairlines) or as cards; `Tiles` and `Tile`. The docs' Patterns, Components and Foundations index pages use it.
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
