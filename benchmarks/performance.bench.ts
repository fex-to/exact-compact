import { performance } from 'node:perf_hooks';

import { PreciseCompact } from '../src/formatter';

interface BenchmarkCase {
  name: string;
  value: number;
  locale: string;
  currency?: string;
}

interface BenchmarkResult {
  case: string;
  smartCompactTime: number;
  nativeCompactTime: number;
  nativeRegularTime: number;
  smartCompactOps: number;
  nativeCompactOps: number;
  nativeRegularOps: number;
  speedupVsCompact: number;
  speedupVsRegular: number;
  output: string;
}

const ITERATIONS = 100_000;
const WARMUP_RUNS = 1000;

const benchmarkCases: BenchmarkCase[] = [
  // Exact numbers - compact format
  { name: 'Exact 1K', value: 1000, locale: 'en-US' },
  { name: 'Exact 1.5K', value: 1500, locale: 'en-US' },
  { name: 'Exact 1M', value: 1000000, locale: 'en-US' },
  { name: 'Exact 1.23M', value: 1230000, locale: 'en-US' },
  { name: 'Exact 1B', value: 1000000000, locale: 'en-US' },

  // Non-exact numbers - regular format
  { name: 'Non-exact 1.15K', value: 1150, locale: 'en-US' },
  { name: 'Non-exact 1.234M', value: 1234567, locale: 'en-US' },

  // Below 1000 - regular format
  { name: 'Small 500', value: 500, locale: 'en-US' },
  { name: 'Small 999.99', value: 999.99, locale: 'en-US' },

  // With currency
  { name: 'Exact 1K EUR', value: 1000, locale: 'cs-CZ', currency: 'EUR' },
  { name: 'Non-exact 1.15K EUR', value: 1150, locale: 'cs-CZ', currency: 'EUR' },

  // Different locales
  { name: 'Chinese 1万', value: 10000, locale: 'zh-CN' },
  { name: 'Japanese 1万', value: 10000, locale: 'ja-JP' },
  { name: 'Indian 1 लाख', value: 100000, locale: 'hi-IN' },
];

function warmup(fn: () => void, runs: number): void {
  for (let i = 0; i < runs; i++) {
    fn();
  }
}

function benchmark(fn: () => void, iterations: number): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  return end - start;
}

function runBenchmark(testCase: BenchmarkCase): BenchmarkResult {
  const { name, value, locale, currency } = testCase;

  // Create formatters
  const smartFormatter = PreciseCompact({ locale, currency });

  const nativeCompact = new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    ...(currency ? { style: 'currency', currency } : { style: 'decimal' }),
  });

  const nativeRegular = new Intl.NumberFormat(locale, {
    ...(currency ? { style: 'currency', currency } : { style: 'decimal' }),
  });

  // Warmup
  warmup(() => smartFormatter.format(value), WARMUP_RUNS);
  warmup(() => nativeCompact.format(value), WARMUP_RUNS);
  warmup(() => nativeRegular.format(value), WARMUP_RUNS);

  // Run benchmarks
  const smartTime = benchmark(() => smartFormatter.format(value), ITERATIONS);
  const compactTime = benchmark(() => nativeCompact.format(value), ITERATIONS);
  const regularTime = benchmark(() => nativeRegular.format(value), ITERATIONS);

  // Calculate ops/sec
  const smartOps = Math.round((ITERATIONS / smartTime) * 1000);
  const compactOps = Math.round((ITERATIONS / compactTime) * 1000);
  const regularOps = Math.round((ITERATIONS / regularTime) * 1000);

  return {
    case: name,
    smartCompactTime: smartTime,
    nativeCompactTime: compactTime,
    nativeRegularTime: regularTime,
    smartCompactOps: smartOps,
    nativeCompactOps: compactOps,
    nativeRegularOps: regularOps,
    speedupVsCompact: compactTime / smartTime,
    speedupVsRegular: regularTime / smartTime,
    output: smartFormatter.format(value),
  };
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function formatTime(ms: number): string {
  return ms.toFixed(2);
}

function formatSpeedup(speedup: number): string {
  if (speedup > 1) {
    return `${speedup.toFixed(2)}× faster`;
  } else {
    return `${(1 / speedup).toFixed(2)}× slower`;
  }
}

console.log('🚀 Smart Compact Formatter Benchmark\n');
console.log(`Iterations: ${formatNumber(ITERATIONS)}`);
console.log(`Warmup runs: ${formatNumber(WARMUP_RUNS)}`);
console.log(`Node: ${process.version}`);
console.log(`Platform: ${process.platform} ${process.arch}\n`);

const results: BenchmarkResult[] = [];

for (const testCase of benchmarkCases) {
  process.stdout.write(`Running: ${testCase.name}...`);
  const result = runBenchmark(testCase);
  results.push(result);
  console.log(' ✓');
}

console.log('\n📊 Results:\n');
console.log(
  '┌─────────────────────────┬──────────────────┬─────────────┬─────────────┬─────────────┐',
);
console.log(
  '│ Case                    │ Output           │ Smart (ms)  │ Compact (ms)│ Regular (ms)│',
);
console.log(
  '├─────────────────────────┼──────────────────┼─────────────┼─────────────┼─────────────┤',
);

for (const result of results) {
  const caseName = result.case.padEnd(23);
  const output = result.output.substring(0, 16).padEnd(16);
  const smartTime = formatTime(result.smartCompactTime).padStart(11);
  const compactTime = formatTime(result.nativeCompactTime).padStart(11);
  const regularTime = formatTime(result.nativeRegularTime).padStart(11);

  console.log(`│ ${caseName} │ ${output} │ ${smartTime} │ ${compactTime} │ ${regularTime} │`);
}

