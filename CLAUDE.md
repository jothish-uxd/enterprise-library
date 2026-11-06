# Enterprise Library — notes for Claude

This repo is the single source of Sleepy's design system: foundations (tokens), components and patterns. Apps install it from GitHub; they should not keep their own copies. It replaces `jothish-uxd/design-system`, which is no longer used.

## Layout

- `src/` — the package `@jothish-uxd/enterprise-library`: `styles/` (tokens and CSS) and `components/` (React). Built to `dist/` with `npm run build`; `dist/` is committed.
- `index.html` — the docs site, served by GitHub Pages as is (no build). Four sections in the header: Overview, Foundations, Components, Patterns. Each `.panel` has a `data-section`; each sidebar `.nav-group` has the same `data-section`, and only the current section's groups show.
- The page loads the package CSS from `dist/css/*.css` in a cascade layer (`layer(lib)`), skipping `base.css`. Library demos sit inside `.lib`; the page's own rules that share a class name (`.btn`, `.field`, `.note`, `table`…) are written `:where(:not(.lib *))` so they never reach demos and keep their specificity.
- Component pages are moving to a **playground**: one instance of the component in a preview, its props as controls beside it, and the matching code below (`Playground` in `docs/demos.tsx`, styles `.pg*` in `index.html`). Switch, Chips, Buttons, Checkbox, Checkbox group, Input, Radio button and Radio group are done. Every playground is compact at a fixed **420px** (preview and properties; the properties scroll beside the preview so the component stays in view); do the others one at a time when Sleepy asks, not all at once.
- `docs/demos.tsx` — live demos of the React components, mounted into `[data-react="name"]` elements, each in its own MemoryRouter. Built to `docs/demos.js` with `npm run build:docs`; committed.

## Every change

- `npm run check`, `npm run build`, `npm run build:docs`; update `DESIGN-SYSTEM.md` and `CHANGELOG.md`; bump `version` in package.json (and the install command and badge in `index.html`); commit and push.
- Claude sessions can't push tags, so ask Sleepy to publish a GitHub Release named and tagged `vX.Y.Z` on that commit. Then update the apps that use it (listed in README.md).
- Open the page and check every section in light, dark and at phone width before pushing.

## Rules

- Change components, tokens and rules **here first**. Never fix a copy inside an app and leave this repo behind.
- New components come from real use in an app. Generalise them before adding: no app names, no app-specific class names or data, no CSS imports inside components (styles live in `src/styles/` and ship in `styles.css`).
- Keep the look: Geist and Geist Mono, monochrome ink, state shown with ink weight, rules and shape, never colour alone. Colour appears only in error, warning and success messages, and on the danger button (red, `--danger`). Only use the tokens in `src/styles/tokens.css`; add a token there before using a new value anywhere.
- Accessibility is part of each component's contract: real buttons with names, WAI-ARIA patterns, visible focus, forced-colors fallbacks, reduced motion respected. Document the keyboard and screen-reader behaviour in DESIGN-SYSTEM.md and on the component's page.
- Every new component gets a page in the Components section of `index.html` (sidebar link, panel, pager) with a live demo.
- Commit as Sleepy <jothish.uxd@gmail.com>.
