// ==============================================================================
// Common Platform Unified Homepage
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Construction,
  Globe,
  Headphones,
} from 'lucide-react';
import { ReligionId } from '../types/religion';
import { RELIGIONS_REGISTRY, ALL_RELIGION_IDS } from '../config/religionsRegistry';

interface PlatformHomepageProps {
  onSelectReligion: (religionId: ReligionId | 'sacred-audio') => void;
  onOpenSpanishPilot?: () => void;
  onOpenStudio?: () => void;
  onOpenSacredAudio?: () => void;
}

export const PlatformHomepage: React.FC<PlatformHomepageProps> = ({
  onSelectReligion,
  onOpenSpanishPilot,
  onOpenStudio,
  onOpenSacredAudio,
}) => {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-10 animate-in fade-in-50 duration-200">
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-950 border border-gold-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden text-center">
        {/* Subtle radial background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unified Sacred Scriptures & Audio Library</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-slate-100 max-w-3xl mx-auto leading-tight">
          Jafri Religious Books & Audio Platform
        </h1>

        <p className="mt-3 text-base sm:text-lg text-gold-400 font-serif font-medium tracking-wide">
          Authentic Scriptures • Chapter & Verse Navigation • Original Languages • Verified Audio
        </p>

        <p className="max-w-2xl mx-auto mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          A dedicated, free-to-use digital library honoring seven world traditions through respectful textual presentation, rigorous provenance, verified translations, and independent, uncompromised modules.
        </p>

        {/* Quick Highlights Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Traditions</span>
            <div className="text-sm font-bold text-slate-100">7 Religions</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Access</span>
            <div className="text-sm font-bold text-slate-100">100% Free & Open</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Commercial Status</span>
            <div className="text-sm font-bold text-slate-100">Zero Ads / Paywalls</div>
          </div>
          <div className="p-3 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Integrity</span>
            <div className="text-sm font-bold text-slate-100">Zero AI Scripture</div>
          </div>
        </div>
      </section>

      {/* Featured Sacred Audio Library Showcase */}
      <section className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-950 border border-gold-500/40 p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-navy-950 flex-shrink-0 shadow-gold">
            <Headphones className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                154 Works Available
              </span>
              <span className="text-xs text-slate-400">• Seven Sacred World Traditions</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-100">
              Jafri Sacred Audio Library
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Listen to authentic liturgical recitations, scriptural cantillations, and sacred choral works across all seven world traditions: 14 direct high-fidelity local audio recordings and 140 official video recitations, with an authoritative multilingual archive of 651 documented works.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSacredAudio || (() => onSelectReligion('sacred-audio'))}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold text-sm shadow-gold transition transform hover:scale-105 flex-shrink-0"
        >
          <Headphones className="w-4 h-4" />
          <span>Open Sacred Audio Library</span>
          <Sparkles className="w-4 h-4 ml-1" />
        </button>
      </section>

      {/* Seven Religions Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100">
              Explore Sacred Traditions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Select any tradition to enter its dedicated scripture reader and audio library.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Phase 0 Common Foundation
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_RELIGION_IDS.map((id) => {
            const rel = RELIGIONS_REGISTRY[id];
            const isReady = rel.status === 'production-ready';

            return (
              <div
                key={id}
                onClick={() => onSelectReligion(id)}
                className={`relative rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between group border ${
                  isReady
                    ? 'bg-gradient-to-b from-navy-900 to-navy-950 border-gold-500/40 shadow-xl hover:border-gold-400 hover:shadow-gold-sm hover:-translate-y-1'
                    : 'bg-navy-950/80 border-slate-800 hover:border-slate-700 hover:bg-navy-900/60 hover:-translate-y-0.5'
                }`}
              >
                {/* Status Badge & Script Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase flex items-center space-x-1 ${
                      isReady
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {isReady ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Module Active & Ready</span>
                      </>
                    ) : (
                      <>
                        <Construction className="w-3 h-3" />
                        <span>Phase 0 In-Development</span>
                      </>
                    )}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400">
                    {rel.scriptName}
                  </span>
                </div>

                {/* Religion Title & Native Name */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-2xl font-bold text-slate-100 group-hover:text-gold-400 transition">
                      {rel.name}
                    </h3>
                    <span className="font-serif text-lg text-gold-400">
                      {rel.nativeName}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {rel.shortDescription}
                  </p>
                </div>

                {/* Scripture Coverage & Availability Badge */}
                <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-navy-900/90 border border-gold-500/20 text-[11px] text-slate-300 flex items-center justify-between">
                  <span className="font-semibold text-gold-400">Coverage:</span>
                  <span className="truncate max-w-[220px] text-right font-medium">
                    {id === 'islam' && 'Complete Mushaf Facsimiles • 100% Offline'}
                    {id === 'hinduism' && '55 Curated Texts Offline • 698 Verses via API'}
                    {id === 'christianity' && '66 Books Metadata • 31,102 Verses Dynamic'}
                    {id === 'judaism' && '11 of 24 Books • Sefaria Dynamic API'}
                    {id === 'sikhism' && '1,430 Angs • Ang 1 Offline • Angs 2–1430 API'}
                    {id === 'buddhism' && '24 Curated Pali Sutta Units • CC0'}
                    {id === 'jainism' && '29 Curated Texts • 100% Offline (Zero AI)'}
                  </span>
                </div>

                {/* Meta Details: Language, Era, Traditions */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Language:</span>
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">
                      {rel.foundationalLanguage}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Historical Era:</span>
                    <span className="text-slate-300">{rel.historicalEra}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Direction:</span>
                    <span className="text-slate-300 uppercase font-mono">
                      {rel.textDirection}
                    </span>
                  </div>
                </div>

                {/* Enter Button */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-gold-400 transition">
                    {rel.id === 'islam'
                      ? 'Open Quran Reader & Tools'
                      : `Open ${rel.name} Scripture Reader`}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                      isReady
                        ? 'bg-gold-500 text-navy-950 group-hover:bg-gold-400'
                        : 'bg-slate-800 text-slate-300 group-hover:text-gold-400 group-hover:bg-slate-700'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 30-Language Global Multilingual Reading & Audio Studio (Command 20) */}
      <section className="rounded-3xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-gold-500/40 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Globe className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Estudio Multilingüe de las 30 Lenguas Mundiales
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-gold-950 text-gold-300 border border-gold-500/40">
                  Global Coverage
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore los textos sagrados, traducciones y comentarios en 30 idiomas con tipografía auténtica, soporte RTL (árabe, hebreo, persa, urdu) y scripts indios. Audio humano y narración sintética según prioridad canónica.
            </p>
          </div>
          {onOpenStudio && (
            <button
              id="homepage-open-studio-btn"
              onClick={onOpenStudio}
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-gold-950/50 transition cursor-pointer shrink-0"
            >
              <Globe className="w-4 h-4" />
              Abrir Estudio de 30 Idiomas
            </button>
          )}
        </div>
      </section>

      {/* Controlled Research Pilot: Spanish Neural Narration (Command 19) */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 border border-emerald-500/40 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇪🇸</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Piloto de Narración Neural en Español
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  Voz ef_dora • Apache 2.0
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prueba controlada de síntesis neural en dispositivo (Kokoro-82M LiteRT) para traducciones y comentarios religiosos en español. Se ejecuta 100% en su navegador con privacidad total y ₹0 costo de servidores.
            </p>
          </div>
          {onOpenSpanishPilot && (
            <button
              id="homepage-open-spanish-pilot-btn"
              onClick={onOpenSpanishPilot}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Abrir Piloto Español (ef_dora)
            </button>
          )}
        </div>
      </section>

      {/* Architectural Principles & Non-Astrology Commitment */}
      <section className="rounded-3xl bg-navy-950/90 border border-slate-800 p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">
            Platform Principles & Integrity Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-slate-200">1. Sacred Textual Dignity</h4>
            <p className="leading-relaxed">
              Every tradition is honored with its canonical divisions, authentic scripts, and scholarly translations without imposition of external structures.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-slate-200">2. Strict AI Exclusion</h4>
            <p className="leading-relaxed">
              No artificial intelligence or LLM is permitted to generate or interpolate scripture text, missing verses, or synthetic translations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-slate-200">3. Non-Astrology Separation</h4>
            <p className="leading-relaxed">
              Religious scriptures are strictly segregated from astrological or esoteric horoscopes. Sacred books remain pure devotional and literary works.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
