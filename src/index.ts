export { preciseCompact } from './formatter';
export type { 
  PreciseCompactOptions, 
  PreciseCompactFormatter,
  ScaleLevel,
} from '../types';
export { SCALE_LEVELS } from './constants';
export { isExactOnGrid, findScaleLevel } from './utils';

// Deprecated aliases for backwards compatibility
/** @deprecated Use preciseCompact instead */
export { preciseCompact as createSmartCompactFormatter } from './formatter';
/** @deprecated Use PreciseCompactOptions instead */
export type { PreciseCompactOptions as SmartCompactOptions } from '../types';
/** @deprecated Use PreciseCompactFormatter instead */
export type { PreciseCompactFormatter as SmartCompactFormatter } from '../types';
