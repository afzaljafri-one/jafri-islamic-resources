/**
 * Global Audio Coordinator — Enforces Single Active Audio Source
 * Phase 6.5: Unified Reader & Player Consolidation
 *
 * Guarantees that activating any audio engine (Quran Ayah Recitation,
 * Sacred Audio Library, or Multilingual Narration) immediately stops
 * all other audio engines so simultaneous playback can never occur.
 */

export type AudioEngineSourceId = 'quran' | 'sacred' | 'multilingual';

class AudioCoordinator {
  private stopHandlers = new Map<AudioEngineSourceId, () => void>();
  private activeSource: AudioEngineSourceId | null = null;

  public register(id: AudioEngineSourceId, stopFn: () => void): void {
    this.stopHandlers.set(id, stopFn);
  }

  public activate(id: AudioEngineSourceId): void {
    for (const [otherId, stopFn] of this.stopHandlers.entries()) {
      if (otherId !== id) {
        try {
          stopFn();
        } catch {
          // Ignore errors when stopping an inactive engine
        }
      }
    }
    this.activeSource = id;
  }

  public getActiveSource(): AudioEngineSourceId | null {
    return this.activeSource;
  }
}

export const audioCoordinator = new AudioCoordinator();
