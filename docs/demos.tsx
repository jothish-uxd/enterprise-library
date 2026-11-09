/*
  Live demos for the docs page (index.html). Built into docs/demos.js with `npm run build:docs`
  and committed, so GitHub Pages serves the page with no build step.
  Each demo mounts into a [data-react="name"] element with its own in-memory router,
  so nothing here touches the page's own hash routing.
*/
import React, { StrictMode, useRef, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import {
  Accordion, Banner, ProgressBar, Loader, Skeleton, Tag, TagInput, FormGroup, FormSection, type FormError, Icon, ICONS, ICON_GROUPS, type IconName, type TagColor, type StatusMarkShape, ToastProvider, useToast, BrowserFrame, Button, Card, HeaderNav, SideNav, Breadcrumbs, Checkbox, Dialog, Link, Menu, StatusMark, Stepper, Tabs, CheckboxGroup, Input, Radio, RadioGroup, TextArea, ChipGroup, ChoiceCard, MultiSelect, ResetButton, SegmentedControl, Select, SortHeader, StatFilter, Switch, TableCheck, Tile, Tiles, TableEmpty, Tooltip,
  useFrameHistory, type SortDirection,
} from '../src';

/* ---------- Select playground (Select and MultiSelect) ---------- */
function SelectDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Job', required: true, hasDescription: true, description: 'The job this assessment is for.',
    multiple: false, placeholder: 'Choose a job', options: 'Starfighter Pilot, Hangar Mechanic, Intelligence Analyst, Field Medic',
    error: false, errorMessage: 'Choose the job this assessment is for.',
    disabled: false, disabledReason: 'The job can’t change once candidates are invited.',
  });
  const [one, setOne] = useState('');
  const [many, setMany] = useState<string[]>([]);
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.options).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const options = names.map((n) => ({ value: slug(n), label: n }));
  const multi = !!v.multiple;
  const name = camel(String(v.label)) || 'value';
  const setter = `set${name[0].toUpperCase()}${name.slice(1)}`;
  const showError = !!v.error && !!v.errorMessage;
  const optLines = options.map((o) => `    { value: '${o.value}', label: '${o.label}' },`).join('\n');
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    ...(v.placeholder ? [{ attr: 'placeholder', value: String(v.placeholder) }] : []),
    { attr: 'options', value: `[\n${optLines}\n  ]`, expr: true },
    { attr: 'value', value: name, expr: true },
    { attr: 'onChange', value: setter, expr: true },
    ...(v.hasDescription && v.description && !showError ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(showError ? [{ attr: 'error', value: String(v.errorMessage) }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
  ];
  const common = {
    label: String(v.label) || 'Untitled',
    options,
    placeholder: v.placeholder ? String(v.placeholder) : undefined,
    required: !!v.required,
    description: v.hasDescription && v.description ? String(v.description) : undefined,
    error: showError ? String(v.errorMessage) : undefined,
    disabled: !!v.disabled,
    disabledReason: v.disabled && v.disabledReason ? String(v.disabledReason) : undefined,
  };
  return (
    <Playground
      name="Select"
      compact
      values={v}
      set={set}
      file="JobPicker.tsx"
      tag={multi ? 'MultiSelect' : 'Select'}
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'boolean', key: 'required', label: 'Required', help: 'An asterisk after the label.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'boolean', key: 'multiple', label: 'Multiple', help: 'Choose several: MultiSelect. The list stays open while people choose.' },
        { kind: 'text', key: 'placeholder', label: 'Placeholder', help: 'Shown until something is chosen.' },
        { kind: 'text', key: 'options', label: 'Options', help: 'Up to 4 here, separated by commas. In real use, about 7 to 30.' },
        { kind: 'boolean', key: 'error', label: 'Error' },
        { kind: 'text', key: 'errorMessage', label: 'Error message', help: 'Replaces the description when Error is on.' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
      ]}
      preview={multi
        ? <MultiSelect {...common} value={many} onChange={setMany} />
        : <Select {...common} value={one} onChange={setOne} />}
    />
  );
}

/* ---------- Table ---------- */
const PEOPLE = [
  { id: 'C-1138', name: 'Luke Skywalker', job: 'Starfighter Pilot L4', score: 91 },
  { id: 'C-2187', name: 'Finn', job: 'Hangar Mechanic L3', score: 78 },
  { id: 'C-0451', name: 'Rey', job: 'Starfighter Pilot L4', score: 96 },
  { id: 'C-3263', name: 'Poe Dameron', job: 'Intelligence Analyst L5', score: 84 },
  { id: 'C-0001', name: 'Jyn Erso', job: 'Intelligence Analyst L5', score: 88 },
];

function TableDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    rows: '4', selectable: true, sortable: true, hover: false, compact: false, idCol: true, jobCol: false, empty: false,
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const [sort, setSort] = useState<{ key: 'name' | 'score'; dir: SortDirection }>({ key: 'score', dir: 'descending' });
  const [chosen, setChosen] = useState<string[]>(['C-0451']);
  const base = v.empty ? [] : PEOPLE.slice(0, Number(v.rows));
  const rows = [...base].sort((a, b) => (sort.key === 'score' ? a.score - b.score : a.name.localeCompare(b.name)) * (sort.dir === 'ascending' ? 1 : -1));
  const all = rows.length > 0 && rows.every((r) => chosen.includes(r.id));
  const some = rows.some((r) => chosen.includes(r.id));
  const sel = !!v.selectable, srt = !!v.sortable;
  const cols = 2 + (sel ? 1 : 0) + (v.idCol ? 1 : 0) + (v.jobCol ? 1 : 0);
  const cls = ['table', sel && 'table--selectable', v.hover && 'table--hover', v.compact && 'table--compact'].filter(Boolean).join(' ');

  const head = (label: string, key: 'name' | 'score', numeric = false) => srt
    ? `<SortHeader${numeric ? ' numeric' : ''} sort={sortBy === '${key}' ? dir : undefined} onSort={(d) => sort('${key}', d)}>${label}</SortHeader>`
    : `<th scope="col"${numeric ? ' className="num"' : ''}>${label}</th>`;
  const code = [
    '<caption className="visually-hidden">Candidates</caption>',
    '<thead>',
    '  <tr>',
    ...(sel ? ['    <TableCheck header checked={all} indeterminate={some && !all} label="Choose all candidates" onChange={chooseAll} />'] : []),
    `    ${head('Name', 'name')}`,
    ...(v.idCol ? ['    <th scope="col">ID</th>'] : []),
    ...(v.jobCol ? ['    <th scope="col">Job</th>'] : []),
    `    ${head('Score', 'score', true)}`,
    '  </tr>',
    '</thead>',
    '<tbody>',
    '  {rows.map((r) => (',
    `    <tr key={r.id}${sel ? " className={chosen.has(r.id) ? 'is-selected' : undefined}" : ''}>`,
    ...(sel ? ['      <TableCheck checked={chosen.has(r.id)} label={`Choose ${r.name}`} onChange={(c) => choose(r.id, c)} />'] : []),
    '      <th scope="row">{r.name}</th>',
    ...(v.idCol ? ['      <td><code>{r.id}</code></td>'] : []),
    ...(v.jobCol ? ['      <td>{r.job}</td>'] : []),
    '      <td className="num">{r.score}</td>',
    '    </tr>',
    '  ))}',
    `  {rows.length === 0 && <TableEmpty colSpan={${cols}} title="No candidates yet" action={<Button size="sm" variant="secondary">Invite candidates</Button>} />}`,
    '</tbody>',
  ];
  return (
    <Playground
      name="Table"
      compact
      wide
      values={v}
      set={set}
      file="Candidates.tsx"
      tag="table"
      attrs={[{ attr: 'className', value: cls }]}
      codeChildren={code}
      controls={[
        { kind: 'select', key: 'rows', label: 'Rows', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        { kind: 'boolean', key: 'selectable', label: 'Selectable', help: 'A checkbox column; chosen rows get a wash and an ink bar.' },
        { kind: 'boolean', key: 'sortable', label: 'Sortable', help: 'Name and Score sort; the header says which way.' },
        { kind: 'boolean', key: 'hover', label: 'Hover rows', help: 'A wash on hover, for rows that open something.' },
        { kind: 'boolean', key: 'compact', label: 'Compact', help: 'Shorter rows for dense lists.' },
        { kind: 'boolean', key: 'idCol', label: 'ID column' },
        { kind: 'boolean', key: 'jobCol', label: 'Job column' },
        { kind: 'boolean', key: 'empty', label: 'Empty', help: 'No rows: the table says why and offers the next step.' },
      ]}
      preview={
        <div className="table-wrap">
          <table className={cls}>
            <caption className="visually-hidden">Candidates{srt ? ', sortable by name and score' : ''}</caption>
            <thead>
              <tr>
                {sel && <TableCheck header checked={all} indeterminate={some && !all} label={`Choose all ${rows.length} candidates`}
                  onChange={(c) => setChosen(c ? Array.from(new Set([...chosen, ...rows.map((r) => r.id)])) : chosen.filter((id) => !rows.some((r) => r.id === id)))} />}
                {srt ? <SortHeader sort={sort.key === 'name' ? sort.dir : undefined} onSort={(dir) => setSort({ key: 'name', dir })}>Name</SortHeader> : <th scope="col">Name</th>}
                {v.idCol && <th scope="col">ID</th>}
                {v.jobCol && <th scope="col">Job</th>}
                {srt ? <SortHeader numeric sort={sort.key === 'score' ? sort.dir : undefined} onSort={(dir) => setSort({ key: 'score', dir })}>Score</SortHeader> : <th scope="col" className="num">Score</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const on = sel && chosen.includes(p.id);
                return (
                  <tr key={p.id} className={on ? 'is-selected' : undefined}>
                    {sel && <TableCheck checked={on} label={`Choose ${p.name}`} onChange={(c) => setChosen(c ? [...chosen, p.id] : chosen.filter((x) => x !== p.id))} />}
                    <th scope="row">{p.name}</th>
                    {v.idCol && <td><code>{p.id}</code></td>}
                    {v.jobCol && <td>{p.job}</td>}
                    <td className="num">{p.score}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <TableEmpty colSpan={cols} title="No candidates yet"
                  action={<Button size="sm" variant="secondary" onClick={() => set('empty', false)}>Invite candidates</Button>}>
                  Invite people to this job and they’ll appear here.
                </TableEmpty>
              )}
            </tbody>
          </table>
        </div>
      }
    />
  );
}

/* ---------- ChoiceCard ---------- */
const PLANS = [
  { value: 'standard', title: 'Standard', desc: 'Webcam check at the start and end.', meta: 'ID · WEBCAM' },
  { value: 'live', title: 'Live proctor', desc: 'A proctor watches the whole session.', meta: 'ID · WEBCAM · SCREEN' },
  { value: 'none', title: 'Unproctored', desc: 'No checks during the session.', meta: 'NONE', disabled: true },
];
function CardDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    title: 'Pilot screening v3', meta: 'Edited 2 days ago by Leia Organa', tag: true, stats: true, footer: true, variant: 'default', compact: false,
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const variant = v.variant as 'default' | 'subtle' | 'strong' | 'emphasis';
  const attrs: PgCodeLine[] = [
    ...(v.title ? [{ attr: 'title', value: String(v.title) }] : []),
    ...(v.meta ? [{ attr: 'meta', value: String(v.meta) }] : []),
    ...(v.tag ? [{ attr: 'end', value: '<span className="tag">Live</span>', expr: true }] : []),
    ...(v.footer ? [{ attr: 'footer', value: '<>\n    <span>132 candidates</span>\n    <Button size="sm" variant="secondary">Open</Button>\n  </>', expr: true }] : []),
    ...(variant !== 'default' ? [{ attr: 'variant', value: variant }] : []),
    ...(v.compact ? [{ attr: 'compact', value: true as const }] : []),
  ];
  const body = v.stats
    ? ['<dl className="card__stats">', '  <div><dt>Pass rate</dt><dd>64%</dd></div>', '  <div><dt>Median</dt><dd>38 min</dd></div>', '</dl>']
    : ['<p>132 candidates have taken it this month.</p>'];
  return (
    <Playground
      name="Card"
      compact
      values={v}
      set={set}
      file="Assessments.tsx"
      tag="Card"
      attrs={attrs.length ? attrs : [{ attr: 'title', value: 'Untitled' }]}
      codeChildren={body}
      controls={[
        { kind: 'text', key: 'title', label: 'Title', help: 'A heading (h3 by default). Leave empty for none.' },
        { kind: 'text', key: 'meta', label: 'Meta', help: 'One quiet line: owner, date, count. Leave empty for none.' },
        { kind: 'boolean', key: 'tag', label: 'Tag', help: 'In the end slot, at the right of the header.' },
        { kind: 'boolean', key: 'stats', label: 'Stats', help: 'Label-and-number pairs in the body.' },
        { kind: 'boolean', key: 'footer', label: 'Footer', help: 'Under a full-width rule.' },
        { kind: 'select', key: 'variant', label: 'Variant', options: [{ value: 'default', label: 'Default' }, { value: 'subtle', label: 'Subtle' }, { value: 'strong', label: 'Strong' }, { value: 'emphasis', label: 'Emphasis' }] },
        { kind: 'boolean', key: 'compact', label: 'Compact', help: 'Less padding, for dense grids.' },
      ]}
      preview={
        <Card
          className="pg-card"
          title={v.title ? String(v.title) : undefined}
          meta={v.meta ? String(v.meta) : undefined}
          end={v.tag ? <span className="tag">Live</span> : undefined}
          footer={v.footer ? <><span>132 candidates</span><Button size="sm" variant="secondary">Open</Button></> : undefined}
          variant={variant}
          compact={!!v.compact}
        >
          {v.stats
            ? <dl className="card__stats"><div><dt>Pass rate</dt><dd>64%</dd></div><div><dt>Median</dt><dd>38 min</dd></div></dl>
            : <p>132 candidates have taken it this month.</p>}
        </Card>
      }
    />
  );
}

const CHOICE_ICONS = [
  <svg key="a" viewBox="0 0 16 16"><circle cx="8" cy="6" r="2.5" /><path d="M3.5 13.5c.8-2.4 2.5-3.5 4.5-3.5s3.7 1.1 4.5 3.5" /></svg>,
  <svg key="b" viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="8" rx="1.5" /><path d="M6 13.5h4" /></svg>,
  <svg key="c" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" /><path d="M4.2 11.8l7.6-7.6" /></svg>,
];
function ChoiceCardDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    type: 'radio', descriptions: true, meta: true, icons: false, compact: false,
    disableLast: true, disabledReason: 'Evaluated modules must be proctored.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const [plan, setPlan] = useState('standard');
  const [many, setMany] = useState<string[]>(['standard']);
  const radio = v.type === 'radio';
  const opts = PLANS.map((p, i) => ({ ...p, disabled: !!v.disableLast && i === PLANS.length - 1 }));
  const reason = v.disabledReason ? String(v.disabledReason) : undefined;
  const line = (p: typeof opts[number]) => [
    `  <ChoiceCard${radio ? '' : ' type="checkbox"'}${v.compact ? ' compact' : ''}`,
    `    name="proctoring" value="${p.value}" title="${p.title}"`,
    ...(v.descriptions ? [`    description="${p.desc}"`] : []),
    ...(v.meta ? [`    meta="${p.meta}"`] : []),
    ...(v.icons ? ['    icon={<PersonIcon />}'] : []),
    radio ? `    checked={plan === '${p.value}'} onChange={() => setPlan('${p.value}')}` : `    checked={tools.includes('${p.value}')} onChange={(c) => toggle('${p.value}', c)}`,
    ...(p.disabled ? [`    disabled disabledReason="${reason ?? ''}"`] : []),
    '  />',
  ];
  return (
    <Playground
      name="Choice card"
      compact
      wide
      values={v}
      set={set}
      file="Proctoring.tsx"
      tag="fieldset"
      attrs={[]}
      codeChildren={['<legend className="field__label">Proctoring</legend>', '<div className="card-grid">', ...opts.flatMap(line), '</div>']}
      controls={[
        { kind: 'segmented', key: 'type', label: 'Type', options: [{ value: 'radio', label: 'Radio' }, { value: 'checkbox', label: 'Checkbox' }] },
        { kind: 'boolean', key: 'descriptions', label: 'Descriptions', help: 'Read as each card’s description.' },
        { kind: 'boolean', key: 'meta', label: 'Meta', help: 'A mono line: labels or an ID.' },
        { kind: 'boolean', key: 'icons', label: 'Icons', help: 'A small outlined icon before the title.' },
        { kind: 'boolean', key: 'compact', label: 'Compact' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last card' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip and read as its description.' },
      ]}
      preview={
        <fieldset className="pg-choice">
          <legend className="field__label">Proctoring</legend>
          <div className="card-grid" style={{ ['--card-min' as string]: '150px' }}>
            {opts.map((p, i) => (
              <ChoiceCard key={p.value} type={radio ? 'radio' : 'checkbox'} name="pg-plan" value={p.value}
                checked={radio ? plan === p.value : many.includes(p.value)}
                onChange={(c) => (radio ? setPlan(p.value) : setMany(c ? [...many, p.value] : many.filter((x) => x !== p.value)))}
                title={p.title} description={v.descriptions ? p.desc : undefined} meta={v.meta ? p.meta : undefined}
                icon={v.icons ? CHOICE_ICONS[i] : undefined} compact={!!v.compact}
                disabled={p.disabled} disabledReason={p.disabled ? reason : undefined} />
            ))}
          </div>
        </fieldset>
      }
    />
  );
}

