export function fractionDenominator(f: number): number {
  const s = f.toString();
  const i = s.indexOf('.');
  return i === -1 ? 1 : 10 ** (s.length - i - 1);
}

export function exactFactor(absValue: bigint, unit: bigint, fractions: number[]): number | null {
  if (absValue % unit === 0n) return Number(absValue / unit);

  for (const fraction of fractions) {
    if (fraction === 0) continue;
    const denom = fractionDenominator(fraction);
    const numerator = BigInt(Math.round(fraction * denom));
    const d = BigInt(denom);

    const lhs = absValue * d;
    const rhsFrac = numerator * unit;

    const remainder = (lhs - rhsFrac) % unit;
    if (remainder !== 0n) continue;

    const kTimesD = (lhs - rhsFrac) / unit;
    if (kTimesD < 0n || kTimesD % d !== 0n) continue;

    const k = Number(kTimesD / d);
    return k + fraction;
  }

  return null;
}
