import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library
  {
    entry: { index: 'src/precise-compact.ts' },
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    esbuildOptions(options) {
      options.charset = 'utf8';
    },
    treeshake: true,
    splitting: false,
    // Emit .mjs for ESM and .cjs for CJS to match package.json
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs',
    }),
  },

  // Per-locale files: use a GLOB ARRAY, not an object with a wildcard key
  {
    entry: ['i18n/*.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    treeshake: true,
    splitting: false,
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs',
    }),
  },
]);