/* ---------- StatFilter ---------- */
function StatFilterDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Pipeline. Choose a stage to list its candidates', stages: 'Screening, Assessment, Interview', all: true, big: false, region: true,
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.stages).split(',').map((x) => x.trim()).filter(Boolean).slice(0, v.all ? 3 : 4);
  const scale = v.big ? 1371 : 11;
  const base = names.map((n) => ({ value: slug(n), label: n, count: fakeCount(n) * scale }));
  const items = v.all ? [{ value: 'all', label: 'All', count: base.reduce((t, i) => t + i.count, 0) }, ...base] : base;
  const [chosen, setChosen] = useState('all');
  const value = items.some((i) => i.value === chosen) ? chosen : items[0]?.value ?? '';
  const current = items.find((i) => i.value === value);
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(v.region ? [{ attr: 'controls', value: 'candidates' }] : []),
    { attr: 'value', value: 'stage', expr: true },
    { attr: 'onChange', value: 'setStage', expr: true },
    { attr: 'items', value: `[\n${items.map((i) => `    { value: '${i.value}', label: '${i.label}', count: ${i.count} },`).join('\n')}\n  ]`, expr: true },
  ];
  return (
    <Playground
      name="Stat filter"
      compact
      wide
      values={v}
      set={set}
      file="Pipeline.tsx"
      tag="StatFilter"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'Names the group for screen readers; say that choosing filters.' },
        { kind: 'text', key: 'stages', label: 'Stages', help: 'Up to 4 cards in all, separated by commas.' },
        { kind: 'boolean', key: 'all', label: '“All” first', help: 'When seeing everything is useful. Its count is the total.' },
        { kind: 'boolean', key: 'big', label: 'Large counts', help: 'Thousands, with separators.' },
        { kind: 'boolean', key: 'region', label: 'Filtered region', help: 'What the cards control (aria-controls), with a heading that follows the choice.' },
      ]}
      preview={
        <div className="pg-statfilter">
          <StatFilter label={String(v.label) || 'Untitled'} items={items} value={value} onChange={setChosen} controls={v.region ? 'pg-sf-out' : undefined} />
          {v.region && current && (
            <section id="pg-sf-out" className="pg-statfilter__out" aria-live="polite">
              <h3>{current.label === 'All' ? 'All candidates' : current.label}</h3>
              <p className="t-small muted">{current.count.toLocaleString('en-US')} candidates</p>
            </section>
          )}
        </div>
      }
    />
  );
}

/* ---------- Tooltip ---------- */
const FlagIcon = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 14V2.5h8l-1.5 3 1.5 3h-8" fill="currentColor" /></svg>;
const InfoIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 7.2v3.8M8 5h.01" /></svg>;
const TT_DEFAULTS = {
  info: { label: 'About proctoring', title: 'Proctoring', text: 'A webcam check at the start and end of the assessment. Candidates are told before they begin.',
    dl: [['Starts', 'Before the first question'], ['Ends', 'After submitting']], note: 'Recordings are kept for 30 days.' },
  count: { label: '2 policy matches, 1 open', title: 'Policy matches', text: 'Flagged by the nightly scan.',
    dl: [['Bribery', 'Open'], ['Gifts and entertainment', 'Cleared']], note: 'Open matches need a reviewer.' },
};
function TooltipDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    opens: 'hover', look: 'info', label: TT_DEFAULTS.info.label, title: TT_DEFAULTS.info.title, text: TT_DEFAULTS.info.text,
    details: false, note: false, links: false,
  });
  const set = (key: string, value: PgValue) => setV((old) => {
    const next = { ...old, [key]: value };
    // Hover tooltips never hold links: links on means click; hover means no links.
    if (key === 'links' && value) next.opens = 'click';
    if (key === 'opens' && value === 'hover') next.links = false;
    // Switching the trigger swaps in its own example text, unless it was edited.
    if (key === 'look') {
      const from = TT_DEFAULTS[old.look as 'info' | 'count'], to = TT_DEFAULTS[value as 'info' | 'count'];
      (['label', 'title', 'text'] as const).forEach((k) => { if (old[k] === from[k]) next[k] = to[k]; });
    }
    return next;
  });
  const d = TT_DEFAULTS[v.look as 'info' | 'count'];
  const click = v.opens === 'click';
  const info = v.look === 'info';
  const lines: string[] = [
    ...(v.title ? [`<p className="tooltip__title">${v.title}</p>`] : []),
    ...(v.text ? [`<p>${v.text}</p>`] : []),
    ...(v.details ? ['<dl className="tooltip__dl">', ...d.dl.map(([t, dd]) => `  <div><dt>${t}</dt><dd>${dd}</dd></div>`), '</dl>'] : []),
    ...(v.note ? [`<p className="tooltip__note">${d.note}</p>`] : []),
    ...(v.links && click ? ['<p className="tooltip__links">', '  <a href="/help/proctoring">Proctoring options</a>', '  <a href="/help/retention">Data retention</a>', '</p>'] : []),
  ];
  const attrs: PgCodeLine[] = [
    ...(click ? [{ attr: 'trigger', value: 'click' }] : []),
    { attr: 'label', value: String(v.label) },
    ...(info ? [{ attr: 'className', value: 'tooltip-trigger--info' }] : []),
    { attr: 'content', value: `<>\n${lines.map((l) => `    ${l}`).join('\n')}\n  </>`, expr: true },
  ];
  const content = (
    <>
      {v.title ? <p className="tooltip__title">{String(v.title)}</p> : null}
      {v.text ? <p>{String(v.text)}</p> : null}
      {v.details ? <dl className="tooltip__dl">{d.dl.map(([t, dd]) => <div key={t}><dt>{t}</dt><dd>{dd}</dd></div>)}</dl> : null}
      {v.note ? <p className="tooltip__note">{d.note}</p> : null}
      {v.links && click ? <p className="tooltip__links"><a href="#radio-group">Proctoring options</a><a href="#compliance">Data retention</a></p> : null}
    </>
  );
  const tip = (
    <Tooltip key={`${v.opens}`} trigger={click ? 'click' : 'hover'} label={String(v.label) || 'Untitled'}
      className={info ? 'tooltip-trigger--info' : undefined} content={content}>
      {info ? <InfoIcon /> : <><FlagIcon /> 2</>}
    </Tooltip>
  );
  return (
    <Playground
      name="Tooltip"
      compact
      values={v}
      set={set}
      file={info ? 'Proctoring.tsx' : 'Flags.tsx'}
      tag="Tooltip"
      attrs={attrs}
      codeChildren={[info ? '<InfoIcon />' : '<FlagIcon /> 2']}
      controls={[
        { kind: 'segmented', key: 'opens', label: 'Opens', options: [{ value: 'hover', label: 'On hover' }, { value: 'click', label: 'On click' }] },
        { kind: 'select', key: 'look', label: 'Trigger', options: [{ value: 'info', label: 'Info icon' }, { value: 'count', label: 'Count' }] },
        { kind: 'text', key: 'label', label: 'Label', help: 'The trigger’s name: what it explains, not “Info”.' },
        { kind: 'text', key: 'title', label: 'Title', help: 'Leave empty for none.' },
        { kind: 'text', key: 'text', label: 'Text', help: 'A sentence or two. Leave empty for none.' },
        { kind: 'boolean', key: 'details', label: 'Details', help: 'Label-and-value lines.' },
        { kind: 'boolean', key: 'note', label: 'Note', help: 'A small closing line.' },
        { kind: 'boolean', key: 'links', label: 'Links', help: 'On click only: turning this on switches Opens to On click.' },
      ]}
      preview={info
        ? <span className="field__label pg-inline">Proctoring {tip}</span>
        : <p className="t-body-sm pg-inline">Message from San Hill, flagged {tip}</p>}
    />
  );
}

/* ---------- BrowserFrame ---------- */
const FRAME_PAGES = ['jobs', 'talent', 'interviews'];
function FrameApp({ host, withNav, withMenu, avatar, reset }: { host: string; withNav: boolean; withMenu: boolean; avatar: boolean; reset: boolean }) {
  const { pathname, nav, menuOpen, setMenuOpen, scrollRef } = useFrameHistory();
  const navigate = useNavigate();
  const page = pathname.slice(1) || 'jobs';
  const go = (p: string) => { navigate(`/${p}`); setMenuOpen(false); };
  const end = (avatar || reset) ? (
    <>
      {reset && <ResetButton what="demo" description="Clears everything you changed in the demo." done="Demo reset." to="/jobs" onReset={() => {}} />}
      {avatar && <span className="lib-avatar" aria-hidden="true">LO</span>}
    </>
  ) : undefined;
  return (
    <div className="lib-frame pg-frame">
      <BrowserFrame host={host || 'example.app'} path={pathname} nav={withNav ? nav : undefined} end={end}
        menu={withMenu ? { open: menuOpen, onToggle: () => setMenuOpen((o) => !o), controls: 'pg-frame-menu' } : undefined}>
        <div className="lib-frame__app" ref={scrollRef as React.RefObject<HTMLDivElement>} data-scroll="">
          {withMenu && menuOpen && (
            <nav id="pg-frame-menu" className="pg-frame__menu" aria-label="Demo app menu">
              <ul>{FRAME_PAGES.map((p) => (
                <li key={p}><button type="button" aria-current={page === p ? 'page' : undefined} onClick={() => go(p)}>{p[0].toUpperCase() + p.slice(1)}</button></li>
              ))}</ul>
            </nav>
          )}
          <nav aria-label="Demo app"><ul className="lib-frame__tabs">{FRAME_PAGES.map((p) => (
            <li key={p}><button type="button" aria-current={page === p ? 'page' : undefined} onClick={() => go(p)}>{p[0].toUpperCase() + p.slice(1)}</button></li>
          ))}</ul></nav>
          <p className="t-body-sm muted">You’re on {page}.{withNav ? ' Visit another page, then use Back and Forward in the bar: they only move through pages visited inside the frame.' : ''}</p>
        </div>
      </BrowserFrame>
    </div>
  );
}
function BrowserFrameDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ host: 'hire.example', nav: true, menu: false, avatar: true, reset: false });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const attrs: PgCodeLine[] = [
    ...(v.host && v.host !== 'example.app' ? [{ attr: 'host', value: String(v.host) }] : []),
    { attr: 'path', value: 'pathname', expr: true },
    ...(v.nav ? [{ attr: 'nav', value: 'nav', expr: true }] : []),
    ...(v.menu ? [{ attr: 'menu', value: "{ open: menuOpen, onToggle: () => setMenuOpen((o) => !o), controls: 'app-menu' }", expr: true }] : []),
    ...(v.avatar || v.reset ? [{ attr: 'end', value: `<>${v.reset ? '<ResetButton what="demo" … />' : ''}${v.avatar ? '<Avatar />' : ''}</>`, expr: true }] : []),
  ];
  return (
    <Playground
      name="Browser frame"
      compact
      wide
      values={v}
      set={set}
      file="Demo.tsx"
      tag="BrowserFrame"
      attrs={attrs}
      codeChildren={['<MyApp />']}
      controls={[
        { kind: 'text', key: 'host', label: 'Host', help: 'Shown in the address bar before the path.' },
        { kind: 'boolean', key: 'nav', label: 'Back and Forward', help: 'Move only through pages visited inside the frame.' },
        { kind: 'boolean', key: 'menu', label: 'Menu button', help: 'For small screens; it shows below 960px wide (always here). Its panel opens inside the frame.' },
        { kind: 'boolean', key: 'avatar', label: 'Avatar', help: 'In the end slot, at the right of the bar.' },
        { kind: 'boolean', key: 'reset', label: 'Reset button', help: 'A ResetButton in the end slot, to clear the demo.' },
      ]}
      preview={
        <FrameApp host={String(v.host)} withNav={!!v.nav} withMenu={!!v.menu} avatar={!!v.avatar} reset={!!v.reset} />
      }
    />
  );
}

/* ---------- ResetButton playground ---------- */
function ResetDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    what: 'jobs', description: 'Clears jobs you added or changed. The sample jobs come back.', done: 'Jobs reset.',
    confirmVariant: 'primary', disabled: false, disabledReason: 'Nothing to reset: you haven’t changed any jobs yet.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const what = String(v.what) || 'demo';
  const attrs: PgCodeLine[] = [
    { attr: 'what', value: what },
    { attr: 'description', value: String(v.description) },
    { attr: 'done', value: String(v.done) },
    { attr: 'to', value: `/${slug(what)}` },
    { attr: 'onReset', value: `reset${camel(what)[0].toUpperCase()}${camel(what).slice(1)}`, expr: true },
    ...(v.confirmVariant === 'danger' ? [{ attr: 'confirmVariant', value: 'danger' }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
  ];
  return (
    <Playground
      name="Reset button"
      compact
      values={v}
      set={set}
      file="Bar.tsx"
      tag="ResetButton"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'what', label: 'What', help: 'Names the button and the confirm: “Reset jobs”.' },
        { kind: 'text', key: 'description', label: 'Description', help: 'What the reset clears, and what it keeps.' },
        { kind: 'text', key: 'done', label: 'Done message', help: 'Announced to screen readers after resetting.' },
        { kind: 'segmented', key: 'confirmVariant', label: 'Confirm button', options: [{ value: 'primary', label: 'Primary' }, { value: 'danger', label: 'Danger' }] },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in the tooltip when Disabled is on.' },
      ]}
      preview={
        <div className="pg-bar">
          <span className="pg-bar__address">example.app/{slug(what)}</span>
          <ResetButton
            what={what}
            description={String(v.description)}
            done={String(v.done)}
            to="/"
            onReset={() => {}}
            confirmVariant={v.confirmVariant as 'primary' | 'danger'}
            disabled={!!v.disabled}
            disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
          />
        </div>
      }
    />
  );
}

/* ---------- SegmentedControl playground ---------- */
const SEG_ICONS = [
  { name: 'GridIcon', el: <svg viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></svg> },
  { name: 'ImageIcon', el: <svg viewBox="0 0 16 16"><rect x="2.5" y="3" width="11" height="10" rx="1.5" /><circle cx="6" cy="6.5" r="1" /><path d="m3 12 3.5-3.5 2.5 2.5 1.5-1.5L13 12" /></svg> },
  { name: 'PlayIcon', el: <svg viewBox="0 0 16 16"><rect x="2.5" y="3" width="11" height="10" rx="1.5" /><path d="M7 6v4l3-2z" /></svg> },
  { name: 'WaveIcon', el: <svg viewBox="0 0 16 16"><path d="M3 7v2M5.5 5v6M8 3v10M10.5 5v6M13 7v2" /></svg> },
];
function SegmentedDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Type', showLabel: false, options: 'All, Images, Video, Audio', counts: true, icons: 'none',
    size: 'md', fill: false, disableLast: false, disabledReason: 'No audio in this library yet.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.options).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const [chosen, setChosen] = useState('all');
  const withIcons = v.icons !== 'none';
  const iconOnly = v.icons === 'only';
  const opts = names.map((n, i) => {
    const off = !!v.disableLast && i === names.length - 1 && names.length > 1;
    return {
      value: slug(n), label: n,
      count: v.counts && !iconOnly ? (i === 0 && /^all$/i.test(n) ? names.slice(1).reduce((t, m) => t + fakeCount(m), 0) : fakeCount(n)) : undefined,
      icon: withIcons ? SEG_ICONS[i % SEG_ICONS.length] : undefined,
      disabled: off, disabledReason: off && v.disabledReason ? String(v.disabledReason) : undefined,
    };
  });
  const value = opts.some((o) => o.value === chosen) ? chosen : opts[0]?.value ?? '';
  const name = camel(String(v.label)) || 'value';
  const setter = `set${name[0].toUpperCase()}${name.slice(1)}`;
  const optLines = opts.map((o) => `    { value: '${o.value}', label: '${o.label}'${o.count !== undefined ? `, count: ${o.count}` : ''}${o.icon ? `, icon: <${o.icon.name} />` : ''}${o.disabled ? `, disabled: true${o.disabledReason ? `, disabledReason: '${o.disabledReason}'` : ''}` : ''} },`).join('\n');
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(v.showLabel ? [{ attr: 'showLabel', value: true as const }] : []),
    { attr: 'options', value: `[\n${optLines}\n  ]`, expr: true },
    { attr: 'value', value: name, expr: true },
    { attr: 'onChange', value: setter, expr: true },
    ...(iconOnly ? [{ attr: 'iconOnly', value: true as const }] : []),
    ...(v.size === 'sm' ? [{ attr: 'size', value: 'sm' }] : []),
    ...(v.fill ? [{ attr: 'fill', value: true as const }] : []),
  ];
  return (
    <Playground
      name="Segmented control"
      compact
      wide
      values={v}
      set={set}
      file="Toolbar.tsx"
      tag="SegmentedControl"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'Names the group for screen readers, even when hidden.' },
        { kind: 'boolean', key: 'showLabel', label: 'Show label', help: 'Beside the control. Hidden by default.' },
        { kind: 'text', key: 'options', label: 'Options', help: 'Up to 4 here, separated by commas. Keep them short.' },
        { kind: 'boolean', key: 'counts', label: 'Counts', help: 'How many items each option would show.' },
        { kind: 'segmented', key: 'icons', label: 'Icons', options: [{ value: 'none', label: 'None' }, { value: 'start', label: 'With text' }, { value: 'only', label: 'Icon only' }] },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
        { kind: 'boolean', key: 'fill', label: 'Full width', help: 'Options share the width equally.' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last option' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when the last option is disabled.' },
      ]}
      preview={
        <SegmentedControl
          label={String(v.label) || 'Untitled'}
          showLabel={!!v.showLabel}
          options={opts.map((o) => ({ ...o, icon: o.icon?.el }))}
          value={value}
          onChange={setChosen}
          iconOnly={iconOnly}
          size={v.size as 'sm' | 'md'}
          fill={!!v.fill}
        />
      }
    />
  );
}

