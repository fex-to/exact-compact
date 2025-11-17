
import { globSync } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

const locales = globSync('i18n/*.ts').map((p) => path.basename(p, '.ts'));

const header =
  `// Auto-generated. Do not edit.\n` +
  `// Ambient module declarations for @fex-to/precise-compact i18n packs.\n\n` +
  `declare module '@fex-to/precise-compact' {\n` +
  `  export interface LocalePack {\n` +
  `    locale: string;\n` +
  `    labels: Record<string, { words: string; abbr: string } | undefined>;\n` +
  `    rules?: {\n` +
  `      rtl?: boolean;\n` +
  `      joiner?: '' | ' ' | '\\u00A0' | '\\u202F';\n` +
  `      unitOrder?: 'after' | 'before';\n` +
  `      resolveLabel?: (\n` +
  `        unitKey: string,\n` +
  `        base: { words: string; abbr: string },\n` +
  `        factor: number,\n` +
  `        style: 'words' | 'abbr'\n` +
  `      ) => string;\n` +
  `      finalize?: (text: string) => string;\n` +
  `    };\n` +
  `  }\n` +
  `}\n\n`;

const body = locales
  .map(
    (loc) =>
      `declare module '@fex-to/precise-compact/i18n/${loc}' {\n` +
      `  import type { LocalePack } from '@fex-to/precise-compact';\n` +
      `  const locale: LocalePack;\n` +
      `  export default locale;\n` +
      `}\n`,
  )
  .join('\n');

fs.mkdirSync('types', { recursive: true });
fs.writeFileSync('types/i18n.d.ts', header + body);
console.log(`✔ Generated types/i18n.d.ts for ${locales.length} locales`);
