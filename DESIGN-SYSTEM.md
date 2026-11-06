# Enterprise Library — rules

Foundations, components and patterns for Sleepy's apps. Geist, monochrome ink on white, true black in dark mode. State is shown with ink weight, rules and shape, never colour alone; the only hue is an error, warning or success message. This repo is the single source; apps install it and don't keep copies. The docs page (`index.html`) shows every rule here live.

## Foundations (`src/styles/tokens.css`, shipped as `tokens.css`)

### Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | #ffffff | #0a0a0a | Page and panel background |
| `--bg-subtle` | #fafafa | #111111 | Bars, badges, chosen card fill |
| `--bg-hover` | #f2f2f2 | #1a1a1a | Hover and selected rows |
| `--ink` | #171717 | #ededed | Text, primary button, active marks |
| `--ink-soft` | #666666 | #a1a1a1 | Secondary text |
| `--ink-faint` | #737373 | #8a8a8a | Labels, table headers |
| `--rule` | #ebebeb | #242424 | Hairlines |
| `--rule-strong` | #d4d4d4 | #3a3a3a | Control borders, frame edge |
| `--focus` | #0068d6 | #52a8ff | Focus ring only |
| `--on-ink` | #ffffff | #0a0a0a | Text on solid ink |
| `--error`, `--error-bg` | #b42318, #fdecea | #ff8f85, #3b1513 | Error messages |
| `--warning`, `--warning-bg` | #8a5a00, #fdf3d7 | #f2c14e, #352a0e | Warning messages |
| `--success`, `--success-bg` | #157032, #e6f4ea | #6fd28c, #11301c | Success messages |
| `--danger`, `--on-danger` | #b42318, #ffffff | #ff8f85, #0a0a0a | Danger button fill and its text |

`--ok` is a deprecated alias of `--success`. Message colours appear only in messages and their icons, always beside words. The one exception is the danger button: `--danger` (same as `--error`) with `--on-danger` text (white in light mode, near-black in dark).

### Type

| Token | Size | Class | Use |
| --- | --- | --- | --- |
| `--text-caption` | 12px | `.t-caption` | Labels, table headers, badges, mono IDs |
| `--text-small` | 13px | `.t-small` | Help text, metadata |
| `--text-body-sm` | 14px | `.t-body-sm` | Controls, dense UI text, table cells |
| `--text-body` | 15px | `.t-body` | Reading text |
| `--text-lead` | 17px | `.t-lead` | Intro paragraphs |
| `--text-title-sm` | 20px | `.t-title-sm` | Section titles, card stats |
| `--text-title` | 24–32px, fluid | `.t-title`, `.page-title` | Page titles |
| `--text-display` | 44–72px, fluid | `.t-display` | Hero |

Line height `--leading-tight` 1.1, `--leading-snug` 1.4, `--leading-body` 1.6. Tracking `--tracking-title-sm` −0.025em, `--tracking-title` −0.045em, `--tracking-display` −0.055em. Weights `--weight-regular` 400, `--weight-medium` 500, `--weight-semibold` 600. Never type a raw size; a size between steps rounds to the nearer step.

### Spacing, radius, shadow, height

- Spacing, a 4px grid: `--space-1` 4, `-1-5` 6, `-2` 8, `-2-5` 10, `-3` 12, `-3-5` 14, `-4` 16, `-5` 20, `-6` 24, `-8` 32, `-10` 40, `-12` 48, `-16` 64. Half steps only inside controls.
- Radius: `--radius-xs` 4 (items in a list, focus ring), `-sm` 6 (buttons, fields, tags), `-md` 8 (popovers, choice cards), `-lg` 12 (cards, strips, frames), `-full`. Nest smaller inside larger.
- Shadow, only for things that float: `--shadow-frame`, `--shadow-popover`, `--shadow-overlay`. Each is deeper in dark mode.
- Control height: `--control-h-sm` 30, `--control-h` 36, `--control-h-lg` 44.

Theme follows the OS. Set `data-theme="light"` or `"dark"` on `<html>` to override it.

Fonts are loaded by the app, not the package:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Stylesheets: `styles.css` has everything. Each file also ships under `css/`: `tokens`, `base` (element resets, skip it if the page has its own), `type`, `forms`, `buttons`, `table`, `card`, and one per component.

## Components

### Buttons (`buttons.css`, `components/Button.tsx`)

`.btn` with a variant (`--primary`, `--secondary`, `--ghost`, `--danger`), a size (`--sm` 30px, default 36px, `--lg` 44px), an optional leading `.btn__icon`, and `--icon` for square icon-only buttons. `aria-pressed="true"` gives a toggle its ink border and wash. `.link-button` (and `--danger`) and `.btn-row`.

