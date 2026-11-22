// ==============================================================================
// Common Platform Audio Status & Licensing Notice Modal
// Jafri Religious Books & Audio Platform — Phase 0 / Command 3
// ==============================================================================

import React from 'react';
import { Volume2, X, ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { ReligionId } from '../types/religion';

export interface AudioTraditionNotice {
  religionId: ReligionId;
  traditionTitle: string;
  status: 'VERIFIED' | 'PARTIALLY AVAILABLE' | 'NOT AVAILABLE';
  investigatedProvider: string;
  technicalFindings: string;
  licensingRestrictions: string;
  authenticityPolicyNote: string;
  recommendedAction: string;
}

export const AUDIO_TRADITION_NOTICES: Record<ReligionId, AudioTraditionNotice> = {
  islam: {
    religionId: 'islam',
    traditionTitle: 'Islam — Holy Quran Audio',
    status: 'VERIFIED',
    investigatedProvider: 'EveryAyah (Reciter: Mishary Rashid Alafasy)',
    technicalFindings: 'Direct verse-by-verse and page-bounded MP3 audio streams verified (HTTP 200, byte-range audio/mpeg).',
    licensingRestrictions: 'Public Domain / Free open religious distribution for non-commercial educational use.',
    authenticityPolicyNote: 'Authentic human recitation synchronized with verified Mushaf page boundaries.',
    recommendedAction: 'Active in the Dual-Mushaf Reader via the dedicated Audio Player Bar.',
  },
  judaism: {
    religionId: 'judaism',
    traditionTitle: 'Judaism — Hebrew Tanakh Audio',
    status: 'NOT AVAILABLE',
    investigatedProvider: 'Mechon Mamre (Cantor Shmuel Ofen)',
    technicalFindings: 'Complete chapter-by-chapter Hebrew Masoretic Tanakh MP3 streams verified (HTTP 200, 2.91 MB Genesis 1, byte-ranges supported). Acoustic audit confirms authentic cantillation.',
    licensingRestrictions: 'Mechon Mamre terms permit individual non-commercial study only; commercial redistribution and online streaming without formal authorization are prohibited under Sections 1 and 2 of the Permanent Audio Copyright Policy.',
    authenticityPolicyNote: 'Authentic cantillation and vocalized Hebrew Masoretic recitation by a traditional cantor.',
    recommendedAction: 'Playback disabled under Permanent Audio Copyright Policy pending formal written streaming authorization from Mechon Mamre.',
  },
  christianity: {
    religionId: 'christianity',
    traditionTitle: 'Christianity — Holy Bible Spoken Audio',
    status: 'NOT AVAILABLE',
    investigatedProvider: 'Faith Comes By Hearing (Bible Brain DBP v4) & LibriVox Public Domain Archives',
    technicalFindings: 'Bible Brain requires an approval-gated developer API key and individual ministry licensing agreement. Internet Archive mirrors are currently blocked by HTTP 503 / Cloudflare anti-scraping limits.',
    licensingRestrictions: 'The Digital Bible Platform (DBP) License Agreement strictly prohibits unauthorized anonymous streaming or third-party proxy redistribution without an active vetted API key.',
    authenticityPolicyNote: 'To preserve platform integrity, synthetic AI-generated audio readings are strictly prohibited as substitutes for human spoken scripture.',
    recommendedAction: 'Audio controls remain disabled until an authorized institutional Bible Brain API key is provisioned.',
  },
  sikhism: {
    religionId: 'sikhism',
    traditionTitle: 'Sikhism — Gurbani & Nitnem Recitation',
    status: 'NOT AVAILABLE',
    investigatedProvider: 'BaniDB, GurbaniNow & SikhNet Community Archives',
    technicalFindings: 'BaniDB and GurbaniNow provide structured text/transliteration databases only and do not operate an open direct MP3 audio streaming API. SikhNet and GurmatVeechar audio archives require institutional CORS proxy authorization.',
    licensingRestrictions: 'No public verse-synchronized Gurbani audio streaming CDN with open redistribution rights is available without private API agreements.',
    authenticityPolicyNote: 'Authentic Nitnem recitations by traditional Gursikhs (e.g. Damdami Taksal) must be preserved; synthesized or unvetted audio is disallowed.',
    recommendedAction: 'Audio controls remain disabled pending verified institutional proxy gateway authorization.',
  },
  hinduism: {
    religionId: 'hinduism',
    traditionTitle: 'Hinduism — Sacred Sanskrit Liturgy & Devotional Chanting',
    status: 'PARTIALLY AVAILABLE',
    investigatedProvider: 'Internet Archive (T.S. Ranganathan) & Wikimedia Commons (Vedadhayana Gosthi, Swami Atmananda, Wilfredor)',
    technicalFindings: 'Complete 18-chapter continuous Sanskrit recitation of Bhagavad Gita (T.S. Ranganathan) verified. Zero-cost CC0 and CC BY authentic human audio streams verified and active for Gayatri Mantra (CC0 1.0), Guru Stotram (CC0 1.0), Purusha Suktam (CC BY 3.0), Sri Suktam (CC BY 3.0), Ganapati Suktam (CC BY 3.0), and Devi Suktam (CC BY 3.0). ShareAlike and copyleft recordings (Nama Sankirtana, Yasomati-nandana, Maha Mrityunjaya) are quarantined under Phase 2 Requirement 4 pending platform compatibility review. Aarti audio disabled following acoustic content audit confirming files did not match intended liturgy.',
    licensingRestrictions: 'Gita audio preserved under open educational & religious preservation access. Active Vedic and Stotra recordings licensed under CC0 1.0 Universal and CC BY 3.0 without ShareAlike restrictions. Aartis, Chalisas, Bhajans, Upanishads, Puranas, Ramayana, and Puja procedures remain in text-only mode pending verified open licensing clearance.',
    authenticityPolicyNote: 'All active audio streams are authentic human recitations by traditional pandits, liturgical choirs, and swamis. AI/TTS is never presented as authentic devotional chanting.',
    recommendedAction: 'Active for Bhagavad Gita, Vedas (Purusha, Sri & Ganapati Suktams), Gayatri Mantra, and classical Stotras (Guru Stotram, Devi Suktam). Bhajans, Aartis and remaining collections display clear "awaiting verification" badges.',
  },
  buddhism: {
    religionId: 'buddhism',
    traditionTitle: 'Buddhism — Pali Chants, Parittas & Mahayana Recitation',
    status: 'PARTIALLY AVAILABLE',
    investigatedProvider: 'Wikimedia Commons Free Cultural Works (Hariharan, Traditional Chinese Layperson)',
    technicalFindings: 'Authentic human recordings verified for Buddhist Chants & Sutras: Ti-sarana / Three Refuges (Hariharan & Chorus, CC0 1.0) and Prajnaparamita Heart Sutra recitation (Traditional Chinese layperson, CC0 1.0). Theravada Sangha Maha Piritha chant (CC BY-SA 4.0) quarantined under Phase 2 Requirement 4 pending ShareAlike platform compatibility review. Client-side WebSpeech synthesis is available strictly as an optional translated study aid clearly marked [TTS].',
    licensingRestrictions: 'Ti-sarana and Heart Sutra dedicated to CC0 1.0 Public Domain. ShareAlike Paritta chanting, Dhammapada, and canonical Pali suttas without verified CC0/CC BY human recordings remain marked as awaiting open audio licensing.',
    authenticityPolicyNote: 'Strictly distinguishes authentic human chanting (monastic Sangha / traditional recitation) from synthetic speech synthesis. TTS is never labeled as authentic recitation.',
    recommendedAction: 'Active for Ti-sarana and Heart Sutra. Other suttas support text reading with optional client TTS clearly designated as synthetic.',
  },
  jainism: {
    religionId: 'jainism',
    traditionTitle: 'Jainism — Navkar Mantra & Prakrit Canonical Chanting',
    status: 'NOT AVAILABLE',
    investigatedProvider: 'Wikimedia Commons, Internet Archive & Jain Institutional Repositories',
    technicalFindings: 'Exhaustive audit confirms zero public-domain, CC0, or CC-BY sound recordings for Namokar Mantra, Bhaktamar Stotra, or Agamas. Existing web and YouTube uploads are copyrighted commercial studio albums (Anuradha Paudwal, Lata Mangeshkar, Ravindra Jain) under T-Series / Super Cassettes Industries.',
    licensingRestrictions: 'Devotional musical recordings on commercial platforms are protected by strict sound recording copyright. Per project policy, public YouTube/Internet Archive uploads cannot be assumed free to reuse.',
    authenticityPolicyNote: 'Authentic traditional Prakrit and Sanskrit chanting must be preserved without synthetic imitation. In compliance with strict copyright ethics, Jain audio controls remain disabled pending verified open educational permission.',
    recommendedAction: 'All Jain collections remain in text-only mode with clear "awaiting rights clearance" status until authorized open educational recordings are provided.',
  },
};

interface AudioNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  religionId: ReligionId;
  accentColorClass?: string;
}

