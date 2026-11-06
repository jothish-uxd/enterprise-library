# Enterprise Library

Foundations, components and accessible enterprise patterns: whole workflows, not just atoms and molecules. Each pattern decides where focus goes, what a screen reader hears, and how every state looks.

Docs: https://jothish-uxd.github.io/enterprise-library/ — one page, `index.html`, with four sections: **Overview** (introduction, use cases, getting started), **Foundations** (colour, type, spacing, radius and shadow), **Components** (buttons, fields, select, table, card and more) and **Patterns**.

## Install

```sh
npm install github:jothish-uxd/enterprise-library#v0.2.0
```

```tsx
import '@jothish-uxd/enterprise-library/styles.css';
import { Select, StatFilter, Card, ChoiceCard, SortHeader } from '@jothish-uxd/enterprise-library';
```

Load Geist and Geist Mono in the app (see Getting started on the docs page).

## What's inside

- **Foundations:** colour (monochrome plus error, warning and success), an eight-step type ramp, spacing, radius, shadow and control-height tokens.
- **Components:** Buttons (Button), Forms (Input, Text area, Select and MultiSelect, Checkbox and checkbox group, Radio group), Table (with SortHeader, TableCheck, TableEmpty), Card and ChoiceCard, Tiles, Segmented control, Chips, Switch, StatFilter, Tooltip, BrowserFrame, ResetButton.
- **Patterns** (working examples, React versions coming): bulk actions, data table, details sheet, filter bar, pagination, multi-step form, command palette, destructive confirm, notifications, empty / loading / error states, and admin screens (audit log, usage caps, compliance, reports, asset inventory, configuration, roles and permissions).

## Apps that use it

- Cipher Lab (`jothish-uxd/cipher-lab`)
- Online Assessments (`jothish-uxd/online-assessments`)

## Development

```sh
npm install
npm run check        # types
npm run build        # dist/ (committed)
npm run build:docs   # docs/demos.js (committed)
```

Open `index.html` through any local server (for example `python3 -m http.server`) to see the docs.

## Design rules

- Black and white with patterns, in the style of Accessible Charts. Geist and Geist Mono.
- Color appears in one place only: red, yellow, and green messages for errors, warnings, and success, each with an icon and words.
- Light, dark, and Windows High Contrast; reduced motion respected.
- Targets WCAG 2.2 AA with NVDA, JAWS, VoiceOver, and TalkBack.
