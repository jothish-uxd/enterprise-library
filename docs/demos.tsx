/*
  Live demos for the docs page (index.html). Built into docs/demos.js with `npm run build:docs`
  and committed, so GitHub Pages serves the page with no build step.
  Each demo mounts into a [data-react="name"] element with its own in-memory router,
  so nothing here touches the page's own hash routing.
*/
import React, { StrictMode, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import {
  BrowserFrame, Button, Checkbox, CheckboxGroup, Input, Radio, RadioGroup, ChipGroup, ChoiceCard, MultiSelect, ResetButton, SegmentedControl, Select, SortHeader, StatFilter, Switch, TableCheck, TableEmpty, Tooltip,
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
  const [sort, setSort] = useState<{ key: 'name' | 'score'; dir: SortDirection }>({ key: 'score', dir: 'descending' });
  const [chosen, setChosen] = useState<string[]>(['C-0451']);
  const [query, setQuery] = useState('');
  const rows = PEOPLE.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (sort.key === 'score' ? a.score - b.score : a.name.localeCompare(b.name)) * (sort.dir === 'ascending' ? 1 : -1));
  const all = rows.length > 0 && rows.every((r) => chosen.includes(r.id));
  const some = rows.some((r) => chosen.includes(r.id));
  return (
    <>
      <div className="lib-row">
        <div className="field" style={{ width: 240 }}>
          <label className="field__label" htmlFor="tbl-q">Filter by name</label>
          <input id="tbl-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “Vader”" />
        </div>
        <p className="t-small muted" aria-live="polite">{chosen.length} chosen</p>
      </div>
      <div className="table-wrap lib-scroll" data-scroll="">
        <table className="table table--selectable table--sticky">
          <caption className="visually-hidden">Candidates, sortable by name and score</caption>
          <thead>
            <tr>
              <TableCheck header checked={all} indeterminate={some && !all} label={`Choose all ${rows.length} candidates`}
                onChange={(c) => setChosen(c ? Array.from(new Set([...chosen, ...rows.map((r) => r.id)])) : chosen.filter((id) => !rows.some((r) => r.id === id)))} />
              <SortHeader sort={sort.key === 'name' ? sort.dir : undefined} onSort={(dir) => setSort({ key: 'name', dir })}>Name</SortHeader>
              <th scope="col">ID</th>
              <th scope="col">Job</th>
              <SortHeader numeric sort={sort.key === 'score' ? sort.dir : undefined} onSort={(dir) => setSort({ key: 'score', dir })}>Score</SortHeader>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const on = chosen.includes(p.id);
              return (
                <tr key={p.id} className={on ? 'is-selected' : undefined}>
                  <TableCheck checked={on} label={`Choose ${p.name}`} onChange={(c) => setChosen(c ? [...chosen, p.id] : chosen.filter((x) => x !== p.id))} />
                  <th scope="row"><a className="row-link" href="#table" onClick={(e) => e.preventDefault()}>{p.name}</a></th>
                  <td><code>{p.id}</code></td>
                  <td>{p.job}</td>
                  <td className="num">{p.score}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <TableEmpty colSpan={5} title="No candidates match"
                action={<button type="button" className="btn btn--secondary btn--sm" onClick={() => setQuery('')}>Clear filter</button>}>
                Nobody’s name contains “{query.trim()}”.
              </TableEmpty>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------- ChoiceCard ---------- */
const PLANS = [
  { value: 'standard', title: 'Standard', desc: 'Webcam check at the start and end.', meta: 'ID · WEBCAM' },
  { value: 'live', title: 'Live proctor', desc: 'A proctor watches the whole session.', meta: 'ID · WEBCAM · SCREEN' },
  { value: 'none', title: 'Unproctored', desc: 'Not allowed for evaluated modules.', meta: 'NONE', disabled: true },
];
function ChoiceDemo() {
  const [plan, setPlan] = useState('standard');
  const [tools, setTools] = useState<string[]>(['calc']);
  return (
    <>
      <fieldset className="lib-fieldset">
        <legend className="t-label">Proctoring</legend>
        <div className="card-grid" style={{ ['--card-min' as string]: '200px' }}>
          {PLANS.map((p) => (
            <ChoiceCard key={p.value} name="demo-plan" value={p.value} checked={plan === p.value} onChange={() => setPlan(p.value)}
              title={p.title} description={p.desc} meta={p.meta} disabled={p.disabled} />
          ))}
        </div>
      </fieldset>
      <fieldset className="lib-fieldset">
        <legend className="t-label">Allowed tools</legend>
        <div className="card-list" style={{ maxWidth: 360 }}>
          {[{ v: 'calc', t: 'Calculator' }, { v: 'notes', t: 'Scratch notes' }].map((o) => (
            <ChoiceCard key={o.v} type="checkbox" compact name="demo-tools" value={o.v} checked={tools.includes(o.v)} title={o.t}
              onChange={(c) => setTools(c ? [...tools, o.v] : tools.filter((x) => x !== o.v))} />
          ))}
        </div>
      </fieldset>
    </>
  );
}

/* ---------- StatFilter ---------- */
const STAGES = { All: 132, Applied: 76, Screening: 31, Assessment: 18, Interview: 6, Offer: 1, Hired: 0 } as const;
type Stage = keyof typeof STAGES;
function StatFilterDemo() {
  const [stage, setStage] = useState<Stage>('Assessment');
  return (
    <>
      <StatFilter label="Pipeline. Choose a stage to list its candidates" controls="sf-out" value={stage} onChange={setStage}
        items={(Object.keys(STAGES) as Stage[]).map((k) => ({ value: k, label: k, count: STAGES[k] }))} />
      <p id="sf-out" className="t-small muted" aria-live="polite">Showing <strong>{stage}</strong>: {STAGES[stage]} candidates.</p>
    </>
  );
}

/* ---------- Tooltip ---------- */
const FlagIcon = () => <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 14V2.5h8l-1.5 3 1.5 3h-8" fill="currentColor" /></svg>;
const InfoIcon = () => <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6.2" /><path d="M8 7.2v3.8M8 5h.01" /></svg>;
function TooltipHoverDemo() {
  return (
    <div className="lib-row">
      <p className="t-body-sm">Message from San Hill, flagged&nbsp;
        <Tooltip label="2 policy matches, 1 open" content={<>
          <p className="tooltip__title">Policy matches</p>
          <dl className="tooltip__dl"><div><dt>Bribery</dt><dd>Open</dd></div><div><dt>Gifts and entertainment</dt><dd>Cleared</dd></div></dl>
          <p className="tooltip__note">From the nightly scan.</p>
        </>}>
          <FlagIcon /> 2
        </Tooltip>
      </p>
    </div>
  );
}
function TooltipClickDemo() {
  return (
    <div className="lib-row">
      <span className="field__label" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        Proctoring
        <Tooltip trigger="click" label="About proctoring" className="tooltip-trigger--info" content={<>
          <p className="tooltip__title">Proctoring</p>
          <p>A webcam check at the start and end of the assessment. Candidates are told before they begin.</p>
          <p className="tooltip__links"><a href="#radio-group">Proctoring options</a><a href="#compliance">Data retention</a></p>
        </>}>
          <InfoIcon />
        </Tooltip>
      </span>
      <button type="button" className="btn btn--secondary btn--sm">Next thing in the Tab order</button>
    </div>
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

/* ---------- ResetButton ---------- */
function ResetDemo() {
  const { pathname } = useLocation();
  return (
    <div className="lib-row">
      <ResetButton what="demo" description="Nothing is stored on this page, so this only shows the confirm." done="Demo reset." to="/" onReset={() => {}} />
      <span className="t-small muted">Choose the icon. {pathname !== '/' ? '' : 'Focus starts on Cancel.'}</span>
    </div>
  );
}

/* ---------- SegmentedControl ---------- */
const ASSETS = [
  { name: 'X-wing schematic', kind: 'images' }, { name: 'Cantina sign', kind: 'images' }, { name: 'Shipment chart', kind: 'charts' },
  { name: 'Briefing', kind: 'video' }, { name: 'Intercept', kind: 'audio' }, { name: 'Customer call', kind: 'audio' },
  { name: 'Astromech manual', kind: 'documents' }, { name: 'Fuel chart', kind: 'charts' }, { name: 'Hangar walk-through', kind: 'video' },
];
type Kind = 'all' | 'images' | 'video' | 'audio' | 'documents' | 'charts';
const GridIcon = () => <svg viewBox="0 0 16 16"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="9" y="2.5" width="4.5" height="4.5" rx="1" /><rect x="2.5" y="9" width="4.5" height="4.5" rx="1" /><rect x="9" y="9" width="4.5" height="4.5" rx="1" /></svg>;
const ListIcon = () => <svg viewBox="0 0 16 16"><path d="M6 4h7.5M6 8h7.5M6 12h7.5M2.5 4h.01M2.5 8h.01M2.5 12h.01" /></svg>;
function SegmentedDemo() {
  const [kind, setKind] = useState<Kind>('video');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [range, setRange] = useState<'7' | '30' | '90'>('30');
  const kinds: Kind[] = ['all', 'images', 'video', 'audio', 'documents', 'charts'];
  const count = (k: Kind) => (k === 'all' ? ASSETS.length : ASSETS.filter((a) => a.kind === k).length);
  const shown = ASSETS.filter((a) => kind === 'all' || a.kind === kind);
  return (
    <>
      <div className="lib-row">
        <SegmentedControl label="Type" value={kind} onChange={setKind}
          options={kinds.map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1), count: count(k) }))} />
        <SegmentedControl label="View" iconOnly value={view} onChange={setView}
          options={[{ value: 'grid', label: 'Grid', icon: <GridIcon /> }, { value: 'list', label: 'List', icon: <ListIcon /> }]} />
      </div>
      <p className="t-small muted" aria-live="polite">{shown.length} {shown.length === 1 ? 'asset' : 'assets'}, as a {view}: {shown.map((a) => a.name).join(', ')}.</p>
      <div className="lib-row">
        <SegmentedControl label="Period" showLabel size="sm" value={range} onChange={setRange}
          options={[{ value: '7', label: '7 days' }, { value: '30', label: '30 days' }, { value: '90', label: '90 days' }]} />
      </div>
    </>
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
  const open = `<${tag}\n${attrs.map((a) => `  ${a.value === true ? a.attr : a.expr ? `${a.attr}={${a.value}}` : `${a.attr}="${a.value}"`}`).join('\n')}`;
  const text = children?.length ? `${open}\n>\n${children.map((c) => `  ${c}`).join('\n')}\n</${tag}>` : `${open}\n/>`;
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
        {'<'}<span className="tok-k">{tag}</span>{'\n'}
        {attrs.map((a) => (
          <span key={a.attr}>{'  '}{a.attr}{a.value === true ? null : a.expr ? <>{'={'}{String(a.value).split(/('[^']*')/).map((part, i) => (i % 2 ? <span key={i} className="tok-s">{part}</span> : part))}{'}'}</> : <>=<span className="tok-s">"{a.value}"</span></>}{'\n'}</span>
        ))}
        {children?.length ? <>{'>'}{'\n'}{children.map((c) => <span key={c}>{'  '}{c.startsWith('<') ? <>{'<'}<span className="tok-k">{c.slice(1).split(/[\s/>]/)[0]}</span>{c.slice(1 + c.slice(1).split(/[\s/>]/)[0].length)}</> : c}{'\n'}</span>)}{'</'}<span className="tok-k">{tag}</span>{'>'}</> : '/>'}
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
  choicecard: () => <ChoiceDemo />,
  statfilter: () => <StatFilterDemo />,
  'tooltip-hover': () => <TooltipHoverDemo />,
  'tooltip-click': () => <TooltipClickDemo />,
  browserframe: () => <FrameApp />,
  resetbutton: () => <ResetDemo />,
  segmented: () => <SegmentedDemo />,
  chips: () => <ChipsDemo />,
  switch: () => <SwitchDemo />,
  button: () => <ButtonDemo />,
  checkbox: () => <CheckboxDemo />,
  'checkbox-group': () => <CheckboxGroupDemo />,
  input: () => <InputDemo />,
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
