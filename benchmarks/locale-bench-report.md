# Locale Benchmark

- Generated: 2025-11-17T23:22:07.670Z
- Iterations per case: 100,000
- Warmup runs per case: 2
- Total cases: 18
- Host: darwin 24.6.0 (arm64)
- CPU: Apple M3 Max x16
- RAM: 64.0 GB

## Results
| Case | Sample Output | Iterations | Total ms | ns/op | ops/sec |
| --- | --- | ---:| ---:| ---:| ---:|
| ru-RU – 750 (fallback raw) | 750 | 100,000 | 2.87 | 28.7 | 34814905 |
| es-ES – 720 (fallback raw) | 720 | 100,000 | 3.87 | 38.7 | 25822558 |
| th-TH – 30 million | 30 ล้าน | 100,000 | 961.98 | 9619.8 | 103952 |
| th-TH – 45 million (abbr) | 45 ล | 100,000 | 1781.96 | 17819.6 | 56118 |
| en-US – 1 million | 1 million | 100,000 | 1791.03 | 17910.3 | 55834 |
| fr-FR – 9.9 billion | 9,9 milliards | 100,000 | 1834.29 | 18342.9 | 54517 |
| ar – 7 million | 7 ملايين | 100,000 | 1845.51 | 18455.1 | 54186 |
| uk-UA – 3 million (abbr) | 3 млн | 100,000 | 1853.43 | 18534.3 | 53954 |
| ru-RU – 2 million (abbr) | 2 млн | 100,000 | 1859.22 | 18592.2 | 53786 |
| ar – 12 million (abbr) | 12 م | 100,000 | 1865.73 | 18657.3 | 53598 |
| ja-JP – 120 thousand (abbr) | 120千 | 100,000 | 1900.60 | 19006.0 | 52615 |
| en-US – 250K (abbr) | 250 K | 100,000 | 2016.40 | 20164.0 | 49593 |
| es-ES – 3.4 million | 3,4 millones | 100,000 | 2211.53 | 22115.3 | 45218 |
| pt-BR – 4.5 million (abbr) | 4,5 mi | 100,000 | 2285.76 | 22857.6 | 43749 |
| de-DE – 2.5 million | 2,5 Millionen | 100,000 | 2295.26 | 22952.6 | 43568 |
| ja-JP – 12 thousand | 12千 | 100,000 | 2634.11 | 26341.1 | 37963 |
| uk-UA – 2.1 thousand | 2,1 тисячі | 100,000 | 2792.59 | 27925.9 | 35809 |
| ru-RU – 1.5 thousand | 1,5 тысячи | 100,000 | 3147.78 | 31477.8 | 31768 |

_Generated via `scripts/bench.ts`_
