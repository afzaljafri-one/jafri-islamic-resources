// ==============================================================================
// Reciter Configuration Registry
// Configures Mishary Rashid Alafasy as default and Abdul Basit as alternative
// ==============================================================================

import { ReciterConfig } from './types';

export const RECITERS_REGISTRY: ReciterConfig[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    nameArabic: 'مشاري راشد العفاسي',
    style: 'Murattal',
    providerFolder: 'Alafasy_128kbps',
    bitrate: '128kbps',
    isDefault: true,
  },
  {
    id: 'abdulbasit-murattal',
    name: 'Abdul Basit Abdul Samad',
    nameArabic: 'عبدالباسط عبدالصمد (مرتل)',
    style: 'Murattal',
    providerFolder: 'Abdul_Basit_Murattal_192kbps',
    bitrate: '192kbps',
    isDefault: false,
  },
  {
    id: 'abdulbasit-mujawwad',
    name: 'Abdul Basit Abdul Samad (Mujawwad)',
    nameArabic: 'عبدالباسط عبدالصمد (مجود)',
    style: 'Mujawwad',
    providerFolder: 'Abdul_Basit_Mujawwad_128kbps',
    bitrate: '128kbps',
    isDefault: false,
  },
];

export const DEFAULT_RECITER_ID = 'alafasy';

export function getReciterConfig(id: string): ReciterConfig {
  if (id === '1' || id === 'ar.alafasy') return RECITERS_REGISTRY[0];
  if (id === '3' || id === 'ar.abdulbasitmurattal') return RECITERS_REGISTRY[1];
  if (id === '4' || id === 'ar.abdulbasitmujawwad') return RECITERS_REGISTRY[2];
  const match = RECITERS_REGISTRY.find((r) => r.id === id);
  return match || RECITERS_REGISTRY[0];
}
