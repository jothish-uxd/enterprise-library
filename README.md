# enterprise library

A React design system of accessible enterprise patterns: whole workflows, not just atoms and molecules. Each pattern decides where focus goes, what a screen reader hears, and how every state looks.

The docs site is a single page, `index.html`. Open it in a browser; no build step.

## What's inside

- **Working with records:** data table, filter bar, bulk actions, details sheet
- **Tasks and feedback:** multi-step form, command palette, destructive confirm, notifications, empty / loading / error states
- **Admin console:** audit log, AI usage and caps, compliance overview, reports, asset inventory, configuration, roles and permissions

Every pattern page has a working example with a "Screen reader hears" strip, a keyboard map, focus and announcement notes, usage code, props, and states.

## Design rules

- Black and white with patterns, in the style of Accessible Charts. Geist and Geist Mono.
- Color appears in one place only: red, yellow, and green messages for errors, warnings, and success, each with an icon and words.
- Light, dark, and Windows High Contrast; reduced motion respected.
- Targets WCAG 2.2 AA with NVDA, JAWS, VoiceOver, and TalkBack.

## Status

v0.1 preview. The React package (`enterprise-library`) isn't published yet; the examples in the page are plain HTML and JavaScript that show the intended behavior.
