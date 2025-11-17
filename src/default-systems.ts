import type { SystemDef } from './types';

export const SYSTEM_INTL: SystemDef = {
  id: 'international',
  units: [
    { key: 'trillion', value: 1_000_000_000_000n },
    { key: 'billion', value: 1_000_000_000n },
    { key: 'million', value: 1_000_000n },
    { key: 'thousand', value: 1_000n },
  ],
};

export const SYSTEM_INDIAN: SystemDef = {
  id: 'indian',
  units: [
    { key: 'kharab', value: 100_000_000_000n },
    { key: 'arab', value: 1_000_000_000n },
    { key: 'crore', value: 10_000_000n },
    { key: 'lakh', value: 100_000n },
    { key: 'thousand', value: 1_000n },
  ],
};

export const SYSTEM_EAST_ASIA: SystemDef = {
  id: 'eastAsia',
  units: [
    { key: 'yi', value: 100_000_000n },
    { key: 'wan', value: 10_000n },
    { key: 'thousand', value: 1_000n },
  ],
};

export const DEFAULT_SYSTEMS: SystemDef[] = [SYSTEM_INTL, SYSTEM_INDIAN, SYSTEM_EAST_ASIA];
