export { PreciseCompact } from './formatter';
export type { PreciseCompactOptions, PreciseCompactFormatter, ScaleLevel } from '../types';
export { SCALE_LEVELS } from './constants';
export { isExactOnGrid, findScaleLevel } from './utils';

// Deprecated aliases for backwards compatibility
/** @deprecated Use PreciseCompact instead */
export { PreciseCompact as createSmartCompactFormatter } from './formatter';
/** @deprecated Use PreciseCompact instead */
export { PreciseCompact as preciseCompact } from './formatter';
/** @deprecated Use PreciseCompactOptions instead */
export type { PreciseCompactOptions as SmartCompactOptions } from '../types';
/** @deprecated Use PreciseCompactFormatter instead */
export type { PreciseCompactFormatter as SmartCompactFormatter } from '../types';
