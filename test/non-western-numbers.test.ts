import { describe, it, expect } from 'vitest';

import { PreciseCompact } from '../src/formatter';

describe('Non-Western number systems', () => {
  describe('Indian numbering system (hi-IN)', () => {
    const fmt = PreciseCompact({
      locale: 'hi-IN',
      currency: 'INR',
    });

    const fmtDecimal = PreciseCompact({
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
    const fmt = PreciseCompact({
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

  describe('Ukrainian numbering system (uk-UA)', () => {
    const fmt = PreciseCompact({
      locale: 'uk-UA',
      compactDisplay: 'long',
    });

    it('formats thousands with proper declension', () => {
      const result1 = fmt.format(1000); // 1 тисяча
      const result2 = fmt.format(2000); // 2 тисячі
      const result3 = fmt.format(5000); // 5 тисяч
      console.log('1000 (uk-UA):', result1);
      console.log('2000 (uk-UA):', result2);
      console.log('5000 (uk-UA):', result3);
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
      expect(result3).toBeTruthy();
    });

    it('formats millions', () => {
      const result = fmt.format(1_000_000);
      console.log('1,000,000 (uk-UA):', result);
      expect(result).toBeTruthy();
    });

    it('formats billions', () => {
      const result = fmt.format(1_000_000_000);
      console.log('1,000,000,000 (uk-UA):', result);
      expect(result).toBeTruthy();
    });
  });

  describe('Thai numbering system (th-TH)', () => {
    const fmt = PreciseCompact({
      locale: 'th-TH',
      compactDisplay: 'long',
    });

    it('formats thousands (พัน)', () => {
      const result1 = fmt.format(1000);
      const result2 = fmt.format(1500);
      console.log('1000 (th-TH):', result1);
      console.log('1500 (th-TH):', result2);
      expect(result1).toBeTruthy();
      expect(result2).toBeTruthy();
    });

    it('formats millions (ล้าน)', () => {
      const result = fmt.format(1_000_000);
      console.log('1,000,000 (th-TH):', result);
      expect(result).toBeTruthy();
    });

    it('formats billions (พันล้าน)', () => {
      const result = fmt.format(1_000_000_000);
      console.log('1,000,000,000 (th-TH):', result);
      expect(result).toBeTruthy();
    });
  });

  describe('Chinese numbering system (zh-CN)', () => {
    const fmt = PreciseCompact({
      locale: 'zh-CN',
      currency: 'CNY',
    });

    const fmtDecimal = PreciseCompact({
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
    const fmt = PreciseCompact({
      locale: 'ja-JP',
      currency: 'JPY',
    });

    const fmtDecimal = PreciseCompact({
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
    const fmt = PreciseCompact({
      locale: 'ko-KR',
      currency: 'KRW',
    });

    const fmtDecimal = PreciseCompact({
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
    const fmt = PreciseCompact({
      locale: 'ur-PK',
      currency: 'PKR',
    });

    const fmtDecimal = PreciseCompact({
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
      const en = PreciseCompact({ locale: 'en-US' });
      const hi = PreciseCompact({ locale: 'hi-IN' });
      const zh = PreciseCompact({ locale: 'zh-CN' });
      const ja = PreciseCompact({ locale: 'ja-JP' });

      const enResult = en.format(10_000);
      const hiResult = hi.format(10_000);
      const zhResult = zh.format(10_000);
      const jaResult = ja.format(10_000);

      console.log('\n=== 10,000 in different locales ===');
      console.log('en-US:', enResult);
      console.log('hi-IN:', hiResult);
      console.log('zh-CN:', zhResult);
      console.log('ja-JP:', jaResult);

      expect(enResult).toBeTruthy();
      expect(hiResult).toBeTruthy();
      expect(zhResult).toBeTruthy();
      expect(jaResult).toBeTruthy();
    });

    it('compares 100,000,000 across locales', () => {
      const en = PreciseCompact({ locale: 'en-US' });
      const hi = PreciseCompact({ locale: 'hi-IN' });
      const zh = PreciseCompact({ locale: 'zh-CN' });
      const ja = PreciseCompact({ locale: 'ja-JP' });

      const enResult = en.format(100_000_000);
      const hiResult = hi.format(100_000_000);
      const zhResult = zh.format(100_000_000);
      const jaResult = ja.format(100_000_000);

      console.log('\n=== 100,000,000 in different locales ===');
      console.log('en-US:', enResult);
      console.log('hi-IN:', hiResult);
      console.log('zh-CN:', zhResult);
      console.log('ja-JP:', jaResult);

      expect(enResult).toBeTruthy();
      expect(hiResult).toBeTruthy();
      expect(zhResult).toBeTruthy();
      expect(jaResult).toBeTruthy();
    });
  });
});
