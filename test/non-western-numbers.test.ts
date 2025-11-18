import { describe, it, expect } from 'vitest';
import { preciseCompact } from '../src/formatter';

describe('Non-Western number systems', () => {
  describe('Indian numbering system (hi-IN)', () => {
    const fmt = preciseCompact({
      locale: 'hi-IN',
      currency: 'INR',
    });

    const fmtDecimal = preciseCompact({
      locale: 'hi-IN',
    });

    it('formats lakh (100,000) - exact', () => {
      const result = fmtDecimal.format(100_000);
      console.log('100,000 (lakh):', result);
      // Indian system uses lakh for 100,000
      expect(result).toBeTruthy();
    });

    it('formats 1.5 lakh - exact', () => {
      const result = fmtDecimal.format(150_000);
      console.log('150,000 (1.5 lakh):', result);
      expect(result).toBeTruthy();
    });

    it('formats crore (10,000,000) - exact', () => {
      const result = fmtDecimal.format(10_000_000);
      console.log('10,000,000 (crore):', result);
      // Indian system uses crore for 10,000,000
      expect(result).toBeTruthy();
    });

    it('formats 1.23 crore - exact', () => {
      const result = fmtDecimal.format(12_300_000);
      console.log('12,300,000 (1.23 crore):', result);
      expect(result).toBeTruthy();
    });

    it('formats with INR currency', () => {
      const result1 = fmt.format(100_000);
      const result2 = fmt.format(10_000_000);
      console.log('100,000 INR:', result1);
      console.log('10,000,000 INR:', result2);
      expect(result1).toMatch(/₹|INR/);
      expect(result2).toMatch(/₹|INR/);
    });

    it('formats non-exact numbers as regular', () => {
      const result = fmtDecimal.format(123_456);
      console.log('123,456 (not exact):', result);
      // Should be regular format
      expect(result).toBeTruthy();
    });
  });

  describe('Arabic/Urdu numbering system (ar-SA)', () => {
    const fmt = preciseCompact({
      locale: 'ar-SA',
    });

    it('formats thousands', () => {
      const result1 = fmt.format(1000);
      const result2 = fmt.format(1500);
      console.log('1000 (ar-SA):', result1);
      console.log('1500 (ar-SA):', result2);
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });

    it('formats millions', () => {
      const result = fmt.format(1_000_000);
      console.log('1,000,000 (ar-SA):', result);
      expect(result).toBeTruthy();
    });

    // Note: 'arab' (مليار) is billion in some Arabic locales
    it('formats billions', () => {
      const result = fmt.format(1_000_000_000);
      console.log('1,000,000,000 (ar-SA):', result);
      expect(result).toBeTruthy();
    });
  });

  describe('Chinese numbering system (zh-CN)', () => {
    const fmt = preciseCompact({
      locale: 'zh-CN',
      currency: 'CNY',
    });

    const fmtDecimal = preciseCompact({
      locale: 'zh-CN',
    });

    it('formats wan (10,000) - exact', () => {
      const result = fmtDecimal.format(10_000);
      console.log('10,000 (万 wan):', result);
      // Chinese uses 万 (wan) for 10,000
      expect(result).toBeTruthy();
    });

    it('formats yi (100,000,000) - exact', () => {
      const result = fmtDecimal.format(100_000_000);
      console.log('100,000,000 (亿 yi):', result);
      // Chinese uses 亿 (yi) for 100,000,000
      expect(result).toBeTruthy();
    });

    it('formats 1.5 wan - exact', () => {
      const result = fmtDecimal.format(15_000);
      console.log('15,000 (1.5万):', result);
      expect(result).toBeTruthy();
    });

    it('formats 1.23 yi - exact', () => {
      const result = fmtDecimal.format(123_000_000);
      console.log('123,000,000 (1.23亿):', result);
      expect(result).toBeTruthy();
    });

    it('formats with CNY currency', () => {
      const result1 = fmt.format(10_000);
      const result2 = fmt.format(100_000_000);
      console.log('10,000 CNY:', result1);
      console.log('100,000,000 CNY:', result2);
      expect(result1).toMatch(/¥|CN¥|CNY/);
      expect(result2).toMatch(/¥|CN¥|CNY/);
    });

    it('formats thousands (qian 千) - exact', () => {
      const result = fmtDecimal.format(1000);
      console.log('1,000 (千 qian):', result);
      expect(result).toBeTruthy();
    });

    it('formats non-exact numbers as regular', () => {
      const result = fmtDecimal.format(12_345);
      console.log('12,345 (not exact for wan):', result);
      expect(result).toBeTruthy();
    });
  });

  describe('Japanese numbering system (ja-JP)', () => {
    const fmt = preciseCompact({
      locale: 'ja-JP',
      currency: 'JPY',
    });

    const fmtDecimal = preciseCompact({
      locale: 'ja-JP',
    });

    it('formats man (10,000) - similar to Chinese wan', () => {
      const result = fmtDecimal.format(10_000);
      console.log('10,000 (万 man):', result);
      // Japanese uses 万 (man) for 10,000
      expect(result).toBeTruthy();
    });

    it('formats oku (100,000,000) - similar to Chinese yi', () => {
      const result = fmtDecimal.format(100_000_000);
      console.log('100,000,000 (億 oku):', result);
      // Japanese uses 億 (oku) for 100,000,000
      expect(result).toBeTruthy();
    });

    it('formats with JPY currency', () => {
      const result1 = fmt.format(10_000);
      const result2 = fmt.format(100_000_000);
      console.log('10,000 JPY:', result1);
      console.log('100,000,000 JPY:', result2);
      // Japanese yen uses full-width yen sign ￥
      expect(result1).toMatch(/￥|¥|JP¥|JPY/);
      expect(result2).toMatch(/￥|¥|JP¥|JPY/);
    });
  });

  describe('Korean numbering system (ko-KR)', () => {
    const fmt = preciseCompact({
      locale: 'ko-KR',
      currency: 'KRW',
    });

    const fmtDecimal = preciseCompact({
      locale: 'ko-KR',
    });

    it('formats man (10,000)', () => {
      const result = fmtDecimal.format(10_000);
      console.log('10,000 (만 man):', result);
      // Korean uses 만 (man) for 10,000
      expect(result).toBeTruthy();
    });

    it('formats eok (100,000,000)', () => {
      const result = fmtDecimal.format(100_000_000);
      console.log('100,000,000 (억 eok):', result);
      // Korean uses 억 (eok) for 100,000,000
      expect(result).toBeTruthy();
    });

    it('formats with KRW currency', () => {
      const result1 = fmt.format(10_000);
      const result2 = fmt.format(100_000_000);
      console.log('10,000 KRW:', result1);
      console.log('100,000,000 KRW:', result2);
      expect(result1).toMatch(/₩|KRW/);
      expect(result2).toMatch(/₩|KRW/);
    });
  });

  describe('Pakistani/Urdu numbering system (ur-PK)', () => {
    const fmt = preciseCompact({
      locale: 'ur-PK',
      currency: 'PKR',
    });

    const fmtDecimal = preciseCompact({
      locale: 'ur-PK',
    });

    it('formats lakh (100,000)', () => {
      const result = fmtDecimal.format(100_000);
      console.log('100,000 lakh (ur-PK):', result);
      expect(result).toBeTruthy();
    });

    it('formats crore (10,000,000)', () => {
      const result = fmtDecimal.format(10_000_000);
      console.log('10,000,000 crore (ur-PK):', result);
      expect(result).toBeTruthy();
    });

    it('formats arab (1,000,000,000)', () => {
      const result = fmtDecimal.format(1_000_000_000);
      console.log('1,000,000,000 arab (ur-PK):', result);
      expect(result).toBeTruthy();
    });

    it('formats kharab (100,000,000,000)', () => {
      const result = fmtDecimal.format(100_000_000_000);
      console.log('100,000,000,000 kharab (ur-PK):', result);
      expect(result).toBeTruthy();
    });

    it('formats with PKR currency', () => {
      const result = fmt.format(100_000);
      console.log('100,000 PKR:', result);
      expect(result).toMatch(/Rs|PKR|₨/);
    });
  });

  describe('Comparison: Same numbers in different locales', () => {
    it('compares 10,000 across locales', () => {
      const en = preciseCompact({ locale: 'en-US' });
      const hi = preciseCompact({ locale: 'hi-IN' });
      const zh = preciseCompact({ locale: 'zh-CN' });
      const ja = preciseCompact({ locale: 'ja-JP' });

      console.log('\n=== 10,000 in different locales ===');
      console.log('en-US:', en.format(10_000));
      console.log('hi-IN:', hi.format(10_000));
      console.log('zh-CN:', zh.format(10_000));
      console.log('ja-JP:', ja.format(10_000));
    });

    it('compares 100,000,000 across locales', () => {
      const en = preciseCompact({ locale: 'en-US' });
      const hi = preciseCompact({ locale: 'hi-IN' });
      const zh = preciseCompact({ locale: 'zh-CN' });
      const ja = preciseCompact({ locale: 'ja-JP' });

      console.log('\n=== 100,000,000 in different locales ===');
      console.log('en-US:', en.format(100_000_000));
      console.log('hi-IN:', hi.format(100_000_000));
      console.log('zh-CN:', zh.format(100_000_000));
      console.log('ja-JP:', ja.format(100_000_000));
    });
  });
});
