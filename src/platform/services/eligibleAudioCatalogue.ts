// ==============================================================================
// Dedicated Structured Catalogue for Eligible Sacred Audio Recordings
// Governed by: PERMANENT AUDIO COPYRIGHT POLICY (Phase 3 Controlled Integration)
//
// Strict Standards:
// 1. Playback Decoded: 100% CoreAudio / WebAudio clean decoding with zero errors
// 2. Content Verified: Word-for-word acoustic alignment with canonical sacred text
// 3. Rights Cleared: Commercial streaming explicitly permitted under CC0, PD, or CC BY
// ==============================================================================

import { ReligionId } from '../types';

export interface EligibleAudioCatalogueItem {
  recordingId: string;
  requirementId: string;
  religion: ReligionId;
  collectionId: string;
  unitId?: string;
  exactTitle: string;
  textReference: string;
  recordingScope: 'continuous_book' | 'individual_passage' | 'liturgical_recitation';
  language: string;
  performer: string;
  sourcePageUrl: string;
  streamingMediaUrl: string;
  localAssetPath: string;
  license: string;
  licenseCondition: 'A' | 'B' | 'D';
  rightsHolder: string;
  commercialStreamingCleared: boolean;
  attributionRequirement: string;
  durationSeconds: number;
  durationDisplay: string;
  audioFormat: string;
  verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE';
}