- One primary action per view. Label with a verb and object: “Delete 3 assets”.
- Danger is red (`--danger`): the one button with a colour, only for the last step of a destructive action. The verb and the trash icon say it too, so it never relies on colour alone.
- Prefer `aria-disabled="true"`, so the button stays focusable and can point at why. Icon-only buttons need `aria-label`.
- High contrast: ButtonText borders; pressed gets a Highlight border.
- Icons sit before the label, or after it with `.btn__icon--end` (`iconPosition="end"`), e.g. a download icon after “Export”.
- React: `<Button variant size icon iconPosition iconOnly pressed disabled disabledReason>` renders the same classes; `variant` defaults to primary. `iconOnly` keeps the label as the name and shows it as a tooltip; `disabled` uses `aria-disabled` (stays focusable, clicks do nothing) and `disabledReason` shows in a tooltip on hover and focus and is read as the description. `span.btn__icon` wraps the icon so any SVG fits.

### Forms (`forms.css`, `select.css`, `components/Select.tsx`, `components/MultiSelect.tsx`)

Native elements, styled, so browsers and screen readers already know how they work. One docs page each: Input, Text area, Select (single and multi), Checkbox, Checkbox group, Radio button, Radio group, plus a Forms overview.

Shared anatomy: `.field` stacks a `.field__label` (joined with `for`/`id`), the control, and `.field-help` (joined with `aria-describedby`). Mark the few optional fields with `.field__optional` "(optional)" rather than starring required ones. Errors replace the help: `.field-error` is ink words with an icon in `--error`, the control gets `aria-invalid="true"` and a 2px ink border. Placeholders are examples, never labels.

- **Input**: 36px, hairline border, 6px corners. States: hover, focus ring, invalid, read only (quiet fill, still focusable; prefer it to disabled), disabled. Leading icon: `.field__control` + `.field__icon`. Use the right `type`, `inputmode` and `autocomplete`; IDs are text with `inputmode="numeric"`, not `type="number"`.
- **Text area**: resizes vertically; `.field__foot` holds the help and a `.field__counter` ("102 characters left", semibold "6 characters too many" with `.is-over`). Never cut off what people typed; announce the counter only when they reach or pass the limit.
- **Select**: WAI-ARIA select-only combobox (see Select below). **MultiSelect**: same field, `aria-multiselectable` list with a box before each option; Enter or Space toggles and keeps the list open; the field shows "Email, Teams +2" and its name includes "4 chosen". For about 7+ options; fewer is a checkbox group.
- **Checkbox**: React `<Checkbox label checked onChange description indeterminate error disabled disabledReason>`: the name is the label only; the description and the error are read as its description; `error` shows the message under the label (`.check-field` > `.check__error`, lined up with the label text) with the error icon and sets `aria-invalid`; `disabled` uses `aria-disabled` with the reason in a tooltip. Plain HTML: `.check` around a native checkbox; `.check--desc` with `.check__label` and `.check__desc` for a description. Mixed state via `indeterminate` for "select all". Word it as what's true when checked. Settings that apply instantly are a Switch.
- **Checkbox group / Radio group**: a `fieldset.checks` with a `legend.field__label`; `.checks--stack` stacks them (do this unless there are two or three short options); `.checks--nested` indents options under a "select all". A group error goes under the last option, and the fieldset points at it with `aria-describedby`.
- **Radio button**: always in a group sharing a `name`; Tab reaches the chosen one, arrows move and choose. Never a lone radio. Choose a sensible default when there is one.
- Check on submit, then move focus to an error summary that links to each field; re-check a field as it's fixed. Never disable submit to show a form is incomplete. Keep what people typed.
- Layout: `.form`, `.form-grid`, `.form-actions`, `.inline-form`, `.field--wide` / `--narrow`. One column; size fields to their content.

### Switch (`switch.css`, `components/Switch.tsx`)

One setting on or off, applied straight away. A native checkbox with `role="switch"` inside `.switch__track`, with a `.switch__thumb` dot: off is an ink ring with the dot at the start, on is a filled track with the dot at the end. Never colour; high contrast uses Highlight for on. React: `<Switch label checked onChange description showState disabled disabledReason size labelPosition>`.

