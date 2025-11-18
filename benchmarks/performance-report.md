# Smart Compact Formatter Benchmark

Generated: 2025-11-18T10:27:41.990Z
Iterations: 100,000
Warmup runs: 1,000
Node: v24.7.0
Platform: darwin arm64

## Results

| Case | Output | Smart (ms) | Compact (ms) | Regular (ms) | Smart ops/s | vs Compact | vs Regular |
|------|--------|------------|--------------|--------------|-------------|------------|------------|
| Exact 1K | 1K | 29.00 | 27.82 | 25.05 | 3,448,643 | 1.04× slower | 1.16× slower |
| Exact 1.5K | 1.5K | 32.51 | 30.58 | 26.50 | 3,075,973 | 1.06× slower | 1.23× slower |
| Exact 1M | 1M | 31.67 | 29.79 | 30.34 | 3,157,525 | 1.06× slower | 1.04× slower |
| Exact 1.23M | 1.23M | 34.99 | 31.84 | 28.65 | 2,857,813 | 1.10× slower | 1.22× slower |
| Exact 1B | 1B | 32.54 | 30.04 | 32.96 | 3,072,759 | 1.08× slower | 1.01× faster |
| Non-exact 1.15K | 1,150 | 26.93 | 33.92 | 24.84 | 3,713,727 | 1.26× faster | 1.08× slower |
| Non-exact 1.234M | 1,234,567 | 30.93 | 31.86 | 28.84 | 3,233,198 | 1.03× faster | 1.07× slower |
| Small 500 | 500 | 23.20 | 29.25 | 23.21 | 4,310,879 | 1.26× faster | 1.00× faster |
| Small 999.99 | 999.99 | 29.66 | 34.52 | 28.57 | 3,371,000 | 1.16× faster | 1.04× slower |
| Exact 1K EUR | 1 tis. € | 31.82 | 31.10 | 28.26 | 3,142,665 | 1.02× slower | 1.13× slower |
| Non-exact 1.15K EUR | 1 150,00 € | 30.04 | 35.54 | 29.57 | 3,329,375 | 1.18× faster | 1.02× slower |
| Chinese 1万 | 1万 | 28.39 | 27.59 | 26.59 | 3,522,672 | 1.03× slower | 1.07× slower |
| Japanese 1万 | 1万 | 28.42 | 27.76 | 27.00 | 3,518,190 | 1.02× slower | 1.05× slower |
| Indian 1 लाख | 1 लाख | 34.58 | 33.46 | 28.54 | 2,891,671 | 1.03× slower | 1.21× slower |

## Summary

### Average Performance
- Smart Compact: 30.33 ms
- Native Compact: 31.08 ms
- Native Regular: 27.78 ms

### Comparison
- Smart vs Native Compact: 1.02× faster
- Smart vs Native Regular: 1.09× slower

### Best/Worst Cases
**Best** (vs Native Compact): Small 500 - 1.26× faster

**Worst** (vs Native Compact): Exact 1.23M - 1.10× slower
