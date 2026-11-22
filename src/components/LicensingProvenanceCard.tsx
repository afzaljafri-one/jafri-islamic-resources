import React from 'react';
import { Scale, Award, Ban, ShieldCheck, Database } from 'lucide-react';

export const LicensingProvenanceCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-navy-900 border border-gold-500/30 p-5 lg:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-3 border-b border-navy-800">
        <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
            Licensing, Provenance & Audio Permissions
            <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-navy-800 text-gold-400 border border-gold-500/30">
              Verified 2-Provider Architecture
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            EveryAyah streaming terms • Hadith metadata integrity • Translation provenance safeguards
          </p>
        </div>
      </div>

      {/* Core Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Translation Copyright & Provenance */}
        <div className="p-4 rounded-xl bg-navy-950/70 border border-gold-500/20 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-gold-400">
            <Award className="w-4 h-4" />
            <span>Translation Provenance & Scholar Integrity</span>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
            <li>
              <strong>Saheeh International (en.sahih):</strong> Emily Assami, Mary Kennedy, Amatullah Bantley (Abul-Qasim Publishing House). Permitted for free electronic dissemination with attribution.
            </li>
            <li>
              <strong>Allama Syed Zeeshan Haider Jawadi (ur.jawadi):</strong> Respected Shia scholar translation (Al-Quran al-Mubeen). Preserved via Al Quran Cloud. Never substituted.
            </li>
            <li>
              <strong>Fateh Muhammad Jalandhry (ur.jalandhry):</strong> Classic Sunni Urdu translation (early 20th century). Provided by UmmahAPI & Al Quran Cloud.
            </li>
            <li>
              <strong>Abdullah Yusuf Ali & Marmaduke Pickthall:</strong> Classic early 20th-century translations (1930s). Referenced for non-commercial religious research and educational comparison with standard scholarly attribution.
            </li>
          </ul>
        </div>

        {/* Audio Streaming vs Raw Redistribution */}
        <div className="p-4 rounded-xl bg-navy-950/70 border border-gold-500/20 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-gold-400">
            <Ban className="w-4 h-4 text-amber-400" />
            <span>Audio Streaming Terms (No Raw File Redistribution)</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Audio streams (Mishary Rashid Alafasy, Abdul Basit Murattal & Mujawwad) are hosted on EveryAyah.com & QuranicAudio.com (BunnyCDN).
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
            <li>
              <strong>CORS Availability ≠ Redistribution Permission:</strong> Having <code className="text-gold-400">Access-Control-Allow-Origin: *</code> permits browser streaming only; it does not grant commercial ownership.
            </li>
            <li>Raw audio files are <strong>NEVER bundled or redistributed</strong> in this repository.</li>
            <li>Individual reciters retain moral rights; playback is streamed on-demand.</li>
          </ul>
        </div>
      </div>

      {/* Hadith & Tafsir Provenance */}
      <div className="p-4 rounded-xl bg-navy-950/70 border border-gold-500/20 text-xs space-y-2">
        <div className="flex items-center space-x-2 font-bold text-gold-400">
          <Database className="w-4 h-4" />
          <span>Hadith & Tafsir Provenance Policy</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
          <div className="space-y-1">
            <strong className="text-slate-100">Hadith Corpus & Citations:</strong>
            <p className="leading-relaxed text-slate-400">
              Curated foundational traditions are cited directly with verified collection keys, canonical book numbers, Hadith numbers, primary narrators, Arabic text, and authenticated scholarly gradings (Sahih / Hasan). Unverified or ungraded traditions are strictly excluded.
            </p>
          </div>
          <div className="space-y-1">
            <strong className="text-slate-100">Tafsir Status: STRICTLY DISABLED</strong>
            <p className="leading-relaxed text-slate-400">
              Per explicit project instructions, Tafsir endpoints remain disabled in the user interface until a multi-school classical commentary framework (including Shia classical commentaries such as Tafseer Al-Mizan or Allama Jawadi notes) is established.
            </p>
          </div>
        </div>
      </div>

      {/* API Limits & Health */}
      <div className="p-4 rounded-xl bg-navy-950/90 border border-gold-500/40 text-xs space-y-2">
        <div className="flex items-center space-x-2 font-bold text-gold-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>UmmahAPI Reliability, Quotas & Fair-Use Standards</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          UmmahAPI provides free unauthenticated access as a Sadaqah Jariyah service:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] pt-1">
          <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
            <span className="text-slate-400 block">General Quota</span>
            <span className="font-mono text-emerald-400 font-bold">5,000 / 15 min</span>
            <span className="text-[10px] text-slate-500 block">~333 requests/min</span>
          </div>
          <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
            <span className="text-slate-400 block">Calculations Quota</span>
            <span className="font-mono text-emerald-400 font-bold">300 / min</span>
            <span className="text-[10px] text-slate-500 block">Prayer times & Qibla</span>
          </div>
          <div className="p-2.5 rounded bg-navy-900 border border-navy-800">
            <span className="text-slate-400 block">Client Cache Strategy</span>
            <span className="font-mono text-gold-400 font-bold">IndexedDB + TTL</span>
            <span className="text-[10px] text-slate-500 block">Prevents redundant load</span>
          </div>
        </div>
      </div>
    </div>
  );
};