export const JAFRI_ELIGIBLE_AUDIO_CATALOGUE: EligibleAudioCatalogueItem[] = [
  // ----------------------------------------------------------------------------
  // HINDUISM (सनातन धर्म) — 6 Cleared Recordings
  // ----------------------------------------------------------------------------
  {
    recordingId: 'REC-HIN-01',
    requirementId: 'REQ-HIN-036',
    religion: 'hinduism',
    collectionId: 'vedas',
    unitId: 'veda:purusha_sukta',
    exactTitle: 'Rigveda 10.90 — Purusha Suktam (Cosmic Being Recitation)',
    textReference: 'Rigveda Mandala 10, Sukta 90, Verses 1–16',
    recordingScope: 'individual_passage',
    language: 'Vedic Sanskrit',
    performer: 'Vedadhayana Gosthi (Pundits)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:05-PURUSHA_SUKTHAM-MANTRA_MANJUSHA.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/56/05-PURUSHA_SUKTHAM-MANTRA_MANJUSHA.ogg',
    localAssetPath: '/audio/hinduism/hinduism_vedas_purusha_suktam_vedadhayana_gosthi.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'Vedadhayana Gosthi / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Recited by Vedadhayana Gosthi under CC BY 3.0 Unported (Mantra Manjusha Series)',
    durationSeconds: 248.89,
    durationDisplay: '4m 08s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-HIN-02',
    requirementId: 'REQ-HIN-037',
    religion: 'hinduism',
    collectionId: 'vedas',
    unitId: 'veda:sri_suktam',
    exactTitle: 'Rigveda Khilani — Sri Suktam (Devi Mahalakshmi Liturgy)',
    textReference: 'Rigveda Parishishta / Khilani Sri Sukta, Verses 1–16',
    recordingScope: 'individual_passage',
    language: 'Vedic Sanskrit',
    performer: 'Vedadhayana Gosthi (Pundits)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:06-SREE_SUKTHAM-MANTRA_MANJUSHA.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/06-SREE_SUKTHAM-MANTRA_MANJUSHA.ogg',
    localAssetPath: '/audio/hinduism/hinduism_vedas_sri_suktam_vedadhayana_gosthi.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'Vedadhayana Gosthi / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Recited by Vedadhayana Gosthi under CC BY 3.0 Unported',
    durationSeconds: 570.1,
    durationDisplay: '9m 30s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-HIN-03',
    requirementId: 'REQ-HIN-038',
    religion: 'hinduism',
    collectionId: 'vedas',
    unitId: 'veda:ganapati_suktam',
    exactTitle: 'Rigveda 2.23.1 — Ganapati Suktam (Lord of Multitudes Recitation)',
    textReference: 'Rigveda Mandala 2, Sukta 23, Verse 1 / Atharvashirsha',
    recordingScope: 'individual_passage',
    language: 'Vedic Sanskrit',
    performer: 'Vedadhayana Gosthi (Pundits)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:03-GANAPATHI_SUKTHA-MANTRA_MANJUSHA.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/03-GANAPATHI_SUKTHA-MANTRA_MANJUSHA.ogg',
    localAssetPath: '/audio/hinduism/hinduism_vedas_ganapati_suktam_vedadhayana_gosthi.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'Vedadhayana Gosthi / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Recited by Vedadhayana Gosthi under CC BY 3.0 Unported',
    durationSeconds: 178.86,
    durationDisplay: '2m 58s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-HIN-04',
    requirementId: 'REQ-HIN-067',
    religion: 'hinduism',
    collectionId: 'mantras',
    unitId: 'mantra:gayatri',
    exactTitle: 'Gayatri Maha Mantra (Rigveda 3.62.10)',
    textReference: 'Rigveda Mandala 3, Sukta 62, Verse 10',
    recordingScope: 'individual_passage',
    language: 'Vedic Sanskrit',
    performer: 'Wilfredor (Vedic Chanting)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Gayatri_mantra.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Gayatri_mantra.ogg',
    localAssetPath: '/audio/hinduism/hinduism_mantras_gayatri_mantra_wilfredor.ogg',
    license: 'CC0 1.0 Universal',
    licenseCondition: 'A',
    rightsHolder: 'Wilfredor / Public Domain Dedication',
    commercialStreamingCleared: true,
    attributionRequirement: 'Wilfredor / Wikimedia Commons (CC0 1.0 Universal Dedication)',
    durationSeconds: 20.92,
    durationDisplay: '0m 20s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-HIN-05',
    requirementId: 'REQ-HIN-079',
    religion: 'hinduism',
    collectionId: 'stotras',
    unitId: 'stotra:guru_stotram',
    exactTitle: 'Sri Guru Stotram (Guru Gita — Akhanda Mandalakaram)',
    textReference: 'Skanda Purana, Uttara Khanda, Guru Gita Verses 1–14',
    recordingScope: 'liturgical_recitation',
    language: 'Classical Sanskrit',
    performer: 'Swami Atmananda',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Sanskrit_Chanting_Guru_Stotram.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Sanskrit_Chanting_Guru_Stotram.ogg',
    localAssetPath: '/audio/hinduism/hinduism_stotras_sri_guru_stotram_swami_atmananda.ogg',
    license: 'CC0 1.0 Universal',
    licenseCondition: 'A',
    rightsHolder: 'Swami Atmananda / Public Domain Dedication',
    commercialStreamingCleared: true,
    attributionRequirement: 'Swami Atmananda / Wikimedia Commons (CC0 1.0 Universal Dedication)',
    durationSeconds: 294.58,
    durationDisplay: '4m 54s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-HIN-06',
    requirementId: 'REQ-HIN-080',
    religion: 'hinduism',
    collectionId: 'stotras',
    unitId: 'stotra:devi_suktam',
    exactTitle: 'Rigveda 10.125 — Devi Suktam / Vak Ambhrani Sukta',
    textReference: 'Rigveda Mandala 10, Sukta 125, Verses 1–8',
    recordingScope: 'individual_passage',
    language: 'Vedic Sanskrit',
    performer: 'Vedadhayana Gosthi (Pundits)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:04-DEVI_SUKTHAM-MANTRA_MANJUSHA.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/04-DEVI_SUKTHAM-MANTRA_MANJUSHA.ogg',
    localAssetPath: '/audio/hinduism/hinduism_stotras_devi_suktam_vedadhayana_gosthi.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'Vedadhayana Gosthi / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Recited by Vedadhayana Gosthi under CC BY 3.0 Unported',
    durationSeconds: 166.09,
    durationDisplay: '2m 46s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },

  // ----------------------------------------------------------------------------
  // BUDDHISM (बौद्ध धर्म) — 2 Cleared Recordings
  // ----------------------------------------------------------------------------
  {
    recordingId: 'REC-BUD-01',
    requirementId: 'REQ-BUD-001',
    religion: 'buddhism',
    collectionId: 'tipitaka_overview',
    unitId: 'tipitaka:structure',
    exactTitle: 'Pali Tipitaka Vinaya — Bhikkhu Patimokkha Monastic Recitation',
    textReference: 'Vinaya Pitaka, Suttavibhanga, Bhikkhu Patimokkha',
    recordingScope: 'liturgical_recitation',
    language: 'Pali',
    performer: 'พระวินัยธर (Phra Winaithorn)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Bhikkhu_P%C4%81%E1%B9%ADimokkha_Pali.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Bhikkhu_P%C4%81%E1%B9%ADimokkha_Pali.ogg',
    localAssetPath: '/audio/buddhism/buddhism_tipitaka_patimokkha_pali_recitation.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'พระวินัยธर (Phra Winaithorn) / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'พระวินัยธर (Phra Winaithorn) / Wikimedia Commons (CC BY 3.0)',
    durationSeconds: 2067.08,
    durationDisplay: '34m 27s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-BUD-02',
    requirementId: 'REQ-BUD-010',
    religion: 'buddhism',
    collectionId: 'suttas_sutras',
    unitId: 'heart_sutra:form_emptiness',
    exactTitle: 'Prajnaparamita Heart Sutra (Bore Xinjing — Form is Emptiness)',
    textReference: 'Prajnaparamita Hridaya Sutra (Taisho Tripitaka 251)',
    recordingScope: 'individual_passage',
    language: 'Classical Mandarin Chinese',
    performer: 'Chinese Buddhist Layperson',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Bore_Xinjing_%E8%88%AC%E8%8B%A5%E5%BF%83%E7%BB%8F_(Heart_Sutra)_in_Mandarin_recited_by_a_Chinese_Buddhist_layperson.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Bore_Xinjing_%E8%88%AC%E8%8B%A5%E5%BF%83%E7%BB%8F_%28Heart_Sutra%29_in_Mandarin_recited_by_a_Chinese_Buddhist_layperson.ogg',
    localAssetPath: '/audio/buddhism/buddhism_suttas_sutras_heart_sutra_prajnaparamita_layperson.ogg',
    license: 'CC0 1.0 Universal',
    licenseCondition: 'A',
    rightsHolder: 'Chinese Buddhist Layperson / Public Domain Dedication',
    commercialStreamingCleared: true,
    attributionRequirement: 'Chinese Buddhist Layperson / Wikimedia Commons (CC0 1.0 Universal)',
    durationSeconds: 132.76,
    durationDisplay: '2m 12s',
    audioFormat: 'Ogg Vorbis (48.0 kHz, Mono)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-BUD-03',
    requirementId: 'REQ-BUD-020',
    religion: 'buddhism',
    collectionId: 'chants_parittas',
    unitId: 'chant:ti_sarana',
    exactTitle: 'The Three Sacred Refuges (Ti-sarana / Buddham Saranam Gacchami)',
    textReference: 'Khuddaka Nikaya, Khuddakapatha 1 (Saranattayam)',
    recordingScope: 'liturgical_recitation',
    language: 'Pali',
    performer: 'Hariharan (Male Voice with Female Chorus)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Buddham_Saranam_Gacchami_-_Male_Voice,_with_Female_Chorus.oga',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Buddham_Saranam_Gacchami_-_Male_Voice%2C_with_Female_Chorus.oga',
    localAssetPath: '/audio/buddhism/buddhism_chants_buddham_saranam_gacchami_hariharan.oga',
    license: 'CC0 1.0 Universal',
    licenseCondition: 'A',
    rightsHolder: 'Hariharan / Wikimedia Commons (Public Domain Dedication)',
    commercialStreamingCleared: true,
    attributionRequirement: 'Hariharan under CC0 1.0 Universal Public Domain Dedication',
    durationSeconds: 379.09,
    durationDisplay: '6m 19s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },

  // ----------------------------------------------------------------------------
  // CHRISTIANITY (Christian Scriptures) — 3 Cleared Recordings
  // ----------------------------------------------------------------------------
  {
    recordingId: 'REC-CHR-01',
    requirementId: 'REQ-CHR-048',
    religion: 'christianity',
    collectionId: 'bible_new_testament',
    unitId: 'chr_book_48',
    exactTitle: 'The Holy Bible: Epistle of Paul to the Galatians (Chapters 1–6 Complete)',
    textReference: 'New Testament Book 48 (Galatians Chapters 1 to 6 Complete)',
    recordingScope: 'continuous_book',
    language: 'English (World English Bible)',
    performer: 'LibriVox Volunteer Reader',
    sourcePageUrl: 'https://archive.org/details/web_new_testament_0811_librivox1',
    streamingMediaUrl: 'https://archive.org/download/web_new_testament_0811_librivox1/worldenglishbible2_36_galatians_64kb.mp3',
    localAssetPath: '/audio/christianity/christianity_bible_new_testament_epistle_to_the_galatians_librivox.mp3',
    license: 'Public Domain Mark 1.0',
    licenseCondition: 'B',
    rightsHolder: 'LibriVox Volunteers / Internet Archive (Public Domain)',
    commercialStreamingCleared: true,
    attributionRequirement: 'Read by LibriVox Volunteers for the Public Domain worldwide',
    durationSeconds: 1312.62,
    durationDisplay: '21m 52s',
    audioFormat: 'MP3 (22.05 kHz, Mono, 64 kbps CBR)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-CHR-02',
    requirementId: 'REQ-CHR-049',
    religion: 'christianity',
    collectionId: 'bible_new_testament',
    unitId: 'chr_book_49',
    exactTitle: 'The Holy Bible: Epistle of Paul to the Ephesians (Chapters 1–6 Complete)',
    textReference: 'New Testament Book 49 (Ephesians Chapters 1 to 6 Complete)',
    recordingScope: 'continuous_book',
    language: 'English (World English Bible)',
    performer: 'LibriVox Volunteer Reader',
    sourcePageUrl: 'https://archive.org/details/web_new_testament_0811_librivox1',
    streamingMediaUrl: 'https://archive.org/download/web_new_testament_0811_librivox1/worldenglishbible2_37_ephesians_64kb.mp3',
    localAssetPath: '/audio/christianity/christianity_bible_new_testament_epistle_to_the_ephesians_librivox.mp3',
    license: 'Public Domain Mark 1.0',
    licenseCondition: 'B',
    rightsHolder: 'LibriVox Volunteers / Internet Archive (Public Domain)',
    commercialStreamingCleared: true,
    attributionRequirement: 'Read by LibriVox Volunteers for the Public Domain worldwide',
    durationSeconds: 1328.58,
    durationDisplay: '22m 08s',
    audioFormat: 'MP3 (22.05 kHz, Mono, 64 kbps CBR)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-CHR-03',
    requirementId: 'REQ-CHR-067',
    religion: 'christianity',
    collectionId: 'christian_classical_prayers',
    unitId: 'chr_matthew_6_9_13',
    exactTitle: 'The Lord\'s Prayer (Pater Noster — Matthew 6:9–13)',
    textReference: 'Gospel of Matthew 6:9–13 (Oratio Dominica)',
    recordingScope: 'liturgical_recitation',
    language: 'Ecclesiastical Latin',
    performer: 'The Tudor Consort (Directed by Alastair Carey)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:The_Tudor_Consort_-_17_-_Pater_Noster.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/The_Tudor_Consort_-_17_-_Pater_Noster.ogg',
    localAssetPath: '/audio/christianity/christianity_prayers_pater_noster_the_tudor_consort.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'The Tudor Consort / Free Music Archive / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'The Tudor Consort (Directed by Alastair Carey) under CC BY 3.0',
    durationSeconds: 92.5,
    durationDisplay: '1m 32s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-CHR-04',
    requirementId: 'REQ-CHR-073',
    religion: 'christianity',
    collectionId: 'christian_classical_prayers',
    unitId: 'prayer:credo_in_unum_deum',
    exactTitle: 'The Nicene-Constantinopolitan Creed (Credo in Unum Deum — 381 AD)',
    textReference: 'Symbolum Nicaenum / Missa Victimae Paschali Laudes',
    recordingScope: 'liturgical_recitation',
    language: 'Ecclesiastical Latin',
    performer: 'The Tudor Consort (Directed by Peter Walls)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:The_Tudor_Consort_-_11_-_Credo_in_Unum_Deum.ogg',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/The_Tudor_Consort_-_11_-_Credo_in_Unum_Deum.ogg',
    localAssetPath: '/audio/christianity/christianity_prayers_credo_in_unum_deum_the_tudor_consort.ogg',
    license: 'CC BY 3.0 Unported',
    licenseCondition: 'D',
    rightsHolder: 'The Tudor Consort / Free Music Archive / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'The Tudor Consort (Directed by Peter Walls) under CC BY 3.0',
    durationSeconds: 424.98,
    durationDisplay: '7m 05s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-CHR-05',
    requirementId: 'REQ-CHR-071',
    religion: 'christianity',
    collectionId: 'christian_classical_prayers',
    unitId: 'prayer:magnificat',
    exactTitle: 'The Magnificat (The Song of the Virgin Mary — Luke 1:46–55)',
    textReference: 'Gospel of Luke 1:46–55 / Antonio Vivaldi RV 610/611',
    recordingScope: 'liturgical_recitation',
    language: 'Ecclesiastical Latin',
    performer: 'Associazione Culturale Panharmonikon (Antonio Vivaldi)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:Vivaldi_-_Magnificat_01_Magnificat.oga',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Vivaldi_-_Magnificat_01_Magnificat.oga',
    localAssetPath: '/audio/christianity/christianity_prayers_magnificat_panharmonikon.oga',
    license: 'CC BY-SA 3.0',
    licenseCondition: 'D',
    rightsHolder: 'Associazione Culturale Panharmonikon / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Associazione Culturale Panharmonikon under CC BY-SA 3.0',
    durationSeconds: 65.88,
    durationDisplay: '1m 06s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },

  // ----------------------------------------------------------------------------
  // JUDAISM (יהדות) — 2 Cleared Alternative Recordings
  // ----------------------------------------------------------------------------
  {
    recordingId: 'REC-JUD-01',
    requirementId: 'REQ-JUD-001',
    religion: 'judaism',
    collectionId: 'tanakh_torah',
    unitId: 'torah:bereshit_ch1',
    exactTitle: 'The Holy Torah: Book of Genesis (Bereshit / בְּרֵאשִׁית) — Simchat Torah Cantillation',
    textReference: 'Torah Bereshit Chapter 1 (Genesis 1:1–2:3)',
    recordingScope: 'liturgical_recitation',
    language: 'Biblical Hebrew',
    performer: 'Asael (Traditional Ashkenazi Simchat Torah Cantillation)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:ZGf_Sim%E1%B8%A5at_Torah-6%E1%B8%A4atanim-2-%E1%B8%A4atan_Bereshit_Asael.oga',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/ZGf_Sim%E1%B8%A5at_Torah-6%E1%B8%A4atanim-2-%E1%B8%A4atan_Bereshit_Asael.oga',
    localAssetPath: '/audio/judaism/judaism_torah_bereshit_asael.oga',
    license: 'CC BY-SA 3.0',
    licenseCondition: 'D',
    rightsHolder: 'Asael / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Asael under CC BY-SA 3.0',
    durationSeconds: 373.7,
    durationDisplay: '6m 14s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Mono)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
  {
    recordingId: 'REC-JUD-02',
    requirementId: 'REQ-JUD-006',
    religion: 'judaism',
    collectionId: 'tanakh_neviim',
    unitId: 'neviim:joshua_ch2',
    exactTitle: 'The Holy Nevi\'im: Book of Joshua (Yehoshua / יְהוֹשֻׁעַ) — Chapter Cantillation',
    textReference: 'Nevi\'im Yehoshua Chapter 2 (Joshua 2:1–24)',
    recordingScope: 'liturgical_recitation',
    language: 'Biblical Hebrew',
    performer: 'Asael (Traditional Ashkenazi Cantillation for the Prophets)',
    sourcePageUrl: 'https://commons.wikimedia.org/wiki/File:F_Joshua-S02_Asael.oga',
    streamingMediaUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/F_Joshua-S02_Asael.oga',
    localAssetPath: '/audio/judaism/judaism_neviim_joshua_asael.oga',
    license: 'CC BY-SA 4.0',
    licenseCondition: 'D',
    rightsHolder: 'Asael / Wikimedia Commons',
    commercialStreamingCleared: true,
    attributionRequirement: 'Asael under CC BY-SA 4.0',
    durationSeconds: 434.01,
    durationDisplay: '7m 14s',
    audioFormat: 'Ogg Vorbis (44.1 kHz, Stereo)',
    verificationStatus: 'VERIFIED_CLEARED_ELIGIBLE',
  },
];

export class EligibleAudioCatalogueService {
  private static instance: EligibleAudioCatalogueService;
  private catalogue: EligibleAudioCatalogueItem[] = JAFRI_ELIGIBLE_AUDIO_CATALOGUE;

  public static getInstance(): EligibleAudioCatalogueService {
    if (!EligibleAudioCatalogueService.instance) {
      EligibleAudioCatalogueService.instance = new EligibleAudioCatalogueService();
    }
    return EligibleAudioCatalogueService.instance;
  }

  public getAll(): EligibleAudioCatalogueItem[] {
    return this.catalogue;
  }

  public getById(recordingId: string): EligibleAudioCatalogueItem | undefined {
    return this.catalogue.find((c) => c.recordingId === recordingId);
  }

  public getByRequirementId(requirementId: string): EligibleAudioCatalogueItem | undefined {
    return this.catalogue.find((c) => c.requirementId === requirementId);
  }

  public getByReligion(religion: ReligionId): EligibleAudioCatalogueItem[] {
    return this.catalogue.filter((c) => c.religion === religion);
  }

  public getByCollection(collectionId: string): EligibleAudioCatalogueItem[] {
    return this.catalogue.filter((c) => c.collectionId === collectionId);
  }
}

export const eligibleAudioCatalogue = EligibleAudioCatalogueService.getInstance();
