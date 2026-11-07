/*
  Live demos for the docs page (index.html). Built into docs/demos.js with `npm run build:docs`
  and committed, so GitHub Pages serves the page with no build step.
  Each demo mounts into a [data-react="name"] element with its own in-memory router,
  so nothing here touches the page's own hash routing.
*/
import React, { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import {
  BrowserFrame, Button, Card, Checkbox, CheckboxGroup, Input, Radio, RadioGroup, TextArea, ChipGroup, ChoiceCard, MultiSelect, ResetButton, SegmentedControl, Select, SortHeader, StatFilter, Switch, TableCheck, Tile, Tiles, TableEmpty, Tooltip,
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
      name="ChoiceCard"
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
      name="StatFilter"
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
function FrameApp() {
  const { pathname, nav, scrollRef } = useFrameHistory();
  const navigate = useNavigate();
  const page = pathname.slice(1) || 'jobs';
  return (
    <div className="lib-frame">
      <BrowserFrame host="hire.example" path={pathname} nav={nav} end={<span className="lib-avatar" aria-hidden="true">LO</span>}>
        <div className="lib-frame__app" ref={scrollRef as React.RefObject<HTMLDivElement>} data-scroll="">
          <nav aria-label="Demo app"><ul className="lib-frame__tabs">{FRAME_PAGES.map((p) => (
            <li key={p}><button type="button" aria-current={page === p ? 'page' : undefined} onClick={() => navigate(`/${p}`)}>{p[0].toUpperCase() + p.slice(1)}</button></li>
          ))}</ul></nav>
          <p className="t-body-sm muted">You’re on {page}. Visit another page, then use Back and Forward in the bar: they only move through pages visited inside the frame.</p>
        </div>
      </BrowserFrame>
    </div>
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
      name="ResetButton"
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

/* ---------- Playground: one component, controls beside it, code below ---------- */
type PgValue = string | boolean;
type PgControl =
  | { kind: 'text'; key: string; label: string; help?: string }
  | { kind: 'boolean'; key: string; label: string; help?: string }
  | { kind: 'select'; key: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'segmented'; key: string; label: string; options: { value: string; label: string }[] };
type PgCodeLine = { attr: string; value: string | true; expr?: boolean };

function PgCode({ file, tag, attrs, children }: { file: string; tag: string; attrs: PgCodeLine[]; children?: string[] }) {
  const [copied, setCopied] = useState<'' | 'ok' | 'fail'>('');
  const open = !attrs.length ? `<${tag}` : `<${tag}\n${attrs.map((a) => `  ${a.value === true ? a.attr : a.expr ? `${a.attr}={${a.value}}` : `${a.attr}="${a.value}"`}`).join('\n')}`;
  const close = attrs.length ? '\n>' : '>';
  const text = children?.length ? `${open}${close}\n${children.map((c) => `  ${c}`).join('\n')}\n</${tag}>` : `${open}${attrs.length ? '\n' : ' '}/>`;
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
        {'<'}<span className="tok-k">{tag}</span>{attrs.length ? '\n' : null}
        {attrs.map((a) => (
          <span key={a.attr}>{'  '}{a.attr}{a.value === true ? null : a.expr ? <>{'={'}{String(a.value).split(/('[^']*')/).map((part, i) => (i % 2 ? <span key={i} className="tok-s">{part}</span> : part))}{'}'}</> : <>=<span className="tok-s">"{a.value}"</span></>}{'\n'}</span>
        ))}
        {children?.length ? <>{attrs.length ? '>' : '>'}{'\n'}{children.map((c) => <span key={c}>{'  '}{c.startsWith('<') ? <>{'<'}<span className="tok-k">{c.slice(1).split(/[\s/>]/)[0]}</span>{c.slice(1 + c.slice(1).split(/[\s/>]/)[0].length)}</> : c}{'\n'}</span>)}{'</'}<span className="tok-k">{tag}</span>{'>'}</> : attrs.length ? '/>' : ' />'}
      </code></pre>
      <p className="visually-hidden" role="status" aria-live="polite">{copied === 'ok' ? `Copied ${file} to clipboard.` : copied === 'fail' ? `Couldn't copy ${file}. Select the text and copy it manually.` : ''}</p>
    </div>
  );
}

function Playground({ name, controls, values, set, preview, file, tag, attrs, wide, compact, codeChildren }: {
  wide?: boolean; compact?: boolean | number; codeChildren?: string[]; name: string; controls: PgControl[]; values: Record<string, PgValue>; set: (key: string, v: PgValue) => void;
  preview: ReactNode; file: string; tag: string; attrs: PgCodeLine[];
}) {
  const id = React.useId();
  return (
    <div className={`pg${compact ? ' pg--compact' : ''}`} style={typeof compact === 'number' ? { ['--pg-h' as string]: `${compact}px` } : undefined}>
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
      <PgCode file={file} tag={tag} attrs={attrs} children={codeChildren} />
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
  browserframe: () => <FrameApp />,
  resetbutton: () => <ResetDemo />,
  segmented: () => <SegmentedDemo />,
  chips: () => <ChipsDemo />,
  switch: () => <SwitchDemo />,
  button: () => <ButtonDemo />,
  checkbox: () => <CheckboxDemo />,
  'checkbox-group': () => <CheckboxGroupDemo />,
  input: () => <InputDemo />,
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