/* ---------- Tiles playground ---------- */
const TILE_SAMPLES = [
  { href: '#bulk-actions', title: 'Bulk actions', tag: 'Live', strong: true, desc: 'Select many, act once, undo.', sketch: 'BulkActionsSketch',
    media: <svg viewBox="0 0 180 72" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="20" y="10" width="140" height="52" rx="4" /><rect x="30" y="20" width="8" height="8" rx="1.5" /><path d="M46 24h70" /><rect x="30" y="34" width="8" height="8" rx="1.5" /><path d="M46 38h56" /><rect x="30" y="48" width="8" height="8" rx="1.5" /><path d="M46 52h64" /><rect x="122" y="18" width="30" height="12" rx="3" /></svg> },
  { href: '#data-table', title: 'Data table', tag: 'Live', strong: true, desc: 'Sort, select and page through rows.', sketch: 'DataTableSketch',
    media: <svg viewBox="0 0 180 72" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="20" y="10" width="140" height="52" rx="4" /><path d="M20 23h140M20 36h140M20 49h140M66 10v52M112 10v52" /></svg> },
  { href: '#filter-bar', title: 'Filter bar', tag: 'Soon', strong: false, desc: 'Narrow a list without losing your place.', sketch: 'FilterBarSketch',
    media: <svg viewBox="0 0 180 72" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="20" y="10" width="34" height="12" rx="6" /><rect x="60" y="10" width="42" height="12" rx="6" /><rect x="108" y="10" width="30" height="12" rx="6" /><path d="M20 36h140M20 48h120M20 60h132" /></svg> },
  { href: '#pagination', title: 'Pagination', tag: 'Soon', strong: false, desc: 'Move between pages and say where you are.', sketch: 'PaginationSketch',
    media: <svg viewBox="0 0 180 72" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 16h140M20 28h120M20 40h132" /><rect x="44" y="52" width="16" height="14" rx="3" /><rect x="66" y="52" width="16" height="14" rx="3" /><rect x="88" y="52" width="16" height="14" rx="3" /><rect x="110" y="52" width="16" height="14" rx="3" /></svg> },
];
function TilesDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    layout: 'joined', media: true, tags: true, descriptions: true, count: '3', columns: '3', minWidth: '140',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const items = TILE_SAMPLES.slice(0, Number(v.count));
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: 'Patterns' },
    ...(v.layout === 'separate' ? [{ attr: 'layout', value: 'separate' }] : []),
    ...(v.columns !== '3' ? [{ attr: 'columns', value: String(v.columns), expr: true }] : []),
    { attr: 'minWidth', value: String(v.minWidth), expr: true },
  ];
  const children = items.flatMap((t) => [
    '<Tile',
    `  href="${t.href}"`,
    `  title="${t.title}"`,
    ...(v.tags ? [`  tag="${t.tag}"${t.strong ? '\n    tagStrong' : ''}`.replace('\n    ', '\n  ')] : []),
    ...(v.descriptions ? [`  description="${t.desc}"`] : []),
    ...(v.media ? [`  media={<${t.sketch} />}`] : []),
    '/>',
  ].join('\n').split('\n'));
  return (
    <Playground
      name="Tiles"
      compact
      wide
      values={v}
      set={set}
      file="Patterns.tsx"
      tag="Tiles"
      attrs={attrs}
      codeChildren={children}
      controls={[
        { kind: 'segmented', key: 'layout', label: 'Layout', options: [{ value: 'joined', label: 'Joined' }, { value: 'separate', label: 'Separate' }] },
        { kind: 'boolean', key: 'media', label: 'Include image', help: 'A decorative picture above the title.' },
        { kind: 'boolean', key: 'tags', label: 'Tags', help: 'A short mono label beside the title; “Live” in full ink.' },
        { kind: 'boolean', key: 'descriptions', label: 'Descriptions' },
        { kind: 'select', key: 'count', label: 'Tiles', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        { kind: 'select', key: 'columns', label: 'Most columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        { kind: 'select', key: 'minWidth', label: 'Narrowest column', options: [{ value: '140', label: '140px' }, { value: '220', label: '220px' }, { value: '280', label: '280px' }] },
      ]}
      preview={
        <Tiles label="Patterns" layout={v.layout as 'joined' | 'separate'} columns={Number(v.columns)} minWidth={Number(v.minWidth)}>
          {items.map((t) => (
            <Tile key={t.href} href={t.href} title={t.title}
              tag={v.tags ? t.tag : undefined} tagStrong={t.strong}
              description={v.descriptions ? t.desc : undefined}
              media={v.media ? t.media : undefined} />
          ))}
        </Tiles>
      }
    />
  );
}

/* ---------- Dialog playground ---------- */
const XIcon = () => <svg className="btn__icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>;
function DialogDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    title: 'Delete Pilot screening v3?', hasDescription: true, description: 'Its 132 candidates’ results are deleted with it. This can’t be undone.',
    body: 'none', size: 'sm', alert: true, footer: true, close: true,
  });
  const set = (key: string, value: PgValue) => setV((old) => {
    const next = { ...old, [key]: value };
    if (key === 'alert' && !value && old.title === 'Delete Pilot screening v3?') { next.title = 'Rename assessment'; next.description = 'Candidates see the new name in their invitations.'; next.body = 'form'; }
    if (key === 'alert' && value && old.title === 'Rename assessment') { next.title = 'Delete Pilot screening v3?'; next.description = 'Its 132 candidates’ results are deleted with it. This can’t be undone.'; next.body = 'none'; }
    return next;
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Pilot screening v3');
  const cancelRef = useRef<HTMLButtonElement>(null);
  const alert = !!v.alert;
  const size = v.size as 'sm' | 'lg' | 'drawer';
  const desc = v.hasDescription && v.description ? String(v.description) : undefined;
  const main = alert ? 'Delete' : 'Save';
  const body = (live: boolean) => v.body === 'form'
    ? <Input label="Name" required value={live ? name : 'Pilot screening v3'} onChange={(e) => live && setName(e.target.value)} />
    : v.body === 'text'
      ? <div className="t-body-sm"><p>Results stay in reports for 30 days, then they’re removed from exports too.</p><p>Candidates who haven’t started can still use their link until it expires.</p></div>
      : null;
  const foot = (live: boolean) => v.footer ? (
    <>
      <Button ref={live ? cancelRef : undefined} variant="secondary" size="sm" onClick={() => live && setOpen(false)}>Cancel</Button>
      <Button variant={alert ? 'danger' : 'primary'} size="sm" onClick={() => live && setOpen(false)}>{main}</Button>
    </>
  ) : undefined;
  const attrs: PgCodeLine[] = [
    { attr: 'open', value: 'open', expr: true },
    { attr: 'onClose', value: '() => setOpen(false)', expr: true },
    { attr: 'title', value: String(v.title) },
    ...(desc ? [{ attr: 'description', value: desc }] : []),
    ...(size !== 'sm' ? [{ attr: 'size', value: size }] : []),
    ...(alert ? [{ attr: 'alert', value: true as const }, ...(v.footer ? [{ attr: 'initialFocus', value: 'cancelRef', expr: true }] : [])] : []),
    ...(!v.close ? [{ attr: 'hideClose', value: true as const }] : []),
    ...(v.footer ? [{ attr: 'footer', value: `<>\n    <Button ${alert ? 'ref={cancelRef} ' : ''}variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>\n    <Button variant="${alert ? 'danger' : 'primary'}" size="sm" onClick={${alert ? 'remove' : 'save'}}>${main}</Button>\n  </>`, expr: true }] : []),
  ];
  const children = v.body === 'form' ? ['<Input label="Name" required value={name} onChange={(e) => setName(e.target.value)} />']
    : v.body === 'text' ? ['<p>Results stay in reports for 30 days…</p>', '<p>Candidates who haven’t started…</p>'] : undefined;
  return (
    <Playground
      name="Dialog"
      compact
      wide
      values={v}
      set={set}
      file="Assessment.tsx"
      tag="Dialog"
      attrs={attrs}
      codeChildren={children}
      controls={[
        { kind: 'text', key: 'title', label: 'Title', help: 'Names the dialog. For a confirm, ask the question.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Read with the title. For a confirm, say what will happen.' },
        { kind: 'boolean', key: 'alert', label: 'Alert', help: 'Destroys something: an alertdialog, focus starts on Cancel, the backdrop doesn’t close it.' },
        { kind: 'select', key: 'body', label: 'Body', options: [{ value: 'none', label: 'None' }, { value: 'form', label: 'A field' }, { value: 'text', label: 'Text' }] },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small (480px)' }, { value: 'lg', label: 'Large (760px)' }, { value: 'drawer', label: 'Drawer' }] },
        { kind: 'boolean', key: 'footer', label: 'Footer', help: 'Cancel, then the main action, at the right.' },
        { kind: 'boolean', key: 'close', label: 'Close button', help: 'Esc closes it either way.' },
      ]}
      preview={
        <div className={`pg-dialog pg-dialog--${size}`}>
          <div className={`dialog dialog--${size} pg-dialog__copy`} {...({ inert: '' } as Record<string, string>)} aria-hidden="true">
            <div className="dialog__inner">
              <div className="dialog__head">
                <h2 className="dialog__title">{String(v.title) || 'Untitled'}</h2>
                {v.close && <span className="btn btn--ghost btn--sm btn--icon dialog__close"><XIcon /></span>}
              </div>
              {desc && <div className="dialog__desc">{desc}</div>}
              {body(false) && <div className="dialog__body">{body(false)}</div>}
              {foot(false) && <div className="dialog__foot">{foot(false)}</div>}
            </div>
          </div>
          <Button size="sm" variant={alert ? 'danger' : 'secondary'} onClick={() => setOpen(true)}>{alert ? 'Delete assessment' : 'Rename'}</Button>
          <Dialog open={open} onClose={() => setOpen(false)} title={String(v.title) || 'Untitled'} description={desc} size={size}
            alert={alert} initialFocus={alert && v.footer ? cancelRef : undefined} hideClose={!v.close} footer={foot(true)}>
            {body(true)}
          </Dialog>
        </div>
      }
    />
  );
}

/* ---------- Menu playground ---------- */
const MENU_ICONS: Record<string, JSX.Element> = {
  Rename: <svg viewBox="0 0 16 16"><path d="M3 13h3l7-7-3-3-7 7z" /></svg>,
  Duplicate: <svg viewBox="0 0 16 16"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" /><path d="M10.5 3.5v-1h-8v8h1" /></svg>,
  Archive: <svg viewBox="0 0 16 16"><rect x="2.5" y="3" width="11" height="3" rx="1" /><path d="M3.5 6v7h9V6M6.5 9h3" /></svg>,
  Delete: <svg viewBox="0 0 16 16"><path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" /></svg>,
};
const MoreIcon = () => <svg className="btn__icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="3.5" cy="8" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="12.5" cy="8" r="1" /></svg>;
const ChevronIcon = () => <svg className="btn__icon btn__icon--end" viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.5 3.5 3.5 3.5-3.5" /></svg>;
function MenuDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Options for Pilot screening v3', trigger: 'icon', variant: 'secondary', size: 'md', align: 'end',
    icons: false, danger: true, disable: true, reason: 'Only the owner can archive it.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const [chose, setChose] = useState('');
  const names = ['Rename', 'Duplicate', 'Archive', ...(v.danger ? ['Delete'] : [])];
  const items = names.map((n) => ({
    label: n, onSelect: () => setChose(n),
    icon: v.icons ? MENU_ICONS[n] : undefined,
    disabled: !!v.disable && n === 'Archive', disabledReason: v.disable && n === 'Archive' && v.reason ? String(v.reason) : undefined,
    divider: n === 'Delete', danger: n === 'Delete',
  }));
  const iconOnly = v.trigger === 'icon';
  const trig = v.trigger === 'icon' ? ['<MoreIcon />'] : v.trigger === 'text' ? ['Options'] : ['Options <ChevronIcon />'];
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(iconOnly ? [{ attr: 'iconOnly', value: true as const }] : []),
    ...(v.variant !== 'secondary' ? [{ attr: 'variant', value: String(v.variant) }] : []),
    ...(v.size === 'sm' ? [{ attr: 'size', value: 'sm' }] : []),
    ...(v.align === 'start' ? [{ attr: 'align', value: 'start' }] : []),
    { attr: 'items', value: `[\n${items.map((it) => `    { label: '${it.label}', onSelect: ${it.label === 'Delete' ? 'remove' : camel(it.label)}${it.icon ? `, icon: <${it.label}Icon />` : ''}${it.disabled ? `, disabled: true${it.disabledReason ? `, disabledReason: '${it.disabledReason}'` : ''}` : ''}${it.divider ? ', divider: true, danger: true' : ''} },`).join('\n')}\n  ]`, expr: true },
  ];
  return (
    <Playground
      name="Menu"
      compact
      values={v}
      set={set}
      file="AssessmentRow.tsx"
      tag="Menu"
      attrs={attrs}
      codeChildren={trig}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'The button’s name: say whose options they are.' },
        { kind: 'select', key: 'trigger', label: 'Button', options: [{ value: 'icon', label: 'Icon only' }, { value: 'text', label: 'Text' }, { value: 'both', label: 'Text and chevron' }] },
        { kind: 'select', key: 'variant', label: 'Variant', options: [{ value: 'secondary', label: 'Secondary' }, { value: 'ghost', label: 'Ghost' }, { value: 'primary', label: 'Primary' }] },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
        { kind: 'segmented', key: 'align', label: 'Align', options: [{ value: 'start', label: 'Start' }, { value: 'end', label: 'End' }] },
        { kind: 'boolean', key: 'icons', label: 'Item icons' },
        { kind: 'boolean', key: 'danger', label: 'Delete item', help: 'After a rule, in medium weight. Confirm in a Dialog.' },
        { kind: 'boolean', key: 'disable', label: 'Disable Archive' },
        { kind: 'text', key: 'reason', label: 'Disabled reason', help: 'Shown under the item and read as its description.' },
      ]}
      preview={
        <div className="pg-menu">
          <Menu label={String(v.label) || 'Options'} items={items} iconOnly={iconOnly} variant={v.variant as 'secondary' | 'ghost' | 'primary'}
            size={v.size as 'sm' | 'md'} align={v.align as 'start' | 'end'}>
            {v.trigger === 'icon' ? <MoreIcon /> : v.trigger === 'text' ? 'Options' : <>Options <ChevronIcon /></>}
          </Menu>
          <p className="t-small muted" role="status">{chose ? `Chose ${chose}.` : 'Nothing chosen yet.'}</p>
        </div>
      }
    />
  );
}

