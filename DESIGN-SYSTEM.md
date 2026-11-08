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

In docs and prose, components are named in sentence case with spaces (Status mark, Side navigation). The React name (`StatusMark`, `SideNav`) appears only in code.

### Accordion (`accordion.css`, `components/Accordion.tsx`)

A stack of sections people open one or more of, so a long page shows its outline first: setup sections, test cases, FAQs (WAI-ARIA accordion). Not for views people switch between (Tabs) or a single show/hide.

- `<Accordion items defaultOpen | open onOpenChange single headingLevel layout />`. Each item is `{ value, title, content, meta?, actions?, disabled?, disabledReason? }`.
- Each header is a heading (`headingLevel`, default 3) holding one button with `aria-expanded` and `aria-controls`. `meta` (a StatusMark, a count) and `actions` (icon buttons) sit beside the button, never inside it. In a narrow container (440px or less) they move under the title.
- With 6 sections or fewer, each panel is a `region` named by its header; with more, it isn't, so landmarks don't pile up.
- Keyboard: Tab between headers and into open panels; Enter or Space opens and closes; Up and Down move between headers and wrap; Home and End jump.
- `single`: one open at a time. Otherwise any number.
- Open or closed is the chevron's shape (in a ring, pointing right or down; the ring goes full ink when open), never colour. An unavailable section uses `aria-disabled`, stays reachable, has a dashed ring and faint title, and `disabledReason` shows in a tooltip and is its description.
- Closed panels stay mounted with `hidden="until-found"`, so what people typed survives and find-in-page opens the matching section where supported. Padding lives on `.accordion__body`, since a panel hidden until found keeps its box.
- `layout="joined"` (default): rules between sections. `layout="separate"`: each section a bordered box (generalised from Online Assessments' test cases).
- Reduced motion: the chevron doesn't animate. Forced colors: rings and rules in CanvasText, unavailable sections in GrayText.

### Alerts: banner and toast (`alerts.css`, `components/Banner.tsx`, `components/Toast.tsx`, `components/AlertIcon.tsx`)

Banners for problems that need attention; toasts for the quick result of something people just did. Built from the Notifications pattern and Online Assessments' toasts. Colour appears here only for error, warning and success.

- Tones: `error` (filled circle with !), `warning` (filled triangle with !), `success` (filled circle with a check), `info` (ring with i, ink). The icon is hidden; a visually hidden word ("Error:", "Warning:", "Done:", "Note:") says the tone.
- `<Banner tone variant title action onDismiss announce>{message}</Banner>`.
  - `variant="global"`: full width under the header, `--{tone}-bg` fill and a 1px rule in the tone's colour (info: `--bg-subtle` and `--rule-strong`). For problems with the whole product.
  - `variant="inline"` (default): a hairline box with a 3px bar in the tone's colour, beside the content it's about.
  - A grid of icon, text, action and close; in a container 480px or narrower, the action moves under the text.
  - Announced on arrival: errors `role="alert"`, the rest `role="status"`; `announce="off"` for a banner already on screen at load. `onDismiss` adds a close button named "Dismiss".
- `<ToastProvider label max>` once around the app; `useToast()` returns `toast({ message, tone, action, duration })` and `dismiss(id)`.
  - Toasts are ink (`--ink` on `--on-ink`) whatever the tone, fixed to the bottom right (full width on phones), in a region named "Notifications".
  - One polite live region announces each toast once; focus never moves.
  - A toast with an action stays until dismissed; others stay `duration` (at least 6s) and pause while hovered or focused.
  - At most `max` (3) show; the rest wait behind "N more".
  - Escape or "Dismiss" closes one; if focus was in it, it returns to where it was before.
- Reduced motion: toasts appear without sliding. Forced colors: icons and borders in system colours, toasts outlined.
- Class names `.banner`, `.toaster` (not `.toast`, which apps use for their own).

### Buttons (`buttons.css`, `components/Button.tsx`)

`.btn` with a variant (`--primary`, `--secondary`, `--ghost`, `--danger`), a size (`--sm` 30px, default 36px, `--lg` 44px), an optional leading `.btn__icon`, and `--icon` for square icon-only buttons. `aria-pressed="true"` gives a toggle its ink border and wash. `.link-button` (and `--danger`) and `.btn-row`.

- One primary action per view. Label with a verb and object: “Delete 3 assets”.
- Danger is red (`--danger`): the one button with a colour, only for the last step of a destructive action. The verb and the trash icon say it too, so it never relies on colour alone.
- Prefer `aria-disabled="true"`, so the button stays focusable and can point at why. Icon-only buttons need `aria-label`.
- High contrast: ButtonText borders; pressed gets a Highlight border.
- Icons sit before the label, or after it with `.btn__icon--end` (`iconPosition="end"`), e.g. a download icon after “Export”.
- React: `<Button variant size icon iconPosition iconOnly pressed disabled disabledReason>` renders the same classes; `variant` defaults to primary. `iconOnly` keeps the label as the name and shows it as a tooltip; `disabled` uses `aria-disabled` (stays focusable, clicks do nothing) and `disabledReason` shows in a tooltip on hover and focus and is read as the description. `span.btn__icon` wraps the icon so any SVG fits.

### Forms (`forms.css`, `select.css`, `components/Input.tsx`, `components/TextArea.tsx`, `components/Radio.tsx`, `components/RadioGroup.tsx`, `components/Select.tsx`, `components/MultiSelect.tsx`)

Native elements, styled, so browsers and screen readers already know how they work. One docs page each: Input, Text area, Select (single and multi), Checkbox, Checkbox group, Radio button, Radio group, plus a Forms overview.

Shared anatomy: `.field` stacks a `.field__label` (joined with `for`/`id`), the control, and `.field-help` (joined with `aria-describedby`). Mark required fields with `.field__required`, an ink asterisk after the label with `aria-hidden="true"`, and put `aria-required="true"` on the control so screen readers hear "required"; leave optional fields unmarked, and say once above the form "Fields marked * are required." A group (fieldset) can't take `aria-required`, so its legend adds visually hidden ", required" after the asterisk. Descriptions (`.field-help`) are optional: add one only when it helps. Errors replace the help: `.field-error` is ink words with an icon in `--error`, the control gets `aria-invalid="true"` and a 2px ink border. Placeholders are examples, never labels.

- **Input**: 36px, hairline border, 6px corners. States: hover, focus ring, invalid, read only (quiet fill, still focusable; prefer it to disabled), disabled. Leading icon: `.field__control` + `.field__icon`. Use the right `type`, `inputmode` and `autocomplete`; IDs are text with `inputmode="numeric"`, not `type="number"`. React `<Input label description error required icon readOnly disabled disabledReason width>`, with every other input attribute passed through: the name is the label; `required` adds the asterisk and `aria-required` ("Work email, edit text, required"); the description, the error and a disabled reason are read as its description; `error` replaces the description and sets `aria-invalid`; `disabled` is `aria-disabled` plus `readonly`, so it stays in the Tab order, can't change, and shows the reason in a tooltip on hover and focus ("Work email, edit text, read only, dimmed. Set by your organisation's single sign-on."). Keyboard: Tab reaches it in every state; Esc closes the reason tooltip.
- **Text area**: resizes vertically; `.field__foot` holds the help and a `.field__counter` ("102 characters left", semibold "6 characters too many" with `.is-over`). Never cut off what people typed; announce the counter only when they reach or pass the limit. React `<TextArea label description error required limit rows readOnly disabled disabledReason width>`, with other textarea attributes passed through: the same field parts as Input; `limit` shows the counter, marks the field invalid while over, and speaks from a polite live region only when people reach or pass the limit; the counter is part of its description.
- **Select**: WAI-ARIA select-only combobox (see Select below). **MultiSelect**: same field, `aria-multiselectable` list with a box before each option; Enter or Space toggles and keeps the list open; the field shows "Email, Teams +2" and its name includes "4 chosen". For about 7+ options; fewer is a checkbox group.
- **Checkbox**: React `<Checkbox label required checked onChange description indeterminate error disabled disabledReason>`: `required` (a box people must tick, such as terms) adds the asterisk and `aria-required`; the name is the label only; the description and the error are read as its description; `error` shows the message under the label (`.check-field` > `.check__error`, lined up with the label text) with the error icon and sets `aria-invalid`; `disabled` uses `aria-disabled` with the reason in a tooltip. Plain HTML: `.check` around a native checkbox; `.check--desc` with `.check__label` and `.check__desc` for a description. Mixed state via `indeterminate` for "select all". Word it as what's true when checked. Settings that apply instantly are a Switch.
- **CheckboxGroup** (React): `<CheckboxGroup legend options value onChange orientation selectAll description required error name>`; `required` means at least one, with the asterisk and ", required" in the legend; vertical by default, horizontal for two or three short options; `selectAll` adds a first checkbox that shows the mixed state when only some are chosen and turns every available option on or off; `error` replaces `description` under the group; disabled options keep their value and explain why.
- **Checkbox group / Radio group**: a `fieldset.checks` with a `legend.field__label`; `.checks--stack` stacks them (do this unless there are two or three short options); `.checks--nested` indents options under a "select all". A group error goes under the last option, and the fieldset points at it with `aria-describedby`.
- **Radio button**: always in a group sharing a `name`; Tab reaches the chosen one, arrows move and choose. Never a lone radio. Choose a sensible default when there is one. React `<Radio name value label checked onChange description disabled disabledReason>`: the name is the label only, a description is read as its description; `onChange` gets this radio's value; `disabled` uses `aria-disabled`, so the arrow keys still reach it (focus lands, the choice stays where it was, the next arrow moves on) and the reason shows in a tooltip. Required and errors belong to the group.
- **RadioGroup** (React): `<RadioGroup legend options value onChange orientation required description error name>`; a `fieldset` with `role="radiogroup"` named by its legend, so screen readers hear "When results are shared, radio group, required". `required` adds the asterisk and `aria-required` on the group; `error` replaces the description and sets `aria-invalid`; `value` `''` is nothing chosen. Keyboard: Tab into the group (the chosen option, or the first), arrows move and choose, Space chooses when none is, Esc closes an unavailable option's tooltip.
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

### Card and choice card (`card.css`, `components/Card.tsx`: `Card`, `ChoiceCard`)

`.card` with `__header` (`__heading`, `__title`, `__meta`, `__end`), `__body`, `__footer` (full-width rule), `__stats`; variants `--subtle`, `--strong`, `--emphasis` (ink border), `--compact`; `.card-grid` (`--card-min`) and `.card-list`. `Card` renders the same markup.

`ChoiceCard` is a card that is a real radio or checkbox: the input covers the card, invisible; the title is its name, the description its description. Chosen: a 2px ink edge and a filled mark (ring for radio, box for checkbox). Disabled stays readable and says why. Never a second control inside. A grid of links to other pages is Tiles, not cards. An unavailable ChoiceCard (`disabled` with `disabledReason`) uses `aria-disabled`: Tab, or the arrow keys in a radio group, still reach it, it can't be chosen, and the reason shows in a tooltip and is read as its description.


### Filters and views: segmented control, chips, stat filter

All three narrow or switch what's shown below them. Pick by how many options there are, whether people choose one or several, and whether the counts are the point.

| | Segmented control | Chips | StatFilter |
| --- | --- | --- | --- |
| Choose | One | One, or several | One |
| Options | 2–6, short, fixed | Any number; they wrap | 3–8 states |
| Best for | Filtering by one property; switching view or mode (grid / list) | Multi-select filters; long or changing option lists | Queues and pipelines where the counts are the headline |
| Looks | A tray; the choice is lifted out of it | Separate pills; chosen is solid ink, with a check when several can be on | A strip of counts; chosen has a 3px ink underline |
| Keyboard | One Tab stop; arrows move and choose | Each chip a Tab stop; Enter/Space toggles | Each card a Tab stop |
| Built as | Radio group (real radios) | Toggle buttons in a group | Toggle buttons in a group |

- Moving between pages, or panels of different content, is navigation: Tabs or links, not any of these.
- More than 6 options, or long labels: chips that wrap, or a Select.
- Keep "All" first, and announce how many results are showing in a polite live region.

**Segmented control** (`segmented.css`, `components/SegmentedControl.tsx`). `.segmented` tray, 36px like fields (`--sm` 30px), `--icons` for square icon-only options, `--fill` for full width; `.segmented__opt` with an invisible `.segmented__input` radio over it; chosen is `.is-on` or a checked input: page background and a rule-strong outline. `.segmented__icon`, `.segmented__count`; `.segmented-field` for a visible label. React: `<SegmentedControl label options value onChange showLabel iconOnly size fill name>`. Screen readers hear "Type, Video 4, radio button, checked, 3 of 6"; icon-only options keep their text label as the name. High contrast: the chosen option is Highlight. Overflows by scrolling sideways; at phone width with many options, use a Select instead. Icon-only options show their label in the library tooltip (not `title`). An unavailable option (`disabled` with `disabledReason`) uses `aria-disabled`: the arrow keys reach it but don't choose it, the reason shows in a tooltip and is read as its description, and only its content fades so the focus ring stays full strength.

**Chips** (`chips.css`, `components/ChipGroup.tsx`). `.chips` wrapping row; `.chip` 36px toggle button (`--sm` 30px) with `aria-pressed`; chosen is solid ink; `.chip__count` (or `.count`); `.chip__check` shows when a multi-select chip is on. React: `<ChipGroup label options value onChange multiple size controls>`. Single-select always has one chip on and pressing it again doesn't turn it off; multi-select with nothing on means no filter, so offer a way to clear.

### Dialog (`dialog.css`, `components/Dialog.tsx`)

A modal on the native `<dialog>`: the page behind goes inert, Esc closes it, focus returns to whatever opened it, and the page doesn't scroll while it's open.

- `<Dialog open onClose title description footer size alert initialFocus hideClose>`. Named by its title (an h2), described by `description`.
- Sizes: `sm` 480px (confirms, short forms), `lg` 760px, `drawer` pinned to the right edge at full height.
- Focus starts on `initialFocus`, else the first field in the body, else the first footer action, and only then the close button.
- `alert` makes it an `alertdialog` (the description is read straight away) and the backdrop no longer closes it. Use it only for confirms that destroy something, and start on Cancel: `initialFocus={cancelRef}` with `<Button ref={cancelRef}>`.
- Keyboard: Tab and Shift+Tab stay inside; Esc closes it (an alert too); Enter activates the focused button.
- Rules: title a confirm as the question and name the button with the verb; say whether it can be undone; the main action goes last, at the right, and only a destructive one is red. No dialog from a dialog, none on page load.
- Tokens: `--backdrop` behind it, `--shadow-overlay`, `--radius-lg`; a 160ms entrance (`--duration-base`) only when motion is allowed. Forced colors: CanvasText border.

### Menu (`menu.css`, `components/Menu.tsx`)

A button that opens a short list of actions on one thing (WAI-ARIA menu button). For doing something, not for choosing a value (Select) or going somewhere (links).

- `<Menu label items iconOnly variant size align>`, with the button's content as children. The trigger is a `.btn` (`variant`, `size`, `iconOnly`); `label` is its name: "Options for Pilot screening v3, menu button, collapsed".
- Items: `{ label, onSelect, icon?, disabled?, disabledReason?, divider?, danger? }`. `divider` starts a group; `danger` sets the item in medium ink weight (the confirm Dialog after it carries the red).
- An unavailable item stays in the arrow-key order, can't be chosen, and shows its reason under the label, read as its description: "Archive, menu item, dimmed. Only the owner can archive it."
- Keyboard: Enter, Space or Down opens on the first item, Up on the last; Up and Down move and wrap; Home and End jump; a letter jumps to the next item starting with it; Enter or Space chooses and closes; Esc closes and returns focus to the button; Tab closes and moves on.
- The list opens below the button, or above it when there's no room (inside the nearest `[data-scroll]` or the window). Forced colors: CanvasText border, Highlight focus.

### Tabs (`tabs.css`, `components/Tabs.tsx`)

Switch between panels of related content in one place (WAI-ARIA tabs). Not for moving between pages (links or the side navigation) or for changing the view of one list (Segmented control).

- `<Tabs label tabs value onChange activation size fill>`; each tab is `{ value, label, panel, count?, disabled?, disabledReason? }`. Classes are `.tabs`, `.tabs__list`, `.tabs__tab`, `.tabs__count`, `.tabs__panel` (namespaced so they don't meet a page's own `.tab`).
- Keyboard: Tab reaches the chosen tab, then the panel; Left and Right move and wrap; Home and End jump. `activation="automatic"` (default) shows a panel as its tab is reached; `"manual"` waits for Enter or Space, for slow panels.
- Screen readers: "Assessment sections, tab list"; "Questions 42, tab, selected, 2 of 4"; each panel is named by its tab and takes focus when nothing focusable starts it.
- An unavailable tab uses `aria-disabled`: the arrow keys reach it, it's never chosen, and its reason shows in a tooltip and is read as its description.
- The chosen tab is full ink with a 2px rule under it (Highlight in high contrast). The row scrolls sideways when it can't fit; it never wraps. Panels stay mounted while hidden.

### Breadcrumbs (`breadcrumbs.css`, `components/Breadcrumbs.tsx`)

Where this page sits: the pages above it, each a link, ending with this page. For hierarchies three or more levels deep.

- `<Breadcrumbs items maxItems label>`; items are `{ label, to? }` (router link) or `{ label, href? }` (plain link); the last is the current page, `aria-current="page"`, not a link.
- A `nav` named "Breadcrumb" around an ordered list: "Breadcrumb, navigation, list, 4 items".
- Separators are CSS with empty alternative text (`content: "/" / ""`), so they aren't read.
- `maxItems` folds the middle into a "…" button ("Show 2 more levels"); opening it moves focus to the first level revealed.
- Rules: show the hierarchy, not history; use the pages' own titles; put it above the page title.

### Stepper (`stepper.css`, `components/Stepper.tsx`)

Where people are in a sequence of steps, and how far each has got.

- `<Stepper label steps current variant orientation unit statusText>`; each step is `{ id, label, status, to?, href? }` with `status` `complete`, `in-progress` or `not-started`.
- `variant="full"` (default): every step, numbered. Complete is a filled ink circle with a check; in progress a 1.5px ink ring; not started a faint ring. The current step is full ink with a 2px rule under it, or an ink bar beside it when `orientation="vertical"`. Never colour.
- `variant="compact"`: a segmented bar and "Step 3 of 4: Proctoring" (`unit` changes "Step").
- Plain steps are an ordered list named by `label`, the current one `aria-current="step"`. Steps with `to` or `href` are links in a `nav`, the current one `aria-current="page"`; only links are in the Tab order. Each step reads its number, name and status: "3. Proctoring, in progress, current step".
- Rules: three to about seven steps, short noun labels; link only the steps people can go back to; see the Multi-step form pattern for saving and validation between steps.

### Navigation: side navigation and header navigation (`navigation.css`, `components/SideNav.tsx`, `components/HeaderNav.tsx`)

Moving between a product's pages. Generalised from the header tabs and sidebars in Cipher Lab and Online Assessments. Classes are `.sidenav__*` and `.headernav__*`, so they don't collide with apps' own `.nav-link`.

- `<HeaderNav items label />`: top-level sections across the app header. A `<nav>` (default name "Primary") holding a list of links. The current section has full ink and a 2px ink rule; the nav reaches 1px past the header's content so the rule sits on the header's bottom border. Router items stay current on pages below them (`end` to stop that). The row scrolls sideways when it doesn't fit.
- `<SideNav label groups back headingLevel top footer />`: the pages within a section or record. Each group is `{ title?, hideTitle?, icon?, items, empty?, action? }`; each item `{ label, to?, href?, current?, end?, count?, strong? }`.
  - A titled group's heading (level 2 by default) names its list. `hideTitle` keeps it for screen readers and shows a rule above the group instead.
  - The current page: semibold ink, the `--bg-hover` tint and a 3px ink bar; the tint bleeds past the text so labels line up with titles. A group `icon` sits beside its title and its items, empty text and action line up after it.
  - `count` in mono at the end of an item, read after the label. `action` is a link with a plus at the end of a group. `back` is a link up one level.
- The current page is `aria-current="page"`: set by the router for `to` items, by `current` for `href` items. Lists of links only: Tab and Enter, no arrow keys.
- On phones, SideNav goes behind a menu button in the header (the app shell's job, not this component's).
- Forced colors: the current SideNav item uses Highlight and HighlightText; the HeaderNav rule uses Highlight.

### Progress bar (`progress.css`, `components/ProgressBar.tsx`)

How far a task has got: uploads, scoring, training. Generalised from Cipher Lab's training runs and Online Assessments' upload progress.

- `<ProgressBar label value max valueText showValue hideLabel description error size />`.
- `role="progressbar"` named by the visible label, with `aria-valuenow`, `-min`, `-max`; `valueText` ("9 of 12 files") is shown at the end of the label row (mono) and read as `aria-valuetext`, else the percent.
- No `value`: indeterminate. A band a third of the track slides along it; with reduced motion the track is hatched ink and still. Read with no value.
- `description` under the bar is its `aria-describedby`. `error` replaces it with the error icon, a hidden "Error:", and text in `--error`; the fill turns `--error`, the track is hatched and ruled in `--error`, so it doesn't rest on colour.
- Not a live region and not focusable: announce the start and end with a toast or status message, and put Cancel or Retry beside it as a button.
- Ink fill on a `--bg-hover` track with a hairline (`md`, 8px) or none (`sm`, 4px). Forced colors: CanvasText fill on a Canvas track with a CanvasText border.

### Loader (`loader.css`, `components/Loader.tsx`)

A small square mark that shows something is loading or working, and how far it's got when that can be measured. Was Progress circle (0.3.11) and Progress indicator (0.3.12); `ProgressCircle` and `ProgressIndicator` remain as deprecated aliases. Generalised from Online Assessments' spinners and Cipher Lab's pulse.

- `<Loader type label value max valueText size labelPosition />`. Seven types, all in the same square (`--loader-size`):
  - `circle` (default): an ink arc fills clockwise over a `--bg-hover` track, or a quarter arc spins over a `--rule` track.
  - `ticks`: twelve ticks; measured, the first n are ink and the rest `--rule-strong`; waiting, they fade from ink through `--ink-soft` and `--ink-faint` and turn in 12 steps.
  - `dots`: three dots pulse in turn. `bars`: four bars rise and fall. `orbit`: a dot goes round a `--rule` ring. `pulse`: a ring grows from a dot and fades. `grid`: nine squares light up in a diagonal wave.
  - Only circle and ticks take a `value`.
  - AI (`AI_LOADER_TYPES`, class `.loader--ai`), to say what a model is doing, always paired with a label that says it too:
    - `sparkle`: a four-point star turns and breathes, a small one twinkles (thinking).
    - `shimmer`: no mark; a highlight sweeps across the label (`background-clip: text`); the label always shows.
    - `network`: six nodes light up in turn along `--rule-strong` links (reasoning).
    - `scan`: an ink-edged band sweeps down over four lines (searching, reading sources).
    - `tokens`: three lines write themselves out left to right (generating).
    - `caret`: a block cursor after the label, blinking (still writing).
    - Reduced motion: all still; shimmer is plain `--ink-soft` text and the caret stays solid.
- Sizes `sm` 16px, `md` 32px, `lg` 64px (circle and ticks show the value inside, in mono). Labels beside (`end`), `below`, or `hidden`.
- `role="progressbar"` named by the label, with value attributes only when measured. Not a live region, not focusable: mark the loading area `aria-busy="true"` and announce the end if the wait was long.
- Reduced motion: nothing moves. Circle and orbit go dashed; ticks, dots, bars, pulse and grid hold a still fade in ink shades.
- No error state, and no line: for a wide bar use the progress bar (which slides without a value); for content placeholders use the skeleton. Forced colors: CanvasText and GrayText.
- Docs: the playground switches type with chips above the preview (`above` slot in `Playground`).

### Skeleton (`skeleton.css`, `components/Skeleton.tsx`)

Grey shapes where content will appear, so the page holds its layout while it loads.

- `<Skeleton label lines heading avatar rows />`: `lines` of text (default 3), a wider, taller `heading` bar, an `avatar` circle before the lines, and `rows` to repeat the block for a list. `--bg-hover` shapes that shimmer to `--bg-subtle`; still with reduced motion; GrayText in forced colors.
- One `role="progressbar"` named by `label`, which is visually hidden; the shapes are `aria-hidden`. Mark the area `aria-busy` and swap the skeleton for the content in place.
- Class `.skeleton*`; the docs page's own `.skeleton` rules are scoped away from demos.

### Link (`link.css`, `components/Link.tsx`)

Goes somewhere. To do something, use a Button.

- `<Link to|href newTab>{where it goes}</Link>`. `to` is a router path, `href` a plain address.
- One look in body text and on its own line: medium weight and a full-ink 1px underline, so a link reads as a link by more than colour (WCAG 1.4.1). On hover the underline goes; with keyboard focus it stays, plus the focus ring.
- `newTab`: opens in a new tab with `rel="noopener noreferrer"`. A box-and-arrow icon (`aria-hidden`) follows the last word, held on the same line by a word joiner, and "(opens in a new tab)" is in the accessible name. Use it only when leaving would lose work, or for help read alongside a task.
- Plain HTML: `a.link`. Links without a class inside `.prose` get the in-text style.
- Keyboard: Tab reaches it, Enter follows it. Screen readers: "proctoring policy, link"; new-tab links add "(opens in a new tab)". Link text says where it goes, never "click here".
- Forced colors: LinkText, underline kept on hover.

### Status mark (`status-mark.css`, `components/StatusMark.tsx`)

A status in words, with a small mark that repeats it by shape. Never colour, never the mark alone.

- `<StatusMark mark variant size muted>{words}</StatusMark>`. Marks are named by shape so each product maps its own statuses: `dashed` (not started, pending, draft), `ring` (open, ready), `half` (in progress, in review, on hold), `filled` (live, published), `check` (complete, passed, approved), `slash` (failed, denied, cancelled).
- `variant="badge"`: a small bordered box; a dashed badge has a dashed border, a slash badge a 1.5px ink border, a check badge is filled ink. `muted` softens the words for statuses that are over.
- The mark is an inline SVG with `aria-hidden`; the words are what's read. Class `.status-mark` (not `.status`, which apps use for their own labels).
- Forced colors: marks and borders in CanvasText.

### Tiles (`tiles.css`, `components/Tiles.tsx`)

A grid of links into other pages: a section's index, a gallery of patterns or templates. Two layouts:

- **Joined** (`.tiles`, default, `layout="joined"`): no gap. Tiles share 1px hairlines with square corners and read as one index, like a table of contents. For many short items people scan.
- **Separate** (`.tiles--separate`, `layout="separate"`): a 16px gap; each tile has its own border and 12px corners and reads as its own object. For a handful of richer items, especially with pictures.

The old names still work: `layout="tiled"` / `"cards"` and the `.tiles--cards` class. Not a bento grid: every tile is the same size, so reading order follows the rows and nothing breaks on a phone. A separate tile looks like a Card but is still a link; content people compare or act on is a Card.

Each `.tile` holds one `.tile__link`: an optional `.tile__media` picture (72px, `aria-hidden`), a `.tile__head` with `.tile__title` and a mono `.tile__tag` (`--strong` for full ink), and a `.tile__desc`. Columns: as many as fit at `--tiles-min` (220px joined, 240px separate), never more than `--tiles-columns` (3; `.tiles--two` caps at 2). React: `<Tiles layout columns minWidth label>` with `<Tile title description tag tagStrong media href | as + linkProps hidden>`.

- Tiles are navigation; content people compare, choose or act on is a Card.
- The whole tile is one link and its title is read first. Never a second control in a tile.
- The picture is decoration; the title and description must stand alone.
- Filtered tiles get `hidden`, and the number showing is announced in a polite live region.
- High contrast: hairlines and borders become CanvasText.

### Browser frame (`BrowserFrame`)

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
  required
  description="Which score the chart ranks models by."
/>
```

| Prop | What it does |
| --- | --- |
| `label` | Visible label; also the accessible name |
| `value`, `onChange` | Controlled value (string or number) |
| `options` | `{ value, label }` list |
| `required` | An asterisk after the label (hidden from screen readers) and `aria-required` on the button: "Metric, combo box, required" |
| `description` | A line under the field, read as its description |
| `error` | Replaces the description with the message and the error icon; sets `aria-invalid` |
| `disabled`, `disabledReason` | `aria-disabled`: stays in the Tab order, won't open or change, and shows the reason in a tooltip on hover and focus (and as its description) |
| `describedBy` | id of help text kept outside the field; added to the description |
| `inline` | Label beside the button instead of above it |
| `hideLabel` | Keep the label for screen readers only, for compact fields whose context already names them (a status inside a policy match) |
| `placeholder` | Shown when the value isn't one of the options, e.g. "Choose a job" |
| `invalid` | Marks the field invalid (`aria-invalid`, heavier border) for an error shown elsewhere; `error` sets it too |
| `buttonId` | id for the button, so an error summary can link to it |
| `className` | Extra classes, e.g. `select--wide` for a 240px minimum |

Rules:

- **Looks like a field, opens like a menu.** Chevron sits 14px from the right edge and flips when open. The list floats 6px below with an 8px radius and soft shadow; the active option has a `--bg-hover` wash, the chosen one is weight 500 with a check.
- **Never clipped.** Near the bottom of its scrolling area (the nearest `[data-scroll]` element; put it on each app region that scrolls), the list opens upward. Long lists scroll at 280px.
- **Focus stays on the button.** The open list is announced through `aria-activedescendant`, so screen readers hear "Metric, Precision" and each option as you move.
- **Keyboard.** Enter, Space or the arrow keys open it. Up/Down, Home/End and Page Up/Down move. Typing jumps to a matching option. Enter or Space chooses, Escape closes without changing, Tab chooses and moves on.
- **High contrast.** In forced-colors mode the active option gets a system Highlight outline; an unavailable button is GrayText.
- **MultiSelect** takes the same props, with `value` and `onChange` as arrays. Docs: one playground for both, with a Multiple switch.

### Reset button (`ResetButton`)

`src/components/ResetButton.tsx` and `src/styles/reset.css`.

An icon button for the BrowserFrame bar (`end` slot) that clears saved changes after a confirm. Each app in a frame gets its own, scoped to its own data, so one app's reset never touches another's.

```tsx
<ResetButton what="jobs" description="…what it clears…" done="Jobs reset." to="/jobs"
  onReset={() => resetStore((key) => key.startsWith("jobs:"))} />
```

Rules: the confirm is a small `alertdialog` under the button; focus starts on **Cancel**; Escape or a click outside closes it and returns focus to the button; the result is announced in a polite live region. Say what is cleared and what is kept.

- The button's name is "Reset {what}", also shown in the library tooltip on hover and focus (not `title`).
- `confirmVariant="danger"` makes the confirm's Reset button red, for resets that throw away work people would miss; keep the default primary for demo data that comes straight back.
- `disabled` with `disabledReason`: `aria-disabled`, so it stays in the Tab order, won't open, and the reason shows in the tooltip and is read as its description. Use it when there's nothing to reset.
- `to` is optional; leave it out to stay on the same page.

### Tooltip (`tooltip.css`, `components/Tooltip.tsx`)

Extra detail beside something on the page, in two versions (the docs show both in one playground, with an Opens switch):

| | On hover (`trigger="hover"`, default) | On click (`trigger="click"`) |
| --- | --- | --- |
| Opens | Hover, or keyboard focus | Pressing the button |
| Closes | Pointer or focus leaves; Escape | The button again, Escape, or clicking outside |
| Holds | Text only, never links or buttons | Text, links and buttons |
| Built as | A button described by `role="tooltip"` | A disclosure button (`aria-expanded`) and a native popover |

- The trigger is a real button with its own name: an icon-only trigger names what it explains ("About proctoring", not "Info").
- Hover: hoverable, dismissable, persistent (WCAG 1.4.13): when the page scrolls, it follows its trigger instead of closing, so a tooltip opened by keyboard focus isn't lost to the scroll that focus causes. It closes when focus moves, so a link in it could never be reached by keyboard or screen reader: if there's a link, use the click version.
- Click: Tab goes from the open button straight into its links, then on through the page; Escape closes it and returns focus to the button.
- Both render above everything (no clipping in scrolling areas) and flip above the trigger when there's no room below.
- Keep it short. Nothing people need to finish the task should live only in a tooltip.
- Content: `.tooltip__title` (`--rule`), `.tooltip__dl`, `.tooltip__note`, and for click `.tooltip__links`. Trigger: `.tooltip-trigger`, `--info` for a quiet info icon.
- `HoverCard` (with `card`) and the `.hovercard`, `.card-title`, `.card-dl`, `.card-note` classes are deprecated aliases kept for 0.1 apps.

### Stat filter (`StatFilter`)

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