- Settings that apply instantly are switches; choices sent with a form are checkboxes. Never pair a switch with Save.
- The label names the setting ("Include image") and stays the same on or off; `showState` adds "On" or "Off". The name is the label only; a description is read separately.
- Unavailable: `aria-disabled` (not `disabled`), so it stays in the Tab order and can't be flipped, and `disabledReason` shows in a tooltip on hover and focus and is read as its description: "Proctoring, switch, off, dimmed. Turn on recording in Settings first." Always give a reason.
- Sizes 36×22 and `--sm` 28×18; `--start` puts the label first; `--between` spreads label and switch across a settings row.
- `useTooltip(content)` gives any control the same hover-and-focus tooltip: spread `hoverProps` and `focusProps`, add `describedBy` to `aria-describedby`, attach `anchorRef`, render `tooltip`.

### Table (`table.css`, `components/Table.tsx`)

`.table` with modifiers `--selectable` (checkbox column; chosen rows `.is-selected` or `aria-selected` get a wash and a 3px ink bar), `--hover`, `--compact`, `--sticky` (`--table-sticky-top`). Helpers: `SortHeader` (th carries `aria-sort`, the button the name: “Score, sorted descending, button”), `TableCheck` (row checkbox or select-all with the mixed state), `TableEmpty` (one row saying why it’s empty, with a next step). Every table has a caption and row headers.

### Card and ChoiceCard (`card.css`, `components/Card.tsx`)

`.card` with `__header` (`__heading`, `__title`, `__meta`, `__end`), `__body`, `__footer` (full-width rule), `__stats`; variants `--subtle`, `--strong`, `--emphasis` (ink border), `--compact`; `.card-grid` (`--card-min`) and `.card-list`. `Card` renders the same markup.

`ChoiceCard` is a card that is a real radio or checkbox: the input covers the card, invisible; the title is its name, the description its description. Chosen: a 2px ink edge and a filled mark (ring for radio, box for checkbox). Disabled stays readable and says why. Never a second control inside. A grid of links to other pages is Tiles, not cards.


### Filters and views: Segmented control, Chips, StatFilter

All three narrow or switch what's shown below them. Pick by how many options there are, whether people choose one or several, and whether the counts are the point.

| | Segmented control | Chips | StatFilter |
| --- | --- | --- | --- |
| Choose | One | One, or several | One |
| Options | 2–6, short, fixed | Any number; they wrap | 3–8 states |
| Best for | Filtering by one property; switching view or mode (grid / list) | Multi-select filters; long or changing option lists | Queues and pipelines where the counts are the headline |
| Looks | A tray; the choice is lifted out of it | Separate pills; chosen is solid ink, with a check when several can be on | A strip of counts; chosen has a 3px ink underline |
| Keyboard | One Tab stop; arrows move and choose | Each chip a Tab stop; Enter/Space toggles | Each card a Tab stop |
| Built as | Radio group (real radios) | Toggle buttons in a group | Toggle buttons in a group |

- Moving between pages, or panels of different content, is navigation: Tabs (0.3.0), not any of these.
- More than 6 options, or long labels: chips that wrap, or a Select.
- Keep "All" first, and announce how many results are showing in a polite live region.

**Segmented control** (`segmented.css`, `components/SegmentedControl.tsx`). `.segmented` tray, 36px like fields (`--sm` 30px), `--icons` for square icon-only options, `--fill` for full width; `.segmented__opt` with an invisible `.segmented__input` radio over it; chosen is `.is-on` or a checked input: page background and a rule-strong outline. `.segmented__icon`, `.segmented__count`; `.segmented-field` for a visible label. React: `<SegmentedControl label options value onChange showLabel iconOnly size fill name>`. Screen readers hear "Type, Video 4, radio button, checked, 3 of 6"; icon-only options keep their text label as the name. High contrast: the chosen option is Highlight. Overflows by scrolling sideways; at phone width with many options, use a Select instead.

**Chips** (`chips.css`, `components/ChipGroup.tsx`). `.chips` wrapping row; `.chip` 36px toggle button (`--sm` 30px) with `aria-pressed`; chosen is solid ink; `.chip__count` (or `.count`); `.chip__check` shows when a multi-select chip is on. React: `<ChipGroup label options value onChange multiple size controls>`. Single-select always has one chip on and pressing it again doesn't turn it off; multi-select with nothing on means no filter, so offer a way to clear.

### Tiles (`tiles.css`, `components/Tiles.tsx`)

A grid of links into other pages: a section's index, a gallery of patterns or templates. Two layouts:

- **Tiled** (`.tiles`, default): cells share 1px hairlines with square corners and no gaps, like a table. For many items, and items with a picture.
- **Cards** (`.tiles--cards`): separate boxes with 12px corners, 16px apart. For a handful of items, a section index, or next to Card content.

