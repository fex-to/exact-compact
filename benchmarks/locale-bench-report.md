# Locale Benchmark

- Generated: 2025-11-17T20:16:46.327Z
- Iterations per case: 100,000
- Warmup runs per case: 2
- Total cases: 18
- Host: darwin 25.1.0 (arm64)
- CPU: Apple M2 Max x12
- RAM: 32.0 GB

## Results
| Case | Sample Output | Iterations | Total ms | ns/op | ops/sec |
| --- | --- | ---:| ---:| ---:| ---:|
| es-ES – 720 (fallback raw) | 720 | 100,000 | 3.67 | 36.7 | 27211810 |
| ru-RU – 750 (fallback raw) | 750 | 100,000 | 3.74 | 37.4 | 26705236 |
| en-US – 1 million | 1 million | 100,000 | 217.08 | 2170.8 | 460652 |
| th-TH – 45 million (abbr) | 45 ล | 100,000 | 218.04 | 2180.4 | 458622 |
| th-TH – 30 million | 30 ล้าน | 100,000 | 219.09 | 2190.9 | 456433 |
| ru-RU – 2 million (abbr) | 2 млн | 100,000 | 273.27 | 2732.7 | 365933 |
| uk-UA – 3 million (abbr) | 3 млн | 100,000 | 274.55 | 2745.5 | 364236 |
| ar – 7 million | 7 ملايين | 100,000 | 278.17 | 2781.7 | 359498 |
| ar – 12 million (abbr) | 12 م | 100,000 | 301.96 | 3019.6 | 331170 |
| ja-JP – 12 thousand | 12千 | 100,000 | 305.15 | 3051.5 | 327712 |
| ja-JP – 120 thousand (abbr) | 120千 | 100,000 | 307.12 | 3071.2 | 325609 |
| fr-FR – 9.9 billion | 9,9 milliards | 100,000 | 326.72 | 3267.2 | 306072 |
| en-US – 250K (abbr) | 250 K | 100,000 | 339.34 | 3393.4 | 294694 |
| de-DE – 2.5 million | 2,5 Millionen | 100,000 | 342.48 | 3424.8 | 291984 |
| es-ES – 3.4 million | 3,4 millones | 100,000 | 348.26 | 3482.6 | 287138 |
| uk-UA – 2.1 thousand | 2,1 тисячі | 100,000 | 386.77 | 3867.7 | 258549 |
| pt-BR – 4.5 million (abbr) | 4,5 mi | 100,000 | 400.14 | 4001.4 | 249912 |
| ru-RU – 1.5 thousand | 1,5 тысячи | 100,000 | 434.35 | 4343.5 | 230230 |

_Generated via `scripts/bench.ts`_
