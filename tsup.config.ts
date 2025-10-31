import { globSync } from 'glob';
import path from 'node:path';
import { defineConfig } from 'tsup';

const localeFiles = globSync('i18n/*.ts');
const localeEntries = Object.fromEntries(
  localeFiles.map((p) => {
    const base = path.basename(p, '.ts'); // e.g. 'en', 'ru'
    return [`i18n/${base}`, p]; // dist/i18n/{base}.{mjs,cjs}
  }),
);

export default defineConfig([
  // Core bundle (+ d.ts)
  {
    entry: { index: 'src/precise-compact.ts' },
    format: ['esm', 'cjs'],
    dts: { entry: { index: 'src/precise-compact.ts' } },
    sourcemap: true,
    clean: true,
    target: 'es2020',
    treeshake: true,
    skipNodeModulesBundle: true,
    splitting: false,
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
  },
  // Locales: JS only, без d.ts и без sourcemap
  {
    entry: localeEntries,
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: false,
    sourcemap: false, // меньше мусора
    clean: false,
    target: 'es2020',
    treeshake: true,
    skipNodeModulesBundle: true,
    splitting: false,
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
  },
]);