Each `.tile` holds one `.tile__link`: an optional `.tile__media` picture (72px, `aria-hidden`), a `.tile__head` with `.tile__title` and a mono `.tile__tag` (`--strong` for full ink), and a `.tile__desc`. Columns: as many as fit at `--tiles-min` (220px tiled, 240px cards), never more than `--tiles-columns` (3; `.tiles--two` caps at 2). React: `<Tiles layout columns minWidth label>` with `<Tile title description tag tagStrong media href | as + linkProps hidden>`.

- Tiles are navigation; content people compare, choose or act on is a Card.
- The whole tile is one link and its title is read first. Never a second control in a tile.
- The picture is decoration; the title and description must stand alone.
- Filtered tiles get `hidden`, and the number showing is announced in a polite live region.
- High contrast: hairlines and borders become CanvasText.

### BrowserFrame

`src/components/BrowserFrame.tsx` and `src/styles/browser-frame.css`.

A plain browser window for presenting an app inside a page: a product demo, a prototype, a case study. The app inside reads as the product, the page around it as the story.

```tsx
import { BrowserFrame, useFrameHistory } from '@jothish-uxd/enterprise-library';

function Demo() {
  const { pathname, nav, menuOpen, setMenuOpen, scrollRef } = useFrameHistory();
  return (
    <BrowserFrame.Stage>
      <BrowserFrame
        host="myapp.example"
        path={pathname}
        nav={nav}
        menu={{ open: menuOpen, onToggle: () => setMenuOpen((o) => !o), controls: 'sidebar' }}
        end={<Avatar />}
      >
        <div className="my-app">…</div>
      </BrowserFrame>
    </BrowserFrame.Stage>
  );
}
```

| Prop | What it does |
| --- | --- |
| `path` | Shown after the host in the address bar |
| `host` | Address host, default `example.app` |
| `nav` | Back / Forward buttons; `useFrameHistory()` supplies one |
| `menu` | Menu button for small screens; `controls` is the id of the panel it opens |
| `end` | Right end of the bar, such as an avatar |

Rules:

- **Fill the viewport.** `BrowserFrame.Stage` sizes the frame to the height under the site header. The page itself never scrolls; the app's own regions scroll inside the frame.
- **90% on wide screens.** From 1280px up, the frame takes 90% of the width and 90% of the height under the header, centered, so it reads as a framed product with even space around it. Below 1280px it fills the space with a 16px gutter (8px under 520px), because room inside matters more there.
- **Everything stays inside.** Back and Forward only move through pages visited in the frame, so Back never leaves it. Panels opened from the bar (like the small-screen menu) render inside the frame body, which is the positioning context.
- **Keep the bar quiet.** The window dots are decoration and hidden from assistive tech. Back, Forward and Menu are real buttons with names; the address is read-only text.
- **Small screens.** Below 960px the menu button appears; below 520px the dots and host hide so the path keeps its room.

Tunables: `--bframe-gutter` (below 1280px), `--bframe-radius`, `--bframe-bar-h`. The component reads only the shared tokens above, so it drops into any project that uses them.

### Select

`src/components/Select.tsx` and `src/styles/select.css`.

A custom dropdown that replaces the native `<select>`, following the WAI-ARIA select-only combobox pattern. It matches the other fields: same height, border and radius.

```tsx
import { Select } from '@jothish-uxd/enterprise-library';

<Select
  label="Metric"
  value={metric}
  onChange={setMetric}
  options={[
    { value: 'Precision', label: 'Precision' },
    { value: 'Recall', label: 'Recall' },
  ]}
  describedBy="metric-help"
/>
```

| Prop | What it does |
| --- | --- |
| `label` | Visible label; also the accessible name |
| `value`, `onChange` | Controlled value (string or number) |
| `options` | `{ value, label }` list |
| `describedBy` | id of help text that describes the field |
| `inline` | Label beside the button instead of above it |
| `hideLabel` | Keep the label for screen readers only, for compact fields whose context already names them (a status inside a policy match) |
| `placeholder` | Shown when the value isn't one of the options, e.g. "Choose a job" |
| `invalid` | Marks the field invalid (`aria-invalid`, heavier border) |
| `buttonId` | id for the button, so an error summary can link to it |
| `className` | Extra classes, e.g. `select--wide` for a 240px minimum |

Rules:

