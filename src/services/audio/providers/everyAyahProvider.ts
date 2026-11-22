// ==============================================================================
// EveryAyah Audio Provider
// Streams verified segmented per-Ayah MP3 files from EveryAyah.com CDN
// ==============================================================================

import { AudioProvider } from '../types';
import { getReciterConfig, RECITERS_REGISTRY } from '../reciterConfig';

export class EveryAyahProvider implements AudioProvider {
  readonly id = 'everyayah';
  readonly name = 'EveryAyah CDN (BunnyCDN)';
  readonly baseUrl = 'https://everyayah.com/data';

  getAyahAudioUrl(surah: number, ayah: number, reciterId: string): string {
    const sStr = Math.max(1, Math.min(114, surah)).toString().padStart(3, '0');
    const aStr = Math.max(1, ayah).toString().padStart(3, '0');
    const reciter = getReciterConfig(reciterId);
    return `${this.baseUrl}/${reciter.providerFolder}/${sStr}${aStr}.mp3`;
  }

  isReciterSupported(reciterId: string): boolean {
    return RECITERS_REGISTRY.some((r) => r.id === reciterId);
  }
}

export const everyAyahProvider = new EveryAyahProvider();