export const AudioNoticeModal: React.FC<AudioNoticeModalProps> = ({
  isOpen,
  onClose,
  religionId,
  accentColorClass = 'text-gold-400',
}) => {
  if (!isOpen) return null;

  const notice = AUDIO_TRADITION_NOTICES[religionId] || AUDIO_TRADITION_NOTICES.christianity;

  const statusBadge = {
    VERIFIED: {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      label: 'VERIFIED — Working Audio Stream',
    },
    'PARTIALLY AVAILABLE': {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      label: 'PARTIALLY AVAILABLE — Curated Samples',
    },
    'NOT AVAILABLE': {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      label: 'NOT AVAILABLE — Permission / Source Restricted',
    },
  }[notice.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-navy-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className={`w-4 h-4 ${accentColorClass}`} />
            <span className="text-xs font-semibold text-slate-100">
              Audio Recitation & Licensing Status
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300">
          {/* Tradition Header & Badge */}
          <div className="space-y-1.5 pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100">{notice.traditionTitle}</h3>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-semibold ${statusBadge.bg}`}
            >
              {statusBadge.label}
            </span>
          </div>

          {/* Section 1: Recording Provider Evaluated */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
              <Info className="w-3.5 h-3.5 text-gold-400" />
              <span>Investigated Provider & Source:</span>
            </div>
            <p className="text-slate-300 pl-5 bg-navy-950/50 p-2 rounded-xl border border-slate-800/80 font-mono text-[11px]">
              {notice.investigatedProvider}
            </p>
          </div>

          {/* Section 2: Technical & API Findings */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-sky-400" />
              <span>Technical & Endpoint Findings:</span>
            </div>
            <p className="text-slate-400 pl-5 leading-relaxed">{notice.technicalFindings}</p>
          </div>

          {/* Section 3: Copyright & Permissions */}
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-200 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Copyright & Streaming Permissions:</span>
            </div>
            <p className="text-slate-400 pl-5 leading-relaxed">{notice.licensingRestrictions}</p>
          </div>

          {/* Section 4: Authentic vs AI-Generated Policy */}
          <div className="space-y-1 bg-amber-500/5 p-3 rounded-2xl border border-amber-500/20">
            <div className="flex items-center space-x-1.5 text-amber-300 font-semibold text-[11px]">
              <span>Platform Authenticity Policy:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {notice.authenticityPolicyNote}
            </p>
          </div>

          {/* Section 5: Current Action & Next Steps */}
          <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3">
            <span className="font-semibold text-slate-300">Operational Status: </span>
            <span>{notice.recommendedAction}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-navy-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