/* ---------- Tabs playground ---------- */
const TAB_TEXT: Record<string, string> = {
  overview: 'Pilot screening v3: 42 questions, about 40 minutes, proctored.',
  questions: 'Questions are grouped into four sections; each can be reordered.',
  candidates: '132 candidates have taken it this month; 18 are in progress.',
  settings: 'Who can edit it, how long links last, and what candidates see when they finish.',
};
function TabsDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Assessment sections', tabs: 'Overview, Questions, Candidates, Settings', counts: true, activation: 'automatic',
    size: 'md', fill: false, disableLast: true, reason: 'Only owners can change settings.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.tabs).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const [chosen, setChosen] = useState('overview');
  const tabs = names.map((n, i) => {
    const off = !!v.disableLast && i === names.length - 1 && names.length > 1;
    const val = slug(n);
    return {
      value: val, label: n, count: v.counts && i > 0 && i < 3 ? (i === 1 ? 42 : 132) : undefined,
      panel: <p className="t-body-sm">{TAB_TEXT[val] ?? `${n}: what belongs here.`}</p>,
      disabled: off, disabledReason: off && v.reason ? String(v.reason) : undefined,
    };
  });
  const value = tabs.some((t) => t.value === chosen && !t.disabled) ? chosen : tabs[0]?.value ?? '';
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    { attr: 'tabs', value: `[\n${tabs.map((t) => `    { value: '${t.value}', label: '${t.label}'${t.count !== undefined ? `, count: ${t.count}` : ''}, panel: <${camel(t.label)[0].toUpperCase() + camel(t.label).slice(1)} />${t.disabled ? `, disabled: true${t.disabledReason ? `, disabledReason: '${t.disabledReason}'` : ''}` : ''} },`).join('\n')}\n  ]`, expr: true },
    { attr: 'value', value: 'section', expr: true },
    { attr: 'onChange', value: 'setSection', expr: true },
    ...(v.activation === 'manual' ? [{ attr: 'activation', value: 'manual' }] : []),
    ...(v.size === 'sm' ? [{ attr: 'size', value: 'sm' }] : []),
    ...(v.fill ? [{ attr: 'fill', value: true as const }] : []),
  ];
  return (
    <Playground
      name="Tabs"
      compact
      wide
      values={v}
      set={set}
      file="Assessment.tsx"
      tag="Tabs"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'Names the tab list for screen readers.' },
        { kind: 'text', key: 'tabs', label: 'Tabs', help: 'Up to 4, separated by commas. Short nouns.' },
        { kind: 'boolean', key: 'counts', label: 'Counts', help: 'A number after the label, in mono.' },
        { kind: 'segmented', key: 'activation', label: 'Activation', options: [{ value: 'automatic', label: 'Automatic' }, { value: 'manual', label: 'Manual' }] },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
        { kind: 'boolean', key: 'fill', label: 'Full width', help: 'Tabs share the width equally.' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last tab' },
        { kind: 'text', key: 'reason', label: 'Disabled reason', help: 'Shown in a tooltip and read as its description.' },
      ]}
      preview={
        <div className="pg-tabs">
          <Tabs label={String(v.label) || 'Sections'} tabs={tabs} value={value} onChange={setChosen}
            activation={v.activation as 'automatic' | 'manual'} size={v.size as 'sm' | 'md'} fill={!!v.fill} />
        </div>
      }
    />
  );
}

/* ---------- Accordion playground ---------- */
const ACC_TEXT: Record<string, string> = {
  basics: 'Name, role and level, and who can see the assessment.',
  questions: 'Twelve questions in three parts. Candidates can go back to earlier answers.',
  proctoring: 'The webcam records while the assessment is open. Recordings are kept for 30 days.',
  scoring: 'Each part is scored on its own; the pass mark applies to the total.',
};
const ACC_STATUS: [('check' | 'half' | 'dashed'), string][] = [['check', 'Complete'], ['half', 'In progress'], ['dashed', 'Not started'], ['dashed', 'Not started']];
function AccordionDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    sections: 'Basics, Questions, Proctoring, Scoring', layout: 'joined', single: false, level: '3',
    status: false, actions: false, disableLast: false, reason: 'Add questions before you set scoring.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.sections).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const items = names.map((n, i) => {
    const off = !!v.disableLast && i === names.length - 1 && names.length > 1;
    const val = slug(n);
    const [mark, words] = ACC_STATUS[i];
    return {
      value: val, title: n,
      content: <p className="t-body-sm">{ACC_TEXT[val] ?? `${n}: what belongs here.`}</p>,
      meta: v.status ? <StatusMark mark={mark} size="sm">{words}</StatusMark> : undefined,
      actions: v.actions ? (
        <>
          <Button variant="ghost" size="sm" iconOnly icon={MENU_ICONS.Rename}>{`Rename ${n}`}</Button>
          <Button variant="ghost" size="sm" iconOnly icon={MENU_ICONS.Delete}>{`Delete ${n}`}</Button>
        </>
      ) : undefined,
      disabled: off, disabledReason: off && v.reason ? String(v.reason) : undefined,
    };
  });
  const comp = (n: string) => { const c = camel(n); return c[0].toUpperCase() + c.slice(1); };
  const attrs: PgCodeLine[] = [
    { attr: 'items', value: `[\n${items.map((it, i) => {
      const extra = [
        v.status && `meta: <StatusMark mark="${ACC_STATUS[i][0]}" size="sm">${ACC_STATUS[i][1]}</StatusMark>`,
        v.actions && 'actions: <SectionActions />',
        it.disabled && `disabled: true${it.disabledReason ? `, disabledReason: '${it.disabledReason}'` : ''}`,
      ].filter(Boolean);
      return `    { value: '${it.value}', title: '${it.title}', content: <${comp(it.title)} />${extra.map((x) => `,\n      ${x}`).join('')} },`;
    }).join('\n')}\n  ]`, expr: true },
    ...(items[0] ? [{ attr: 'defaultOpen', value: `['${items[0].value}']`, expr: true }] : []),
    ...(v.single ? [{ attr: 'single', value: true as const }] : []),
    ...(v.level !== '3' ? [{ attr: 'headingLevel', value: String(v.level), expr: true }] : []),
    ...(v.layout === 'separate' ? [{ attr: 'layout', value: 'separate' }] : []),
  ];
  const key = `${names.join('|')}-${v.single}`;
  return (
    <Playground
      name="Accordion"
      compact
      wide
      values={v}
      set={set}
      file="AssessmentSetup.tsx"
      tag="Accordion"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'sections', label: 'Sections', help: 'Up to 4, separated by commas.' },
        { kind: 'segmented', key: 'layout', label: 'Layout', options: [{ value: 'joined', label: 'Joined' }, { value: 'separate', label: 'Separate' }] },
        { kind: 'boolean', key: 'single', label: 'One at a time', help: 'Opening a section closes the one that was open.' },
        { kind: 'select', key: 'level', label: 'Heading level', options: [{ value: '2', label: 'h2' }, { value: '3', label: 'h3' }, { value: '4', label: 'h4' }] },
        { kind: 'boolean', key: 'status', label: 'Status', help: 'Beside the title, outside the button.' },
        { kind: 'boolean', key: 'actions', label: 'Actions', help: 'Icon buttons at the end of the header.' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last section' },
        { kind: 'text', key: 'reason', label: 'Disabled reason', help: 'Shown in a tooltip and read as its description.' },
      ]}
      preview={
        <div className="pg-accordion">
          <Accordion key={key} items={items} defaultOpen={items[0] ? [items[0].value] : []} single={!!v.single}
            headingLevel={Number(v.level) as 2 | 3 | 4} layout={v.layout as 'joined' | 'separate'} />
        </div>
      }
    />
  );
}

/* ---------- Navigation playgrounds ---------- */
const NAV_ICONS = {
  layers: <svg viewBox="0 0 24 24"><path d="m12 3 9 5-9 5-9-5 9-5z" /><path d="m3 13 9 5 9-5" /></svg>,
  people: <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></svg>,
};
function StartAt({ path }: { path: string }) {
  const navigate = useNavigate();
  React.useEffect(() => { navigate(path, { replace: true }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
function SideNavDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Starfighter Pilot L4', back: true, icons: true, counts: true, action: true, candidatesTitle: 'shown',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const base = '/jobs/pilot-l4';
  const icon = (k: keyof typeof NAV_ICONS) => (v.icons ? NAV_ICONS[k] : undefined);
  const groups = [
    { items: [{ label: String(v.label) || 'Untitled job', to: base, end: true, strong: true }] },
    {
      title: 'Assessments', icon: icon('layers'),
      items: [
        { label: 'Pilot screening v3', to: `${base}/assessments/pilot-screening` },
        { label: 'Navigation drills', to: `${base}/assessments/navigation-drills` },
        { label: 'Astromech basics', to: `${base}/assessments/astromech-basics` },
      ],
      action: v.action ? { label: 'New assessment', to: `${base}/assessments/new` } : undefined,
    },
    {
      title: 'Candidates', hideTitle: v.candidatesTitle === 'hidden', icon: icon('people'),
      items: [
        { label: 'In review', to: `${base}/candidates/in-review`, count: v.counts ? 12 : undefined },
        { label: 'Shortlisted', to: `${base}/candidates/shortlisted`, count: v.counts ? 4 : undefined },
        { label: 'Hired', to: `${base}/candidates/hired`, count: v.counts ? 1 : undefined },
      ],
    },
  ];
  const q = (x: string) => `'${x}'`;
  const groupCode = [
    `    { items: [{ label: ${q(String(v.label) || 'Untitled job')}, to: '${base}', end: true, strong: true }] },`,
    `    { title: 'Assessments',${v.icons ? ' icon: <LayersIcon />,' : ''}\n      items: [{ label: 'Pilot screening v3', to: '${base}/assessments/pilot-screening' }, …]${v.action ? `,\n      action: { label: 'New assessment', to: '${base}/assessments/new' }` : ''} },`,
    `    { title: 'Candidates',${v.candidatesTitle === 'hidden' ? ' hideTitle: true,' : ''}${v.icons ? ' icon: <PeopleIcon />,' : ''}\n      items: [{ label: 'In review', to: '${base}/candidates/in-review'${v.counts ? ', count: 12' : ''} }, …] },`,
  ];
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) || 'Untitled job' },
    ...(v.back ? [{ attr: 'back', value: "{ label: 'All jobs', to: '/jobs' }", expr: true }] : []),
    { attr: 'groups', value: `[\n${groupCode.join('\n')}\n  ]`, expr: true },
  ];
  return (
    <Playground
      name="Side navigation"
      compact
      wide
      values={v}
      set={set}
      file="JobSidebar.tsx"
      tag="SideNav"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'Names the navigation; here, the job it belongs to.' },
        { kind: 'boolean', key: 'back', label: 'Back link', help: 'A link up one level, above everything.' },
        { kind: 'boolean', key: 'icons', label: 'Group icons', help: 'Items line up after the icon.' },
        { kind: 'boolean', key: 'counts', label: 'Counts' },
        { kind: 'boolean', key: 'action', label: 'Add link', help: 'A link at the end of a group.' },
        { kind: 'segmented', key: 'candidatesTitle', label: 'Candidates title', options: [{ value: 'shown', label: 'Shown' }, { value: 'hidden', label: 'Screen readers' }] },
      ]}
      preview={
        <div className="pg-sidenav">
          <StartAt path={`${base}/assessments/pilot-screening`} />
          <SideNav label={String(v.label) || 'Untitled job'} groups={groups}
            back={v.back ? { label: 'All jobs', to: '/jobs' } : undefined} />
        </div>
      }
    />
  );
}

function HeaderNavDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ items: 'Overview, Jobs, Talent, Reports', label: 'Primary' });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.items).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const items = names.map((n) => ({ label: n, to: `/${slug(n)}` }));
  const attrs: PgCodeLine[] = [
    { attr: 'items', value: `[\n${items.map((it) => `    { label: '${it.label}', to: '${it.to}' },`).join('\n')}\n  ]`, expr: true },
    ...(v.label !== 'Primary' ? [{ attr: 'label', value: String(v.label) }] : []),
  ];
  return (
    <Playground
      name="Header navigation"
      compact
      wide
      values={v}
      set={set}
      file="AppHeader.tsx"
      tag="HeaderNav"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'items', label: 'Sections', help: 'Up to 4, separated by commas. Short nouns.' },
        { kind: 'text', key: 'label', label: 'Label', help: 'Names the navigation for screen readers.' },
      ]}
      preview={
        <div className="pg-headernav">
          <StartAt path={items[1]?.to ?? items[0]?.to ?? '/'} />
          <div className="pg-appheader">
            <span className="pg-appheader__mark" aria-hidden="true" />
            <span className="pg-appheader__name">Product</span>
            <HeaderNav items={items} label={String(v.label) || 'Primary'} />
          </div>
        </div>
      }
    />
  );
}

/* ---------- Alerts playgrounds ---------- */
const BANNER_TEXT: Record<string, { title: string; message: string; action: string }> = {
  error: { title: 'Sign-in is failing for some people.', message: 'We’re working on it. Work already open is saved.', action: 'View status' },
  warning: { title: '3 questions have no answer key.', message: 'Candidates can still take the assessment, but those questions won’t be scored.', action: 'Review questions' },
  success: { title: 'All 132 results are scored.', message: 'You can now share them with the hiring team.', action: 'Share results' },
  info: { title: 'Scheduled maintenance on Sunday, 2:00–3:00 AM.', message: 'Assessments in progress will pause and resume.', action: 'Learn more' },
};
function BannerDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    variant: 'global', tone: 'error', ...BANNER_TEXT.error, showAction: true, dismiss: false, showTitle: true,
  });
  const [gone, setGone] = useState(false);
  const set = (key: string, value: PgValue) => setV((old) => {
    const next = { ...old, [key]: value };
    if (key === 'tone') {
      const was = BANNER_TEXT[String(old.tone)];
      const now = BANNER_TEXT[String(value)];
      (['title', 'message', 'action'] as const).forEach((k) => { if (old[k] === was[k]) next[k] = now[k]; });
    }
    if (key === 'dismiss') setGone(false);
    return next;
  });
  const tone = v.tone as 'error' | 'warning' | 'success' | 'info';
  const variant = v.variant as 'global' | 'inline';
  const attrs: PgCodeLine[] = [
    { attr: 'tone', value: tone },
    { attr: 'variant', value: variant },
    ...(v.showTitle && v.title ? [{ attr: 'title', value: String(v.title) }] : []),
    ...(v.showAction && v.action ? [{ attr: 'action', value: `<Button variant="secondary" size="sm">${v.action}</Button>`, expr: true }] : []),
    ...(v.dismiss ? [{ attr: 'onDismiss', value: 'dismiss', expr: true }] : []),
  ];
  const banner = gone ? (
    <p className="pg-banner__gone t-small">Dismissed. <button type="button" className="pg-banner__again" onClick={() => setGone(false)}>Show it again</button></p>
  ) : (
    <Banner tone={tone} variant={variant} title={v.showTitle ? String(v.title) || undefined : undefined}
      action={v.showAction && v.action ? <Button variant="secondary" size="sm">{String(v.action)}</Button> : undefined}
      onDismiss={v.dismiss ? () => setGone(true) : undefined} announce="off">
      {String(v.message) || undefined}
    </Banner>
  );
  return (
    <Playground
      name="Banner"
      compact
      wide
      values={v}
      set={set}
      file="Page.tsx"
      tag="Banner"
      attrs={attrs}
      codeChildren={v.message ? [String(v.message)] : undefined}
      controls={[
        { kind: 'segmented', key: 'variant', label: 'Variant', options: [{ value: 'global', label: 'Global' }, { value: 'inline', label: 'Inline' }] },
        { kind: 'select', key: 'tone', label: 'Tone', options: [{ value: 'error', label: 'Error' }, { value: 'warning', label: 'Warning' }, { value: 'success', label: 'Success' }, { value: 'info', label: 'Info' }] },
        { kind: 'boolean', key: 'showTitle', label: 'Title', help: 'A short headline in bold.' },
        { kind: 'text', key: 'title', label: 'Title text' },
        { kind: 'text', key: 'message', label: 'Message', help: 'What happened and what to do.' },
        { kind: 'boolean', key: 'showAction', label: 'Action', help: 'A button or link that fixes it.' },
        { kind: 'text', key: 'action', label: 'Action label' },
        { kind: 'boolean', key: 'dismiss', label: 'Dismissible', help: 'Leave off for problems that aren’t fixed yet.' },
      ]}
      preview={variant === 'global' ? (
        <div className="pg-banner pg-banner--global">
          <div className="pg-appheader pg-appheader--flat">
            <span className="pg-appheader__mark" aria-hidden="true" />
            <span className="pg-appheader__name">Product</span>
          </div>
          {banner}
          <div className="pg-banner__page" aria-hidden="true"><span /><span /><span /></div>
        </div>
      ) : (
        <div className="pg-banner pg-banner--inline">
          <p className="pg-banner__heading">Questions</p>
          {banner}
          <div className="pg-banner__page" aria-hidden="true"><span /><span /></div>
        </div>
      )}
    />
  );
}

