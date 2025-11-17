import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

import {
  createCompactFormatter,
  type FormatOptions,
  type LocalePack,
} from '../src/precise-compact';
import ru from '../i18n/ru';
import uk from '../i18n/uk';
import de from '../i18n/de';
import fr from '../i18n/fr';
import ar from '../i18n/ar';
import es from '../i18n/es';
import ptBR from '../i18n/pt-BR';
import ja from '../i18n/ja';
import th from '../i18n/th';

const ITERATIONS = Number(process.env.BENCH_ITERS ?? 100_000);
const WARMUP_RUNS = 2;
const REPORT_DIR = path.resolve(process.cwd(), 'benchmarks');
const REPORT_FILE = path.join(REPORT_DIR, 'locale-bench-report.md');
const CPU_INFO = os.cpus();
const HARDWARE_DETAILS = {
  platform: `${os.platform()} ${os.release()} (${os.arch()})`,
  cpu: CPU_INFO?.[0]?.model ?? 'unknown CPU',
  cores: CPU_INFO ? CPU_INFO.length : 0,
  memoryGb: (os.totalmem() / 1024 ** 3).toFixed(1),
};

const fmt = createCompactFormatter();

function registerLocaleVariants(pack: LocalePack, aliases: string[] = []) {
  fmt.registerLocale(pack);
  for (const alias of aliases) {
    fmt.registerLocale({ ...pack, locale: alias });
  }
}

registerLocaleVariants(ru, ['ru-RU']);
registerLocaleVariants(uk, ['uk-UA']);
registerLocaleVariants(de, ['de-DE']);
registerLocaleVariants(fr, ['fr-FR']);
registerLocaleVariants(ar);
registerLocaleVariants(es, ['es-ES']);
registerLocaleVariants(ptBR, ['pt']);
registerLocaleVariants(ja, ['ja-JP']);
registerLocaleVariants(th, ['th-TH']);

const CASES: Array<{
  label: string;
  value: number | bigint;
  options?: FormatOptions;
}> = [
  {
    label: 'en-US – 1 million',
    value: 1_000_000,
    options: { locale: 'en-US' },
  },
  {
    label: 'en-US – 250K (abbr)',
    value: 250_000,
    options: { locale: 'en-US', style: 'abbr' },
  },
  {
    label: 'es-ES – 3.4 million',
    value: 3_400_000,
    options: { locale: 'es-ES' },
  },
  {
    label: 'es-ES – 720 (fallback raw)',
    value: 720,
    options: { locale: 'es-ES' },
  },
  {
    label: 'pt-BR – 4.5 million (abbr)',
    value: 4_500_000,
    options: { locale: 'pt-BR', style: 'abbr' },
  },
  {
    label: 'de-DE – 2.5 million',
    value: 2_500_000,
    options: { locale: 'de-DE' },
  },
  {
    label: 'fr-FR – 9.9 billion',
    value: 9_900_000_000,
    options: { locale: 'fr-FR' },
  },
  {
    label: 'ru-RU – 1.5 thousand',
    value: 1_500,
    options: { locale: 'ru-RU' },
  },
  {
    label: 'ru-RU – 750 (fallback raw)',
    value: 750,
    options: { locale: 'ru-RU' },
  },
  {
    label: 'ru-RU – 2 million (abbr)',
    value: 2_000_000,
    options: { locale: 'ru-RU', style: 'abbr' },
  },
  {
    label: 'uk-UA – 2.1 thousand',
    value: 2_100,
    options: { locale: 'uk-UA' },
  },
  {
    label: 'uk-UA – 3 million (abbr)',
    value: 3_000_000,
    options: { locale: 'uk-UA', style: 'abbr' },
  },
  {
    label: 'ar – 7 million',
    value: 7_000_000,
    options: { locale: 'ar' },
  },
  {
    label: 'ar – 12 million (abbr)',
    value: 12_000_000,
    options: { locale: 'ar', style: 'abbr' },
  },
  {
    label: 'ja-JP – 12 thousand',
    value: 12_000,
    options: { locale: 'ja-JP' },
  },
  {
    label: 'ja-JP – 120 thousand (abbr)',
    value: 120_000,
    options: { locale: 'ja-JP', style: 'abbr' },
  },
  {
    label: 'th-TH – 30 million',
    value: 30_000_000,
    options: { locale: 'th-TH' },
  },
  {
    label: 'th-TH – 45 million (abbr)',
    value: 45_000_000,
    options: { locale: 'th-TH', style: 'abbr' },
  },
];

function benchCase(
  label: string,
  value: number | bigint,
  options: FormatOptions | undefined,
) {
  const sample = fmt.format(value, options);

  // Warmup loops to let the JIT settle per case
  for (let i = 0; i < WARMUP_RUNS; i++) {
    for (let j = 0; j < ITERATIONS; j++) fmt.format(value, options);
  }

  const start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) {
    fmt.format(value, options);
  }
  const end = performance.now();

  const totalMs = end - start;
  const nsPerCall = (totalMs / ITERATIONS) * 1e6;
  const opsPerSec = (ITERATIONS / totalMs) * 1000;

  return {
    label,
    iterations: ITERATIONS,
    totalMs,
    nsPerCall,
    opsPerSec,
    sample,
  };
}

const results = CASES.map((c) => benchCase(c.label, c.value, c.options));
const sortedResults = [...results].sort((a, b) => b.opsPerSec - a.opsPerSec);

const header = `| Case | Sample Output | Iterations | Total ms | ns/op | ops/sec |`;
const divider = `| --- | --- | ---:| ---:| ---:| ---:|`;
const tableLines = sortedResults.map(
  (r) =>
    `| ${r.label} | ${r.sample} | ${r.iterations.toLocaleString('en-US')} | ${r.totalMs.toFixed(
      2,
    )} | ${r.nsPerCall.toFixed(1)} | ${r.opsPerSec.toFixed(0)} |`,
);

console.log(header);
console.log(divider);
tableLines.forEach((line) => console.log(line));

const now = new Date().toISOString();
const report = [
  '# Locale Benchmark',
  '',
  `- Generated: ${now}`,
  `- Iterations per case: ${ITERATIONS.toLocaleString('en-US')}`,
  `- Warmup runs per case: ${WARMUP_RUNS}`,
  `- Total cases: ${CASES.length}`,
  `- Host: ${HARDWARE_DETAILS.platform}`,
  `- CPU: ${HARDWARE_DETAILS.cpu} x${HARDWARE_DETAILS.cores}`,
  `- RAM: ${HARDWARE_DETAILS.memoryGb} GB`,
  '',
  '## Results',
  header,
  divider,
  ...tableLines,
  '',
  '_Generated via `scripts/bench.ts`_',
  '',
].join('\n');

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(REPORT_FILE, report, 'utf8');

const relativeReportFile = path.relative(process.cwd(), REPORT_FILE);
console.log(`\nSaved report to ${relativeReportFile}`);
