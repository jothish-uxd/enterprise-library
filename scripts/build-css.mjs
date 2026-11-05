// Ship the stylesheets: one bundled styles.css (imports inlined) plus each file under dist/css.
import { mkdirSync, readFileSync, writeFileSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const src = 'src/styles';
mkdirSync('dist/css', { recursive: true });
for (const f of readdirSync(src)) if (f.endsWith('.css') && f !== 'index.css') copyFileSync(join(src, f), join('dist/css', f));
copyFileSync(join(src, 'tokens.css'), 'dist/tokens.css');

const index = readFileSync(join(src, 'index.css'), 'utf8');
const bundled = index.replace(/@import "\.\/([^"]+)";/g, (_, f) => `/* ---- ${f} ---- */\n${readFileSync(join(src, f), 'utf8').trim()}\n`);
writeFileSync('dist/styles.css', bundled);
console.log('Wrote dist/styles.css and dist/css/*.css');