function ToastTrigger({ v }: { v: Record<string, PgValue> }) {
  const { toast } = useToast();
  const tone = v.tone as 'info' | 'success' | 'error';
  return (
    <Button variant="secondary" onClick={() => toast({
      message: String(v.message) || 'Done', tone,
      action: v.showAction && v.action ? { label: String(v.action), onClick: () => {} } : undefined,
      duration: Number(v.duration),
    })}>Show toast</Button>
  );
}
function ToastDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    message: 'Assessment duplicated', tone: 'success', showAction: true, action: 'Undo', duration: '6000',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const opts = [
    `message: '${String(v.message) || 'Done'}'`,
    ...(v.tone !== 'info' ? [`tone: '${v.tone}'`] : []),
    ...(v.showAction && v.action ? [`action: { label: '${v.action}', onClick: undo }`] : []),
    ...(!(v.showAction && v.action) && v.duration !== '6000' ? [`duration: ${v.duration}`] : []),
  ];
  const raw = `// Once, around the app\n<ToastProvider>\n  <App />\n</ToastProvider>\n\n// Anywhere inside it\nconst { toast } = useToast();\ntoast({\n${opts.map((o) => `  ${o},`).join('\n')}\n});`;
  return (
    <Playground
      name="Toast"
      compact
      values={v}
      set={set}
      file="DuplicateButton.tsx"
      tag="ToastProvider"
      attrs={[]}
      codeRaw={raw}
      controls={[
        { kind: 'text', key: 'message', label: 'Message', help: 'Says what just happened, in a few words.' },
        { kind: 'select', key: 'tone', label: 'Tone', options: [{ value: 'info', label: 'Info' }, { value: 'success', label: 'Success' }, { value: 'error', label: 'Error' }] },
        { kind: 'boolean', key: 'showAction', label: 'Action', help: 'A toast with an action stays until dismissed.' },
        { kind: 'text', key: 'action', label: 'Action label' },
        { kind: 'select', key: 'duration', label: 'Stays for', options: [{ value: '6000', label: '6 seconds' }, { value: '10000', label: '10 seconds' }] },
      ]}
      preview={
        <div className="pg-toast">
          <ToastProvider>
            <ToastTrigger v={v} />
          </ToastProvider>
        </div>
      }
    />
  );
}

/* ---------- Progress bar playground ---------- */
function ProgressDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Uploading files', progress: '9', words: true, showValue: true, size: 'md', hideLabel: false,
    showDesc: true, description: 'About 1 minute left', showError: false, error: 'Upload stopped: the connection dropped. Retry to carry on from file 10.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const known = v.progress !== 'none';
  const value = known ? Number(v.progress) : undefined;
  const valueText = known && v.words ? `${value} of 12 files` : undefined;
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) || 'Uploading files' },
    ...(known ? [{ attr: 'value', value: String(value), expr: true }, { attr: 'max', value: '12', expr: true }] : []),
    ...(valueText ? [{ attr: 'valueText', value: valueText }] : []),
    ...(!v.showValue ? [{ attr: 'showValue', value: 'false', expr: true }] : []),
    ...(v.hideLabel ? [{ attr: 'hideLabel', value: true as const }] : []),
    ...(v.showDesc && v.description && !v.showError ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(v.showError && v.error ? [{ attr: 'error', value: String(v.error) }] : []),
    ...(v.size === 'sm' ? [{ attr: 'size', value: 'sm' }] : []),
  ];
  return (
    <Playground
      name="Progress bar"
      compact
      values={v}
      set={set}
      file="UploadProgress.tsx"
      tag="ProgressBar"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'What’s in progress.' },
        { kind: 'select', key: 'progress', label: 'Progress', options: [{ value: 'none', label: 'Not measured' }, { value: '0', label: '0 of 12' }, { value: '3', label: '3 of 12' }, { value: '9', label: '9 of 12' }, { value: '12', label: '12 of 12' }] },
        { kind: 'boolean', key: 'words', label: 'Value in words', help: '“9 of 12 files” instead of “75%”.' },
        { kind: 'boolean', key: 'showValue', label: 'Show value' },
        { kind: 'segmented', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
        { kind: 'boolean', key: 'hideLabel', label: 'Hide label', help: 'Still names the bar for screen readers.' },
        { kind: 'boolean', key: 'showDesc', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Time left, or what happens next.' },
        { kind: 'boolean', key: 'showError', label: 'Error', help: 'It stopped; replaces the description.' },
        { kind: 'text', key: 'error', label: 'Error text' },
      ]}
      preview={
        <div className="pg-progress">
          <ProgressBar label={String(v.label) || 'Uploading files'} value={value} max={12} valueText={valueText}
            showValue={!!v.showValue} hideLabel={!!v.hideLabel} size={v.size as 'sm' | 'md'}
            description={v.showDesc && v.description ? String(v.description) : undefined}
            error={v.showError && v.error ? String(v.error) : undefined} />
        </div>
      }
    />
  );
}

/* ---------- Loader playground ---------- */
const LOADER_TYPES: { value: string; label: string }[] = [
  { value: 'circle', label: 'Circle' }, { value: 'ticks', label: 'Ticks' }, { value: 'dots', label: 'Dots' },
  { value: 'bars', label: 'Bars' }, { value: 'orbit', label: 'Orbit' }, { value: 'pulse', label: 'Pulse' }, { value: 'grid', label: 'Grid' },
];
const AI_TYPES: { value: string; label: string }[] = [
  { value: 'sparkle', label: 'Sparkle' }, { value: 'shimmer', label: 'Shimmer' }, { value: 'network', label: 'Network' },
  { value: 'scan', label: 'Scan' }, { value: 'tokens', label: 'Tokens' }, { value: 'caret', label: 'Caret' },
];
const LOADER_LABEL: Record<string, string> = {
  sparkle: 'Thinking', shimmer: 'Thinking', network: 'Reasoning through the rubric', scan: 'Searching 12 sources',
  tokens: 'Writing a summary', caret: 'Writing',
};
const LOADER_MEASURED = ['circle', 'ticks'];
function LoaderDemo() {
  const [type, setTypeRaw] = useState('circle');
  const [v, setV] = useState<Record<string, PgValue>>({
    set: 'general', label: 'Loading results', progress: 'none', words: false, size: 'md', position: 'end',
  });
  const labelFor = (t: string) => LOADER_LABEL[t] ?? 'Loading results';
  const setType = (t: string) => {
    setV((old) => (old.label === labelFor(type) ? { ...old, label: labelFor(t) } : old));
    setTypeRaw(t);
  };
  const set = (key: string, value: PgValue) => {
    if (key === 'set') setType(value === 'ai' ? 'sparkle' : 'circle');
    setV((old) => ({ ...old, [key]: value }));
  };
  const ai = v.set === 'ai';
  const measurable = LOADER_MEASURED.includes(type);
  const known = measurable && v.progress !== 'none';
  const value = known ? Number(v.progress) : undefined;
  const valueText = known && v.words ? `${value} of 12` : undefined;
  const attrs: PgCodeLine[] = [
    ...(type !== 'circle' ? [{ attr: 'type', value: type }] : []),
    { attr: 'label', value: String(v.label) || 'Loading' },
    ...(known ? [{ attr: 'value', value: String(value), expr: true }, { attr: 'max', value: '12', expr: true }] : []),
    ...(valueText ? [{ attr: 'valueText', value: valueText }] : []),
    ...(v.size !== 'md' ? [{ attr: 'size', value: String(v.size) }] : []),
    ...(v.position !== 'end' && type !== 'shimmer' ? [{ attr: 'labelPosition', value: String(v.position) }] : []),
  ];
  const controls: PgControl[] = [
    { kind: 'segmented', key: 'set', label: 'Set', options: [{ value: 'general', label: 'General' }, { value: 'ai', label: 'AI' }] },
    { kind: 'text', key: 'label', label: 'Label', help: ai ? 'Say what the model is doing: thinking, searching, writing.' : 'What’s happening. Always there, even when hidden.' },
    ...(measurable ? [
      { kind: 'select' as const, key: 'progress', label: 'Progress', options: [{ value: 'none', label: 'Not measured' }, { value: '0', label: '0 of 12' }, { value: '3', label: '3 of 12' }, { value: '8', label: '8 of 12' }, { value: '12', label: '12 of 12' }] },
      { kind: 'boolean' as const, key: 'words', label: 'Value in words', help: '“8 of 12” instead of “67%”.' },
    ] : []),
    { kind: 'segmented', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }] },
    ...(type === 'shimmer' ? [] : [{ kind: 'segmented' as const, key: 'position', label: 'Label position', options: [{ value: 'end', label: 'Beside' }, { value: 'below', label: 'Below' }, { value: 'hidden', label: 'Hidden' }] }]),
  ];
  return (
    <Playground
      name="Loader"
      compact
      values={v}
      set={set}
      file="Results.tsx"
      tag="Loader"
      attrs={attrs}
      above={<ChipGroup label={ai ? 'AI loader type' : 'Loader type'} size="sm" options={ai ? AI_TYPES : LOADER_TYPES} value={type} onChange={setType} />}
      controls={controls}
      preview={
        <Loader type={type as 'circle'} label={String(v.label) || 'Loading'} value={value} max={12} valueText={valueText}
          size={v.size as 'sm' | 'md' | 'lg'} labelPosition={v.position as 'end' | 'below' | 'hidden'} />
      }
    />
  );
}

/* ---------- Skeleton playground ---------- */
function SkeletonDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ label: 'Loading candidates', lines: '2', heading: true, avatar: true, rows: '3' });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) || 'Loading' },
    ...(v.lines !== '3' ? [{ attr: 'lines', value: String(v.lines), expr: true }] : []),
    ...(v.heading ? [{ attr: 'heading', value: true as const }] : []),
    ...(v.avatar ? [{ attr: 'avatar', value: true as const }] : []),
    ...(v.rows !== '1' ? [{ attr: 'rows', value: String(v.rows), expr: true }] : []),
  ];
  return (
    <Playground
      name="Skeleton"
      compact
      values={v}
      set={set}
      file="CandidateList.tsx"
      tag="Skeleton"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'For screen readers: what’s loading.' },
        { kind: 'boolean', key: 'heading', label: 'Heading', help: 'A wider, taller first bar.' },
        { kind: 'segmented', key: 'lines', label: 'Lines', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
        { kind: 'boolean', key: 'avatar', label: 'Avatar', help: 'A circle before the lines.' },
        { kind: 'segmented', key: 'rows', label: 'Rows', options: [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }] },
      ]}
      preview={
        <div className="pg-skeleton">
          <Skeleton label={String(v.label) || 'Loading'} lines={Number(v.lines)} heading={!!v.heading} avatar={!!v.avatar} rows={Number(v.rows)} />
        </div>
      }
    />
  );
}

/* ---------- Tag playground ---------- */
const TAG_COLORS = ['gray', 'red', 'amber', 'green', 'teal', 'blue', 'purple', 'pink'].map((c) => ({ value: c, label: c[0].toUpperCase() + c.slice(1) }));
const TAG_ROWS: { name: string; role: string; status: string; color: TagColor; mark: StatusMarkShape }[] = [
  { name: 'Wedge Antilles', role: 'Starfighter Pilot L4', status: 'Hired', color: 'green', mark: 'check' },
  { name: 'Biggs Darklighter', role: 'Starfighter Pilot L4', status: 'In review', color: 'blue', mark: 'half' },
  { name: 'Jyn Erso', role: 'Field Analyst L3', status: 'On hold', color: 'amber', mark: 'ring' },
  { name: 'Porkins', role: 'Starfighter Pilot L4', status: 'Not selected', color: 'red', mark: 'slash' },
];
function TagDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    view: 'field', label: 'Skills', showDesc: true, description: 'Press Enter to add each one.', required: false, limit: true, color: 'gray', marks: true,
  });
  const [tags, setTags] = useState<string[]>(['Navigation', 'Astromech repair', 'Piloting']);
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const table = v.view === 'table';
  const color = v.color as TagColor;
  const items = tags.map((t) => (color === 'gray' ? t : { label: t, color }));
  const attrs: PgCodeLine[] = table ? [
    { attr: 'color', value: 'green' },
    ...(v.marks ? [{ attr: 'mark', value: 'check' }] : []),
  ] : [
    { attr: 'label', value: String(v.label) || 'Tags' },
    { attr: 'tags', value: color === 'gray' ? 'skills' : `skills.map((label) => ({ label, color: '${color}' }))`, expr: true },
    { attr: 'onChange', value: 'setSkills', expr: true },
    ...(!v.showDesc ? [{ attr: 'description', value: 'null', expr: true }] : v.description !== 'Press Enter to add each one.' ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    ...(v.limit ? [{ attr: 'max', value: '4', expr: true }] : []),
    { attr: 'empty', value: 'No skills yet.' },
  ];
  return (
    <Playground
      name="Tag"
      compact
      wide={table}
      values={v}
      set={set}
      file={table ? 'CandidateTable.tsx' : 'Skills.tsx'}
      tag={table ? 'Tag' : 'TagInput'}
      attrs={attrs}
      codeChildren={table ? ['Hired'] : undefined}
      controls={[
        { kind: 'segmented', key: 'view', label: 'Show in', options: [{ value: 'field', label: 'A field' }, { value: 'table', label: 'A table' }] },
        ...(table ? [
          { kind: 'boolean' as const, key: 'marks', label: 'Status marks', help: 'A shape for each status, so it isn’t colour alone.' },
        ] : [
          { kind: 'text' as const, key: 'label', label: 'Label', help: 'Above the field; it names the list too.' },
          { kind: 'boolean' as const, key: 'showDesc', label: 'Description' },
          { kind: 'text' as const, key: 'description', label: 'Description text' },
          { kind: 'boolean' as const, key: 'required', label: 'Required' },
          { kind: 'boolean' as const, key: 'limit', label: 'At most 4', help: 'Says so when someone tries to add a fifth.' },
          { kind: 'select' as const, key: 'color', label: 'Color', options: TAG_COLORS },
        ]),
      ]}
      preview={table ? (
        <div className="pg-tag-table table-wrap">
          <table className="table">
            <caption className="visually-hidden">Candidates and their status</caption>
            <thead><tr><th scope="col">Candidate</th><th scope="col">Role</th><th scope="col">Status</th></tr></thead>
            <tbody>
              {TAG_ROWS.map((r) => (
                <tr key={r.name}><th scope="row">{r.name}</th><td>{r.role}</td>
                  <td><Tag color={r.color} mark={v.marks ? r.mark : undefined}>{r.status}</Tag></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pg-tags">
          <TagInput label={String(v.label) || 'Tags'} tags={items} onChange={setTags}
            description={v.showDesc ? (String(v.description) || undefined) : null}
            required={!!v.required} max={v.limit ? 4 : undefined} empty="No skills yet." />
        </div>
      )}
    />
  );
}

/* ---------- Form group playground ---------- */
type InviteValues = { first: string; last: string; email: string; phone: string; assessment: string; proctoring: string; help: string[]; note: string };
const INVITE_EMPTY: InviteValues = { first: '', last: '', email: '', phone: '', assessment: '', proctoring: '', help: [], note: '' };
const INVITE_FULL: InviteValues = { first: 'Jyn', last: 'Erso', email: 'jyn@example.com', phone: '', assessment: 'pilot', proctoring: 'recorded', help: [], note: '' };
const INVITE_ONE: InviteValues = { ...INVITE_FULL, email: 'jyn.example.com' };
function checkInvite(x: InviteValues): FormError[] {
  const e: FormError[] = [];
  if (!x.first.trim()) e.push({ id: 'fg-first', message: 'Enter a first name' });
  if (!x.last.trim()) e.push({ id: 'fg-last', message: 'Enter a last name' });
  if (!x.email.trim()) e.push({ id: 'fg-email', message: 'Enter an email address' });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.email)) e.push({ id: 'fg-email', message: 'Enter an email address such as name@company.com' });
  if (!x.assessment) e.push({ id: 'fg-assessment', message: 'Choose an assessment' });
  if (!x.proctoring) e.push({ id: 'fg-proctoring', message: 'Choose how it’s proctored' });
  return e;
}
function FormGroupDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ title: 'Invite a candidate', showDesc: true, note: true, start: 'empty' });
  const [x, setX] = useState<InviteValues>(INVITE_EMPTY);
  const [errors, setErrors] = useState<FormError[]>([]);
  const [sent, setSent] = useState(false);
  const set = (key: string, value: PgValue) => {
    setV((old) => ({ ...old, [key]: value }));
    if (key === 'start') { setX(value === 'full' ? INVITE_FULL : value === 'one' ? INVITE_ONE : INVITE_EMPTY); setErrors([]); setSent(false); }
  };
  const err = (id: string) => errors.find((e) => e.id === id)?.message;
  const upd = (patch: Partial<InviteValues>) => setX((o) => ({ ...o, ...patch }));
  const submit = () => {
    const e = checkInvite(x);
    setErrors(e);
    if (!e.length) setSent(true);
  };
  const raw = `const [errors, setErrors] = useState<FormError[]>([]);

<FormGroup
  title="${String(v.title) || 'Untitled form'}"${v.showDesc ? '\n  description="They’ll get an email with a link to the assessment."' : ''}${v.note ? '' : '\n  requiredNote={null}'}
  errors={errors}
  onSubmit={() => { const e = check(values); setErrors(e); if (!e.length) send(values); }}
  onCancel={close}
  submitLabel="Send invite"
>
  <FormSection title="Candidate">
    <Input id="first" label="First name" required error={errorFor('first')} … />
    <Input id="phone" label="Phone" type="tel" … />            {/* optional */}
  </FormSection>
  <FormSection title="Assessment">
    <Select buttonId="assessment" label="Assessment" required … />
    <div id="proctoring"><RadioGroup legend="Proctoring" required … /></div>
  </FormSection>
</FormGroup>`;
  return (
    <Playground
      name="Form group"
      compact
      wide
      values={v}
      set={set}
      file="InviteCandidate.tsx"
      tag="FormGroup"
      attrs={[]}
      codeRaw={raw}
      controls={[
        { kind: 'segmented', key: 'start', label: 'Start with', options: [{ value: 'empty', label: 'Empty' }, { value: 'one', label: 'One mistake' }, { value: 'full', label: 'All filled' }] },
        { kind: 'text', key: 'title', label: 'Title' },
        { kind: 'boolean', key: 'showDesc', label: 'Description' },
        { kind: 'boolean', key: 'note', label: 'Required note', help: '“Fields marked * are required.”' },
      ]}
      preview={sent ? (
        <div className="pg-form-done">
          <Banner tone="success" title="Invite sent." announce="polite">{x.first} {x.last} will get an email at {x.email}.</Banner>
          <Button variant="secondary" onClick={() => { setSent(false); setX(INVITE_EMPTY); setErrors([]); }}>Invite someone else</Button>
        </div>
      ) : (
        <div className="pg-form">
          <FormGroup
            title={String(v.title) || 'Untitled form'}
            description={v.showDesc ? 'They’ll get an email with a link to the assessment.' : undefined}
            requiredNote={v.note ? undefined : null}
            errors={errors}
            onSubmit={submit}
            onCancel={() => { setX(INVITE_EMPTY); setErrors([]); }}
            submitLabel="Send invite"
          >
            <FormSection title="Candidate">
              <div className="pg-form__row">
                <Input id="fg-first" label="First name" required autoComplete="given-name" value={x.first} error={err('fg-first')} onChange={(e) => upd({ first: e.target.value })} />
                <Input id="fg-last" label="Last name" required autoComplete="family-name" value={x.last} error={err('fg-last')} onChange={(e) => upd({ last: e.target.value })} />
              </div>
              <Input id="fg-email" label="Email" type="email" required autoComplete="email" value={x.email} error={err('fg-email')} onChange={(e) => upd({ email: e.target.value })} />
              <Input id="fg-phone" label="Phone" type="tel" autoComplete="tel" description="Only for reminders by text." value={x.phone} onChange={(e) => upd({ phone: e.target.value })} />
            </FormSection>
            <FormSection title="Assessment">
              <Select buttonId="fg-assessment" label="Assessment" required placeholder="Choose an assessment" value={x.assessment} error={err('fg-assessment')}
                options={[{ value: 'pilot', label: 'Pilot screening v3' }, { value: 'nav', label: 'Navigation drills' }, { value: 'astro', label: 'Astromech basics' }]}
                onChange={(val) => upd({ assessment: String(val) })} />
              <div id="fg-proctoring">
                <RadioGroup legend="Proctoring" required value={x.proctoring} error={err('fg-proctoring')} onChange={(val) => upd({ proctoring: val })}
                  options={[{ value: 'recorded', label: 'Recorded', description: 'The webcam records while they work.' }, { value: 'live', label: 'Live', description: 'A proctor watches in real time.' }, { value: 'none', label: 'None' }]} />
              </div>
              <CheckboxGroup legend="Accommodations" value={x.help} onChange={(val) => upd({ help: val })}
                options={[{ value: 'time', label: 'Extra time' }, { value: 'reader', label: 'Screen reader friendly version' }]} />
              <TextArea label="Note to the candidate" limit={300} value={x.note} onChange={(e) => upd({ note: e.target.value })} />
            </FormSection>
          </FormGroup>
        </div>
      )}
    />
  );
}

