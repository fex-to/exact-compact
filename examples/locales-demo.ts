import { PreciseCompact } from '../src/precise-compact';

// Импортируем локали из собранных паков
import ru from '../i18n/ru';
import en from '../i18n/en';
import de from '../i18n/de';
import fr from '../i18n/fr';
import es from '../i18n/es';
import it from '../i18n/it';
import pl from '../i18n/pl';
import uk from '../i18n/uk';
import ja from '../i18n/ja';
import zhCN from '../i18n/zh-CN';
import zhTW from '../i18n/zh-TW';
import ko from '../i18n/ko';
import hi from '../i18n/hi';
import th from '../i18n/th';
import vi from '../i18n/vi';
import ar from '../i18n/ar';
import he from '../i18n/he';
import fa from '../i18n/fa';
import ur from '../i18n/ur';
import ptBR from '../i18n/pt-BR';
import idID from '../i18n/id-ID';
import tr from '../i18n/tr';

// Регистрируем все локали
[ru, en, de, fr, es, it, pl, uk, ja, zhCN, zhTW, ko, hi, th, vi, ar, he, fa, ur, ptBR, idID, tr].forEach(
  locale => PreciseCompact.registerLocale(locale)
);

console.log('=== Примеры использования разных языков ===\n');

const value = 1500;
const format = (v: number, locale: string) => PreciseCompact.format(v, { locale });

// Европейские языки
console.log('Европейские языки:');
console.log('Русский (ru-RU):', format(value, 'ru'));
console.log('Английский (en-US):', format(value, 'en'));
console.log('Немецкий (de-DE):', format(value, 'de'));
console.log('Французский (fr-FR):', format(value, 'fr'));
console.log('Испанский (es-ES):', format(value, 'es'));
console.log('Итальянский (it-IT):', format(value, 'it'));
console.log('Польский (pl-PL):', format(value, 'pl'));
console.log('Украинский (uk-UA):', format(value, 'uk'));

console.log('\nАзиатские языки:');
console.log('Японский (ja-JP):', format(value, 'ja'));
console.log('Китайский упр. (zh-CN):', format(value, 'zh-CN'));
console.log('Китайский трад. (zh-TW):', format(value, 'zh-TW'));
console.log('Корейский (ko-KR):', format(value, 'ko'));
console.log('Хинди (hi-IN):', format(value, 'hi'));
console.log('Тайский (th-TH):', format(value, 'th'));
console.log('Вьетнамский (vi-VN):', format(value, 'vi'));

console.log('\nБлижний Восток:');
console.log('Арабский (ar-SA):', format(value, 'ar'));
console.log('Иврит (he-IL):', format(value, 'he'));
console.log('Фарси (fa-IR):', format(value, 'fa'));
console.log('Урду (ur-PK):', format(value, 'ur'));

console.log('\nДругие:');
console.log('Португальский BR (pt-BR):', format(value, 'pt-BR'));
console.log('Индонезийский (id-ID):', format(value, 'id-ID'));
console.log('Турецкий (tr-TR):', format(value, 'tr'));

console.log('\n=== Разные значения с русским языком ===\n');
const values = [1000, 1500, 2000, 5000, 12000, 125000, 1500000, 25000000];
values.forEach(v => {
  console.log(`${v.toLocaleString('ru-RU')} → ${format(v, 'ru')}`);
});

console.log('\n=== Миллионы (разные языки) ===\n');
const million = 1500000;
console.log('Русский:', PreciseCompact.format(million, { locale: 'ru' }));
console.log('Английский:', PreciseCompact.format(million, { locale: 'en' }));
console.log('Немецкий:', PreciseCompact.format(million, { locale: 'de' }));
console.log('Французский:', PreciseCompact.format(million, { locale: 'fr' }));
console.log('Японский:', PreciseCompact.format(million, { locale: 'ja' }));

console.log('\n=== Стили (аббревиатуры) ===\n');
console.log('Words (слова):', PreciseCompact.format(1500, { locale: 'ru', style: 'words' }));
console.log('Abbr (сокращения):', PreciseCompact.format(1500, { locale: 'ru', style: 'abbr' }));
console.log('Million words:', PreciseCompact.format(1500000, { locale: 'ru', style: 'words' }));
console.log('Million abbr:', PreciseCompact.format(1500000, { locale: 'ru', style: 'abbr' }));
