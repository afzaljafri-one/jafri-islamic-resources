// ==============================================================================
// Spanish Neural Narration Pilot Modal (Command 19 Integration)
// Controlled pilot for Spanish translations and commentary narration using ef_dora.
// Strict synthetic disclosure, ~295 MB explicit download gating, and full playback controls.
// DOES NOT REPLACE OR MODIFY QuranReader, MultilingualAudioEngine, or Islam M4.
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Square,
  RotateCcw,
  Sparkles,
  Download,
  AlertTriangle,
  Cpu,
  Clock,
  FileText,
} from 'lucide-react';
import {
  spanishNarrationService,
  SpanishNarrationState,
} from '../services/spanishNarrationService';

interface SpanishNarrationPilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialText?: string;
  contentCategory?: 'translation' | 'commentary' | 'explanatory';
}

const SPANISH_PRESETS = [
  {
    id: 'quran_fatihah',
    title: 'Traducción Corán — Al-Fatiha (1:1–7)',
    category: 'Traducción Aprobada',
    source: 'Traducción Julio Cortés / Isa García',
    text: 'En el nombre de Dios, el Clemente, el Misericordioso. Alabado sea Dios, Señor del universo, el Clemente, el Misericordioso, Soberano del Día del Juicio. Solo a Ti adoramos y solo a Ti pedimos ayuda. Guíanos por el camino recto, el camino de los que han sido agraciados, no el de los que han incurrido en la ira, ni el de los extraviados.',
  },
  {
    id: 'bible_psalm23',
    title: 'Traducción Bíblica — Salmo 23',
    category: 'Traducción Aprobada',
    source: 'Reina-Valera 1909 (Dominio Público)',
    text: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará. Confortará mi alma; me guiará por sendas de justicia por amor de su nombre.',
  },
  {
    id: 'commentary_reflection',
    title: 'Comentario Espiritual — La Reflexión Universal',
    category: 'Comentario Explicativo',
    source: 'Comentario Religioso y Ético',
    text: 'El propósito fundamental de la reflexión espiritual en el Islam y las tradiciones monoteístas es despertar el corazón a la conciencia divina, reconociendo la trascendencia y la misericordia en cada aspecto de la creación.',
  },
  {
    id: 'short_verse',
    title: 'Pasaje Corto — Al-Ikhlas (112:1–4)',
    category: 'Traducción Corta',
    source: 'Traducción al Español',
    text: 'Di: Él es Dios, Uno. Dios, el Autosuficiente. No engendró ni fue engendrado. Y no hay nadie semejante a Él.',
  },
];

