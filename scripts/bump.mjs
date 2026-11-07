// Every push is a new version. Raises the patch number (0.3.0 -> 0.3.1), or sets
// an exact one: `npm run bump` or `npm run bump -- 0.4.0`.
// Updates package.json, package-lock.json, the README install line, and the
// docs page's badge, install commands and version note. The CHANGELOG entry is
// written by hand.
import { readFileSync, writeFileSync } from 'node:fs';

const read = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const write = (f, s) => writeFileSync(new URL(`../${f}`, import.meta.url), s);

const pkg = JSON.parse(read('package.json'));
const from = pkg.version;
const [maj, min, pat] = from.split('.').map(Number);
const to = process.argv[2] ?? `${maj}.${min}.${pat + 1}`;
if (!/^\d+\.\d+\.\d+$/.test(to)) { console.error(`Not a version: ${to}`); process.exit(1); }

pkg.version = to;
write('package.json', `${JSON.stringify(pkg, null, 2)}\n`);

try {
  const lock = JSON.parse(read('package-lock.json'));
  lock.version = to;
  if (lock.packages?.['']) lock.packages[''].version = to;
  write('package-lock.json', `${JSON.stringify(lock, null, 2)}\n`);
} catch { /* no lockfile */ }

const tag = (s) => s.replaceAll(`enterprise-library#v${from}`, `enterprise-library#v${to}`);
write('README.md', tag(read('README.md')));
write('index.html', tag(read('index.html'))
  .replace(/<span class="badge">v[\d.]+<\/span>/, `<span class="badge">v${to}</span>`)
  .replace(/<p class="note">Version [\d.]+:/, `<p class="note">Version ${to}:`));

console.log(`${from} -> ${to}. Add a "## ${to}" entry to CHANGELOG.md.`);
