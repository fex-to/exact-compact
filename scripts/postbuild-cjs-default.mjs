// comments in English only
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('dist/i18n');
if (!fs.existsSync(dir)) process.exit(0);

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.cjs')) continue;
  const p = path.join(dir, f);
  const txt = fs.readFileSync(p, 'utf8');
  if (!txt.includes('module.exports.default')) {
    fs.writeFileSync(p, txt + '\nmodule.exports.default = module.exports;\n', 'utf8');
  }
}
console.log('✔ CJS default shims added to dist/i18n/*.cjs');