console.log(
  '└─────────────────────────┴──────────────────┴─────────────┴─────────────┴─────────────┘\n',
);

console.log('📈 Operations per second:\n');
console.log('┌─────────────────────────┬──────────────┬──────────────┬──────────────┐');
console.log('│ Case                    │ Smart ops/s  │ Compact ops/s│ Regular ops/s│');
console.log('├─────────────────────────┼──────────────┼──────────────┼──────────────┤');

for (const result of results) {
  const caseName = result.case.padEnd(23);
  const smartOps = formatNumber(result.smartCompactOps).padStart(12);
  const compactOps = formatNumber(result.nativeCompactOps).padStart(12);
  const regularOps = formatNumber(result.nativeRegularOps).padStart(12);

  console.log(`│ ${caseName} │ ${smartOps} │ ${compactOps} │ ${regularOps} │`);
}

console.log('└─────────────────────────┴──────────────┴──────────────┴──────────────┘\n');

console.log('⚡ Performance comparison:\n');
console.log('┌─────────────────────────┬──────────────────────┬──────────────────────┐');
console.log('│ Case                    │ vs Native Compact    │ vs Native Regular    │');
console.log('├─────────────────────────┼──────────────────────┼──────────────────────┤');

for (const result of results) {
  const caseName = result.case.padEnd(23);
  const vsCompact = formatSpeedup(result.speedupVsCompact).padStart(20);
  const vsRegular = formatSpeedup(result.speedupVsRegular).padStart(20);

  console.log(`│ ${caseName} │ ${vsCompact} │ ${vsRegular} │`);
}

console.log('└─────────────────────────┴──────────────────────┴──────────────────────┘\n');

// Summary statistics
const avgSmartTime = results.reduce((sum, r) => sum + r.smartCompactTime, 0) / results.length;
const avgCompactTime = results.reduce((sum, r) => sum + r.nativeCompactTime, 0) / results.length;
const avgRegularTime = results.reduce((sum, r) => sum + r.nativeRegularTime, 0) / results.length;

const avgSpeedupVsCompact = avgCompactTime / avgSmartTime;
const avgSpeedupVsRegular = avgRegularTime / avgSmartTime;

console.log('📋 Summary:\n');
console.log(`Average time per ${formatNumber(ITERATIONS)} iterations:`);
console.log(`  Smart Compact: ${formatTime(avgSmartTime)} ms`);
console.log(`  Native Compact: ${formatTime(avgCompactTime)} ms`);
console.log(`  Native Regular: ${formatTime(avgRegularTime)} ms\n`);

console.log('Average performance:');
console.log(`  Smart vs Native Compact: ${formatSpeedup(avgSpeedupVsCompact)}`);
console.log(`  Smart vs Native Regular: ${formatSpeedup(avgSpeedupVsRegular)}\n`);

// Find best and worst cases
const bestVsCompact = results.reduce((best, r) =>
  r.speedupVsCompact > best.speedupVsCompact ? r : best,
);
const worstVsCompact = results.reduce((worst, r) =>
  r.speedupVsCompact < worst.speedupVsCompact ? r : worst,
);

console.log('🏆 Best case (vs Native Compact):');
console.log(`  ${bestVsCompact.case}: ${formatSpeedup(bestVsCompact.speedupVsCompact)}`);
console.log(`  Output: ${bestVsCompact.output}\n`);

console.log('🐌 Worst case (vs Native Compact):');
console.log(`  ${worstVsCompact.case}: ${formatSpeedup(worstVsCompact.speedupVsCompact)}`);
console.log(`  Output: ${worstVsCompact.output}\n`);

// Save results to file
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const markdown = `# Smart Compact Formatter Benchmark

Generated: ${new Date().toISOString()}
Iterations: ${formatNumber(ITERATIONS)}
Warmup runs: ${formatNumber(WARMUP_RUNS)}
Node: ${process.version}
Platform: ${process.platform} ${process.arch}

## Results

| Case | Output | Smart (ms) | Compact (ms) | Regular (ms) | Smart ops/s | vs Compact | vs Regular |
|------|--------|------------|--------------|--------------|-------------|------------|------------|
${results
  .map(
    (r) =>
      `| ${r.case} | ${r.output} | ${formatTime(r.smartCompactTime)} | ${formatTime(r.nativeCompactTime)} | ${formatTime(r.nativeRegularTime)} | ${formatNumber(r.smartCompactOps)} | ${formatSpeedup(r.speedupVsCompact)} | ${formatSpeedup(r.speedupVsRegular)} |`,
  )
  .join('\n')}

## Summary

### Average Performance
- Smart Compact: ${formatTime(avgSmartTime)} ms
- Native Compact: ${formatTime(avgCompactTime)} ms
- Native Regular: ${formatTime(avgRegularTime)} ms

### Comparison
- Smart vs Native Compact: ${formatSpeedup(avgSpeedupVsCompact)}
- Smart vs Native Regular: ${formatSpeedup(avgSpeedupVsRegular)}

### Best/Worst Cases
**Best** (vs Native Compact): ${bestVsCompact.case} - ${formatSpeedup(bestVsCompact.speedupVsCompact)}

**Worst** (vs Native Compact): ${worstVsCompact.case} - ${formatSpeedup(worstVsCompact.speedupVsCompact)}
`;

const outputPath = join(process.cwd(), 'benchmarks', 'performance-report.md');
writeFileSync(outputPath, markdown, 'utf-8');

console.log(`✅ Results saved to: ${outputPath}`);
