// ==============================================================================
// Buddhism Authentic Text & Sutta Data (Phase 1 Content Expansion)
// Pali and Sanskrit with Roman Transliteration and CC0 / Public Domain English
// SuttaCentral Bilara Corpus (Bhikkhu Sujato), Max Müller, Pali Text Society
// Jafri Religious Books & Audio Platform
// ==============================================================================

export interface AudioProvenanceInfo {
  audioUrl: string;
  performer: string;
  source: string;
  license: string;
  isHuman: boolean;
  licensingTerms: string;
}

export interface BuddhismVerseUnit {
  id: string; // e.g. 'metta_sutta:1', 'dhp:1', 'heart_sutra:1'
  unitNumber: number | string;
  originalText: string; // Pali in Devanagari or Romanized Pali / Sanskrit
  transliteration?: string; // Standard IAST Romanization
  translationEn: string; // Verified CC0 / Public Domain English Translation
  translationHi?: string; // Optional Hindi translation
  commentary?: string; // Doctrinal notes
  sectionTitle?: string;
  audio?: AudioProvenanceInfo;
}

export const BUDDHISM_TEXT_DATA: Record<string, BuddhismVerseUnit[]> = {
  // ----------------------------------------------------------------------------
  // 1. TIPITAKA / TRIPITAKA CANONICAL OVERVIEW
  // ----------------------------------------------------------------------------
  tipitaka_overview: [
    {
      id: 'tipitaka:structure',
      unitNumber: 'The Three Baskets',
      originalText:
        'तिपिटकं नाम—विनयपिटकं, सुत्तपिटकं, अभिधम्मपिटकं चेति तिविधं होति ।\nबुद्धवचनं सब्बं एतेसु येव संगहितं ॥',
      transliteration:
        'tipiṭakaṁ nāma—vinayapiṭakaṁ, suttapiṭakaṁ, abhidhammapiṭakaṁ ceti tividhaṁ hoti |\nbuddhavacanaṁ sabbaṁ etesu yeva saṅgahitaṁ ||',
      translationEn:
        'The Tipitaka (The Three Baskets) is threefold: 1. Vinaya Pitaka (The Basket of Monastic Discipline: Suttavibhanga, Khandhaka, Parivara), 2. Sutta Pitaka (The Basket of Discourses in five Nikayas: Digha, Majjhima, Samyutta, Anguttara, Khuddaka), and 3. Abhidhamma Pitaka (The Basket of Ultimate Realities: Dhammasangani, Vibhanga, Dhatukatha, Puggalapannatti, Kathavatthu, Yamaka, Patthana). All words of the Buddha are embraced within these three.',
      translationHi:
        'त्रिपिटक तीन भागों में विभक्त है: १. विनयपिटक (भिक्षु-भिक्षुणी नियम), २. सुत्तपिटक (भगवान बुद्ध के उपदेश — ५ निकाय), और ३. अभिधम्मपिटक (परमार्थ दर्शन एवं चित्त-चैतसिक विश्लेषण)।',
      sectionTitle: 'The Three Baskets (Pali Tipitaka Structure)',
      audio: {
        audioUrl:
          '/audio/buddhism/buddhism_tipitaka_patimokkha_pali_recitation.ogg',
        performer: 'พระวินัยธर (Phra Winaithorn)',
        source: 'Wikimedia Commons (File:Bhikkhu_Pāṭimokkha_Pali.ogg)',
        license: 'CC BY 3.0 Unported',
        isHuman: true,
        licensingTerms:
          'Creative Commons Attribution 3.0 Unported. Authentic Pali monastic chanting of the Bhikkhu Patimokkha; unrestricted commercial streaming permitted with attribution.',
      },
    },
    {
      id: 'tipitaka:first_council',
      unitNumber: 'First Council Recitation',
      originalText:
        'एवं मे सुतं—एकं समयं भगवा राजगहे विहरति वेळुवने कलन्दकनिवापे ।\nतत्र खो आयस्मा महाकस्सपो थेरे भिक्खू आमन्तेसि ॥',
      transliteration:
        'evaṁ me sutaṁ—ekaṁ samayaṁ bhagavā rājagahe viharati veḷuvane kalandakanivāpe |\ntatra kho āyasmā mahākassapo there bhikkhū āmantesi ||',
      translationEn:
        '"Thus have I heard" (Evaṁ me sutaṁ)—the universal opening authentication of the Suttas proclaimed by the Venerable Ananda at the First Buddhist Council in the Sattapanni Cave at Rajagaha, establishing the canonical validity of the discourses.',
      translationHi:
        '“ऐसा मैंने सुना है”—प्रथम बौद्ध संगीति में आनंद स्थविर द्वारा उच्चारित यह वाक्य सभी बौद्ध सूत्रों का प्रामाणिक आरंभिक उद्घोष है।',
      sectionTitle: 'Canonical Authentication (Evam Me Sutam)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 2. THE DHAMMAPADA (Core Selected Vaggas)
  // ----------------------------------------------------------------------------
  dhammapada: [
    {
      id: 'dhp:1',
      unitNumber: 'Yamakavagga Verse 1',
      originalText:
        'मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया ।\nमनसा चे पदुट्ठेन भासति वा करोति वा ।\nततो नं दुक्खमन्वेति चक्कंव वहतो पदं ॥ १ ॥',
      transliteration:
        'manopubbaṅgamā dhammā manoseṭṭhā manomayā |\nmanasā ce paduṭṭhena bhāsati vā karoti vā |\ntato naṁ dukkhamanveti cakkaṁva vahato padaṁ || 1 ||',
      translationEn:
        'Mind precedes all mental states; mind is their chief; they are mind-made. If with an impure mind a person speaks or acts, suffering follows him even as the wheel follows the hoof of the draught-ox.',
      translationHi:
        'मन सभी प्रवृत्तियों का अगुवा है, मन ही उनका प्रधान है, वे मन से ही उत्पन्न होती हैं। यदि कोई व्यक्ति दूषित मन से बोलता या कर्म करता है, तो दुःख उसका वैसे ही पीछा करता है जैसे गाड़ी का पहिया खींचने वाले बैल के पैर का पीछा करता है।',
      sectionTitle: 'Dhammapada — Yamakavagga (The Pairs 1–2)',
    },
    {
      id: 'dhp:2',
      unitNumber: 'Yamakavagga Verse 2',
      originalText:
        'मनोपुब्बङ्गमा धम्मा मनोसेट्ठा मनोमया ।\nमनसा चे पसन्नेन भासति वा करोति वा ।\nततो नं सुखमन्वेति छायाव अनपायिनी ॥ २ ॥',
      transliteration:
        'manopubbaṅgamā dhammā manoseṭṭhā manomayā |\nmanasā ce pasannena bhāsati vā karoti vā |\ntato naṁ sukhamanveti chāyāva anapāyinī || 2 ||',
      translationEn:
        'Mind precedes all mental states; mind is their chief; they are mind-made. If with a pure mind a person speaks or acts, happiness follows him like his never-departing shadow.',
      translationHi:
        'मन सभी प्रवृत्तियों का अगुवा है, मन ही प्रधान है, वे मन से ही उत्पन्न होती हैं। यदि कोई शुद्ध मन से बोलता या कर्म करता है, तो सुख उसकी कभी न छूटने वाली छाया की तरह उसके पीछे-पीछे चलता है।',
      sectionTitle: 'Dhammapada — Yamakavagga (The Pairs 1–2)',
    },
    {
      id: 'dhp:5',
      unitNumber: 'Yamakavagga Verse 5',
      originalText:
        'न हि वेरेन वेरानि सम्मन्तीध कुदाचनं ।\nअवेरेन च सम्मन्ति एस धम्मो सनन्तनो ॥ ५ ॥',
      transliteration:
        'na hi verena verāni sammantīdha kudācanaṁ |\naverena ca sammanti esa dhammo sanantano || 5 ||',
      translationEn:
        'Hatred is never appeased by hatred in this world. By non-hatred and loving-kindness alone is hatred stilled. This is the eternal, timeless truth (Dhammo Sanantano).',
      translationHi:
        'इस संसार में वैर से वैर कभी शांत नहीं होता; निर्वैर और प्रेम से ही वैर शांत होता है। यही सनातन धर्म है।',
      sectionTitle: 'Dhammapada — The Eternal Law (Averena ca Sammanti)',
    },
    {
      id: 'dhp:21',
      unitNumber: 'Appamadavagga Verse 21',
      originalText:
        'अप्पमादो अमतपदं पमादो मच्चुनो पदं ।\nअप्पमत्ता न मीयन्ति ये पमत्ता यथा मता ॥ २१ ॥',
      transliteration:
        'appamādo amatapadaṁ pamādo maccuno padaṁ |\nappamattā na mīyanti ye pamattā yathā matā || 21 ||',
      translationEn:
        'Heedfulness (Appamada) is the path to the Deathless (Amata/Nibbana); heedlessness (Pamada) is the path to death. The heedful never die; the heedless are as if already dead.',
      translationHi:
        'अप्रमाद (जागरूकता) अमृत का मार्ग है, और प्रमाद मृत्यु का मार्ग है। जो अप्रमादी (जागरूक) हैं वे मरते नहीं, और जो प्रमादी हैं वे मरे हुए के समान हैं।',
      sectionTitle: 'Dhammapada — Appamadavagga (Heedfulness)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 3. CORE SUTTAS & MAHAYANA SUTRAS
  // ----------------------------------------------------------------------------
  suttas_sutras: [
    {
      id: 'sn56.11:middle_way',
      unitNumber: 'SN 56.11 (First Sermon — The Middle Way)',
      originalText:
        'द्वेमे, भिक्खवे, अन्ता पब्बजितेन न सेविabba । कतमे द्वे? यो चायं कामेसु कामसुखल्लिकानुयोगो हीनो गम्मो पोथुज्जनिको अनरियॊ अनत्थसंहितो, यो चायं अत्तकिलमथानुयोगो दुक्खो अनरियो अनत्थसंहितो । एते खो, भिक्खवे, उभो अन्ते अनुपगम्म मज्झिमा पटिपदा तथागतेन अभिसम्बुद्धा चक्खुकरणी जाणकरणी उपसमाय अभिञ्ञाय सम्बोधाय निब्बाणाय संवत्तति ॥',
      transliteration:
        'dveme, bhikkhave, antā pabbajitena na sevitabbā. katame dve? yo cāyaṁ kāmesu kāmasukhallikānuyogo hīno gammo pothujjaniko anariyo anatthasaṁhito, yo cāyaṁ attakilamathānuyogo dukkho anariyo anatthasaṁhito. ete kho, bhikkhave, ubho ante anupagamma majjhimā paṭipadā tathāgatena abhisambuddhā cakkhukaraṇī ñāṇakaraṇī upasamāya abhiññāya sambodhāya nibbāṇāya saṁvattati ||',
      translationEn:
        'These two extremes, monks, should not be practiced by one who has gone forth into homelessness: The pursuit of sensual pleasure in sensual desire, which is low, vulgar, worldly, ignoble, and unbeneficial; and the pursuit of self-mortification, which is painful, ignoble, and unbeneficial. Avoiding both these extremes, the Tathagata has realized the Middle Way (Majjhima Patipada), which gives vision and knowledge, and leads to peace, direct knowledge, supreme enlightenment, and Nibbana.',
      translationHi:
        'भिक्षुओं! संन्यासी को इन दो अतिवादी छोरों का सेवन नहीं करना चाहिए: एक तो काम-सुखों में लिप्त रहना जो हीन और अनर्थकारी है; और दूसरा शरीर को व्यर्थ कष्ट देना जो दुःखद और अहितकर है। इन दोनों छोरों को छोड़कर तथागत ने मध्यम मार्ग का साक्षात्कार किया है, जो शांति, संबोधि और निर्वाण की ओर ले जाता है।',
      sectionTitle: 'Dhammacakkappavattana Sutta — The Middle Path',
    },
    {
      id: 'sn56.11:four_truths',
      unitNumber: 'SN 56.11 (The Four Noble Truths)',
      originalText:
        'इदं खो पन, भिक्खवे, दुक्खं अरियसच्चं—जातिपि दुक्खा, जparampi दुक्खा, मरणम्पि दुक्खं, सोकपरिदेवदुक्खदोमनस्सुपायासापि दुक्खा, अप्पियेहि सम्पयोगो दुक्खो, पियेहि विप्पयोगो दुक्खो, यम्पिच्छं न लभति तम्पि दुक्खं—संखित्तेन पञ्चुपादानक्खन्धा दुक्खा ।\nइदं खो पन, भिक्खवे, दुक्खसमुदयं अरियसच्चं—यायं तण्हा पोनोब्भविका नन्दिरोगसहगता तत्रतत्राभिनन्दिनी, सेय्यथीदं—कामतण्हा, भवतण्हा, विभवतण्हा ॥',
      transliteration:
        'idaṁ kho pana, bhikkhave, dukkhaṁ ariyasaccaṁ—jātipi dukkhā, jarāmpi dukkhā, maraṇampi dukkhaṁ, sokaparidevaduukkhadomanassupāyāsāpi dukkhā, appiyehi sampayogo dukkho, piyehi vippayogo dukkho, yampicchaṁ na labhati tampi dukkhaṁ—saṅkhittena pañcupādānakkhandhā dukkhā |\nidaṁ kho pana, bhikkhave, dukkhasamudayaṁ ariyasaccaṁ—yāyaṁ taṇhā ponobbhavikā nandirāgasahagatā tatratatrābhinandinī, seyyathīdaṁ—kāmataṇhā, bhavataṇhā, vibhavataṇhā ||',
      translationEn:
        'Now this, monks, is the Noble Truth of Suffering (Dukkha): Birth is suffering, aging is suffering, death is suffering; sorrow, lamentation, pain, grief, and despair are suffering; association with the unpleasant is suffering; separation from the pleasant is suffering; not getting what one desires is suffering; in brief, the five aggregates of clinging are suffering.\nNow this, monks, is the Noble Truth of the Origin of Suffering: It is this craving (Tanha) which leads to renewed existence, accompanied by delight and lust, seeking pleasure now here, now there—namely, craving for sensual pleasures, craving for becoming/existence, and craving for non-existence.',
      translationHi:
        'भिक्षुओं! यह दुःख आर्यसत्य है: जन्म दुःख है, वृद्धावस्था दुःख है, मृत्यु दुःख है, शोक और विलाप दुःख हैं; अप्रिय का मिलना और प्रिय का बिछुड़ना दुःख है; संक्षेप में पाँच उपादान स्कंध दुःख हैं। और दुःख का कारण तृष्णा (कामना) है।',
      sectionTitle: 'Dhammacakkappavattana Sutta — The Noble Truths of Dukkha & Origin',
    },
    {
      id: 'heart_sutra:form_emptiness',
      unitNumber: 'Heart Sutra (Prajnaparamita Hridaya)',
      originalText:
        'रूपं शून्यता शून्यतैव रूपम् । रूपान्न पृथक् शून्यता शून्यताया न पृथग् रूपम् । यद् रूपं सा शून्यता या शून्यता तद् रूपम् । एवमेव वेदनासंज्ञासंस्कारविज्ञानानि ॥\nगते गते पारगते पारसंगते बोधि स्वाहा ॥',
      transliteration:
        'rūpaṁ śūnyatā śūnyataiva rūpam | rūpānna pṛthak śūnyatā śūnyatāyā na pṛthag rūpam | yad rūpaṁ sā śūnyatā yā śūnyatā tad rūpam | evameva vedanā-saṁjñā-saṁskāra-vijñānāni ||\ngate gate pāragate pārasaṁgate bodhi svāhā ||',
      translationEn:
        'Form is emptiness, emptiness is form; emptiness does not differ from form, form does not differ from emptiness; whatever is form, that is emptiness; whatever is emptiness, that is form. The same is true of feelings, perceptions, mental formations, and consciousness.\nGone, gone, gone beyond, gone completely beyond to the other shore of Enlightenment, Hail! (Gate gate paragate parasamgate bodhi svaha).',
      translationHi:
        'रूप ही शून्यता है और शून्यता ही रूप है। रूप शून्यता से अलग नहीं और शून्यता रूप से अलग नहीं। इसी प्रकार वेदना, संज्ञा, संस्कार और विज्ञान भी शून्य हैं। पार गए, पूर्ण पार गए, बोधि को उपलब्ध हुए, स्वाहा!',
      sectionTitle: 'Prajnaparamita Heart Sutra (Mahayana Supreme Wisdom)',
      audio: {
        audioUrl:
          '/audio/buddhism/buddhism_suttas_sutras_heart_sutra_prajnaparamita_layperson.ogg',
        performer: 'Traditional Chinese Buddhist Layperson',
        source:
          'Wikimedia Commons (File:Bore_Xinjing_般若心经_(Heart_Sutra)_in_Mandarin_recited_by_a_Chinese_Buddhist_layperson.ogg)',
        license: 'CC0 1.0 Universal',
        isHuman: true,
        licensingTerms:
          'Public Domain Dedication. Authentic human recitation of the Heart Sutra in Mandarin; unrestricted free streaming and redistribution.',
      },
    },
  ],

  // ----------------------------------------------------------------------------
  // 4. KARANIYA METTA SUTTA (The Discourse on Loving-Kindness)
  // ----------------------------------------------------------------------------
  metta_sutta: [
    {
      id: 'metta_sutta:1',
      unitNumber: 'Verse 1-2',
      originalText:
        'करणीयमत्थकुसलेन यन्तं सन्तं पदं अभिसमेच्च ।\nसक्को उजू च सूजू च सुवचो चस्स मुदु अनतिमानी ॥ १ ॥\nसन्तुस्सको च सुभरो च अप्पकिच्चो च सल्लहुकवुत्ति ।\nसन्तिन्द्रियो च निपको च अप्पगब्भो कुलेसु अननुगिद्धो ॥ २ ॥',
      transliteration:
        'karaṇīyamatthakusalena yantaṁ santaṁ padaṁ abhisamecca |\nsakko ujū ca sūjū ca suvaco cassa mudu anatimānī || 1 ||\nsantussako ca subharo ca appakicco ca sallahukavutti |\nsantindriyo ca nipako ca appagabbho kulesu ananugiddho || 2 ||',
      translationEn:
        'This is what should be done by one who is skilled in spiritual goodness, who seeks to realize that State of Peace (Nibbana): Let him be capable, upright, truly straightforward, obedient, gentle, and free from pride; contented, easily supported, with few duties, living lightly; with calmed senses, wise, modest, and not clingingly attached to families.',
      translationHi:
        'जो व्यक्ति अपने कल्याण में कुशल है और जिसने परम शांत पद (निर्वाण) को जान लिया है, उसे समर्थ, सीधा, सच्चा, विनम्र, सरल, मृदुभाषी और अहंकाररहित होना चाहिए। वह संतुष्ट, अल्पभार वाला और संयमित इंद्रियों वाला हो।',
      sectionTitle: 'Qualifications of the Meditator',
      // Audio quarantined under Phase 2 Requirement 4 (CC BY-SA 4.0 ShareAlike compatibility review pending)
    },
    {
      id: 'metta_sutta:7',
      unitNumber: 'Verse 7 (The Mother’s Love Analogy)',
      originalText:
        'माता यथा नियं पुत्तं आयुसा एकपुत्तमनुरक्खे ।\nएवम्पि सब्बभूतेसु मानसं भावये अपरमाणं ॥ ७ ॥',
      transliteration:
        'mātā yathā niyaṁ puttaṁ āyusā ekaputtamanurakkhe |\nevampi sabbabhūtesu mānasaṁ bhāvaye aparimāṇaṁ || 7 ||',
      translationEn:
        'Just as a mother would protect her only child at the risk of her very life, even so let one cultivate an unmeasured, boundless loving-heart toward all living beings.',
      translationHi:
        'जिस प्रकार माता अपने प्राणों की बाजी लगाकर भी अपने एकमात्र पुत्र की रक्षा करती है, उसी प्रकार समस्त प्राणियों के प्रति अपरिमित मैत्री-भाव की भावना करनी चाहिए।',
      sectionTitle: 'The Supreme Radiance of Boundless Compassion',
    },
    {
      id: 'metta_sutta:8',
      unitNumber: 'Verse 8 (Radiating in Ten Directions)',
      originalText:
        'मेत्तं च सब्बलोकस्मिं मानसं भावये अपरमाणं ।\nउद्धं अधो च तिरियं च असम्बाधं अवेरं असपत्तं ॥ ८ ॥',
      transliteration:
        'mettaṁ ca sabbalokasmiṁ mānasaṁ bhāvaye aparimāṇaṁ |\nuddhaṁ adho ca tiriyaṁ ca asambādhaṁ averaṁ asapattaṁ || 8 ||',
      translationEn:
        'Let one radiate boundless loving-kindness toward the entire universe—above, below, and across—without obstruction, without any hatred, and without any enmity.',
      translationHi:
        'समस्त संसार के प्रति ऊपर, नीचे और चारों दिशाओं में बाधा रहित, वैररहित और शत्रुतारहित अपरिमित मैत्री भावना का प्रसार करना चाहिए।',
      sectionTitle: 'Universal Radiation in All Directions',
    },
  ],

  // ----------------------------------------------------------------------------
  // 5. MAHA MANGALA SUTTA (The Supreme Blessings)
  // ----------------------------------------------------------------------------
  mangala_sutta: [
    {
      id: 'mangala_sutta:1',
      unitNumber: 'Verse 1-2',
      originalText:
        'बहू देवा मनुस्सा च मङ्गलानि अचिन्तयुं ।\nआकङ्खमाना सोत्थानं ब्रूहि मङ्गलमुत्तमं ॥ १ ॥\nअसेवना च बालानं पण्डितानं च सेवना ।\nपूजा च पूजनेय्यानं एतं मङ्गलमुत्तमं ॥ २ ॥',
      transliteration:
        'bahū devā manussā ca maṅgalāni acintayuṁ |\nākaṅkhamānā sotthānaṁ brūhi maṅgalamuttamaṁ || 1 ||\nasevanā ca bālānaṁ paṇḍitānaṁ ca sevanā |\npūjā ca pūjaneyyānaṁ etaṁ maṅgalamuttamaṁ || 2 ||',
      translationEn:
        'Many deities and human beings, yearning for genuine well-being, have pondered upon what constitutes true blessing. Declare, O Buddha, what is the highest blessing!\nThe Buddha replied: Not associating with the foolish; associating with the wise; and honoring those worthy of honor: this is the supreme blessing.',
      translationHi:
        'देवताओं और मनुष्यों ने परम कल्याण की इच्छा से अनेक मंगलों का विचार किया। हे भगवन्! आप सर्वश्रेष्ठ मंगल बताइए!\nबुद्ध बोले: मूर्खों की संगति न करना, बुद्धिमानों की संगति करना, और पूजनीय व्यक्तियों का सत्कार करना—यही सर्वश्रेष्ठ मंगल है।',
      sectionTitle: 'Maha Mangala Sutta — Foundational Blessings',
      // Audio quarantined under Phase 2 Requirement 4 (CC BY-SA 4.0 ShareAlike compatibility review pending)
    },
    {
      id: 'mangala_sutta:11',
      unitNumber: 'Verse 11 (The Unshakable Mind)',
      originalText:
        'फुट्ठस्स लोकधम्मेहि चित्तं यस्स न कम्पति ।\nअसोकं विरजं खेमं एतं मङ्गलमुत्तमं ॥ ११ ॥',
      transliteration:
        'phuṭṭhassa lokadhammehi cittaṁ yassa na kampati |\nasokaṁ virajaṁ khemaṁ etaṁ maṅgalamuttamaṁ || 11 ||',
      translationEn:
        'Although touched by the eight worldly conditions (gain and loss, fame and disrepute, praise and blame, pleasure and pain), one whose mind remains steadfast, unshaken, sorrowless, stainless, and secure: this is the supreme blessing.',
      translationHi:
        'संसार के आठ धर्मों (लाभ-हानि, यश-अपयश, निन्दा-स्तुति, सुख-दुःख) से प्रभावित होने पर भी जिसका चित्त डोलता नहीं, जो शोक-रहित, निर्मल और निर्भय रहता है—यही सर्वश्रेष्ठ मंगल है।',
      sectionTitle: 'Maha Mangala Sutta — The Unshakeable Mind',
    },
  ],

  // ----------------------------------------------------------------------------
  // 6. BUDDHIST CHANTS, REFUGES & PARITTAS
  // ----------------------------------------------------------------------------
  chants_parittas: [
    {
      id: 'chants:ti_sarana',
      unitNumber: 'The Three Refuges (Ti-sarana)',
      originalText:
        'बुद्धं सरणं गच्छामि ।\nधम्मं सरणं गच्छामि ।\nसंघं सरणं गच्छामि ॥\nदुतियम्पि बुद्धं सरणं गच्छामि... ततियम्पि बुद्धं सरणं गच्छामि...',
      transliteration:
        'buddhaṁ saraṇaṁ gacchāmi |\ndhammaṁ saraṇaṁ gacchāmi |\nsaṅghaṁ saraṇaṁ gacchāmi ||\ndutiyampi buddhaṁ saraṇaṁ gacchāmi... tatiyampi buddhaṁ saraṇaṁ gacchāmi...',
      translationEn:
        'I go to the Buddha for refuge (the Awakened One, supreme teacher).\nI go to the Dhamma for refuge (the Truth, the Path, the reality of things).\nI go to the Sangha for refuge (the noble community of enlightened practitioners).\nA second time I go for refuge... A third time I go for refuge...',
      translationHi:
        'मैं बुद्ध की शरण जाता हूँ। मैं धर्म की शरण जाता हूँ। मैं संघ की शरण जाता हूँ। दूसरी बार भी... तीसरी बार भी...',
      sectionTitle: 'Ti-sarana — The Three Sacred Refuges',
    },
    {
      id: 'chants:panca_sila',
      unitNumber: 'The Five Moral Precepts (Panca-sila)',
      originalText:
        '१. पाणातिपाता वेरमणी सिक्खापदं समादियामि ।\n२. अदिन्नादाना वेरमणी सिक्खापदं समादियामि ।\n३. कामेसुमिच्छाचारा वेरमणी सिक्खापदं समादियामि ।\n४. मुसावादा वेरमणी सिक्खापदं समादियामि ।\n५. सुरामेरयमज्जपमादट्ठाना वेरमणी सिक्खापदं समादियामि ॥',
      transliteration:
        '1. pāṇātipātā veramaṇī sikkhāpadaṁ samādiyāmi |\n2. adinnādānā veramaṇī sikkhāpadaṁ samādiyāmi |\n3. kāmesumicchācārā veramaṇī sikkhāpadaṁ samādiyāmi |\n4. musāvādā veramaṇī sikkhāpadaṁ samādiyāmi |\n5. surāmerayamajjapamādaṭṭhānā veramaṇī sikkhāpadaṁ samādiyāmi ||',
      translationEn:
        '1. I undertake the precept to refrain from harming living beings.\n2. I undertake the precept to refrain from taking what is not given.\n3. I undertake the precept to refrain from sexual misconduct.\n4. I undertake the precept to refrain from false speech.\n5. I undertake the precept to refrain from intoxicating drinks and substances that cause heedlessness.',
      translationHi:
        '१. मैं जीव-हिंसा से विरत रहने की प्रतिज्ञा करता हूँ।\n२. मैं चोरी न करने की प्रतिज्ञा करता हूँ।\n३. मैं व्यभिचार से विरत रहने की प्रतिज्ञा करता हूँ।\n४. मैं असत्य न बोलने की प्रतिज्ञा करता हूँ।\n५. मैं मद्यपान और प्रमाद उत्पन्न करने वाले पदार्थों से विरत रहने की प्रतिज्ञा करता हूँ।',
      sectionTitle: 'Panca-sila — The Five Moral Precepts',
    },
    {
      id: 'chants:buddhavandana',
      unitNumber: 'Buddhavandana',
      originalText:
        'नमो तस्स भगवतो अरहतो सम्मासम्बुद्धस्स ॥\nइतिपि सो भगवा अरहं सम्मासम्बुद्धो विज्जाचरणसम्पन्नो सुगतो लोकविदू अनुत्तरो पुरिसदम्मसारथी सत्था देवमनुस्सानं बुद्धो भगवाति ॥',
      transliteration:
        'namo tassa bhagavato arahato sammāsambuddhassa ||\nitipi so bhagavā arahaṁ sammāsambuddho vijjācaraṇasampanno sugato lokavidū anuttaro purisadammasārathī satthā devamanussānaṁ buddho bhagavāti ||',
      translationEn:
        'Homage to the Blessed One, the Worthy One, the Fully Self-Enlightened Buddha!\nSuch indeed is the Blessed One: Worthy, fully self-enlightened, endowed with clear vision and right conduct, sublime, knower of the cosmos, incomparable leader of persons to be tamed, teacher of gods and humans, the Awakened One, the Blessed Lord.',
      translationHi:
        'उन भगवान्, अर्हत्, सम्यक् संबुद्ध को नमस्कार!\nवे भगवान् अर्हत् हैं, सम्यक् संबुद्ध हैं, विद्या और आचरण से संपन्न हैं, सुगत हैं, लोकज्ञ हैं, अद्वितीय सारथी हैं, देव और मनुष्यों के शास्ता हैं।',
      sectionTitle: 'Buddhavandana (Homage to the Blessed One)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 7. CANONICAL MEDITATION INSTRUCTIONS (Anapanasati Sutta MN 118)
  // ----------------------------------------------------------------------------
  meditation_instructions: [
    {
      id: 'anapanasati:tetrad_1',
      unitNumber: 'First Tetrad (Mindfulness of Body)',
      originalText:
        'दीघं वा अस्ससन्तो "दीघं अस्ससामी"ति पजानाति, दीघं वा पस्ससन्तो "दीघं पस्ससामी"ति पजानाति ।\nरस्सं वा अस्ससन्तो "रस्सं अस्ससामी"ति पजानाति, रस्सं वा पस्ससन्तो "रस्सं पस्ससामी"ति पजानाति ।\n"सब्बकायपटिसंवेदी अस्ससिस्सामी"ति सिक्खति, "सब्बकायपटिसंवेदी पस्ससिस्सामी"ति सिक्खति ।\n"पस्सम्भयं कायसंखारं अस्ससिस्सामी"ति सिक्खति, "पस्सम्भयं कायसंखारं पस्ससिस्सामी"ति सिक्खति ॥',
      transliteration:
        'dīghaṁ vā assasanto "dīghaṁ assasāmī"ti pajānāti, dīghaṁ vā passasanto "dīghaṁ passasāmī"ti pajānāti |\nrassaṁ vā assasanto "rassaṁ assasāmī"ti pajānāti, rassaṁ vā passasanto "rassaṁ passasāmī"ti pajānāti |\n"sabbakāyapaṭisaṁvedī assasissāmī"ti sikkhati, "sabbakāyapaṭisaṁvedī passasissāmī"ti sikkhati |\n"passambhayaṁ kāyasaṅkhāraṁ assasissāmī"ti sikkhati, "passambhayaṁ kāyasaṅkhāraṁ passasissāmī"ti sikkhati ||',
      translationEn:
        'Breathing in long, he discerns: "I breathe in long"; breathing out long, he discerns: "I breathe out long."\nBreathing in short, he discerns: "I breathe in short"; breathing out short, he discerns: "I breathe out short."\nHe trains himself: "Experiencing the whole body of breath, I will breathe in"; he trains himself: "Experiencing the whole body of breath, I will breathe out."\nHe trains himself: "Calming bodily formation, I will breathe in"; he trains himself: "Calming bodily formation, I will breathe out."',
      translationHi:
        'लंबा श्वास लेते हुए जानता है कि मैं लंबा श्वास ले रहा हूँ; लंबा श्वास छोड़ते हुए जानता है कि मैं लंबा श्वास छोड़ रहा हूँ।\nछोटा श्वास लेते हुए जानता है कि मैं छोटा श्वास ले रहा हूँ।\n“संपूर्ण श्वास-प्रश्वास के शरीर का अनुभव करते हुए मैं श्वास लूँगा/छोड़ूँगा”—ऐसा अभ्यास करता है।\n“शरीर के तनाव को शांत करते हुए मैं श्वास लूँगा/छोड़ूँगा”—ऐसा अभ्यास करता है।',
      sectionTitle: 'Anapanasati Sutta (MN 118) — First Tetrad (Contemplation of Breath)',
    },
    {
      id: 'anapanasati:tetrad_4',
      unitNumber: 'Fourth Tetrad (Contemplation of Dhamma)',
      originalText:
        '"अनिच्चानुपस्सी अस्ससिस्सामी"ति सिक्खति, "अनिच्चानुपस्सी पस्ससिस्सामी"ति सिक्खति ।\n"विरागानुपस्सी अस्ससिस्सामी"ति सिक्खति, "विरागानुपस्सी पस्ससिस्सामी"ति सिक्खति ।\n"निरोधानुपस्सी अस्ससिस्सामी"ति सिक्खति, "निरोधानुपस्सी पस्ससिस्सामी"ति सिक्खति ।\n"पटिनिस्सग्गानुपस्सी अस्ससिस्सामी"ति सिक्खति, "पटिनिस्सग्गानुपस्सी पस्ससिस्सामी"ति सिक्खति ॥',
      transliteration:
        '"aniccānupassī assasissāmī"ti sikkhati, "aniccānupassī passasissāmī"ti sikkhati |\n"virāgānupassī assasissāmī"ti sikkhati, "virāgānupassī passasissāmī"ti sikkhati |\n"nirodhānupassī assasissāmī"ti sikkhati, "nirodhānupassī passasissāmī"ti sikkhati |\n"paṭinissaggānupassī assasissāmī"ti sikkhati, "paṭinissaggānupassī passasissāmī"ti sikkhati ||',
      translationEn:
        'He trains himself: "Contemplating impermanence (Anicca), I will breathe in"; "Contemplating impermanence, I will breathe out."\nHe trains himself: "Contemplating fading of passion (Viraga), I will breathe in / breathe out."\nHe trains himself: "Contemplating cessation (Nirodha), I will breathe in / breathe out."\nHe trains himself: "Contemplating relinquishment and letting go (Patinissagga), I will breathe in; contemplating relinquishment, I will breathe out."',
      translationHi:
        '“अनित्यता का दर्शन करते हुए श्वास लूँगा/छोड़ूँगा”; “विराग का दर्शन करते हुए श्वास लूँगा/छोड़ूँगा”; “निरोध का दर्शन करते हुए श्वास लूँगा/छोड़ूँगा”; और “सर्वस्व त्याग (समर्पण) का दर्शन करते हुए श्वास लूँगा/छोड़ूँगा”—ऐसा अभ्यास करता है।',
      sectionTitle: 'Anapanasati Sutta — Fourth Tetrad (Insight into Liberation)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 8. GUIDED MEDITATION SCRIPTS (Metta Bhavana)
  // ----------------------------------------------------------------------------
  guided_meditation: [
    {
      id: 'guided:metta_stages',
      unitNumber: 'Five-Stage Metta Bhavana Script',
      originalText:
        '१. अहमेव पठमाय मेत्तं भावयामि (अत्तनि) ।\n२. ततो कल्याणमित्ते पियायके ।\n३. ततो मज्झत्ते उदासीने पुग्गले ।\n४. ततो वेरिके पच्चत्थिके ।\n५. ततो सीमसंभेदं कत्वा सब्बलोके सब्बसत्तेसु ॥',
      transliteration:
        '1. ahameva paṭhamāya mettaṁ bhāvayāmi (attani) |\n2. tato kalyāṇamitte piyāyake |\n3. tato majjhatte udāsīne puggale |\n4. tato verike paccatthike |\n5. tato sīmasaṁbhedaṁ katvā sabbaloke sabbasattesu ||',
      translationEn:
        'The Classical Five Stages of Developing Loving-Kindness (Visuddhimagga):\nStage 1: Cultivating Metta toward oneself ("May I be free from hostility, free from suffering, may I abide in peace").\nStage 2: Radiating toward a revered benefactor or beloved mentor.\nStage 3: Radiating toward a neutral person toward whom neither affection nor aversion is held.\nStage 4: Radiating toward a difficult person, dismantling barriers of resentment.\nStage 5: Breaking all boundaries (Sima-sambheda), radiating unconditional goodwill equally to all beings across all worlds.',
      translationHi:
        'मैत्री भावना के पाँच चरण:\n१. स्वयं के प्रति मैत्री भावना,\n२. प्रिय गुरु/मित्र के प्रति,\n३. तटस्थ व्यक्ति के प्रति,\n४. प्रतिकूल/कठिन व्यक्ति के प्रति (द्वेष मिटाकर),\n५. सीमा-भेद करके संपूर्ण चराचर जगत के सभी प्राणियों के प्रति समान मैत्री।',
      sectionTitle: 'Metta Bhavana — Five Progressive Stages of Compassion',
    },
    {
      id: 'guided:four_immeasurables',
      unitNumber: 'The Four Immeasurables (Brahmaviharas)',
      originalText:
        'सब्बे सत्ता सुखी होन्तु (मेत्ता) ।\nसब्बे सत्ता दुक्खा मुच्चन्तु (करुणा) ।\nसब्बे सत्ता मा लद्धसम्पत्तितो विगच्छन्तु (मुदिता) ।\nसब्बे सत्ता कम्मस्सका (उपेक्खा) ॥',
      transliteration:
        'sabbe sattā sukhī hontu (mettā) |\nsabbe sattā dukkhā muccantu (karuṇā) |\nsabbe sattā mā laddhasampattito vigacchantu (muditā) |\nsabbe sattā kammassakā (upekkhā) ||',
      translationEn:
        'May all beings be happy and peaceful (Metta / Loving-Kindness).\nMay all beings be liberated from pain and suffering (Karuna / Compassion).\nMay all beings never be separated from their spiritual joy and prosperity (Mudita / Sympathetic Joy).\nAll beings are owners of their karma, heirs to their karma; may they abide in equanimity (Upekkha / Equanimity).',
      translationHi:
        'सभी प्राणी सुखी हों (मैत्री)।\nसभी प्राणी दुःखों से मुक्त हों (करुणा)।\nसभी प्राणी प्राप्त सुख-समृद्धि से वंचित न हों (मुदिता)।\nसभी प्राणी अपने कर्मों के स्वामी हैं; सबका मन समता में स्थित रहे (उपेक्षा)।',
      sectionTitle: 'The Four Sublime Abodes (Brahmaviharas)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 9. BUDDHIST FESTIVAL READINGS & BODHISATTVA VOWS
  // ----------------------------------------------------------------------------
  prayers_festivals: [
    {
      id: 'festival:vesak',
      unitNumber: 'Vesak (Buddha Purnima) Triple Celebration',
      originalText:
        'जातो लुम्बिनीवने, बोधिसत्तो महायसो ।\nबोधिंगतो बोधिमूले, संबुद्धो लोकनायकॊ ।\nकुसिनारायं निब्बुतो, तं नमामि तथागतं ॥',
      transliteration:
        'jāto lumbinīvane, bodhisatto mahāyaso |\nbodhiṁgato bodhimūle, sambuddho lokanāyako |\nkusinārāyaṁ nibbuto, taṁ namāmi tathāgataṁ ||',
      translationEn:
        'Born as the glorious Bodhisatta in the garden grove of Lumbini;\nAttaining supreme Enlightenment (Sambodhi) beneath the sacred Bodhi tree at Bodh Gaya;\nAttaining Parinibbana between the twin Sala trees at Kusinara;\nTo that Tathagata, supreme leader of the world, I bow with reverence on this holy Vesak full moon!',
      translationHi:
        'लुम्बिनी के वन में जिनका जन्म हुआ, बोधगया के बोधिवृक्ष के नीचे जिन्होंने सम्यक् संबोधि प्राप्त की, और कुशीनगर में जिनका महापरिनिर्वाण हुआ—उन तथागत बुद्ध को वैशाख पूर्णिमा पर मेरा शत-शत नमन।',
      sectionTitle: 'Vesak Commemoration — Birth, Enlightenment & Parinibbana',
    },
    {
      id: 'festival:bodhisattva_vows',
      unitNumber: 'The Four Great Bodhisattva Vows (Mahayana)',
      originalText:
        'सत्त्वा ह्यसंख्याः प्रणिदधामि तारणाय ।\nक्लेशा ह्यनन्ताः प्रणिदधामि छेदनाय ।\nधर्ममुखाण्यपरिमाणानि प्रणिदधामि शिक्षायै ।\nबुद्धमार्गोऽनुत्तरः प्रणिदधामि साक्षात्करणाय ॥',
      transliteration:
        'sattvā hyasaṁkhyāḥ praṇidadhāmi tāraṇāya |\nkleśā hyanantāḥ praṇidadhāmi chedanāya |\ndharmamukhānyaparimāṇāni praṇidadhāmi śikṣāyai |\nbuddhamārgo\'nuttaraḥ praṇidadhāmi sākṣātkaraṇāya ||',
      translationEn:
        'The Four Great Bodhisattva Vows:\n1. Sentient beings are numberless: I vow to liberate them all.\n2. Delusions and afflictions are endless: I vow to eradicate them all.\n3. Dharma gates are measureless: I vow to master them all.\n4. The Buddha Way is supreme and unsurpassable: I vow to attain it fully for the sake of all.',
      translationHi:
        'चार महान बोधिसत्त्व प्रणिधान:\n१. असंख्य प्राणियों का मैं उद्धार करूँगा।\n२. अनंत क्लेशों का मैं नाश करूँगा।\n३. अपरिमित धर्म-द्वारों को मैं सीखूँगा।\n४. अनुत्तर बुद्धत्व का मैं साक्षात्कार करूँगा।',
      sectionTitle: 'The Four Inexhaustible Bodhisattva Vows',
    },
    {
      id: 'festival:mani_mantra',
      unitNumber: 'Avalokiteshvara Maha Mantra (Vajrayana / Mahayana)',
      originalText: 'ॐ मणि पद्मे हूँ ॥',
      transliteration: 'oṁ maṇi padme hūṁ ||',
      translationEn:
        'AUM. Hail to the Jewel in the Lotus! The six-syllable sacred dharani of Bodhisattva Avalokiteshvara (Chenrezig) embodying universal compassion. Chanted to purify the six realms of cyclic existence (Samsara) and establish all beings in pure compassion.',
      translationHi:
        'ॐ मणि पद्मे हूँ। कमल में स्थित दिव्य मणि (करुणा और प्रज्ञा) को नमन!',
      sectionTitle: 'The Six-Syllable Compassion Mantra (Chenrezig)',
    },
  ],
};