/* ---------- Icons: playground and browser ---------- */
function IconsDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ name: 'sparkles', size: 'md', labelled: false, label: 'AI generated' });
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const name = (String(v.name) in ICONS ? String(v.name) : 'sparkles') as IconName;
  const q = query.trim().toLowerCase();
  const groups = ICON_GROUPS.map((g) => ({
    // Match the start of any word in the name, keywords or group, so “ai” finds AI icons, not “mail”
    ...g, icons: g.icons.filter((i) => !q || `${i.name.replace(/-/g, ' ')} ${i.keywords} ${g.name}`.toLowerCase().split(/\s+/).some((w) => w.startsWith(q)) || i.name.startsWith(q)),
  })).filter((g) => g.icons.length);
  const count = groups.reduce((n, g) => n + g.icons.length, 0);
  const attrs: PgCodeLine[] = [
    { attr: 'name', value: name },
    ...(v.size !== 'md' ? [{ attr: 'size', value: String(v.size) }] : []),
    ...(v.labelled && v.label ? [{ attr: 'label', value: String(v.label) }] : []),
  ];
  const pick = (n: IconName) => {
    set('name', n);
    try { navigator.clipboard?.writeText(`<Icon name="${n}" />`); } catch { /* clipboard may be blocked */ }
    setCopied(n);
  };
  return (
    <>
      <Playground
        name="Icon"
        compact
        values={v}
        set={set}
        file="Example.tsx"
        tag="Icon"
        attrs={attrs}
        controls={[
          { kind: 'text', key: 'name', label: 'Name', help: 'Or pick one from the icons below.' },
          { kind: 'segmented', key: 'size', label: 'Size', options: [{ value: 'sm', label: '16' }, { value: 'md', label: '20' }, { value: 'lg', label: '24' }] },
          { kind: 'boolean', key: 'labelled', label: 'Label', help: 'Only when the icon stands alone and means something.' },
          { kind: 'text', key: 'label', label: 'Label text' },
        ]}
        preview={
          <div className="pg-icon">
            <Icon name={name} size={v.size as 'sm' | 'md' | 'lg'} label={v.labelled && v.label ? String(v.label) : undefined} />
          </div>
        }
      />
      <div className="icon-browser">
        <div className="icon-browser__bar">
          <Input label="Search icons" icon={<Icon name="search" size="sm" />} placeholder="Try “delete”, “ai” or “people”" value={query}
            onChange={(e) => setQuery(e.target.value)} />
          <p className="icon-browser__count" role="status">{count} {count === 1 ? 'icon' : 'icons'}{copied ? ` · Copied <Icon name="${copied}" />` : ''}</p>
        </div>
        {groups.length === 0 && <p className="icon-browser__empty">No icons match “{query}”. Try a simpler word, or ask for a new icon.</p>}
        {groups.map((g) => (
          <section key={g.name} className="icon-browser__group" aria-labelledby={`ig-${slug(g.name)}`}>
            <h3 id={`ig-${slug(g.name)}`} className="icon-browser__title">{g.name} <span>{g.icons.length}</span></h3>
            <ul className="icon-browser__grid">
              {g.icons.map((i) => (
                <li key={i.name}>
                  <button type="button" className="icon-browser__tile" aria-pressed={name === i.name} onClick={() => pick(i.name)}
                    aria-label={`${i.name}, copy code`}>
                    <Icon name={i.name} size="lg" />
                    <span className="icon-browser__name" aria-hidden="true">{i.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

/* ---------- Breadcrumbs playground ---------- */
function BreadcrumbsDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ trail: 'Hiring, Jobs, Starfighter Pilot L4, Pilot screening v3', fold: false, label: 'Breadcrumb' });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.trail).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  let path = '';
  const items = names.map((n, i) => {
    path += `/${slug(n)}`;
    return i === names.length - 1 ? { label: n } : { label: n, to: path };
  });
  const attrs: PgCodeLine[] = [
    { attr: 'items', value: `[\n${items.map((c) => `    { label: '${c.label}'${'to' in c && c.to ? `, to: '${c.to}'` : ''} },`).join('\n')}\n  ]`, expr: true },
    ...(v.fold ? [{ attr: 'maxItems', value: '3', expr: true }] : []),
    ...(v.label && v.label !== 'Breadcrumb' ? [{ attr: 'label', value: String(v.label) }] : []),
  ];
  return (
    <Playground
      name="Breadcrumbs"
      compact
      wide
      values={v}
      set={set}
      file="JobPage.tsx"
      tag="Breadcrumbs"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'trail', label: 'Trail', help: 'Up to 4 levels, separated by commas. The last is this page, not a link.' },
        { kind: 'boolean', key: 'fold', label: 'Fold the middle', help: 'Keep the first and last two; the rest open from “…”.' },
        { kind: 'text', key: 'label', label: 'Label', help: 'The navigation’s name. Change it only if a page has two trails.' },
      ]}
      preview={<Breadcrumbs key={`${v.fold}-${names.length}`} items={items} maxItems={v.fold ? 3 : undefined} label={String(v.label) || 'Breadcrumb'} />}
    />
  );
}

/* ---------- Stepper playground ---------- */
function StepperDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Assessment setup', steps: 'Details, Questions, Proctoring, Review', current: '3', variant: 'full', orientation: 'horizontal', links: false, unit: 'Step',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.steps).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const at = Math.min(Number(v.current), names.length) - 1;
  const steps = names.map((n, i) => ({
    id: slug(n), label: n,
    status: (i < at ? 'complete' : i === at ? 'in-progress' : 'not-started') as 'complete' | 'in-progress' | 'not-started',
    ...(v.links && i <= at ? { to: `/setup/${slug(n)}` } : {}),
  }));
  const compact = v.variant === 'compact';
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    { attr: 'steps', value: `[\n${steps.map((s) => `    { id: '${s.id}', label: '${s.label}', status: '${s.status}'${'to' in s ? `, to: '${s.to}'` : ''} },`).join('\n')}\n  ]`, expr: true },
    { attr: 'current', value: steps[at]?.id ?? '' },
    ...(compact ? [{ attr: 'variant', value: 'compact' }] : []),
    ...(!compact && v.orientation === 'vertical' ? [{ attr: 'orientation', value: 'vertical' }] : []),
    ...(compact && v.unit && v.unit !== 'Step' ? [{ attr: 'unit', value: String(v.unit) }] : []),
  ];
  return (
    <Playground
      name="Stepper"
      compact
      wide
      values={v}
      set={set}
      file="Setup.tsx"
      tag="Stepper"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label', help: 'Names the steps for screen readers.' },
        { kind: 'text', key: 'steps', label: 'Steps', help: 'Up to 4, separated by commas.' },
        { kind: 'select', key: 'current', label: 'Current step', options: names.map((n, i) => ({ value: String(i + 1), label: `${i + 1}. ${n}` })) },
        { kind: 'segmented', key: 'variant', label: 'Variant', options: [{ value: 'full', label: 'Full' }, { value: 'compact', label: 'Compact' }] },
        { kind: 'segmented', key: 'orientation', label: 'Orientation', options: [{ value: 'horizontal', label: 'Horizontal' }, { value: 'vertical', label: 'Vertical' }] },
        { kind: 'boolean', key: 'links', label: 'Steps are links', help: 'Finished steps and this one link to their pages; later ones aren’t reachable yet.' },
        { kind: 'text', key: 'unit', label: 'Unit', help: 'Compact only: “Step 3 of 4”, or “Stage”.' },
      ]}
      preview={
        <div className={`pg-stepper${!compact && v.orientation === 'vertical' ? ' is-vertical' : ''}`}>
          <Stepper label={String(v.label) || 'Steps'} steps={steps} current={steps[at]?.id ?? ''}
            variant={compact ? 'compact' : 'full'} orientation={v.orientation as 'horizontal' | 'vertical'} unit={String(v.unit) || 'Step'} />
        </div>
      }
    />
  );
}

