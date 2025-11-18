# Smart Compact Formatter Benchmark

Generated: 2025-11-18T09:43:41.232Z
Iterations: 100,000
Warmup runs: 1,000
Node: v24.7.0
Platform: darwin arm64

## Results

| Case | Output | Smart (ms) | Compact (ms) | Regular (ms) | Smart ops/s | vs Compact | vs Regular |
|------|--------|------------|--------------|--------------|-------------|------------|------------|
| Exact 1K | 1K | 31.20 | 26.79 | 24.32 | 3,204,683 | 1.16× slower | 1.28× slower |
| Exact 1.5K | 1.5K | 33.63 | 31.36 | 26.18 | 2,973,716 | 1.07× slower | 1.28× slower |
| Exact 1M | 1M | 29.97 | 28.75 | 29.65 | 3,336,215 | 1.04× slower | 1.01× slower |
| Exact 1.23M | 1.23M | 33.85 | 31.96 | 28.67 | 2,954,472 | 1.06× slower | 1.18× slower |
| Exact 1B | 1B | 30.68 | 28.96 | 33.20 | 3,258,983 | 1.06× slower | 1.08× faster |
| Non-exact 1.15K | 1,150 | 29.34 | 33.40 | 24.88 | 3,407,876 | 1.14× faster | 1.18× slower |
| Non-exact 1.234M | 1,234,567 | 31.10 | 30.53 | 28.11 | 3,215,365 | 1.02× slower | 1.11× slower |
| Small 500 | 500 | 23.44 | 29.02 | 22.93 | 4,266,371 | 1.24× faster | 1.02× slower |
| Small 999.99 | 999.99 | 28.56 | 33.99 | 29.19 | 3,501,002 | 1.19× faster | 1.02× faster |
| Exact 1K EUR | 1 tis. € | 33.42 | 30.22 | 28.48 | 2,992,463 | 1.11× slower | 1.17× slower |
| Non-exact 1.15K EUR | 1 150,00 € | 32.99 | 34.81 | 27.65 | 3,031,283 | 1.06× faster | 1.19× slower |
| Chinese 1万 | 1万 | 29.16 | 26.20 | 25.80 | 3,429,870 | 1.11× slower | 1.13× slower |
| Japanese 1万 | 1万 | 29.17 | 25.87 | 25.64 | 3,428,439 | 1.13× slower | 1.14× slower |
| Indian 1 लाख | 1 लाख | 35.82 | 32.72 | 28.75 | 2,791,944 | 1.09× slower | 1.25× slower |

## Summary

### Average Performance
- Smart Compact: 30.88 ms
- Native Compact: 30.33 ms
- Native Regular: 27.39 ms

### Comparison
- Smart vs Native Compact: 1.02× slower
- Smart vs Native Regular: 1.13× slower

### Best/Worst Cases
**Best** (vs Native Compact): Small 500 - 1.24× faster

**Worst** (vs Native Compact): Exact 1K - 1.16× slower
