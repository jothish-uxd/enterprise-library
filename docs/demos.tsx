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
  BrowserFrame, ChipGroup, ChoiceCard, MultiSelect, ResetButton, SegmentedControl, Select, SortHeader, StatFilter, TableCheck, TableEmpty, Tooltip,
  useFrameHistory, type SortDirection,
} from '../src';

/* ---------- Select ---------- */
function SelectDemo() {
  const [job, setJob] = useState('');
  const [metric, setMetric] = useState('Recall');
  return (
    <div className="lib-row lib-row--top">
      <div style={{ width: 260 }}>
        <Select label="Job" value={job} placeholder="Choose a job" onChange={setJob} describedBy="sel-help"
          options={[{ value: 'REQ-4471', label: 'Starfighter Pilot L4' }, { value: 'REQ-4502', label: 'Hangar Mechanic L3' }, { value: 'REQ-4519', label: 'Intelligence Analyst L5' }]} />
        <p className="field-help" id="sel-help" style={{ marginTop: 6 }}>The job this assessment is for.</p>
      </div>
      <Select label="Metric" inline value={metric} onChange={setMetric}
        options={['Precision', 'Recall', 'F1 score'].map((m) => ({ value: m, label: m }))} />
      <p className="t-small muted" aria-live="polite">{job ? `Chosen: ${job}` : 'No job chosen yet'}</p>
    </div>
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

/* ---------- ChipGroup ---------- */
const MESSAGES = [
  { s: 'open', ch: ['email'] }, { s: 'open', ch: ['teams'] }, { s: 'escalated', ch: ['whatsapp'] }, { s: 'cleared', ch: ['email'] },
  { s: 'open', ch: ['bloomberg'] }, { s: 'escalated', ch: ['email'] }, { s: 'cleared', ch: ['teams'] }, { s: 'open', ch: ['sms'] },
];
type Status = 'all' | 'open' | 'escalated' | 'cleared';
const CHANNELS = ['email', 'teams', 'bloomberg', 'whatsapp', 'sms'] as const;
type Channel = typeof CHANNELS[number];
const CH_LABEL: Record<Channel, string> = { email: 'Email', teams: 'Teams', bloomberg: 'Bloomberg Chat', whatsapp: 'WhatsApp', sms: 'Text message' };
function ChipsDemo() {
  const [status, setStatus] = useState<Status>('all');
  const [channels, setChannels] = useState<Channel[]>(['email', 'teams']);
  const statuses: Status[] = ['all', 'open', 'escalated', 'cleared'];
  const byStatus = (s: Status) => MESSAGES.filter((m) => s === 'all' || m.s === s);
  const shown = byStatus(status).filter((m) => channels.length === 0 || m.ch.some((c) => channels.includes(c as Channel)));
  return (
    <>
      <div className="lib-fieldset">
        <p className="t-label" id="chips-ch-l">Channels (choose any)</p>
        <ChipGroup multiple label="Filter by channel" controls="chips-out" value={channels} onChange={setChannels}
          options={CHANNELS.map((c) => ({ value: c, label: CH_LABEL[c], count: MESSAGES.filter((m) => m.ch.includes(c)).length }))} />
      </div>
      <div className="lib-fieldset">
        <p className="t-label">Status (choose one)</p>
        <ChipGroup label="Filter by status" size="sm" controls="chips-out" value={status} onChange={setStatus}
          options={statuses.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1), count: byStatus(s).length }))} />
      </div>
      <p id="chips-out" className="t-small muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? 'message' : 'messages'}{channels.length ? ` in ${channels.map((c) => CH_LABEL[c]).join(', ')}` : ' in every channel'}.
        {channels.length > 0 && <> <button type="button" className="link-button" onClick={() => setChannels([])}>Clear channels</button></>}
      </p>
    </>
  );
}

/* ---------- MultiSelect ---------- */
const CHANNEL_OPTS = ['Email', 'Teams', 'Bloomberg Chat', 'WhatsApp', 'Text message', 'Slack', 'Zoom chat', 'LinkedIn messages', 'Voice'].map((l) => ({ value: l.toLowerCase().replace(/ /g, '-'), label: l }));
function MultiSelectDemo() {
  const [chosen, setChosen] = useState<string[]>(['email', 'teams', 'whatsapp']);
  const [none, setNone] = useState<string[]>([]);
  return (
    <div className="lib-row lib-row--top">
      <div style={{ width: 280 }}>
        <MultiSelect label="Channels to review" value={chosen} onChange={setChosen} options={CHANNEL_OPTS} describedBy="ms-help" placeholder="Choose channels" />
        <p className="field-help" id="ms-help" style={{ marginTop: 6 }}>Messages from these channels go to review.</p>
      </div>
      <div style={{ width: 220 }}>
        <MultiSelect label="Channel" value={none} onChange={setNone} options={CHANNEL_OPTS} placeholder="Any channel" />
      </div>
      <p className="t-small muted" aria-live="polite">{chosen.length} channels chosen.</p>
    </div>
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
  multiselect: () => <MultiSelectDemo />,
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