/* ---------- StatusMark playground ---------- */
const MARK_EXAMPLES: [string, string, string][] = [
  ['dashed', 'Not started', 'Not started, pending, draft'],
  ['ring', 'Open', 'Open, ready, scheduled'],
  ['half', 'In progress', 'In progress, in review, on hold'],
  ['filled', 'Live', 'Live, published, active'],
  ['check', 'Passed', 'Complete, passed, approved'],
  ['slash', 'Failed', 'Failed, denied, cancelled'],
];
function StatusMarkDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({ mark: 'half', label: 'In progress', variant: 'plain', size: 'md', muted: false });
  const set = (key: string, value: PgValue) => setV((old) => {
    const next = { ...old, [key]: value };
    if (key === 'mark') { const from = MARK_EXAMPLES.find((m) => m[0] === old.mark), to = MARK_EXAMPLES.find((m) => m[0] === value); if (from && to && old.label === from[1]) next.label = to[1]; }
    return next;
  });
  const attrs: PgCodeLine[] = [
    { attr: 'mark', value: String(v.mark) },
    ...(v.variant === 'badge' ? [{ attr: 'variant', value: 'badge' }] : []),
    ...(v.size === 'sm' ? [{ attr: 'size', value: 'sm' }] : []),
    ...(v.muted ? [{ attr: 'muted', value: true as const }] : []),
  ];
  return (
    <Playground
      name="Status mark"
      compact
      values={v}
      set={set}
      file="JobRow.tsx"
      tag="StatusMark"
      attrs={attrs}
      codeChildren={[String(v.label) || 'Status']}
      controls={[
        { kind: 'select', key: 'mark', label: 'Mark', options: MARK_EXAMPLES.map(([m, , use]) => ({ value: m, label: `${m[0].toUpperCase()}${m.slice(1)}: ${use.split(',')[0]}` })) },
        { kind: 'text', key: 'label', label: 'Words', help: 'Always shown, always read. The mark only repeats it.' },
        { kind: 'segmented', key: 'variant', label: 'Variant', options: [{ value: 'plain', label: 'Plain' }, { value: 'badge', label: 'Badge' }] },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
        { kind: 'boolean', key: 'muted', label: 'Muted', help: 'Softer words, for statuses that are over: closed, archived.' },
      ]}
      preview={<StatusMark mark={v.mark as 'half'} variant={v.variant as 'plain' | 'badge'} size={v.size as 'sm' | 'md'} muted={!!v.muted}>{String(v.label) || 'Status'}</StatusMark>}
    />
  );
}
function StatusMarkGallery() {
  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="visually-hidden">The six marks, plain and as badges</caption>
        <thead><tr><th scope="col">Mark</th><th scope="col">Plain</th><th scope="col">Badge</th><th scope="col">Use it for</th></tr></thead>
        <tbody>
          {MARK_EXAMPLES.map(([m, label, use]) => (
            <tr key={m}>
              <th scope="row"><code>{m}</code></th>
              <td><StatusMark mark={m as 'half'}>{label}</StatusMark></td>
              <td><StatusMark mark={m as 'half'} variant="badge">{label}</StatusMark></td>
              <td>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Link playground ---------- */
function LinkDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    text: 'proctoring policy', where: 'inline', opens: 'same', href: 'https://example.com/policies/proctoring',
  });
  const set = (key: string, value: PgValue) => setV((old) => {
    const next = { ...old, [key]: value };
    if (key === 'where') {
      if (value === 'standalone' && old.text === 'proctoring policy') next.text = 'View all assessments';
      if (value === 'inline' && old.text === 'View all assessments') next.text = 'proctoring policy';
    }
    return next;
  });
  const newTab = v.opens === 'new';
  const standalone = v.where === 'standalone';
  const attrs: PgCodeLine[] = [
    newTab ? { attr: 'href', value: String(v.href) } : { attr: 'to', value: standalone ? '/assessments' : '/policies/proctoring' },
    ...(newTab ? [{ attr: 'newTab', value: true as const }] : []),
  ];
  const link = (
    <Link href={newTab ? String(v.href) : '#link'} newTab={newTab}
      onClick={(e) => e.preventDefault()}>
      {String(v.text) || 'Untitled'}
    </Link>
  );
  return (
    <Playground
      name="Link"
      compact
      values={v}
      set={set}
      file="Invite.tsx"
      tag="Link"
      attrs={attrs}
      codeChildren={[String(v.text) || 'Untitled']}
      controls={[
        { kind: 'text', key: 'text', label: 'Text', help: 'Say where it goes. Never “click here”.' },
        { kind: 'segmented', key: 'where', label: 'Shown', options: [{ value: 'inline', label: 'In body text' }, { value: 'standalone', label: 'On its own' }] },
        { kind: 'segmented', key: 'opens', label: 'Opens', options: [{ value: 'same', label: 'Same tab' }, { value: 'new', label: 'New tab' }] },
        { kind: 'text', key: 'href', label: 'Address', help: 'New-tab links use a plain address.' },
      ]}
      preview={standalone
        ? <div className="pg-link">{link}</div>
        : <p className="pg-link t-body">Read the {link} before you invite candidates. It explains what the webcam records and how long recordings are kept.</p>}
    />
  );
}

/* ---------- Playground: one component, controls beside it, code below ---------- */
type PgValue = string | boolean;
type PgControl =
  | { kind: 'text'; key: string; label: string; help?: string }
  | { kind: 'boolean'; key: string; label: string; help?: string }
  | { kind: 'select'; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'segmented'; key: string; label: string; options: { value: string; label: string }[] };
type PgCodeLine = { attr: string; value: string | true; expr?: boolean };

function PgCode({ file, tag, attrs, children, raw }: { file: string; tag: string; attrs: PgCodeLine[]; children?: string[]; raw?: string }) {
  const [copied, setCopied] = useState<'' | 'ok' | 'fail'>('');
  const open = !attrs.length ? `<${tag}` : `<${tag}\n${attrs.map((a) => `  ${a.value === true ? a.attr : a.expr ? `${a.attr}={${a.value}}` : `${a.attr}="${a.value}"`}`).join('\n')}`;
  const close = attrs.length ? '\n>' : '>';
  const text = raw ?? (children?.length ? `${open}${close}\n${children.map((c) => `  ${c}`).join('\n')}\n</${tag}>` : `${open}${attrs.length ? '\n' : ' '}/>`);
  const copy = () => {
    const done = (ok: boolean) => { setCopied(ok ? 'ok' : 'fail'); window.setTimeout(() => setCopied(''), 2000); };
    try { navigator.clipboard.writeText(text).then(() => done(true), () => done(false)); } catch { done(false); }
  };
  return (
    <div className="code-block pg__code">
      <div className="code-block-bar">
        <span>{file}</span>
        <button className="copy-button" type="button" aria-label={`Copy ${file}`} data-copied={copied === 'ok' ? '' : undefined} onClick={copy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
          <span>{copied === 'ok' ? 'Copied' : copied === 'fail' ? 'Copy failed' : 'Copy'}</span>
        </button>
      </div>
      <pre><code>
        {raw ? raw.split(/('[^']*')/).map((part, i) => (i % 2 ? <span key={i} className="tok-s">{part}</span> : part)) : <>
        {'<'}<span className="tok-k">{tag}</span>{attrs.length ? '\n' : null}
        {attrs.map((a) => (
          <span key={a.attr}>{'  '}{a.attr}{a.value === true ? null : a.expr ? <>{'={'}{String(a.value).split(/('[^']*')/).map((part, i) => (i % 2 ? <span key={i} className="tok-s">{part}</span> : part))}{'}'}</> : <>=<span className="tok-s">"{a.value}"</span></>}{'\n'}</span>
        ))}
        {children?.length ? <>{attrs.length ? '>' : '>'}{'\n'}{children.map((c) => <span key={c}>{'  '}{c.startsWith('<') ? <>{'<'}<span className="tok-k">{c.slice(1).split(/[\s/>]/)[0]}</span>{c.slice(1 + c.slice(1).split(/[\s/>]/)[0].length)}</> : c}{'\n'}</span>)}{'</'}<span className="tok-k">{tag}</span>{'>'}</> : attrs.length ? '/>' : ' />'}
        </>}
      </code></pre>
      <p className="visually-hidden" role="status" aria-live="polite">{copied === 'ok' ? `Copied ${file} to clipboard.` : copied === 'fail' ? `Couldn't copy ${file}. Select the text and copy it manually.` : ''}</p>
    </div>
  );
}

function Playground({ name, controls, values, set, preview, file, tag, attrs, wide, compact, codeChildren, codeRaw, above }: {
  above?: ReactNode; codeRaw?: string; wide?: boolean; compact?: boolean | number; codeChildren?: string[]; name: string; controls: PgControl[]; values: Record<string, PgValue>; set: (key: string, v: PgValue) => void;
  preview: ReactNode; file: string; tag: string; attrs: PgCodeLine[];
}) {
  const id = React.useId();
  return (
    <div className={`pg${compact ? ' pg--compact' : ''}${above ? ' pg--above' : ''}`} style={typeof compact === 'number' ? { ['--pg-h' as string]: `${compact}px` } : undefined}>
      {above && <div className="pg__above">{above}</div>}
      <div className="pg__stage" role="region" aria-label={`${name} preview`}>
        <div className={`pg__stage-inner${wide ? ' pg__stage-inner--wide' : ''}`}>{preview}</div>
      </div>
      <div className="pg__controls" role="group" aria-label={`${name} properties`} tabIndex={compact ? -1 : undefined} data-scroll={compact ? '' : undefined}>
        <p className="pg__heading">Properties</p>
        {controls.map((c) => {
          const cid = `${id}-${c.key}`;
          if (c.kind === 'boolean') return (
            <div className="pg__row" key={c.key}>
              <Switch labelPosition="between" size="sm" label={c.label} description={c.help} checked={!!values[c.key]} onChange={(v) => set(c.key, v)} />
            </div>
          );
          if (c.kind === 'text') return (
            <div className="pg__row pg__row--stack" key={c.key}>
              <label className="pg__label" htmlFor={cid}>{c.label}</label>
              <input id={cid} className="pg__input" value={String(values[c.key] ?? '')} onChange={(e) => set(c.key, e.target.value)} aria-describedby={c.help ? `${cid}-h` : undefined} />
              {c.help && <span className="pg__help" id={`${cid}-h`}>{c.help}</span>}
            </div>
          );
          if (c.kind === 'select') return (
            <div className="pg__row pg__row--field" key={c.key}>
              <Select label={c.label} inline value={String(values[c.key])} onChange={(v) => set(c.key, v)} options={c.options} />
            </div>
          );
          return (
            <div className="pg__row pg__row--stack" key={c.key}>
              <SegmentedControl label={c.label} showLabel fill size="sm" value={String(values[c.key])} onChange={(v) => set(c.key, v)} options={c.options} />
            </div>
          );
        })}
      </div>
      <PgCode file={file} tag={tag} attrs={attrs} children={codeChildren} raw={codeRaw} />
    </div>
  );
}

/* ---------- ChipGroup playground ---------- */
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'option';
const fakeCount = (t: string) => (t.length * 7 + t.charCodeAt(0)) % 9 + 1;
function ChipsDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Filter by channel', options: 'Email, Teams, WhatsApp, Text message',
    multiple: true, counts: true, all: true, disableLast: false, size: 'md',
  });
  const [single, setSingle] = useState('all');
  const [multi, setMulti] = useState<string[]>(['email', 'teams']);
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));

  const MAX = 4;
  const withAll = !v.multiple && !!v.all;
  const names = String(v.options).split(',').map((x) => x.trim()).filter(Boolean).slice(0, withAll ? MAX - 1 : MAX);
  const listed = names.map((n, i) => ({ value: slug(n), label: n, count: v.counts ? fakeCount(n) : undefined, disabled: !!v.disableLast && i === names.length - 1 }));
  const total = listed.reduce((t, o) => t + (o.count ?? 0), 0);
  const options = withAll ? [{ value: 'all', label: 'All', count: v.counts ? total : undefined, disabled: false }, ...listed] : listed;
  const singleValue = options.some((o) => o.value === single) ? single : options[0]?.value ?? '';

  const optLines = options.map((o) => `    { value: '${o.value}', label: '${o.label}'${o.count !== undefined ? `, count: ${o.count}` : ''}${o.disabled ? ', disabled: true' : ''} },`).join('\n');
  const attrs: PgCodeLine[] = [
    ...(v.multiple ? [{ attr: 'multiple', value: true as const }] : []),
    { attr: 'label', value: String(v.label) },
    { attr: 'value', value: v.multiple ? 'channels' : 'channel', expr: true },
    { attr: 'onChange', value: v.multiple ? 'setChannels' : 'setChannel', expr: true },
    { attr: 'options', value: `[\n${optLines}\n  ]`, expr: true },
    ...(v.size !== 'md' ? [{ attr: 'size', value: String(v.size) }] : []),
  ];

  return (
    <Playground
      name="Chips"
      wide
      compact
      values={v}
      set={set}
      file="ChannelFilter.tsx"
      tag="ChipGroup"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Group label', help: 'Read by screen readers, e.g. “Filter by channel”.' },
        { kind: 'text', key: 'options', label: 'Options', help: 'Up to 4 chips, separated by commas. “All” counts as one.' },
        { kind: 'boolean', key: 'multiple', label: 'Multi-select' },
        { kind: 'boolean', key: 'counts', label: 'Show counts' },
        { kind: 'boolean', key: 'all', label: '“All” first', help: 'Single-select only.' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last option' },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
      ]}
      preview={v.multiple
        ? <ChipGroup multiple label={String(v.label) || 'Filter'} size={v.size as 'sm' | 'md'} value={multi} onChange={setMulti} options={options} />
        : <ChipGroup label={String(v.label) || 'Filter'} size={v.size as 'sm' | 'md'} value={singleValue} onChange={setSingle} options={options} />}
    />
  );
}

/* ---------- Button playground ---------- */
const BTN_ICONS: Record<string, { name: string; node: ReactNode }> = {
  plus: { name: 'PlusIcon', node: <svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" /></svg> },
  trash: { name: 'TrashIcon', node: <svg viewBox="0 0 16 16"><path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.7 9h6.6l.7-9" /></svg> },
  download: { name: 'DownloadIcon', node: <svg viewBox="0 0 16 16"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" /></svg> },
};
function ButtonDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Add module', variant: 'primary', size: 'md', icon: 'plus', iconPos: 'start', toggle: false,
    disabled: false, disabledReason: 'Add an item to this module first.',
  });
  const [on, setOn] = useState(false);
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const icon = v.icon !== 'none' ? BTN_ICONS[String(v.icon)] : null;
  const iconOnly = v.iconPos === 'only' && !!icon;
  const label = String(v.label) || 'Untitled';
  const attrs: PgCodeLine[] = [
    ...(v.variant !== 'primary' ? [{ attr: 'variant', value: String(v.variant) }] : []),
    ...(v.size !== 'md' ? [{ attr: 'size', value: String(v.size) }] : []),
    ...(icon ? [{ attr: 'icon', value: `<${icon.name} />`, expr: true }] : []),
    ...(icon && v.iconPos === 'end' ? [{ attr: 'iconPosition', value: 'end' }] : []),
    ...(iconOnly ? [{ attr: 'iconOnly', value: true as const }] : []),
    ...(v.toggle ? [{ attr: 'pressed', value: 'isOn', expr: true }, { attr: 'onClick', value: '() => setIsOn(!isOn)', expr: true }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
  ];
  return (
    <Playground
      name="Button"
      compact
      values={v}
      set={set}
      file="Toolbar.tsx"
      tag="Button"
      attrs={attrs}
      codeChildren={[label]}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'select', key: 'variant', label: 'Variant', options: [{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }, { value: 'ghost', label: 'Ghost' }, { value: 'danger', label: 'Danger' }] },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }, { value: 'lg', label: 'Large' }] },
        { kind: 'select', key: 'icon', label: 'Icon', options: [{ value: 'none', label: 'None' }, { value: 'plus', label: 'Plus' }, { value: 'trash', label: 'Trash' }, { value: 'download', label: 'Download' }] },
        { kind: 'segmented', key: 'iconPos', label: 'Icon position', options: [{ value: 'start', label: 'Left' }, { value: 'end', label: 'Right' }, { value: 'only', label: 'Icon only' }] },
        { kind: 'boolean', key: 'toggle', label: 'Toggle button', help: 'Press it to turn it on and off (aria-pressed).' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
      ]}
      preview={
        <Button
          variant={v.variant as 'primary' | 'secondary' | 'ghost' | 'danger'}
          size={v.size as 'sm' | 'md' | 'lg'}
          icon={icon?.node}
          iconPosition={v.iconPos === 'end' ? 'end' : 'start'}
          iconOnly={iconOnly}
          pressed={v.toggle ? on : undefined}
          onClick={() => { if (v.toggle) setOn(!on); }}
          disabled={!!v.disabled}
          disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
        >
          {label}
        </Button>
      }
    />
  );
}

/* ---------- Checkbox playground ---------- */
function CheckboxDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Accept the terms', required: true, hasDescription: true, description: 'You can withdraw at any time in Settings.',
    checked: false, indeterminate: false, error: false, errorMessage: 'Accept the terms to continue.',
    disabled: false, disabledReason: 'Your organisation has already accepted on your behalf.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const name = camel(String(v.label));
  const setter = `set${name[0].toUpperCase()}${name.slice(1)}`;
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    ...(v.hasDescription && v.description ? [{ attr: 'description', value: String(v.description) }] : []),
    { attr: 'checked', value: name, expr: true },
    { attr: 'onChange', value: setter, expr: true },
    ...(v.indeterminate ? [{ attr: 'indeterminate', value: true as const }] : []),
    ...(v.error && v.errorMessage ? [{ attr: 'error', value: String(v.errorMessage) }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
  ];
  return (
    <Playground
      name="Checkbox"
      compact
      values={v}
      set={set}
      file="Terms.tsx"
      tag="Checkbox"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'boolean', key: 'required', label: 'Required', help: 'An asterisk after the label.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'boolean', key: 'checked', label: 'Checked' },
        { kind: 'boolean', key: 'indeterminate', label: 'Mixed', help: 'For a “select all” when only some are chosen.' },
        { kind: 'boolean', key: 'error', label: 'Error' },
        { kind: 'text', key: 'errorMessage', label: 'Error message', help: 'Shown under the label when Error is on. Say how to fix it.' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
      ]}
      preview={
        <Checkbox
          label={String(v.label) || 'Untitled'}
          required={!!v.required}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          checked={!!v.checked}
          onChange={(c) => { set('checked', c); if (v.indeterminate) set('indeterminate', false); }}
          indeterminate={!!v.indeterminate}
          error={v.error && v.errorMessage ? String(v.errorMessage) : undefined}
          disabled={!!v.disabled}
          disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
        />
      }
    />
  );
}

/* ---------- Input playground ---------- */
const SearchIcon = () => <svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>;
const INPUT_TYPES: Record<string, { attrs: PgCodeLine[]; props: Record<string, string> }> = {
  text: { attrs: [], props: {} },
  email: { attrs: [{ attr: 'type', value: 'email' }, { attr: 'autoComplete', value: 'email' }], props: { type: 'email', autoComplete: 'email' } },
  search: { attrs: [{ attr: 'type', value: 'search' }], props: { type: 'search' } },
  numeric: { attrs: [{ attr: 'inputMode', value: 'numeric' }], props: { inputMode: 'numeric' } },
};
function InputDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Work email', placeholder: 'name@company.com', hasDescription: true, description: 'We’ll send the results here.', type: 'email',
    required: true, icon: false, error: false, errorMessage: 'Enter an email address, such as name@company.com.',
    readOnly: false, disabled: false, disabledReason: 'Set by your organisation’s single sign-on.',
  });
  const [text, setText] = useState('');
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const name = camel(String(v.label)) || 'value';
  const setter = `set${name[0].toUpperCase()}${name.slice(1)}`;
  const t = INPUT_TYPES[String(v.type)] ?? INPUT_TYPES.text;
  const showError = !!v.error && !!v.errorMessage;
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...t.attrs,
    ...(v.placeholder ? [{ attr: 'placeholder', value: String(v.placeholder) }] : []),
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    ...(v.hasDescription && v.description && !showError ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(v.icon ? [{ attr: 'icon', value: '<SearchIcon />', expr: true }] : []),
    ...(showError ? [{ attr: 'error', value: String(v.errorMessage) }] : []),
    ...(v.readOnly ? [{ attr: 'readOnly', value: true as const }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
    { attr: 'value', value: name, expr: true },
    { attr: 'onChange', value: `(e) => ${setter}(e.target.value)`, expr: true },
  ];
  return (
    <Playground
      name="Input"
      compact
      values={v}
      set={set}
      file="Form.tsx"
      tag="Input"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'select', key: 'type', label: 'Type', options: [{ value: 'text', label: 'Text' }, { value: 'email', label: 'Email' }, { value: 'search', label: 'Search' }, { value: 'numeric', label: 'Numeric' }] },
        { kind: 'text', key: 'placeholder', label: 'Placeholder', help: 'An example, never the only label. Leave empty for none.' },
        { kind: 'boolean', key: 'required', label: 'Required', help: 'An asterisk after the label.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'boolean', key: 'icon', label: 'Search icon' },
        { kind: 'boolean', key: 'error', label: 'Error' },
        { kind: 'text', key: 'errorMessage', label: 'Error message', help: 'Replaces the description when Error is on. Say how to fix it.' },
        { kind: 'boolean', key: 'readOnly', label: 'Read only', help: 'Can be selected and copied, not changed.' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
      ]}
      preview={
        <Input
          label={String(v.label) || 'Untitled'}
          {...t.props}
          placeholder={v.placeholder ? String(v.placeholder) : undefined}
          required={!!v.required}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          icon={v.icon ? <SearchIcon /> : undefined}
          error={showError ? String(v.errorMessage) : undefined}
          readOnly={!!v.readOnly}
          disabled={!!v.disabled}
          disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      }
    />
  );
}

