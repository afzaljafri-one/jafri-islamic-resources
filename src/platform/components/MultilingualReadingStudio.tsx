// ==============================================================================
// Universal Multilingual Reading & Audio Studio (Command 20 Architecture)
// Complete 30-language reading and audio interface for sacred texts & commentary.
// Supports Authentic Human Audio, Kokoro LiteRT, Browser Native, & Text-Only fallback.
// Enforces proper script rendering, RTL layouts, and owner voice decisions.
// Jafri Multilingual Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Square,
  RotateCcw,
  Globe,
  Search,
  BookOpen,
  FileText,
  VolumeX,
  Volume2,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sliders,
  Type,
} from 'lucide-react';
import {
  TARGET_30_LANGUAGES,
  LanguageReadinessStatus,
} from '../config/languagesRegistry';
import {
  unifiedMultilingualAudioService,
  UnifiedAudioState,
} from '../services/unifiedMultilingualAudioService';

interface MultilingualReadingStudioProps {
  isOpen: boolean;
  onClose: () => void;
  initialLanguageId?: string;
}

export const MultilingualReadingStudio: React.FC<MultilingualReadingStudioProps> = ({
  isOpen,
  onClose,
  initialLanguageId = 'en',
}) => {
  const [state, setState] = useState<UnifiedAudioState>(
    unifiedMultilingualAudioService.getState()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<'All' | 'European' | 'Middle Eastern' | 'South Asian' | 'East & Southeast Asian'>('All');
  const [contentMode, setContentMode] = useState<'scripture' | 'commentary' | 'custom'>('scripture');
  const [customText, setCustomText] = useState('');
  const [fontSize, setFontSize] = useState<number>(18); // Default 18px readable typography

  useEffect(() => {
    const unsub = unifiedMultilingualAudioService.subscribe((next) => {
      setState(next);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (initialLanguageId) {
      unifiedMultilingualAudioService.setLanguage(initialLanguageId);
    }
  }, [initialLanguageId]);

  if (!isOpen) return null;

  const currentLang = state.activeLanguage;

  const filteredLanguages = TARGET_30_LANGUAGES.filter((lang) => {
    const matchesGroup = selectedGroup === 'All' || lang.familyGroup === selectedGroup;
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.scriptName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const activePassageText =
    contentMode === 'scripture'
      ? currentLang.sampleScripture.text
      : contentMode === 'commentary'
      ? currentLang.sampleCommentary.text
      : customText || currentLang.sampleScripture.text;

  const sampleRec = currentLang.sampleRecording;
  const isScriptureMode = contentMode === 'scripture';
  const isHumanAudioLanguage = currentLang.audioEngine === 'human_recording';

  // Stable passage matching for authentic human recordings (Amendment 2)
  const isPassageMatch =
    isScriptureMode &&
    !!sampleRec &&
    currentLang.sampleScripture.stablePassageId === sampleRec.stablePassageId;

  const canPlayStudioAudio =
    state.canPlayAudio && (!isHumanAudioLanguage || isPassageMatch);

  const handleSelectLanguage = (langId: string) => {
    unifiedMultilingualAudioService.setLanguage(langId);
  };

  const handlePlay = () => {
    if (isHumanAudioLanguage) {
      if (!isPassageMatch || !sampleRec) {
        return;
      }
      unifiedMultilingualAudioService.playText(activePassageText, {
        stablePassageId: sampleRec.stablePassageId,
        humanAudioUrl: sampleRec.audioUrl,
        passageLabel: sampleRec.exactPassageLabel,
        isPassageMatch: true,
      });
      return;
    }
    unifiedMultilingualAudioService.playText(activePassageText);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: LanguageReadinessStatus) => {
    switch (status) {
      case 'HUMAN AUDIO AVAILABLE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/40">
            Audio Humano
          </span>
        );
      case 'SYNTHETIC AUDIO TECHNICALLY VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-500/40">
            Sintético Verificado
          </span>
        );
      case 'SYNTHETIC AUDIO OWNER APPROVAL PENDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-500/40">
            Aprobación Pendiente
          </span>
        );
      case 'TEXT ONLY':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-600">
            Solo Texto
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            Texto Listo
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Estudio Multilingüe de Lectura y Audio (30 Idiomas)
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40 hidden sm:inline">
                  Command 20 Production Suite
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cobertura completa de las 30 lenguas sagradas y globales • Tipografía y scripts auténticos • Audio según prioridad canónica
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              unifiedMultilingualAudioService.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="Cerrar estudio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Sidebar + Main Studio Deck */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* Left Panel: 30 Languages Directory */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 p-3.5 flex flex-col space-y-3 shrink-0 max-h-60 md:max-h-full">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar entre 30 idiomas..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-gold-500/60 transition"
              />
            </div>

            {/* Region Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
              {(['All', 'European', 'Middle Eastern', 'South Asian', 'East & Southeast Asian'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`px-2 py-1 rounded-lg text-[10px] whitespace-nowrap transition-colors ${
                    selectedGroup === g
                      ? 'bg-gold-500 text-navy-950 font-bold'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {g === 'All' ? 'Todos (30)' : g}
                </button>
              ))}
            </div>

            {/* Language List */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {filteredLanguages.map((lang) => {
                const isSelected = currentLang.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => handleSelectLanguage(lang.id)}
                    className={`w-full text-left p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-gold-500/70 shadow-sm'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <span>{lang.name}</span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          ({lang.nativeName})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{lang.scriptName}</span>
                        <span>•</span>
                        <span>{lang.direction.toUpperCase()}</span>
                      </div>
                    </div>
                    <div>{getStatusBadge(lang.readinessStatus)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Reading & Audio Player Studio */}
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-900/60">

            {/* Active Language Identity Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-800/70 border border-slate-700/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {currentLang.name}
                    <span className="text-sm font-normal text-gold-400">
                      ({currentLang.nativeName})
                    </span>
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">
                    {currentLang.bcp47}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-700 text-slate-300">
                    Script: {currentLang.scriptName}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {currentLang.notes}
                </p>
              </div>

              {/* Typography Controls */}
              <div className="flex items-center gap-2 self-start sm:self-center bg-slate-900/90 border border-slate-700 p-1.5 rounded-xl">
                <Type className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono"
                  title="Disminuir tamaño de fuente"
                >
                  A-
                </button>
                <span className="text-xs font-mono text-slate-300 w-8 text-center">
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono"
                  title="Aumentar tamaño de fuente"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Synthetic Disclosure or Text-Only Notice */}
            {state.isSynthetic && (
              <div className="p-3 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-start gap-2.5 text-amber-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Aviso de Narración Sintética Neural:</strong> La reproducción para este idioma se genera mediante síntesis de voz automatizada ({state.voiceLabel}) para traducciones y comentarios. No sustituye la recitación litúrgica sagrada original.
                </div>
              </div>
            )}

            {!state.canPlayAudio && (
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl flex items-start gap-2.5 text-slate-300 text-xs">
                <VolumeX className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Modo Solo Lectura de Texto:</strong> No se dispone de un motor de voz verificado o la voz de dispositivo fue rechazada por calidad (ej. Piya en bengalí, Vani en tamil). Toda la riqueza textual, caracteres y comentarios están 100% disponibles para lectura.
                </div>
              </div>
            )}

            {/* Content Tier Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setContentMode('scripture')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    contentMode === 'scripture'
                      ? 'bg-gold-500 text-navy-950 font-bold shadow'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Traducción Sagrada ({currentLang.sampleScripture.religion})
                </button>
                <button
                  onClick={() => setContentMode('commentary')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    contentMode === 'commentary'
                      ? 'bg-gold-500 text-navy-950 font-bold shadow'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Comentario Espiritual
                </button>
                <button
                  onClick={() => setContentMode('custom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    contentMode === 'custom'
                      ? 'bg-gold-500 text-navy-950 font-bold shadow'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Texto Personalizado
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Dirección: {currentLang.direction.toUpperCase()} • Script: {currentLang.scriptCode}
              </div>
            </div>

            {/* Reading Canvas with Proper Direction and Font Stack */}
            <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-2xl min-h-[160px] flex flex-col justify-center">
              {contentMode === 'custom' ? (
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  dir={currentLang.direction}
                  placeholder={`Escriba o pegue texto en ${currentLang.name}...`}
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: currentLang.fontFamily,
                  }}
                  className="w-full bg-transparent text-slate-100 p-2 focus:outline-none resize-y min-h-[120px] leading-relaxed"
                />
              ) : (
                <div
                  dir={currentLang.direction}
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: currentLang.fontFamily,
                  }}
                  className={`leading-relaxed text-slate-100 select-text ${
                    currentLang.direction === 'rtl' ? 'text-right' : 'text-left'
                  }`}
                >
                  {activePassageText}
                </div>
              )}

              {/* Provenance Footer inside Canvas */}
              {contentMode === 'scripture' && (
                <div className="mt-4 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <span>
                    <strong>Pasaje:</strong> {currentLang.sampleScripture.passageLabel} • <strong>Traductor:</strong> {currentLang.sampleScripture.translationAuthor}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {currentLang.sampleScripture.license}
                  </span>
                </div>
              )}

              {contentMode === 'commentary' && (
                <div className="mt-4 pt-3 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <span>
                    <strong>Título:</strong> {currentLang.sampleCommentary.title} • <strong>Fuente:</strong> {currentLang.sampleCommentary.authorOrSource}
                  </span>
                  <span className="text-slate-400">
                    Exégesis Ética y Filosófica
                  </span>
                </div>
              )}
            </div>

            {/* Human Audio Sample Match Notice */}
            {isHumanAudioLanguage && !isPassageMatch && (
              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Audio auténtico no disponible para este texto:</strong> La recitación humana sagrada en {currentLang.name} está restringida estrictamente a la muestra {sampleRec?.exactPassageLabel || 'del pasaje sagrado'}. No se reproduce audio humano sobre comentarios o texto libre.
                </div>
              </div>
            )}

            {isHumanAudioLanguage && isPassageMatch && sampleRec && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Muestra Humana Auténtica Vinculada:</strong> Pasaje {sampleRec.exactPassageLabel} • Recitador: {sampleRec.reciterOrPerformer} ({sampleRec.sourceAttribution}).
                </div>
              </div>
            )}

            {/* Unified Audio Deck */}
            <div className="p-4 bg-slate-800/70 border border-slate-700 rounded-2xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">

                {/* Playback Action Buttons */}
                <div className="flex items-center gap-2">
                  {state.playbackStatus === 'playing' ? (
                    <button
                      onClick={() => unifiedMultilingualAudioService.pause()}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer"
                    >
                      <Pause className="w-4 h-4" />
                      Pausar
                    </button>
                  ) : state.playbackStatus === 'paused' ? (
                    <button
                      onClick={() => unifiedMultilingualAudioService.resume()}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      Reanudar
                    </button>
                  ) : (
                    <button
                      onClick={handlePlay}
                      disabled={!canPlayStudioAudio || state.playbackStatus === 'loading'}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                    >
                      {state.playbackStatus === 'loading' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Procesando Audio...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Escuchar Narración ({currentLang.name})
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => unifiedMultilingualAudioService.stop()}
                    disabled={state.playbackStatus === 'idle' || state.playbackStatus === 'text_only'}
                    className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-xs flex items-center gap-1.5 transition"
                    title="Detener"
                  >
                    <Square className="w-3.5 h-3.5" />
                    Detener
                  </button>

                  <button
                    onClick={() => unifiedMultilingualAudioService.replay(activePassageText)}
                    disabled={!state.canPlayAudio}
                    className="px-3 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 text-xs flex items-center gap-1.5 transition"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reiniciar
                  </button>
                </div>

                {/* Speed Multiplier Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Velocidad:
                  </span>
                  <div className="flex rounded-lg bg-slate-900 border border-slate-700 p-0.5">
                    {[0.8, 0.85, 0.9, 1.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => unifiedMultilingualAudioService.setSpeed(spd)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded transition ${
                          state.selectedSpeed === spd
                            ? 'bg-gold-500 text-navy-950 font-bold'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {spd === 0.85 ? '0.85x*' : `${spd.toFixed(2)}x`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress and Audio Information */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{formatTime(state.currentTime)}</span>
                  <span className="text-slate-300">
                    Motor: <strong className="text-white">{state.voiceLabel}</strong>
                  </span>
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

              {state.progressPhase && (
                <div className="text-[11px] text-blue-300 font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                  {state.progressPhase}
                </div>
              )}

              {state.errorMessage && (
                <div className="text-[11px] text-rose-300 font-medium">
                  {state.errorMessage}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Jafri Multilingual Religious Platform • 30 Lenguas Mundiales • Preservación Textual y Sagrada
          </span>
          <button
            onClick={() => {
              unifiedMultilingualAudioService.stop();
              onClose();
            }}
            className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition"
          >
            Cerrar Estudio
          </button>
        </div>

      </div>
    </div>
  );
};