export const SpanishNarrationPilotModal: React.FC<SpanishNarrationPilotModalProps> = ({
  isOpen,
  onClose,
  initialText,
}) => {
  const [state, setState] = useState<SpanishNarrationState>(
    spanishNarrationService.getState()
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>('quran_fatihah');
  const [narrationText, setNarrationText] = useState<string>(
    initialText || SPANISH_PRESETS[0].text
  );
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [wavDownloadUrl, setWavDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsub = spanishNarrationService.subscribe((next) => {
      setState(next);
      if (next.status === 'ready' && !isSynthesizing) {
        const blob = spanishNarrationService.exportWavBlob();
        if (blob) {
          setWavDownloadUrl(URL.createObjectURL(blob));
        }
      }
    });
    return () => unsub();
  }, [isSynthesizing]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: (typeof SPANISH_PRESETS)[0]) => {
    setSelectedPresetId(preset.id);
    setNarrationText(preset.text);
    spanishNarrationService.stop();
  };

  const handleDownloadModel = async () => {
    try {
      await spanishNarrationService.loadModel();
    } catch {
      // Handled in service state
    }
  };

  const handleSynthesizeAndPlay = async () => {
    if (!narrationText.trim()) return;
    setIsSynthesizing(true);
    try {
      await spanishNarrationService.synthesize(narrationText);
      spanishNarrationService.play();
    } catch (err) {
      console.error('[SpanishPilot] Synthesis failed:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇪🇸</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Piloto de Narración en Español (Kokoro LiteRT)
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  Voz ef_dora (Femenina)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-500/30">
                  Apache 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prueba controlada de síntesis neural en dispositivo para traducciones y comentarios religiosos.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              spanishNarrationService.stop();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Synthetic Disclosure Alert */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-start gap-3 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block text-amber-300 mb-0.5">
                Aviso Regulatorio de Narración Sintética Neural (Command 19):
              </strong>
              Esta narración es generada localmente por inteligencia artificial (Kokoro-82M) exclusivamente para traducciones, comentarios y textos explicativos en español. No sustituye la recitación litúrgica sagrada original en árabe o sánscrito, la cual se preserva con grabaciones humanas auténticas.
            </div>
          </div>

          {/* Model Status & Download Gating Card */}
          {state.status === 'unloaded' && (
            <div className="p-5 bg-slate-800/70 border border-slate-700 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Modelo Neural Kokoro-82M no cargado
                </h3>
                <p className="text-xs text-slate-300 max-w-lg mx-auto mt-1">
                  Para proteger su ancho de banda, el paquete de voz en español (<strong>~295 MB</strong> / 281 MiB) se descarga únicamente bajo su solicitud explícita. Se ejecuta 100% en su navegador sin enviar audio ni texto a servidores externos.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleDownloadModel}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Descargar e Inicializar Modelo (~295 MB)
                </button>
              </div>
            </div>
          )}

          {/* Downloading & Initializing Progress Card */}
          {(state.status === 'downloading' || state.status === 'initializing') && (
            <div className="p-5 bg-slate-800/70 border border-blue-500/40 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-blue-300 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
                  {state.progress.phase}
                </span>
                <span className="font-mono text-slate-300 font-bold">
                  {state.progress.percent}%
                </span>
              </div>
              <div className="w-full bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-300"
                  style={{ width: `${state.progress.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>
                  {(state.progress.bytesDownloaded / (1024 * 1024)).toFixed(1)} MB /{' '}
                  {(state.progress.totalBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
                <span>Velocidad: {state.progress.speedMBs} MB/s</span>
                <span>ETA: {state.progress.etaSeconds}s</span>
              </div>
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => spanishNarrationService.cancelLoad()}
                  className="px-3 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 text-xs transition-colors"
                >
                  Cancelar Descarga
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {state.status === 'error' && (
            <div className="p-4 bg-rose-950/40 border border-rose-600/50 rounded-xl text-xs text-rose-200 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Error en la narración:</strong> {state.errorMessage}
                </div>
              </div>
              <button
                onClick={handleDownloadModel}
                className="px-3 py-1 rounded bg-rose-800 text-white font-medium hover:bg-rose-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Preset Passages Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Seleccionar Pasaje de Prueba en Español (Traducciones y Comentarios):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPANISH_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 text-left rounded-xl border text-xs transition-all ${
                    selectedPresetId === preset.id
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-md shadow-emerald-950/20'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60 hover:border-slate-600'
                  }`}
                >
                  <div className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>{preset.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300">
                      {preset.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 truncate">
                    {preset.source}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Editable Narration Text Area */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Texto a Narrar en Español ({narrationText.length} caracteres):
              </label>
              <span className="text-[11px] text-slate-400">
                Idioma forzado: Español (es-ES)
              </span>
            </div>
            <textarea
              value={narrationText}
              onChange={(e) => setNarrationText(e.target.value)}
              rows={4}
              className="w-full p-3 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 text-xs font-sans leading-relaxed focus:outline-none focus:border-emerald-500/80 transition-colors resize-y"
              placeholder="Escriba o pegue traducción o comentario en español..."
            />
          </div>

          {/* Controls Deck */}
          <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Playback Action Buttons */}
              <div className="flex items-center gap-2">
                {state.playbackStatus === 'playing' ? (
                  <button
                    onClick={() => spanishNarrationService.pause()}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Pause className="w-4 h-4" />
                    Pausar
                  </button>
                ) : state.playbackStatus === 'paused' ? (
                  <button
                    onClick={() => spanishNarrationService.resume()}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4" />
                    Reanudar
                  </button>
                ) : (
                  <button
                    onClick={handleSynthesizeAndPlay}
                    disabled={isSynthesizing || state.status === 'downloading' || state.status === 'initializing'}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                  >
                    {isSynthesizing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sintetizando...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Sintetizar y Reproducir
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => spanishNarrationService.stop()}
                  disabled={state.playbackStatus === 'idle' && state.currentTime === 0}
                  className="px-3 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                  title="Detener"
                >
                  <Square className="w-3.5 h-3.5" />
                  Detener
                </button>

                <button
                  onClick={() => spanishNarrationService.replay()}
                  disabled={!state.duration}
                  className="px-3 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                  title="Reiniciar reproducción"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reiniciar
                </button>

                {wavDownloadUrl && (
                  <a
                    href={wavDownloadUrl}
                    download="jafri_spanish_ef_dora_narration.wav"
                    className="px-3 py-2 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-emerald-300 text-xs flex items-center gap-1.5 transition-colors"
                    title="Descargar audio WAV generado"
                  >
                    <Download className="w-3.5 h-3.5" />
                    WAV (24 kHz)
                  </a>
                )}
              </div>

              {/* Speed Pills (0.80x, 0.85x default, 0.90x, 1.00x) */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Velocidad:
                </span>
                <div className="flex rounded-lg bg-slate-900/80 border border-slate-700 p-0.5">
                  {[0.8, 0.85, 0.9, 1.0].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => spanishNarrationService.setSpeed(spd)}
                      className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                        state.selectedSpeed === spd
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {spd === 0.85 ? '0.85x*' : `${spd.toFixed(2)}x`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time / Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{formatTime(state.currentTime)}</span>
                <span>{formatTime(state.duration)}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-200"
                  style={{
                    width: `${state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Performance & Execution Disclaimers Card */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800/80 pb-2">
              <span className="font-semibold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                Métricas Técnicas de Rendimiento (MacBook Apple Silicon):
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Delegado Activo: {state.metrics.activeDelegate === 'GPU' ? 'WebGPU (Metal)' : 'WASM CPU (XNNPACK)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold">
                  {state.metrics.lastSynthesisDurationSec > 0
                    ? `${state.metrics.lastSynthesisDurationSec}s`
                    : '--'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tiempo Síntesis</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-emerald-400 font-mono font-bold">
                  {state.metrics.lastAudioDurationSec > 0
                    ? `${state.metrics.lastAudioDurationSec}s`
                    : '--'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Duración Audio</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-blue-400 font-mono font-bold">
                  {state.metrics.lastRealTimeFactor > 0
                    ? `${state.metrics.lastRealTimeFactor}x`
                    : '--'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Factor Tiempo Real (RTF)</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-purple-400 font-mono font-bold">
                  {state.metrics.peakMemoryMB > 0 ? `${state.metrics.peakMemoryMB} MB` : '--'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Memoria Heap</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              <strong>Nota Técnica (Command 19):</strong> En modo WASM CPU puro en navegadores sin WebGPU acelerado, la síntesis requiere ~3.8x tiempo real (~40s para generar 10s de audio). Cuando se dispone de acelerador WebGPU con Metal en Chrome interactivo, el tiempo de síntesis se reduce significativamente.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>
            Voz seleccionada: <code className="text-emerald-400 font-mono">ef_dora</code> | Licencia: <span className="text-slate-300">Apache 2.0</span>
          </span>
          <button
            onClick={() => {
              spanishNarrationService.stop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            Cerrar Piloto
          </button>
        </div>
      </div>
    </div>
  );
};