/* ---------- TextArea playground ---------- */
function TextAreaDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Reason for escalating', required: true, hasDescription: true, description: 'The reviewer sees this first.',
    placeholder: 'What should the reviewer look at?', rows: '3', limit: '140',
    error: false, errorMessage: 'Say why this message needs a second look.',
    readOnly: false, disabled: false, disabledReason: 'Escalations can’t be edited once a reviewer opens them.',
  });
  const [text, setText] = useState('Mentions a gift above the policy limit.');
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const name = camel(String(v.label)) || 'value';
  const setter = `set${name[0].toUpperCase()}${name.slice(1)}`;
  const showError = !!v.error && !!v.errorMessage;
  const limit = v.limit === 'none' ? undefined : Number(v.limit);
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    ...(v.placeholder ? [{ attr: 'placeholder', value: String(v.placeholder) }] : []),
    ...(v.rows !== '3' ? [{ attr: 'rows', value: String(v.rows), expr: true }] : []),
    ...(limit ? [{ attr: 'limit', value: String(limit), expr: true }] : []),
    ...(v.hasDescription && v.description && !showError ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(showError ? [{ attr: 'error', value: String(v.errorMessage) }] : []),
    ...(v.readOnly ? [{ attr: 'readOnly', value: true as const }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
    { attr: 'value', value: name, expr: true },
    { attr: 'onChange', value: `(e) => ${setter}(e.target.value)`, expr: true },
  ];
  return (
    <Playground
      name="Text area"
      compact
      values={v}
      set={set}
      file="Escalate.tsx"
      tag="TextArea"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'boolean', key: 'required', label: 'Required', help: 'An asterisk after the label.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'text', key: 'placeholder', label: 'Placeholder', help: 'An example, never the only label. Leave empty for none.' },
        { kind: 'select', key: 'rows', label: 'Rows', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '6', label: '6' }] },
        { kind: 'select', key: 'limit', label: 'Character limit', options: [{ value: 'none', label: 'None' }, { value: '40', label: '40' }, { value: '140', label: '140' }, { value: '280', label: '280' }] },
        { kind: 'boolean', key: 'error', label: 'Error' },
        { kind: 'text', key: 'errorMessage', label: 'Error message', help: 'Replaces the description when Error is on. Say how to fix it.' },
        { kind: 'boolean', key: 'readOnly', label: 'Read only', help: 'Can be selected and copied, not changed.' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
      ]}
      preview={
        <TextArea
          label={String(v.label) || 'Untitled'}
          required={!!v.required}
          placeholder={v.placeholder ? String(v.placeholder) : undefined}
          rows={Number(v.rows)}
          limit={limit}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          error={showError ? String(v.errorMessage) : undefined}
          readOnly={!!v.readOnly}
          disabled={!!v.disabled}
          disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      }
    />
  );
}

/* ---------- CheckboxGroup playground ---------- */
function CheckboxGroupDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    legend: 'Notify when a candidate submits', options: 'Hiring manager, Recruiter, Proctor',
    orientation: 'vertical', selectAll: false, required: true, hasDescription: true, description: 'Each person gets one email per candidate.',
    error: false, errorMessage: 'Choose at least one person to notify.', disableLast: false,
  });
  const [chosen, setChosen] = useState<string[]>(['hiring-manager']);
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const names = String(v.options).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const options = names.map((n, i) => ({ value: slug(n), label: n, disabled: !!v.disableLast && i === names.length - 1 && names.length > 1,
    disabledReason: !!v.disableLast && i === names.length - 1 ? 'Proctors are notified by the proctoring service.' : undefined }));
  const optLines = options.map((o) => `    { value: '${o.value}', label: '${o.label}'${o.disabled ? ", disabled: true, disabledReason: 'Proctors are notified by the proctoring service.'" : ''} },`).join('\n');
  const attrs: PgCodeLine[] = [
    { attr: 'legend', value: String(v.legend) },
    { attr: 'options', value: `[\n${optLines}\n  ]`, expr: true },
    { attr: 'value', value: 'notify', expr: true },
    { attr: 'onChange', value: 'setNotify', expr: true },
    ...(v.orientation === 'horizontal' ? [{ attr: 'orientation', value: 'horizontal' }] : []),
    ...(v.selectAll ? [{ attr: 'selectAll', value: 'Everyone' }] : []),
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    ...(v.hasDescription && v.description && !(v.error && v.errorMessage) ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(v.error && v.errorMessage ? [{ attr: 'error', value: String(v.errorMessage) }] : []),
  ];
  return (
    <Playground
      name="Checkbox group"
      compact
      values={v}
      set={set}
      file="Notify.tsx"
      tag="CheckboxGroup"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'legend', label: 'Legend', help: 'Names the group; read with each checkbox.' },
        { kind: 'boolean', key: 'required', label: 'Required', help: 'At least one must be chosen. An asterisk after the legend.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'text', key: 'options', label: 'Options', help: 'Up to 4, separated by commas.' },
        { kind: 'segmented', key: 'orientation', label: 'Orientation', options: [{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }] },
        { kind: 'boolean', key: 'selectAll', label: 'Select all', help: 'An “Everyone” checkbox first; it shows the mixed state when only some are chosen.' },
        { kind: 'boolean', key: 'error', label: 'Error' },
        { kind: 'text', key: 'errorMessage', label: 'Error message', help: 'Replaces the description when Error is on.' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last option' },
      ]}
      preview={
        <CheckboxGroup
          legend={String(v.legend) || 'Untitled group'}
          options={options}
          value={chosen}
          onChange={setChosen}
          orientation={v.orientation as 'vertical' | 'horizontal'}
          selectAll={v.selectAll ? 'Everyone' : undefined}
          required={!!v.required}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          error={v.error && v.errorMessage ? String(v.errorMessage) : undefined}
        />
      }
    />
  );
}

/* ---------- Radio playground ---------- */
function RadioDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'After review', hasDescription: true, description: 'A recruiter checks scores before candidates see them.',
    checked: true, disabled: false, disabledReason: 'Only admins can change when results are shared.',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const value = slug(String(v.label)) || 'option';
  const attrs: PgCodeLine[] = [
    { attr: 'name', value: 'share' },
    { attr: 'value', value },
    { attr: 'label', value: String(v.label) },
    ...(v.hasDescription && v.description ? [{ attr: 'description', value: String(v.description) }] : []),
    { attr: 'checked', value: `share === '${value}'`, expr: true },
    { attr: 'onChange', value: 'setShare', expr: true },
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
  ];
  return (
    <Playground
      name="Radio button"
      compact
      values={v}
      set={set}
      file="Sharing.tsx"
      tag="Radio"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'boolean', key: 'checked', label: 'Checked', help: 'People can’t un-choose a radio; choosing another option does that.' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
      ]}
      preview={
        <Radio
          name="pg-radio"
          value={value}
          label={String(v.label) || 'Untitled option'}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          checked={!!v.checked}
          onChange={() => set('checked', true)}
          disabled={!!v.disabled}
          disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
        />
      }
    />
  );
}

/* ---------- RadioGroup playground ---------- */
function RadioGroupDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    legend: 'When results are shared', required: true, hasDescription: true, description: 'Candidates are told when they submit.',
    options: 'After review, Straight away, Never', orientation: 'vertical', preselect: true,
    error: false, errorMessage: 'Choose when candidates see their results.', disableLast: false,
  });
  const [chosen, setChosen] = useState('after-review');
  const set = (key: string, value: PgValue) => {
    setV((old) => ({ ...old, [key]: value }));
    if (key === 'preselect') setChosen(value ? slug(String(v.options).split(',')[0].trim()) : '');
  };
  const names = String(v.options).split(',').map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const reason = 'Your organisation shares results with every candidate.';
  const options = names.map((n, i) => {
    const off = !!v.disableLast && i === names.length - 1 && names.length > 1;
    return { value: slug(n), label: n, disabled: off, disabledReason: off ? reason : undefined };
  });
  const optLines = options.map((o) => `    { value: '${o.value}', label: '${o.label}'${o.disabled ? `, disabled: true, disabledReason: '${reason}'` : ''} },`).join('\n');
  const showError = !!v.error && !!v.errorMessage;
  const attrs: PgCodeLine[] = [
    { attr: 'legend', value: String(v.legend) },
    ...(v.required ? [{ attr: 'required', value: true as const }] : []),
    { attr: 'options', value: `[\n${optLines}\n  ]`, expr: true },
    { attr: 'value', value: 'share', expr: true },
    { attr: 'onChange', value: 'setShare', expr: true },
    ...(v.orientation === 'horizontal' ? [{ attr: 'orientation', value: 'horizontal' }] : []),
    ...(v.hasDescription && v.description && !showError ? [{ attr: 'description', value: String(v.description) }] : []),
    ...(showError ? [{ attr: 'error', value: String(v.errorMessage) }] : []),
  ];
  return (
    <Playground
      name="Radio group"
      compact
      values={v}
      set={set}
      file="Sharing.tsx"
      tag="RadioGroup"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'legend', label: 'Legend', help: 'Names the group; read with each option.' },
        { kind: 'boolean', key: 'required', label: 'Required', help: 'One must be chosen. An asterisk after the legend.' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'text', key: 'options', label: 'Options', help: 'Up to 4, separated by commas.' },
        { kind: 'segmented', key: 'orientation', label: 'Orientation', options: [{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal' }] },
        { kind: 'boolean', key: 'preselect', label: 'Default choice', help: 'Start with the first option chosen. Turn off when choosing should be a real decision.' },
        { kind: 'boolean', key: 'error', label: 'Error' },
        { kind: 'text', key: 'errorMessage', label: 'Error message', help: 'Replaces the description when Error is on.' },
        { kind: 'boolean', key: 'disableLast', label: 'Disable last option' },
      ]}
      preview={
        <RadioGroup
          legend={String(v.legend) || 'Untitled group'}
          options={options}
          value={chosen}
          onChange={setChosen}
          orientation={v.orientation as 'vertical' | 'horizontal'}
          required={!!v.required}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          error={showError ? String(v.errorMessage) : undefined}
        />
      }
    />
  );
}

/* ---------- Switch playground ---------- */
const camel = (t: string) => {
  const w = t.replace(/[^a-zA-Z0-9 ]/g, '').trim().split(/\s+/).filter(Boolean);
  return w.length ? w.map((x, i) => (i ? x[0].toUpperCase() + x.slice(1).toLowerCase() : x.toLowerCase())).join('') : 'value';
};
function SwitchDemo() {
  const [v, setV] = useState<Record<string, PgValue>>({
    label: 'Require password', hasDescription: true, description: 'Asked for when someone opens a shared file.',
    checked: false, showState: false, disabled: false, disabledReason: 'Your organisation requires passwords on every file.',
    size: 'md', labelPosition: 'end',
  });
  const set = (key: string, value: PgValue) => setV((old) => ({ ...old, [key]: value }));
  const name = camel(String(v.label));
  const setter = `set${name[0].toUpperCase()}${name.slice(1)}`;
  const attrs: PgCodeLine[] = [
    { attr: 'label', value: String(v.label) },
    ...(v.hasDescription && v.description ? [{ attr: 'description', value: String(v.description) }] : []),
    { attr: 'checked', value: name, expr: true },
    { attr: 'onChange', value: setter, expr: true },
    ...(v.showState ? [{ attr: 'showState', value: true as const }] : []),
    ...(v.disabled ? [{ attr: 'disabled', value: true as const }] : []),
    ...(v.disabled && v.disabledReason ? [{ attr: 'disabledReason', value: String(v.disabledReason) }] : []),
    ...(v.size !== 'md' ? [{ attr: 'size', value: String(v.size) }] : []),
    ...(v.labelPosition !== 'end' ? [{ attr: 'labelPosition', value: String(v.labelPosition) }] : []),
  ];
  return (
    <Playground
      name="Switch"
      compact
      values={v}
      set={set}
      file="Settings.tsx"
      tag="Switch"
      attrs={attrs}
      controls={[
        { kind: 'text', key: 'label', label: 'Label' },
        { kind: 'boolean', key: 'hasDescription', label: 'Description' },
        { kind: 'text', key: 'description', label: 'Description text', help: 'Shown when Description is on.' },
        { kind: 'boolean', key: 'checked', label: 'Checked' },
        { kind: 'boolean', key: 'showState', label: 'Show state' },
        { kind: 'boolean', key: 'disabled', label: 'Disabled' },
        { kind: 'text', key: 'disabledReason', label: 'Disabled reason', help: 'Shown in a tooltip when Disabled is on.' },
        { kind: 'select', key: 'size', label: 'Size', options: [{ value: 'sm', label: 'Small' }, { value: 'md', label: 'Medium' }] },
        { kind: 'segmented', key: 'labelPosition', label: 'Label position', options: [{ value: 'end', label: 'After' }, { value: 'start', label: 'Before' }, { value: 'between', label: 'Across' }] },
      ]}
      preview={
        <Switch
          label={String(v.label) || 'Untitled setting'}
          description={v.hasDescription && v.description ? String(v.description) : undefined}
          checked={!!v.checked}
          onChange={(c) => set('checked', c)}
          showState={!!v.showState}
          disabled={!!v.disabled}
          disabledReason={v.disabled && v.disabledReason ? String(v.disabledReason) : undefined}
          size={v.size as 'sm' | 'md'}
          labelPosition={v.labelPosition as 'end' | 'start' | 'between'}
        />
      }
    />
  );
}

const DEMOS: Record<string, () => ReactNode> = {
  select: () => <SelectDemo />,
  table: () => <TableDemo />,
  card: () => <CardDemo />,
  choicecard: () => <ChoiceCardDemo />,
  statfilter: () => <StatFilterDemo />,
  tooltip: () => <TooltipDemo />,
  browserframe: () => <BrowserFrameDemo />,
  resetbutton: () => <ResetDemo />,
  segmented: () => <SegmentedDemo />,
  chips: () => <ChipsDemo />,
  switch: () => <SwitchDemo />,
  button: () => <ButtonDemo />,
  checkbox: () => <CheckboxDemo />,
  'checkbox-group': () => <CheckboxGroupDemo />,
  input: () => <InputDemo />,
  dialog: () => <DialogDemo />,
  menu: () => <MenuDemo />,
  accordion: () => <AccordionDemo />,
  sidenav: () => <SideNavDemo />,
  headernav: () => <HeaderNavDemo />,
  banner: () => <BannerDemo />,
  toast: () => <ToastDemo />,
  progress: () => <ProgressDemo />,
  loader: () => <LoaderDemo />,
  skeleton: () => <SkeletonDemo />,
  tag: () => <TagDemo />,
  'form-group': () => <FormGroupDemo />,
  icons: () => <IconsDemo />,
  tabs: () => <TabsDemo />,
  breadcrumbs: () => <BreadcrumbsDemo />,
  stepper: () => <StepperDemo />,
  statusmark: () => <StatusMarkDemo />,
  link: () => <LinkDemo />,
  'statusmark-gallery': () => <StatusMarkGallery />,
  tiles: () => <TilesDemo />,
  textarea: () => <TextAreaDemo />,
  radio: () => <RadioDemo />,
  'radio-group': () => <RadioGroupDemo />,
};

document.querySelectorAll<HTMLElement>('[data-react]').forEach((el) => {
  const demo = DEMOS[el.dataset.react || ''];
  if (!demo) return;
  createRoot(el).render(
    <StrictMode>
      <MemoryRouter initialEntries={['/jobs']}>{demo()}</MemoryRouter>
    </StrictMode>,
  );
});
