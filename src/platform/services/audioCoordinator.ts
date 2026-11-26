/**
 * Global Audio Coordinator — Enforces Single Active Audio Source
 * Phase 6.5: Unified Reader & Player Consolidation
 *
 * Guarantees that activating any audio engine (Quran Ayah Recitation,
 * Sacred Audio Library, or Multilingual Narration) immediately stops
 * all other audio engines so simultaneous playback can never occur.
 * Observable so UI player mode follows the active audio source.
 */

export type AudioEngineSourceId = 'quran' | 'sacred' | 'multilingual';

type CoordinatorListener = (activeSource: AudioEngineSourceId | null) => void;

class AudioCoordinator {
  private stopHandlers = new Map<AudioEngineSourceId, () => void>();
  private listeners = new Set<CoordinatorListener>();
  private activeSource: AudioEngineSourceId | null = null;

  public register(id: AudioEngineSourceId, stopFn: () => void): void {
    this.stopHandlers.set(id, stopFn);
  }

  public subscribe(listener: CoordinatorListener): () => void {
    this.listeners.add(listener);
    listener(this.activeSource);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.activeSource);
      } catch {
        // Ignore subscriber errors
      }
    }
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
    if (this.activeSource !== id) {
      this.activeSource = id;
      this.notify();
    }
  }

  public deactivate(id: AudioEngineSourceId): void {
    if (this.activeSource === id) {
      this.activeSource = null;
      this.notify();
    }
  }

  public getActiveSource(): AudioEngineSourceId | null {
    return this.activeSource;
  }
}

export const audioCoordinator = new AudioCoordinator();