- **Looks like a field, opens like a menu.** Chevron sits 14px from the right edge and flips when open. The list floats 6px below with an 8px radius and soft shadow; the active option has a `--bg-hover` wash, the chosen one is weight 500 with a check.
- **Never clipped.** Near the bottom of its scrolling area (the nearest `[data-scroll]` element; put it on each app region that scrolls), the list opens upward. Long lists scroll at 280px.
- **Focus stays on the button.** The open list is announced through `aria-activedescendant`, so screen readers hear "Metric, Precision" and each option as you move.
- **Keyboard.** Enter, Space or the arrow keys open it. Up/Down, Home/End and Page Up/Down move. Typing jumps to a matching option. Enter or Space chooses, Escape closes without changing, Tab chooses and moves on.
- **High contrast.** In forced-colors mode the active option gets a system Highlight outline.

### ResetButton

`src/components/ResetButton.tsx` and `src/styles/reset.css`.

An icon button for the BrowserFrame bar (`end` slot) that clears saved changes after a confirm. Each app in a frame gets its own, scoped to its own data, so one app's reset never touches another's.

```tsx
<ResetButton what="jobs" description="…what it clears…" done="Jobs reset." to="/jobs"
  onReset={() => resetStore((key) => key.startsWith("jobs:"))} />
```

Rules: the confirm is a small `alertdialog` under the button; focus starts on **Cancel**; Escape or a click outside closes it and returns focus to the button; the result is announced in a polite live region. Say what is cleared and what is kept.

### Tooltip (`tooltip.css`, `components/Tooltip.tsx`)

Extra detail beside something on the page, in two versions:

| | On hover (`trigger="hover"`, default) | On click (`trigger="click"`) |
| --- | --- | --- |
| Opens | Hover, or keyboard focus | Pressing the button |
| Closes | Pointer or focus leaves; Escape | The button again, Escape, or clicking outside |
| Holds | Text only, never links or buttons | Text, links and buttons |
| Built as | A button described by `role="tooltip"` | A disclosure button (`aria-expanded`) and a native popover |

- The trigger is a real button with its own name: an icon-only trigger names what it explains ("About proctoring", not "Info").
- Hover: hoverable, dismissable, persistent (WCAG 1.4.13). It closes when focus moves, so a link in it could never be reached by keyboard or screen reader: if there's a link, use the click version.
- Click: Tab goes from the open button straight into its links, then on through the page; Escape closes it and returns focus to the button.
- Both render above everything (no clipping in scrolling areas) and flip above the trigger when there's no room below.
- Keep it short. Nothing people need to finish the task should live only in a tooltip.
- Content: `.tooltip__title` (`--rule`), `.tooltip__dl`, `.tooltip__note`, and for click `.tooltip__links`. Trigger: `.tooltip-trigger`, `--info` for a quiet info icon.
- `HoverCard` (with `card`) and the `.hovercard`, `.card-title`, `.card-dl`, `.card-note` classes are deprecated aliases kept for 0.1 apps.

### StatFilter

`src/components/StatFilter.tsx` and `src/styles/stat-filter.css`.

A row of counts that also filters what's below it. Use it when a page would otherwise show KPI cards and a separate set of filter chips with the same numbers. First used for a job's pipeline in the Online Assessments hiring system (All, Applied, Screening, Assessment, Interview, Offer, Hired).

```tsx
import { StatFilter } from '@jothish-uxd/enterprise-library';

<StatFilter
  label="Pipeline. Choose a stage to list its candidates"
  controls="job-cands-list"
  value={stage}
  onChange={setStage}
  items={[
    { value: 'All', label: 'All', count: 132 },
    { value: 'Assessment', label: 'Assessment', count: 18 },
  ]}
/>
```

| Prop | What it does |
| --- | --- |
| `label` | Accessible name of the group; say that choosing a card filters |
| `items` | `{ value, label, count }` list, in display order |
| `value`, `onChange` | The chosen card (controlled) |
| `controls` | id of the region the cards filter |
| `className` | Extra classes, usually for spacing |

Rules:

- **Counts first, filter second.** Each card is a big tabular number over a short label. If the numbers don't filter anything, use a plain `<dl>` of KPI tiles instead.
- **The chosen card uses the tab marker:** a 3px ink underline, the `--bg-subtle` fill and a semibold label. Never an inverted block; it competes with the content it filters. Hover is the `--bg-hover` wash.
- **One strip, hairline dividers.** One 1px `--rule` border and 12px radius around the strip, with hairlines between cards. Cards wrap on narrow screens (minimum 112px each) and the dividers follow.
- **Toggle buttons in a group.** Each card is a `<button aria-pressed>` with `aria-controls` pointing at what it filters; exactly one is pressed. Screen readers hear "18 Assessment, toggle button, pressed".
- **Offer "All" first** when seeing everything is a useful state. Update the filtered region's heading to match ("Assessment 18"), and reset any paging when the choice changes.
- **High contrast.** In forced-colors mode the underline becomes a system Highlight border.
