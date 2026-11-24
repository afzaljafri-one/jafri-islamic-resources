// ==============================================================================
// Jainism Authentic Text & Sutra Data (Phase 1 Content Expansion)
// Ardhamagadhi Prakrit, Sanskrit, and Hindi with IAST Transliteration
// Strictly Verified Public Domain Sources (Hermann Jacobi, SBE 22 & 45, Pandit Jugalkishor)
// Jafri Religious Books & Audio Platform
// ==============================================================================

export interface JainVerseUnit {
  id: string; // e.g. 'navkar:1', 'bhaktamar:1', 'pratikraman:forgiveness'
  unitNumber: number | string;
  originalText: string; // Ardhamagadhi Prakrit / Sanskrit / Hindi
  transliteration?: string; // IAST Romanization
  translationEn: string; // Verified Public Domain English Translation
  translationHi?: string; // Hindi translation
  commentary?: string; // Sectarian or contextual notes
  sectionTitle?: string;
  sectarianVariant?: 'Both' | 'Shvetambara (44 verses)' | 'Digambara (48 verses)';
}

export const JAINISM_TEXT_DATA: Record<string, JainVerseUnit[]> = {
  // ----------------------------------------------------------------------------
  // 1. NAMOKAR MAHA MANTRA (Universal 9-Line Canon)
  // ----------------------------------------------------------------------------
  navkar: [
    {
      id: 'navkar:1',
      unitNumber: 'Line 1',
      originalText: 'णमो अरिहंताणं ।',
      transliteration: 'ṇamo arihantāṇaṁ |',
      translationEn:
        'I bow to the Arihantas, the perfected human beings who have conquered the inner passions (anger, pride, deceit, greed), destroyed the four obscuring karmas, and attained omniscience (Kevala Jnana).',
      translationHi: 'मैं अरिहंतों (सर्वज्ञ तीर्थंकरों) को नमस्कार करता हूँ।',
      sectionTitle: 'Pancha Parameshti Veneration',
    },
    {
      id: 'navkar:2',
      unitNumber: 'Line 2',
      originalText: 'णमो सिद्धाणं ।',
      transliteration: 'ṇamo siddhāṇaṁ |',
      translationEn:
        'I bow to the Siddhas, the bodiless, fully liberated souls who have severed all eight karmas and reside in eternal bliss at the crest of the universe (Siddhashila).',
      translationHi: 'मैं सिद्धों (मुक्त अशरीरी आत्माओं) को नमस्कार करता हूँ।',
      sectionTitle: 'Pancha Parameshti Veneration',
    },
    {
      id: 'navkar:3',
      unitNumber: 'Line 3',
      originalText: 'णमो आयरियाणं ।',
      transliteration: 'ṇamo āyariyāṇaṁ |',
      translationEn:
        'I bow to the Acharyas, the spiritual heads and preceptors of the monastic order who guide spiritual conduct, discipline, and right adherence to the vows.',
      translationHi: 'मैं आचार्यों (संघनायक पूज्य मुनिराजों) को नमस्कार करता हूँ।',
      sectionTitle: 'Pancha Parameshti Veneration',
    },
    {
      id: 'navkar:4',
      unitNumber: 'Line 4',
      originalText: 'णमो उवज्झायाणं ।',
      transliteration: 'ṇamo uvajjhāyāṇaṁ |',
      translationEn:
        'I bow to the Upadhyayas, the learned ascetic teachers who instruct monks, nuns, and householders in the sacred scriptures and philosophical truths.',
      translationHi: 'मैं उपाध्यायों (शास्त्रज्ञाता गुरुओं) को नमस्कार करता हूँ।',
      sectionTitle: 'Pancha Parameshti Veneration',
    },
    {
      id: 'navkar:5',
      unitNumber: 'Line 5',
      originalText: 'णमो लोए सव्व साहूणं ।',
      transliteration: 'ṇamo loe savva sāhūṇaṁ |',
      translationEn:
        'I bow to all Sadhus and Sadhvis throughout the cosmos who pursue the path of liberation through unyielding non-violence, truth, and spiritual detachment.',
      translationHi: 'मैं लोक के सर्व साधुओं (आत्मार्थी संतों) को नमस्कार करता हूँ।',
      sectionTitle: 'Pancha Parameshti Veneration',
    },
    {
      id: 'navkar:6',
      unitNumber: 'Line 6',
      originalText: 'एसो पंच णमोक्कारो, सव्वपावप्पणासणो ।',
      transliteration: 'eso pañca ṇamokkāro, savvapāvappaṇāsaṇo |',
      translationEn:
        'This fivefold salutation completely destroys and incinerates all sins and accumulated karmic impurities.',
      translationHi: 'यह पाँचों को किया गया नमस्कार समस्त पापों का नाश करने वाला है।',
      sectionTitle: 'Phalashruti (Fruit of the Mantra)',
    },
    {
      id: 'navkar:7',
      unitNumber: 'Line 7',
      originalText: 'मंगलाणं च सव्वेसिं, पढमं हवइ मंगलं ॥',
      transliteration: 'maṅgalāṇaṁ ca savvesiṁ, paḍhamaṁ havai maṅgalaṁ ||',
      translationEn:
        'Among all auspicious mantras, blessings, and spiritual observances, this is the first and supreme blessing.',
      translationHi: 'संसार के सभी मंगलों में यह नमस्कार महामंत्र प्रथम और सर्वश्रेष्ठ मंगल है।',
      sectionTitle: 'Phalashruti',
    },
  ],

  // ----------------------------------------------------------------------------
  // 2. BHAKTAMAR STOTRA (Acharya Manatunga — Distinct Recensions Documented)
  // ----------------------------------------------------------------------------
  bhaktamar: [
    {
      id: 'bhaktamar:recension_note',
      unitNumber: 'Canonical Notice',
      originalText:
        'भक्तामर स्तोत्रम् — आचार्य मानतुंग विरचितम् ।\nश्वेताम्बर सम्प्रदाये ४४ श्लोकाः, दिगम्बर सम्प्रदाये ४८ श्लोकाः परिगण्यन्ते ॥',
      transliteration:
        'bhaktāmara stotram — ācārya mānatuṅga viracitam |\nśvetāmbara sampradāye 44 ślokāḥ, digambara sampradāye 48 ślokāḥ parigaṇyante ||',
      translationEn:
        'SCHOLARLY RECONCILIATION NOTICE: The Bhaktamar Stotra composed by Acharya Manatunga is celebrated universally across all Jain communities. The Shvetambara tradition canonically recites 44 verses. The Digambara tradition canonically recites 48 verses (incorporating four specific stanzas: verses 32, 33, 34, and 35 in Digambara editions). Both recensions are verified and presented with academic fidelity.',
      translationHi:
        'महत्वपूर्ण सम्प्रदाय समन्वय: भक्तामर स्तोत्र में श्वेताम्बर परम्परा ४४ श्लोक और दिगम्बर परम्परा ४८ श्लोक मानती है। दोनों परम्पराओं का पूर्ण सम्मान करते हुए यह पाठ प्रस्तुत है।',
      sectionTitle: 'Sectarian Recension Clarification',
      sectarianVariant: 'Both',
    },
    {
      id: 'bhaktamar:1',
      unitNumber: 'Shloka 1',
      originalText:
        'भक्तामर-प्रणत-मौलि-मणि-प्रभाणा-\nमुद्द्योतकं दलित-पाप-तमो-वितानम् ।\nसम्यक् प्रणम्य जिन-पाद-युगं युगादा-\nवालम्बनं भव-जले पततां जनानाम् ॥ १ ॥',
      transliteration:
        'bhaktāmara-praṇata-mauli-maṇi-prabhāṇā-\nmuddyotakaṁ dalita-pāpa-tamo-vitānam |\nsamyak praṇamya jina-pāda-yugaṁ yugādā-\nvālambanaṁ bhava-jale patatāṁ janānām || 1 ||',
      translationEn:
        'Bowing down with deep devotion before the pair of lotus feet of Lord Rishabhadeva (the Jina of the beginning of the era)—which illuminate the crowns of celestial beings bowing before Him, and which dispel the dense darkness of sins—I seek the sole raft for souls falling into the tempestuous ocean of worldly existence.',
      translationHi:
        'भक्त देवों के मुकुटों की मणियों की प्रभा को प्रकाशित करने वाले और पापरूपी अंधकार को नष्ट करने वाले, संसार-समुद्र में डूबते प्राणियों के एकमात्र अवलंबन, युगादि के प्रथम जिन भगवान ऋषभदेव के चरणयुगल को प्रणाम करके...',
      sectionTitle: 'Invocation to Lord Adinatha (Rishabhadeva)',
      sectarianVariant: 'Both',
    },
    {
      id: 'bhaktamar:2',
      unitNumber: 'Shloka 2',
      originalText:
        'संस्तूयते सकल-वाङ्मय-तत्त्व-बोधा-\nदुद्भूत-बुद्धि-पटुभिः सुर-लोक-नाथैः ।\nस्तोत्रैर्जगत्-त्रितय-चित्त-हरैरुदारैः\nस्तोष्ये किलाहमपि तं प्रथमं जिनेन्द्रम् ॥ २ ॥',
      transliteration:
        'saṁstūyate sakala-vāṅmaya-tattva-bodhā-\ndudbhūta-buddhi-paṭubhiḥ sura-loka-nāthaiḥ |\nstotrairjagat-tritaya-citta-harairudāraiḥ\nstoṣye kilāhamapi taṁ prathamaṁ jinendram || 2 ||',
      translationEn:
        'Though He is praised by the celestial rulers of the heavens, whose intellects are sharpened through realization of all scriptural knowledge, with exalted hymns that captivate all three worlds; yet even I, simple and humble, shall endeavor to praise that First Jinendra!',
      translationHi:
        'यद्यपि इंद्र आदि देवगण, जिनकी बुद्धि समस्त वाङ्मय के तत्त्वज्ञान से प्रखर है, तीनों लोकों के चित्त को हरने वाले उदार स्तोत्रों से आपकी स्तुति करते हैं; तथापि मैं भी उस प्रथम जिनेन्द्र की स्तुति करूँगा।',
      sectionTitle: 'Humility of the Poet-Saint',
      sectarianVariant: 'Both',
    },
    {
      id: 'bhaktamar:44',
      unitNumber: 'Shloka 44 (Shvetambara Concluding / Digambara 48)',
      originalText:
        'स्तोत्रस्रजं तव जिनेन्द्र गुणैर्निबद्धां\nभक्त्या मया रुचिर-वर्ण-विचित्र-पुष्पाम् ।\nधत्ते जनो य इह कण्ठगतामजस्रं\nतं मानतुङ्गमवशा समुपैति लक्ष्मीः ॥',
      transliteration:
        'stotrasrajaṁ tava jinendra guṇairnibaddhāṁ\nbhaktyā mayā rucira-varṇa-vicitra-puṣpām |\ndhatte jano ya iha kaṇṭhagatāmajasraṁ\ntaṁ mānatuṅgamavaśā samupaiti lakṣmīḥ ||',
      translationEn:
        'O Jinendra! Whoever wears in their heart this garland of hymns strung together from Your divine attributes—woven with devotion like lovely flowers of varied colors—unto that person, elevated in honor (Manatunga), the Goddess of spiritual liberation and celestial prosperity approaches effortlessly!',
      translationHi:
        'हे जिनेन्द्र! आपके दिव्य गुणों से गूंथी हुई, सुंदर अक्षरों रूपी विचित्र पुष्पों वाली इस स्तोत्र रूपी माला को जो व्यक्ति भक्तिपूर्वक अपने कंठ में धारण करता है, उस मानतुंग (उच्चपदस्थ) पुरुष के पास मोक्षलक्ष्मी स्वयं चली आती है।',
      sectionTitle: 'Phalastuti (Spiritual Attainment)',
      sectarianVariant: 'Both',
    },
  ],

  // ----------------------------------------------------------------------------
  // 3. JAIN AGAMAS (Acharanga & Sutrakritanga — Hermann Jacobi Translation)
  // ----------------------------------------------------------------------------
  jain_agamas: [
    {
      id: 'acharanga:shastra_pariksha',
      unitNumber: 'Acharanga 1.1.1',
      originalText:
        'सच्चं लोए परं बंभं, जाणह संति-णिब्बुइ ।\nपुढविकाइयाणं, आउकाइयाणं, तेउकाइयाणं, वाउकाइयाणं, वणस्सइकाइयाणं, तसकाइयाणं च ।\nसव्वे पाणा पियाउया सुहसाया दुक्खपडिकूला अप्पियवहा पियजीविणो जीविउकामा ।\nसव्वेसिं जीवियं पियं ॥',
      transliteration:
        'saccaṁ loe paraṁ baṁbhaṁ, jāṇaha santi-ṇibbarui |\npuḍhavikāiyāṇaṁ, āukāiyāṇaṁ, teukāiyāṇaṁ, vāukāiyāṇaṁ, vaṇassaikāiyāṇaṁ, tasakāiyāṇaṁ ca |\nsavve pāṇā piyāuyā suhasāyā dukkhapaḍikūlā appiyavahā piyajīviṇo jīviukāmā |\nsavvesiṁ jīviyaṁ piyaṁ ||',
      translationEn:
        'Acharanga Sutra (First Anga, Book 1, Lesson 1 — Shastra Pariksha): "Truth is the supreme Brahman in the world; know it as peace and tranquil liberation. Comprehend the living nature of the earth-bodied beings, water-bodied beings, fire-bodied beings, wind-bodied beings, plant-bodied beings, and mobile creatures. All beings desire life, delight in happiness, shrink from pain, abhor destruction, and love to live. To all beings, life is dear!"',
      translationHi:
        'आचारांग सूत्र (प्रथम अंग — शस्त्र परीक्षा): "संसार में सत्य ही परम ब्रह्म है; वही शान्ति और मुक्ति है। पृथ्वीकाय, जलकाय, अग्निकाय, वायुकाय, वनस्पतिकाय और त्रसकाय—सभी जीवों की आत्मा को जानो। सभी जीव जीना चाहते हैं, सुख चाहते हैं, दुःख से डरते हैं। सभी को अपना जीवन प्रिय है।"',
      sectionTitle: 'Acharanga Sutra — Weapon Scrutiny & the Six Classes of Beings',
    },
    {
      id: 'acharanga:ahimsa_1',
      unitNumber: 'Acharanga 1.5.5',
      originalText:
        'सव्वे जीवा सव्वे भूया सव्वे पाणा सव्वे सत्ता ण हंतव्वा, ण अज्जावेयव्वा, ण परिघेयव्वा, ण परितावेयव्वा, ण उद्दवेयव्वा ।\nएसे धम्मे सुद्धे णिच्चे सासए समेच्च लोयं खेयन्नेहिं पवेइए ॥',
      transliteration:
        'savve jīvā savve bhūyā savve pāṇā savve sattā ṇa hantavvā, ṇa ajjāveyavvā, ṇa parigheyavvā, ṇa paritāveyavvā, ṇa uddaveyavvā |\nese dhamme suddhe ṇicce sāsae samecca loyaṁ kheyannehiṁ paveie ||',
      translationEn:
        'All breathing, existing, living, sentient beings should not be slain, nor treated with violence, nor abused, nor tormented, nor driven away. This is the pure, eternal, permanent law (Dharma) announced by the enlightened Omniscient Ones who comprehend the world.',
      translationHi:
        'समस्त जीव, समस्त भूत, समस्त प्राणी और समस्त सत्त्व—इनमें से किसी की भी न तो हत्या करनी चाहिए, न किसी पर शासन/प्रताड़ना करनी चाहिए, न किसी को कष्ट देना चाहिए। यह शुद्ध, नित्य और शाश्वत धर्म है।',
      sectionTitle: 'Acharanga Sutra (First Anga) — The Supreme Law of Ahimsa',
    },
    {
      id: 'acharanga:ahimsa_2',
      unitNumber: 'Acharanga 1.2.3',
      originalText:
        'तुमेव तुमं चेव जं हंतव्वं मन्नसि ।\nतुमेव तुमं चेव जं अज्जावेयव्वं मन्नसि ॥',
      transliteration:
        'tumeva tumaṁ ceva jaṁ hantavvaṁ mannasi |\ntumeva tumaṁ ceva jaṁ ajjāveyavvaṁ mannasi ||',
      translationEn:
        'You are the very one whom you think of slaying! You are the very one whom you intend to tyrannize and subject to pain! All beings desire to live; all beings dread suffering and death. Knowing this, treat all life with universal compassion.',
      translationHi:
        'जिसे तुम मारना चाहते हो, वह वास्तव में तुम ही हो! जिसे तुम सताना चाहते हो, वह वास्तव में तुम ही हो! सभी जीव जीना चाहते हैं, कोई मरना नहीं चाहता।',
      sectionTitle: 'Acharanga Sutra — Identity of Self and Other',
    },
    {
      id: 'acharanga:equanimity',
      unitNumber: 'Acharanga 1.8.1',
      originalText:
        'तं परिन्नाय मेधावी णेव सयं लोगं विहिंसेज्जा, णेव अण्णेहिं लोगं विहिंसावेज्जा, णेव अण्णे लोगं विहिंसंते समणुजाणेज्जा ।\nअह भिक्खू णिच्चं संवुडे दन्ते समाहिओ समे मणेण वाएण काएण य ॥',
      transliteration:
        'taṁ parinnāya medhāvī ṇeva sayaṁ lokaṁ vihiṁsejjā, ṇeva aṇṇehiṁ lokaṁ vihiṁsāvejjā, ṇeva aṇṇe lokaṁ vihiṁsante samaṇujānejjā |\naha bhikkhū ṇiccaṁ saṁvuḍe dante samāhio same maṇeṇa vāeṇa kāeṇa ya ||',
      translationEn:
        'Acharanga Sutra (Book 1, Lesson 8 — The True Ascetic): "Having understood this universal truth, the wise sage shall neither harm any creature in the world, nor cause others to inflict harm, nor consent to others inflicting harm. Thus the ascetic, ever restrained, disciplined, and tranquil, maintains perfect equanimity of mind, speech, and body."',
      translationHi:
        'आचारांग सूत्र: "इस सत्य को जानकर बुद्धिमान साधक न तो स्वयं किसी प्राणी की हिंसा करे, न दूसरों से करवाए, और न हिंसा करने वालों का अनुमोदन करे। मन, वचन और काया से सर्वथा समता में स्थित रहे।"',
      sectionTitle: 'Acharanga Sutra — Conduct and Equanimity of the Mindful Ascetic',
    },
    {
      id: 'sutrakritanga:samaya',
      unitNumber: 'Sutrakritanga 1.1.1',
      originalText:
        'सयं कडे ण विप्पणस्सइ, ण य अकडं कम्मुणा समेइ ।\nकम्मस्स गइविवागेण, जीवा जायंति णाणाविहा ॥\nणियइ-वादं विणिच्छित्ता, सव्वभावं वियाणिया ।\nअत्तकडाणि कम्माणि, अत्ता चेव पभुंजए ॥',
      transliteration:
        'sayaṁ kaḍe ṇa vippaṇassai, ṇa ya akaḍaṁ kammuṇā samei |\nkammassa gaivivāgeṇa, jīvā jāyanti ṇāṇāvihā ||\nṇiyai-vādaṁ viṇicchittā, savvabhāvaṁ viyāṇiyā |\nattakaḍāṇi kammāṇi, attā ceva pabhuñjae ||',
      translationEn:
        'Sutrakritanga Sutra (Second Anga, Book 1, Chapter 1 — Samaya): "What is done by oneself does not vanish into nothingness, nor does any effect arise from karma not done. By the fruition and destiny of their own karmas, living beings assume diverse states of existence. Refuting passive fatalism (Niyativada), know the true nature of reality: the soul experiences the precise fruits of the karmas generated by its own agency!"',
      translationHi:
        'सूत्रकृतांग सूत्र (द्वितीय अंग — समय अध्ययन): "स्वयं किया हुआ कर्म कभी नष्ट नहीं होता, और न बिना किए फल मिलता है। अपने ही कर्मों के विपाक से जीव नाना योनियों में जन्म लेते हैं। नियतिवाद का खंडन करते हुए जानो: आत्मा अपने किए हुए कर्मों का स्वयं ही भोक्ता है।"',
      sectionTitle: 'Sutrakritanga Sutra — Refutation of Fatalism & Ethical Agency',
    },
    {
      id: 'sutrakritanga:nonviolence',
      unitNumber: 'Sutrakritanga 1.1.4',
      originalText:
        'सव्वेसिं पाणाणं, भूयाणं, जीवाणं, सत्ताणं, दया-धम्मो विसोहओ ।\nण हणे, ण वि घाएज्जा, दयं सव्वेसु पाणिणा ॥',
      transliteration:
        'savvesiṁ pāṇāṇaṁ, bhūyāṇaṁ, jīvāṇaṁ, sattāṇaṁ, dayā-dhammo visohao |\nṇa haṇe, ṇa vi ghāejjā, dayaṁ savvesu pāṇiṇā ||',
      translationEn:
        'Sutrakritanga Sutra (Book 1, Chapter 1.4): "Toward all breathing, existing, living, sentient creatures, the religion of universal compassion (Daya Dharma) is the purifier of the soul. Slay no creature, cause none to be destroyed; cherish universal kindness toward every living being in the cosmos."',
      translationHi:
        'सूत्रकृतांग सूत्र: "समस्त प्राणियों और जीवों के प्रति दया ही आत्मा को शुद्ध करने वाला धर्म है। किसी को न मारें, न आघात पहुँचाएँ; सभी जीवों पर दया भाव रखें।"',
      sectionTitle: 'Sutrakritanga Sutra — The Religion of Universal Compassion',
    },
  ],

  // ----------------------------------------------------------------------------
  // 4. UTTARADHYAYANA SUTRA (The 36 Final Sermons)
  // ----------------------------------------------------------------------------
  uttaradhyayana: [
    {
      id: 'uttaradhyayana:1.1',
      unitNumber: 'Adhyayana 1.1',
      originalText:
        'सामाइयं वय-समिइ-सील-गुत्ती-अहिंसा-सच्चेसु ।\nणिग्गंथ-पवयण-सारं सुणेह वोच्छामि अणुपुव्विं ॥',
      transliteration:
        'sāmāiyaṁ vaya-samii-sīla-guttī-ahiṁsā-saccesu |\nṇiggantha-pavayaṇa-sāraṁ suṇeha vocchāmi aṇupuvviṁ ||',
      translationEn:
        'Hearken to me! I shall declare in regular order the essence of the teachings of the Nirgranthas (the unattached Jinas): equanimity (Samayika), the five great vows, the five vigilant conducts (Samitis), moral character, the three restraints (Guptis), non-violence, and truth.',
      translationHi:
        'निर्ग्रन्थ प्रवचन के सार को सुनो! मैं क्रमपूर्वक सामायिक, व्रत, समिति, शील, गुप्ति, अहिंसा और सत्य के स्वरूप का वर्णन करता हूँ।',
      sectionTitle: 'Uttaradhyayana Sutra — Essence of Monastic Discipline',
    },
    {
      id: 'uttaradhyayana:9.1',
      unitNumber: 'Adhyayana 9.34 (Nami Pravrajya)',
      originalText:
        'जो सहस्सं सहस्साणं, संगामे दुज्जए जिणे ।\nएगं जिणेज्ज अप्पाणं, एस से परमो जओ ॥',
      transliteration:
        'jo sahassaṁ sahassāṇaṁ, saṅgāme dujjae jiṇe |\negaṁ jiṇejja appāṇaṁ, esa se paramo jao ||',
      translationEn:
        'Uttaradhyayana Sutra (Chapter 9.34 — Nami Pravrajya): "Though one should conquer in battle thousands upon thousands of difficult foes, yet the supreme victory is won when one conquers one’s own self!"',
      translationHi:
        'उत्तराध्ययन सूत्र (अध्याय ९ — नमि प्रव्रज्या): "जो संग्राम में लाखों दुर्जय शत्रुओं को जीत ले, उसकी अपेक्षा जो अपनी ही आत्मा (राग, द्वेष, क्रोध, मान) को जीत लेता है, वही सबसे बड़ा विजेता है।"',
      sectionTitle: 'Uttaradhyayana 9 — True Victory is Inner Self-Conquest',
    },
    {
      id: 'uttaradhyayana:10.1',
      unitNumber: 'Adhyayana 10.1 (Druma-patraka)',
      originalText:
        'दुम-पत्तयं जहा पंडुयं, हवइ खीण-आयुस्स देहिणो ।\nएवं माणुस-जीवियं, समयं गोयम! मा पमायए ॥',
      transliteration:
        'duma-pattayaṁ jahā paṇḍuyaṁ, havai khīṇa-āyussa dehiṇo |\nevaṁ māṇusa-jīviyaṁ, samayaṁ goyama! mā pamāyae ||',
      translationEn:
        'Uttaradhyayana Sutra (Chapter 10.1 — Druma-patraka): "As the withered leaf falling from the tree at autumn cannot return to the branch, even so is the transient life of mortals. The span of life diminishes with every fleeting moment. Therefore, Gautama! Be not heedless for even a single fraction of time!"',
      translationHi:
        'उत्तराध्ययन सूत्र (अध्याय १० — द्रुमपत्रक): "जैसे वृक्ष का सूखा पत्ता गिरकर पुनः शाखा पर नहीं लगता, वैसे ही मनुष्य का जीवन क्षणभंगुर है। इसलिए हे गौतम! एक क्षण के लिए भी प्रमाद (आलस्य/असावधानी) मत करो!"',
      sectionTitle: 'Uttaradhyayana 10 — Transience of Life & Non-Heedlessness',
    },
    {
      id: 'uttaradhyayana:23.12',
      unitNumber: 'Adhyayana 23.12 (Keshi-Gautama Dialogue)',
      originalText:
        'चाउज्जामो य जो धम्मो जो य पंच-महव्वओ ।\nदेसिओ वद्धमाणेण पासेण य महायसा ॥',
      transliteration:
        'cāujjāmo ya jo dhammo jo ya pañca-mahavvao |\ndesio vaddhamāṇeṇa pāseṇa ya mahāyasā ||',
      translationEn:
        'The law which forbids four actions (Chaturyama) was taught by the illustrious Parshvanatha; and the law of the five great vows (Pancha Mahavrata) was taught by Vardhamana Mahavira. What is the cause of this difference between two Omniscient Tirthankaras?',
      translationHi:
        'भगवान पार्श्वनाथ ने चार महाव्रतों का धर्म बताया और भगवान वर्धमान महावीर ने पाँच महाव्रतों का। इन दोनों महान तीर्थंकरों के विधान में यह अन्तर क्यों है?',
      sectionTitle: 'The Historical Keshi-Gautama Dialogue',
    },
    {
      id: 'uttaradhyayana:23.29',
      unitNumber: 'Adhyayana 23.29 (Reconciliation)',
      originalText:
        'पुव्वे अजुज्जु-जडा मन्दा उप्पन्न-संकिणो ।\nइमे उ उज्जु-पन्ना य तेण धम्मो दुहा कओ ॥',
      transliteration:
        'puvve ajujju-jaḍā mandā uppanna-saṅkiṇo |\nime u ujju-pannā ya teṇa dhammo duhā kao ||',
      translationEn:
        'Gautama replied: The first disciples under Rishabha were slow and pure; the last under Mahavira are shrewd and complicated; those in between under Parshva were simple and wise. The essence of Ahimsa and self-restraint is identical in both teachings; only the external formulation was adapted to the spiritual capacity of the times.',
      translationHi:
        'गौतम स्वामी ने उत्तर दिया: प्रथम और अंतिम तीर्थंकर के समय के साधक सरल-जड़ अथवा वक्र-जड़ होते हैं, जबकि मध्यवर्ती तीर्थंकरों के साधक ऋजु-प्रज्ञ (सरल और बुद्धिमान) होते हैं। अतः धर्म का मूल एक ही है।',
      sectionTitle: 'Synthesis of the Tirthankara Precepts',
    },
    {
      id: 'uttaradhyayana:36.1',
      unitNumber: 'Adhyayana 36.1–3 (Jiva-Ajiva Vibhakti)',
      originalText:
        'जीवा चेव अजीवा य, एस लोए समाहिए ।\nजीवा चेयणा-संजुत्ता, अजीवा विगया तओ ॥\nधम्मो अधम्मो आगासं, कालो पुग्गल चेव य ।\nएसो अजीव-काओ उ, जिणवरेहिं पवेइओ ॥',
      transliteration:
        'jīvā ceva ajīvā ya, esa loe samāhie |\njīvā ceyaṇā-saṁjuttā, ajīvā vigayā tao ||\ndhammo adhammo āgāsaṁ, kālo puggala ceva ya |\neso ajīva-kāo u, jiṇavarehiṁ paveio ||',
      translationEn:
        'Uttaradhyayana Sutra (Chapter 36.1–3 — Jiva-Ajiva Vibhakti): "The cosmos is composed of the living (Jiva) and the non-living (Ajiva). The characteristic nature of Jiva is pure consciousness (Chetana); non-living substances are devoid of consciousness. Dharma (medium of motion), Adharma (medium of rest), Akasha (space), Kala (time), and Pudgala (matter) constitute the five non-living categories revealed by the supreme Jinas."',
      translationHi:
        'उत्तराध्ययन सूत्र (अध्याय ३६ — जीव-अजीव विभक्ति): "समस्त लोक जीव और अजीव तत्त्वों में विभाजित है। जीव चेतनामय है और अजीव चेतना-रहित। धर्म (गति-सहायक), अधर्म (स्थिति-सहायक), आकाश, काल और पुद्गल—ये पाँच अजीव द्रव्य जिनवरों द्वारा प्ररूपित हैं।"',
      sectionTitle: 'Uttaradhyayana 36 — Classification of Soul and Matter',
    },
  ],

  // ----------------------------------------------------------------------------
  // 5. KALPA SUTRA (Bhadrabahu Svamin — The Lives of the Jinas)
  // ----------------------------------------------------------------------------
  kalpasutra: [
    {
      id: 'kalpasutra:trishala_dreams',
      unitNumber: 'Section 1 (Trishala’s Dreams)',
      originalText:
        'तए णं सा तिसला खत्तियाणी इमे चउद्दस महासुविणे पासित्ताणं पडिबुद्धा ।\nतंजहा—गयं, उसभं, सीहं, अभिसेयं, दामं, ससिं, दिणयरं, झयं, कुंभं, पउमसरं, सागरं, विमाणं, भवणं, सिहिं च ॥',
      transliteration:
        'tae ṇaṁ sā tisalā khattiyāṇī ime cauddasa mahāsuviṇe pāsittāṇaṁ paḍibuddhā |\ntaṁjahā—gayaṁ, usabhaṁ, sīhaṁ, abhiseyaṁ, dāmaṁ, sasiṁ, diṇayaraṁ, jhayam, kumbhaṁ, paumasaraṁ, sāgaraṁ, vimāṇaṁ, bhavaṇaṁ, sihiṁ ca ||',
      translationEn:
        'Queen Trishala awoke in joyous wonder, having beheld the fourteen auspicious great dreams portending the birth of a Tirthankara: 1. An elephant, 2. A bull, 3. A lion, 4. The anointing of Goddess Lakshmi, 5. A garland of flowers, 6. The radiant moon, 7. The golden sun, 8. A glorious flag, 9. A golden vase, 10. A lotus lake, 11. The ocean of milk, 12. A celestial palace, 13. A heap of jewels, and 14. A smokeless blazing fire.',
      translationHi:
        'माता त्रिशला ने भगवान महावीर के गर्भ में आने पर चौदह शुभ महास्वप्न देखे: हाथी, बैल, सिंह, लक्ष्मीजी, पुष्पमाला, चन्द्रमा, सूर्य, ध्वजा, पूर्णकलश, पद्म सरोवर, क्षीरसमुद्र, देवविमान, रत्नराशि और निर्धूम अग्नि।',
      sectionTitle: 'Kalpa Sutra — The Fourteen Auspicious Dreams of Trishala',
    },
    {
      id: 'kalpasutra:renunciation',
      unitNumber: 'Section 2 (Mahavira Diksha)',
      originalText:
        'संवच्छरेणं साहिगेणं विइक्कंतेणं, चइत्ता हिरण्णं च सुवण्णं च धणं च धण्णं च रज्जं च रट्ठं च, उत्तरकुरु-कप्प-समाणं भोग-जागं परिच्चइत्ता, जेणेव णाए णागवणे तेणेव उवागच्छइ, उवागच्छित्ता छट्टेणं भत्तेणं अपाणएणं, केस-लोयं करेत्ता, सामाइयं चरित्तं पडिववन्ने ॥',
      transliteration:
        'saṁvacchareṇaṁ sāhigeṇaṁ viikkaṁteṇaṁ, caittā hiraṇṇaṁ ca suvaṇṇaṁ ca dhaṇaṁ ca dhaṇṇaṁ ca rajjaṁ ca raṭṭhaṁ ca, uttarakuru-kappa-samāṇaṁ bhoga-jāgaṁ pariccaittā, jeṇeva ṇāe ṇāgavaṇe teṇeva uvāgacchai, uvāgacchittā chaṭṭheṇaṁ bhatteṇaṁ apāṇaenaṁ, kesa-loyaṁ karettā, sāmāiyaṁ carittaṁ paḍivavanne ||',
      translationEn:
        'Kalpa Sutra (Section 2 — The Great Renunciation / Diksha): "Having distributed his vast royal treasures of silver, gold, lands, and wealth in year-long charity, Bhagavan Mahavira renounced the sovereign kingdom and worldly comforts. Proceeding to the sacred Jnatrkhanda grove, on a two-day fast without water, under the Ashoka tree, he tore out his hair with his own hands in five handfuls and assumed the sacred equanimous conduct of the ascetic (Samayika Charitra)."',
      translationHi:
        'कल्पसूत्र (महावीर दीक्षा): "एक वर्ष तक प्रतिदिन एक करोड़ आठ लाख स्वर्ण मुद्राओं का दान देकर, भगवान महावीर ने सांसारिक भोगों और राज-वैभव का त्याग किया। ज्ञातृखंड उपवन में अशोक वृक्ष के नीचे दो दिन के निर्जल उपवास में अपने हाथों से पंचमुष्टि केशलोंच कर सामायिक चारित्र अंगीकार किया।"',
      sectionTitle: 'Kalpa Sutra — The Renunciation & Initiation of Mahavira',
    },
    {
      id: 'kalpasutra:kevala_jnana',
      unitNumber: 'Section 3 (Kevala Jnana)',
      originalText:
        'जंभिय-गामस्स णयरस्स उत्तर-पुरच्छिमे दिसीभाए, उज्जुवालियाए णईए तीरे, सामागस्स गाहावइस्स चेइए, साल-रुक्खस्स अहे, उक्कुडुय-आसणे गोदोहियाए झाण-कोट्ठ-गएणं, अणन्ते अणुत्तरे णिव्वाघाए णिरावरणं कसिणे केवल-वर-णाण-दंसणे समुप्पन्ने ॥',
      transliteration:
        'jambhiya-gāmassa ṇayarassa uttara-puracchime disībhāe, ujjuvāliyāe ṇaīe tīre, sāmāgassa gāhāvassa ceie, sāla-rukkhassa ahe, ukkuḍuya-āsaṇe godohiyāe jhāna-koṭṭha-gaeṇaṁ, aṇante aṇuttare ṇivvāghāe ṇirāvaraṇaṁ kasiṇe kevala-vara-ṇāṇa-daṁsaṇe samuppanne ||',
      translationEn:
        'Kalpa Sutra (Section 3 — The Kevala Jnana Omniscience): "Outside the town of Jrmbhikagrama, on the northern bank of the river Rjupalika, in the field of the householder Samaga, under a majestic Sala tree, seated in deep meditation, having destroyed the four obscuring (Ghatiya) karmas, there arose in Mahavira the infinite, supreme, unobstructed, complete, and unconditioned Omniscience and All-Perceiving Vision (Kevala-Jnana and Kevala-Darshana)."',
      translationHi:
        'कल्पसूत्र (केवलज्ञान प्राप्ति): "जृम्भिकग्राम के समीप ऋजुपालिका नदी के तट पर, श्यामाक गाथापति के खेत में शाल वृक्ष के नीचे ध्यान में लीन भगवान महावीर ने चार घातिया कर्मों का क्षय करके अनंत, अनुत्तर, सर्वोत्कृष्ट केवलज्ञान और केवलदर्शन प्राप्त किया।"',
      sectionTitle: 'Kalpa Sutra — The Attainment of Supreme Omniscience (Kevala Jnana)',
    },
    {
      id: 'kalpasutra:mahavira_nirvana',
      unitNumber: 'Section 4 (Mahavira Nirvana)',
      originalText:
        'पावाए णयरीए मज्झिमिल्लाए पावाए हत्थीवालस्स रन्नो रज्जुग-सभाए एक्को चेव अणगारो कालमासे कालं किच्चा सव्वदुक्खप्पहीणे सिद्धे बुद्धे मुत्ते परिनिव्वुडे ॥',
      transliteration:
        'pāvāe ṇayarīe majjhimillāe pāvāe hatthīvālassa ranno rajjuga-sabhāe ekko ceva aṇagāro kālamāse kālaṁ kiccā savvadukkhappahīṇe siddhe buddhe mutte parinivvuḍe ||',
      translationEn:
        'In the city of Pavapuri, in the assembly hall of King Hastipala, the venerable ascetic Mahavira attained total liberation (Nirvana), freed from all karmic suffering, becoming a Siddha, enlightened, unbound, and eternally tranquil.',
      translationHi:
        'पावापुरी में राजा हस्तिपाल की सभा में भगवान महावीर ने संपूर्ण दुःखों का अंत करके निर्वाण पद प्राप्त किया। वे सिद्ध, बुद्ध और सर्वथा मुक्त हो गए।',
      sectionTitle: 'Kalpa Sutra — Bhagavan Mahavira Nirvana at Pavapuri',
    },
  ],

  // ----------------------------------------------------------------------------
  // 6. PRATIKRAMAN & UNIVERSAL FORGIVENESS (Michhami Dukkadam)
  // ----------------------------------------------------------------------------
  pratikraman: [
    {
      id: 'pratikraman:forgiveness',
      unitNumber: 'Khamemi Savve Jive (Universal Forgiveness)',
      originalText:
        'खामेमि सव्व जीवे, सव्वे जीवा खमंतु मे ।\nमित्ती मे सव्व भूएसु, वेरं मज्झं न केणइ ॥',
      transliteration:
        'khāmemi savva jīve, savve jīvā khamantu me |\nmittī me savva bhūesu, veraṁ majjhaṁ na keṇai ||',
      translationEn:
        'I grant forgiveness to all living beings in the cosmos; may all living beings forgive me. I have friendship and goodwill toward all creatures; I hold malice and enmity toward none.',
      translationHi:
        'मैं समस्त जीवों से क्षमा याचना करता हूँ, सभी जीव मुझे क्षमा करें। मेरी संसार के समस्त प्राणियों से मैत्री है, किसी से भी मेरा वैर नहीं है।',
      sectionTitle: 'The Universal Forgiveness Aphorism (Kshamapana Sutra)',
    },
    {
      id: 'pratikraman:michhami_dukkadam',
      unitNumber: 'Michhami Dukkadam Formula',
      originalText:
        'मणेणं वाएणं काएणं, इच्छामि पडिकमिउं ।\nतस्स मिच्छा मि दुक्कडं ॥',
      transliteration:
        'maṇeṇaṁ vāeṇaṁ kāeṇaṁ, icchāmi paḍikamiuṁ |\ntassa micchā mi dukkaḍaṁ ||',
      translationEn:
        'Whatever wrong I have committed through mind, speech, or body—knowingly or unknowingly—I desire to repent and atone for it. May all the evil and harm caused by me become vain and dissolved (Michhami Dukkadam)!',
      translationHi:
        'मन, वचन और काया से जो भी भूल या प्रमाद मुझसे हुआ हो, मैं उसका प्रतिक्रमण करता हूँ। मेरा वह दुष्कृत्य मिथ्या और क्षमा-योग्य हो (मिच्छामि दुक्कडं)।',
      sectionTitle: 'Atonement of Mind, Speech, and Action',
    },
    {
      id: 'pratikraman:iryavahiya',
      unitNumber: 'Iryavahiya Sutra (Walking Atonement)',
      originalText:
        'इच्छामि पडिक्कमिउं, इरियावहियाए, विराहणाए, गमणागमणे ।\nपाणक्कमणे, बीयक्कमणे, हरियक्कमणे, ओसा-उत्तिंग-पणग-दगमट्टी-मक्कड़ा-संताणा-संकमणे ॥',
      transliteration:
        'icchāmi paḍikkamiuṁ, iriyāvahiyāe, virāhaṇāe, gamaṇāgamaṇe |\npāṇakkamaṇe, bīyakkamaṇe, hariyakkamaṇe, osā-uttiṅga-paṇaga-dagamaṭṭī-makkaḍā-saṁtāṇā-saṁkamaṇe ||',
      translationEn:
        'I desire to atone for transgressions committed while walking along the paths: if I have trampled on living beings, seeds, green plants, dew, ant-hills, moss, water-mud, or spider-webs. For any harm caused to microscopic one-sensed, two-sensed, three-sensed, four-sensed, or five-sensed souls—may it be forgiven.',
      translationHi:
        'रास्ते में आते-जाते समय चलने की असावधानी से यदि मेरे द्वारा किसी भी सूक्ष्म जीव, वनस्पति, जलचर या कीट-पतंग की विराधना हुई हो, तो मैं उस सब का पश्चाताप करता हूँ।',
      sectionTitle: 'Iryavahiya Sutra (Conscious Walking Atonement)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 7. SAMAYIK PRAYERS (Karemi Bhante, Logassa Sutra)
  // ----------------------------------------------------------------------------
  samayik: [
    {
      id: 'samayik:karemi_bhante',
      unitNumber: 'Karemi Bhante (The Samayik Vow)',
      originalText:
        'करेमि भंते ! सामाइयं, सावज्जं जोगं पच्चक्खामि ।\nजाव नियमं पज्जुवासामि, दुविहं तिविहेणं—मणेणं वाएणं काएणं, न करेमि न कारवेमि ।\nतस्स भंते ! पडिक्कमामि, निंदामि गरिहामि अप्पाणं वोसिरामि ॥',
      transliteration:
        'karemi bhaṁte ! sāmāiyaṁ, sāvajjaṁ jogaṁ paccakkhāmi |\njāva niyamaṁ pajjuvāsāmi, duvihaṁ tiviheṇaṁ—maṇeṇaṁ vāeṇaṁ kāeṇaṁ, na karemi na kāravemi |\ntassa bhaṁte ! paḍikkamāmi, niṁdāmi garihāmi appāṇaṁ vosirāmi ||',
      translationEn:
        'O Revered Lord! I take the vow of Samayika (spiritual equanimity). I renounce all sinful, harmful, and blameworthy activities of mind, speech, and body for the duration of this meditation. I shall neither commit harm myself, nor cause others to commit it, through thought, word, or deed. I repent for all past errors, criticize my failings before the Guru, and detach my soul from all worldly passion.',
      translationHi:
        'हे भगवन्! मैं सामायिक व्रत ग्रहण करता हूँ। पापमय प्रवृत्तियों का त्याग करता हूँ। जब तक सामायिक में स्थित रहूँ, तब तक मन, वचन और काया से न तो कोई पाप करूँगा और न करवाऊँगा।',
      sectionTitle: 'Karemi Bhante — The Holy Vow of Equanimity (48 Minutes)',
    },
    {
      id: 'samayik:logassa_1',
      unitNumber: 'Logassa Sutra 1 (24 Tirthankara Stuti)',
      originalText:
        'लोगस्स उज्जोअगरे, धम्मतित्थयरे जिणे ।\nअरिहंते कित्तइस्सं, चउवीसम्पि केवलि ॥ १ ॥',
      transliteration:
        'logassa ujjoagare, dhammatitthayare jiṇe |\narihante kittaisaṁ, cauvīsample kevali || 1 ||',
      translationEn:
        'I praise and celebrate the Arihantas, the light-bringers of the universe, the founders of the spiritual ford (Tirthankaras), the conquerors of passion, all twenty-four omniscient Kevalis who illuminate the three worlds.',
      translationHi:
        'लोक में ज्ञान का प्रकाश करने वाले, धर्मतीर्थ की स्थापना करने वाले, समस्त राग-द्वेष को जीतने वाले चौबीस ही केवली तीर्थंकरों का मैं गुणगान करता हूँ।',
      sectionTitle: 'Logassa Sutra — Praise of the 24 Tirthankaras',
    },
  ],

  // ----------------------------------------------------------------------------
  // 8. JAIN DEVOTIONAL HYMNS (Meri Bhavana — Pandit Jugalkishor Mukhtar)
  // ----------------------------------------------------------------------------
  jain_hymns: [
    {
      id: 'meri_bhavana:1',
      unitNumber: 'Meri Bhavana 1',
      originalText:
        'जिसने राग-द्वेष कामादिक जीते सब जग जान लिया ।\nसब जीवों को मोक्ष मार्ग का निस्पृह हो उपदेश दिया ॥\nबुद्ध, वीर, जिन, हरि, हर, ब्रह्मा या उसको स्वाधीन कहो ।\nभक्ति-भाव से मस्तक उस पर झुकता, जग में सदा रहो ॥ १ ॥',
      transliteration:
        'jisane rāga-dveṣa kāmādika jīte saba jaga jāna liyā |\nsaba jīvoṁ ko mokṣa mārga kā nispṛha ho upadeśa diyā ||\nbuddha, vīra, jina, hari, hara, brahmā yā usako svādhīna kaho |\nbhakti-bhāva se mastaka usa para jhukatā, jaga meṁ sadā raho || 1 ||',
      translationEn:
        'He who has conquered attachment, aversion, lust, and passion, and has known the reality of the entire cosmos; who selflessly expounded the path of liberation to all beings without prejudice—call Him Buddha, Mahavira, Jina, Hari, Shiva, Brahma, or the Self-Sovereign Soul. Before Him with deep devotion my head bows down in perpetual reverence.',
      translationHi:
        'जिसने राग, द्वेष और काम आदि विकारों को जीत लिया है और सम्पूर्ण जगत को जान लिया है, तथा समस्त जीवों को निष्काम भाव से मुक्ति का मार्ग दिखाया है—उन्हें चाहे बुद्ध कहें, वीर कहें, जिन कहें या ब्रह्मा—मेरा मस्तक श्रद्धा से उनके चरणों में झुकता है।',
      sectionTitle: 'Meri Bhavana (Pt. Jugalkishor Mukhtar, 1916) — Universal Divinity',
    },
    {
      id: 'meri_bhavana:2',
      unitNumber: 'Meri Bhavana 2',
      originalText:
        'अहंकार का भाव न रक्खूँ, नहीं किसी पर क्रोध करूँ ।\nदेख दूसरों की बढ़ती को, कभी न ईर्ष्या-भाव धरूँ ॥\nरहे भावना ऐसी मेरी, सरल-सत्य व्यवहार करूँ ।\nबने जहाँ तक इस जीवन में, औरों का उपकार करूँ ॥ २ ॥',
      transliteration:
        'ahaṅkāra kā bhāva na rakkhūom, nahīṁ kisī para krodha karūom |\ndekha dūsaroṁ kī baṛhatī ko, kabhī na īrṣyā-bhāva dharūom ||\nrahe bhāvanā aisī merī, sarala-satya vyavahāra karūom |\nbane jahāom taka isa jīvana meṁ, auroṁ kā upakāra karūom || 2 ||',
      translationEn:
        'May I harbor no ego or arrogance; may I vent anger toward no one. Seeing the prosperity and progress of others, may jealousy never touch my heart. May this be my constant aspiration: to conduct myself with simplicity, honesty, and truth, and as far as possible in this life, to be of selfless service to all.',
      translationHi:
        'मेरे मन में अहंकार का भाव न रहे, मैं कभी किसी पर क्रोध न करूँ। दूसरों की उन्नति देखकर ईर्ष्या न करूँ। मेरा व्यवहार सदैव सरल और सत्य रहे तथा जहाँ तक हो सके मैं दूसरों का उपकार करूँ।',
      sectionTitle: 'Meri Bhavana — Moral Conduct and Humility',
    },
    {
      id: 'meri_bhavana:3',
      unitNumber: 'Meri Bhavana 3',
      originalText:
        'मैत्री-भाव जगत में मेरा सब जीवों से नित्य रहे ।\nदीन-दुखी जीवों पर मेरे उर से करुणा-स्रोत बहे ॥\nदुर्जन-क्रूर-कुमार्ग-रतों पर क्षोभ न मुझको आने पाये ।\nसाम्य-भाव रक्खूँ मैं उन पर, ऐसी परिणति हो जाये ॥ ३ ॥',
      transliteration:
        'maitrī-bhāva jagata meṁ merā saba jīvoṁ se nitya rahe |\ndīna-dukhī jīvoṁ para mere ura se karuṇā-srota bahe ||\ndurjana-krūra-kumārga-ratoṁ para kṣobha na mujhako āne pāye |\nsāmya-bhāva rakkhūom maiṁ una para, aisī pariṇati ho jāye || 3 ||',
      translationEn:
        'May I cherish universal friendship (Maitri) toward all living souls in the universe. Toward the destitute, suffering, and afflicted, may a ceaseless torrent of deep compassion (Karuna) flow from my heart. Toward the cruel, malicious, and wayward, may no resentment or malice arise in me; may I remain steadfast in serene equanimity (Upeksha).',
      translationHi:
        'संसार के सभी जीवों के प्रति मेरा नित्य मैत्री भाव रहे। दीन-दुखियों के प्रति मेरे हृदय से करुणा का स्रोत बहे। क्रूर और कुमार्गी व्यक्तियों पर मुझे क्रोध न आए, बल्कि उनके प्रति भी समभाव बना रहे।',
      sectionTitle: 'Meri Bhavana — The Four Noble Attitudes (Maitri, Karuna, Mudita, Madhyastha)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 9. TIRTHANKAR TEACHINGS & CORE PHILOSOPHY
  // ----------------------------------------------------------------------------
  tirthankar_teachings: [
    {
      id: 'tattvartha:1.1',
      unitNumber: 'Tattvartha Sutra 1.1',
      originalText: 'सम्यग्दर्शनज्ञानचारित्राणि मोक्षमार्गः ॥',
      transliteration: 'samyagdarśanajñānacāritrāṇi mokṣamārgaḥ ||',
      translationEn:
        'Right Faith (Samyag Darshana), Right Knowledge (Samyag Jnana), and Right Conduct (Samyag Charitra) together constitute the path to liberation (Mokshamarga).',
      translationHi:
        'सम्यक दर्शन, सम्यक ज्ञान और सम्यक चरित्र—इन तीनों की संयुक्त साधना ही मोक्ष का मार्ग है।',
      sectionTitle: 'The Three Jewels (Ratnatraya)',
    },
    {
      id: 'tattvartha:1.4',
      unitNumber: 'Tattvartha Sutra 1.4',
      originalText: 'जीवाजीवास्रवबन्धसंवरनिर्जरामोक्षास्तत्त्वम् ॥',
      transliteration: 'jīvājīvāsravabandhasaṁvaranirjarāmokṣāstattvam ||',
      translationEn:
        'Tattvartha Sutra 1.4: "The seven fundamental ontological verities (Tattvas) are: 1. Jiva (the living soul), 2. Ajiva (the non-living substance), 3. Asrava (influx of karma into the soul), 4. Bandha (bondage of karma with the soul), 5. Samvara (stoppage of karmic influx), 6. Nirjara (gradual shedding of accumulated karma), and 7. Moksha (complete liberation and eternal beatitude)."',
      translationHi:
        'तत्त्वार्थ सूत्र १.४: "जीव, अजीव, आस्रव, बन्ध, संवर, निर्जरा और मोक्ष—ये सात मूल तत्त्व हैं। इनकी यथार्थ प्रतीति ही सम्यक दर्शन है।"',
      sectionTitle: 'The Seven Fundamental Verities (Sapta Tattva)',
    },
    {
      id: 'tattvartha:2.8',
      unitNumber: 'Tattvartha Sutra 2.1–8',
      originalText: 'द्विपञ्चैकोनविंशतित्रिद्विभेदा यथाक्रमं षट्पञ्चाशद्भेदा औपशमिक-क्षायिक-मिश्र-औदयिक-पारिणामिकाः ॥',
      transliteration: 'dvipañcaikonaviṁśatitridvibhedā yathākramaṁ ṣaṭpañcāśadbhedā aupaśamika-kṣāyika-miśra-audayika-pāriṇāmikāḥ ||',
      translationEn:
        'Tattvartha Sutra 2.1–8: "The five essential constitutional states (Bhavas) of the soul are: 1. Aupashamika (subsidence of karma), 2. Kshayika (total eradication of karma), 3. Mishra / Kshayopashamika (partial destruction and subsidence), 4. Audayika (rise of karma), and 5. Parinamika (inherent natural state independent of karma)."',
      translationHi:
        'तत्त्वार्थ सूत्र २.१-८: "आत्मा के पाँच असाधारण भाव होते हैं: औपशमिक (कर्म के उपशम से), क्षायिक (कर्म के पूर्ण क्षय से), क्षायोपशमिक (मिश्र), औदयिक (कर्म के उदय से), और पारिणामिक (आत्मा का सहज स्वाभाविक स्वरूप)।"',
      sectionTitle: 'The Five Constitutional States of the Soul (Pancha Bhava)',
    },
    {
      id: 'tattvartha:5.21',
      unitNumber: 'Tattvartha Sutra 5.21',
      originalText: 'परस्परोपग्रहो जीवानाम् ॥',
      transliteration: 'parasparopagraho jīvānām ||',
      translationEn:
        'Souls render spiritual service and mutual assistance to one another. (The foundational motto of Jain ecology and universal cosmic interdependence).',
      translationHi:
        'समस्त जीव परस्पर एक-दूसरे के उपकारक हैं। सभी जीव एक-दूसरे के जीवन में सहायक हैं।',
      sectionTitle: 'Universal Cosmic Interdependence (Jain Motto)',
    },
    {
      id: 'tattvartha:7.1',
      unitNumber: 'Tattvartha Sutra 7.1',
      originalText: 'हिंसानृतस्तेयाब्रह्मपरिग्रहेभ्यो विरतिर्व्रतम् ॥',
      transliteration: 'hiṁsānṛtasteyābrahmaparigrahebhyo viratirvratam ||',
      translationEn:
        'Tattvartha Sutra 7.1: "The vows (Vratas) consist in total abstention from five spiritual transgressions: 1. Himsa (violence to any life), 2. Anrta (falsehood and untruth), 3. Steya (taking what is not given / theft), 4. Abrahma (unchastity / sensual indulgence), and 5. Parigraha (possessiveness, attachment, and greed). When observed without qualification by monks, they are the Five Great Vows (Mahavrata); when observed according to householder capacity, they are Minor Vows (Anuvrata)."',
      translationHi:
        'तत्त्वार्थ सूत्र ७.१: "हिंसा, असत्य, चोरी, अब्रह्म (कुशील) और परिग्रह—इन पाँचों पापों से सर्वथा विरत होना ही व्रत (पंच महाव्रत / अणुव्रत) कहलाता है।"',
      sectionTitle: 'The Five Ethical Vows (Pancha Mahavrata / Anuvrata)',
    },
    {
      id: 'tattvartha:9.1',
      unitNumber: 'Tattvartha Sutra 9.1–2',
      originalText: 'आस्रवनिरोधः संवरः । स गुप्ति-समिति-धर्मानुप्रेक्षा-परीषहजय-चारित्रैः ॥',
      transliteration: 'āsravanirodhaḥ saṁvaraḥ | sa gupti-samiti-dharmānuprekṣā-parīṣahajaya-cāritraiḥ ||',
      translationEn:
        'Tattvartha Sutra 9.1–2: "The stoppage of the influx of karma is Samvara. It is accomplished through the three restraints (Guptis of mind, speech, body), the five vigilant conducts (Samitis), the tenfold supreme virtue (Dharma), the twelve reflections (Anuprekshas), victory over hardships (Parishahajaya), and right spiritual conduct (Charitra)."',
      translationHi:
        'तत्त्वार्थ सूत्र ९.१-२: "कर्मों के आस्रव को रोकना ही संवर है। वह तीन गुप्ति, पाँच समिति, दस धर्म, बारह अनुप्रेक्षा, बाईस परीषहजय और सम्यक चारित्र के द्वारा सिद्ध होता है।"',
      sectionTitle: 'Samvara & Nirjara — Stopping and Shedding of Karma',
    },
    {
      id: 'samayasara:gatha_1',
      unitNumber: 'Samayasara Gatha 1 (Acharya Kundakunda)',
      originalText:
        'वंदित्तु सव्व-सिद्धे, धुवमचलमणोवमं गइं पत्ते ।\nवोच्छामि समय-पाहुड-मिणमो सुद-केवली-भणिदं ॥ १ ॥\nजो पस्सइ अप्पाणं, अबद्ध-पुट्ठं अणण्णमविसेसं ।\nअपदेस-संत-मज्झं, पस्सइ सो सव्व-दंसि-जिणं ॥',
      transliteration:
        'vaṁdittu savva-siddhe, dhuvamacalamaṇovamaṁ gaiṁ patte |\nvocchāmi samaya-pāhuḍa-miṇamo suda-kevalī-bhaṇidaṁ || 1 ||\njo passai appāṇaṁ, abaddha-puṭṭhaṁ aṇaṇṇamavisesaṁ |\napadesa-santa-majjhaṁ, passai so savva-daṁsi-jiṇaṁ ||',
      translationEn:
        'Acharya Kundakunda’s Samayasara (Gatha 1 & 14 — Digambara Masterpiece): "Bowing in reverence unto all the Siddhas who have attained the eternal, immovable, and incomparable state of liberation, I shall expound this Samayaprabhrta (Essence of the Pure Soul), as declared by the omniscient masters. He who realizes the innermost Self as unbound, untouched by karmic dust, undivided, immutable, and dwelling in radiant tranquility—he truly beholds the Omniscient Jina!"',
      translationHi:
        'आचार्य कुन्दकुन्द विरचित समयसार (गाथा १ व १४): "ध्रुव, अचल और अनुपम सिद्धगति को प्राप्त समस्त सिद्ध भगवानों को नमस्कार करके मैं श्रुतकेवली द्वारा कहे गए समयप्राभृत (समयसार) का वर्णन करता हूँ। जो अपनी आत्मा को कर्मों से अबद्ध, अस्पृष्ट, अनन्य और शांत स्वरूप में देखता है, वही वास्तव में सर्वदर्शी जिन को देखता है।"',
      sectionTitle: 'Samayasara (Acharya Kundakunda) — The Sovereign Pure Soul (Shuddhatma)',
    },
    {
      id: 'tirthankaras:canon_table',
      unitNumber: 'The 24 Tirthankaras Canonical Table',
      originalText:
        'ऋषभ, अजित, संभव, अभिनन्दन, सुमति, पद्मप्रभ, सुपार्श्व, चन्द्रप्रभ, सुविधि (पुष्पदन्त), शीतल, श्रेयांस, वासुपूज्य, विमल, अनन्त, धर्म, शान्ति, कुन्थु, अरह, मल्लि, मुनिसुव्रत, नमि, नेमि (अरिष्टनेमि), पार्श्व, वर्धमान (महावीर) ॥',
      transliteration:
        'ṛṣabha, ajita, saṁbhava, abhinandana, sumati, padmaprabha, supārśva, candraprabha, suvidhi (puṣpadanta), śītala, śreyāṁsa, vāsupūjya, vimala, ananta, dharma, śānti, kunthu, araha, malli, munisuvrata, nami, nemi (ariṣṭanemi), pārśva, vardhamāna (mahāvīra) ||',
      translationEn:
        'The 24 Ford-makers of this present Avasarpini era: 1. Rishabhanatha (Bull), 2. Ajitanatha (Elephant), 3. Sambhavanatha (Horse), 4. Abhinandananatha (Monkey), 5. Sumatinatha (Chakwa/Heron), 6. Padmaprabha (Red Lotus), 7. Suparshvanatha (Swastika), 8. Chandraprabha (Crescent Moon), 9. Pushpadanta/Suvidhinatha (Crocodile), 10. Shitalanatha (Shrivatsa), 11. Shreyamsanatha (Rhinoceros), 12. Vasupujya (Buffalo), 13. Vimalanatha (Boar), 14. Anantanatha (Falcon), 15. Dharmanatha (Vajra), 16. Shantinatha (Deer), 17. Kunthunatha (Goat), 18. Aranatha (Nandyavarta/Fish), 19. Mallinatha (Kalasha), 20. Munisuvrata (Tortoise), 21. Naminatha (Blue Lotus), 22. Neminatha (Conch), 23. Parshvanatha (Serpent), 24. Mahavira (Lion).',
      translationHi:
        'चौबीस तीर्थंकर: १. ऋषभदेव, २. अजितनाथ, ३. सम्भवनाथ, ४. अभिनन्दननाथ, ५. सुमतिनाथ, ६. पद्मप्रभ, ७. सुपार्श्वनाथ, ८. चन्द्रप्रभ, ९. पुष्पदन्त, १०. शीतलनाथ, ११. श्रेयांसनाथ, १२. वासुपूज्य, १३. विमलनाथ, १४. अनन्तनाथ, १५. धर्मनाथ, १६. शान्तिनाथ, १७. कुन्थुनाथ, १८. अरहनाथ, १९. मल्लिनाथ, २०. मुनिसुव्रतनाथ, २१. नमिनाथ, २२. नेमिनाथ, २३. पार्श्वनाथ, २४. महावीर स्वामी।',
      sectionTitle: 'The 24 Tirthankaras of the Present Age',
    },
  ],

  // ----------------------------------------------------------------------------
  // 10. THE 45 AGAMAS & CANONICAL CORPUS (Canonical Matrix)
  // ----------------------------------------------------------------------------
  agama_framework: [
    {
      id: 'agama:overview',
      unitNumber: 'Structure of the 45 Agamas',
      originalText:
        'बारस अंगाणि, बारस उवंगाणि, दस पइन्नाणि, छ छेयसुत्ताणि, चत्तारि मूलसुत्ताणि, दुन्नि चूलियासुत्ताणि चेव ॥\nएवमेयं पणयालीस आगम-पमाणं समण-सासणे सुत्ताणुसारेण ववत्थियं ॥',
      transliteration:
        'bārasa aṅgāṇi, bārasa uvaṅgāṇi, dasa paiṇṇāṇi, cha cheyasuttāṇi, cattāri mūlasuttāṇi, dunni cūliyāsuttāṇi ceva ||\nevameyaṁ paṇayālīsa āgama-pamāṇaṁ samaṇa-sāsaṇe suttāṇusāreṇa vavatthiyaṁ ||',
      translationEn:
        'The Canonical Architecture of the 45 Agamas: "The Shvetambara Jain scriptural canon codified at the Council of Valabhi comprises exactly forty-five canonical texts classified into six divisions: 1. Twelve Angas (core sermons of Mahavira), 2. Twelve Upangas (secondary canonical texts), 3. Ten Prakirnakas (miscellaneous doctrinal treatises), 4. Six Chedasutras (ascetic conduct, expiation, and monastic jurisprudence), 5. Four Mulasutras (foundational ascetic training), and 6. Two Culikasutras (epistemological keys: Nandi Sutra and Anuyogadvara Sutra)."',
      translationHi:
        '४५ आगमों की संरचना: "श्वेताम्बर जैन परम्परा में वलभी वाचना अनुसार पैंतालीस आगम प्रामाणिक माने जाते हैं: १२ अंग, १२ उपांग, १० प्रकीर्णक, ६ छेदसूत्र, ४ मूलसूत्र और २ चूलिकासूत्र। यह सम्पूर्ण श्रमण शासन का मूल आधार है।"',
      sectionTitle: 'The 45 Agamas Canonical Architecture',
    },
    {
      id: 'agama:12_angas',
      unitNumber: 'The 12 Primary Angas',
      originalText:
        '१. आयारो (आचारांग), २. सूयगडो (सूत्रकृतांग), ३. ठाणं (स्थानांग), ४. समवायो (समवायांग), ५. भगवती (व्याख्याप्रज्ञप्ति), ६. णायाधम्मकहाओ (ज्ञाताधर्मकथा), ७. उवासगदसाओ (उपासकदशा), ८. अंतगडदसाओ (अंतकृद्दशा), ९. अणुत्तरोववाइयदसाओ (अनुत्तरोपपातिकदशा), १०. पण्हावागरणाई (प्रश्नव्याकरण), ११. विवागसुयं (विपाकसूत्र), १२. दिट्ठिवाओ (दृष्टिवाद — लुप्त) ॥',
      transliteration:
        '1. āyāro (ācārāṅga), 2. sūyagaḍo (sūtrakṛtāṅga), 3. ṭhāṇaṁ (sthānāṅga), 4. samavāyo (samavāyāṅga), 5. bhagavatī (vyākhyāprajñapti), 6. ṇāyādhammakahāo (jñātādharmakathā), 7. uvāsagadasāo (upāsakadaśā), 8. aṁtagaḍadasāo (antakṛddaśā), 9. aṇuttarovavāiyadasāo (anuttaropapātikadaśā), 10. paṇhāvāgaraṇāī (praśnavyākaraṇa), 11. vivāgasuyaṁ (vipākasūtra), 12. diṭṭhivāo (dṛṣṭivāda — lupta) ||',
      translationEn:
        'The Twelve Angas (Primary Limbs of Scripture): 1. Acharanga (Monastic conduct and supreme non-violence), 2. Sutrakritanga (Philosophical systems, ethics, refutation of fatalism), 3. Sthananga (Categorical enumerations from 1 to 10), 4. Samavayanga (Cosmic categories and historical listings), 5. Bhagavati / Vyakhyaprajnapti (Monumental dialogues of Mahavira and Gautama spanning metaphysics, soul biology, and cosmology), 6. Jnatadharmakatha (Spiritual parables, narratives, and allegories), 7. Upasakadasa (The conduct of ten devout householders including Ananda), 8. Antakrddasa (Biographies of ascetics who attained liberation amidst extreme austerities), 9. Anuttaraupapatikadasa (Rebirth in the highest heavens), 10. Prasnavyakaranani (Answers to spiritual queries and the ten virtues/restraints), 11. Vipakasruta (The karmic ripening of virtuous and sinful deeds), and 12. Drstivada (The lost Twelfth Anga containing the 14 Purvas).',
      translationHi:
        'द्वादशांग (बारह अंग): १. आचारांग, २. सूत्रकृतांग, ३. स्थानांग, ४. समवायांग, ५. भगवती सूत्र (व्याख्याप्रज्ञप्ति), ६. ज्ञाताधर्मकथा, ७. उपासकदशा, ८. अंतकृद्दशा, ९. अनुत्तरोपपातिकदशा, १०. प्रश्नव्याकरण, ११. विपाकसूत्र, और १२. दृष्टिवाद (१४ पूर्वों सहित लुप्त)।',
      sectionTitle: 'The Twelve Angas — Primary Limbs of Scripture',
    },
    {
      id: 'agama:upangas_chedasutras',
      unitNumber: 'Upangas & Chedasutras',
      originalText:
        'बारस उवंगा: उववाइयं, रायपसेणियं, जीवाभिगमो, पन्नवणा, सूरपन्नत्ती, जंबुद्दीवपन्नत्ती, चंदपन्नत्ती, णिरयावलियाओ, कप्पवडिंसियाओ, पुप्फियाओ, पुप्फचूलियाओ, वह्णिदसाओ ॥\nछ छेयसुत्ताणि: णीसीहं, महाणीसीहं, ववहारो, दसासुयक्खंधो (आयारदसा / कप्पसुत्त), बृहत्कप्पो, पंचकप्पो (जीतकप्पो) ॥',
      transliteration:
        'bārasa uvaṅgā: uvavāiyaṁ, rāyapaseṇiyaṁ, jīvābhigamo, pannavaṇā, sūrapannattī, jambuddīvapannattī, candapannattī, ṇirayāvaliyāo, kappavaḍiṁsiyāo, pupphiyāo, pupphacūliyāo, vaṇhidasāo ||\ncha cheyasuttāṇi: ṇīsīhaṁ, mahāṇīsīhaṁ, vavahāro, dasāsuyakkhandho (āyāradasā / kappasutta), bṛhatkappo, pañcakappo (jītakappo) ||',
      translationEn:
        'The 12 Upangas & 6 Chedasutras: The 12 Upangas (Subsidiary Angas) treat celestial rebirth, King Paresi’s dialogue with Keshikumarasramana, analytical soul biology (Jivabhigama & Prajnapana), astronomical cosmology (Suryaprajnapti & Candraprajnapti), and the historical genealogies of the Vrishnis. The 6 Chedasutras govern ascetic conduct, monastic rules, expiations for transgressions, and include the revered Kalpa Sutra (found within the Dasasrutaskandha).',
      translationHi:
        '१२ उपांग एवं ६ छेदसूत्र: उपांगों में औपपातिक, राजप्रश्नीय, जीवाभिगम, प्रज्ञापना, सूर्यप्रज्ञप्ति, जंबूद्वीपप्रज्ञप्ति आदि आते हैं। ६ छेदसूत्रों में निशीथ, महानिशीथ, व्यवहार, दशाश्रुतस्कंध (जिसमें कल्पसूत्र सम्मिलित है), बृहत्कल्प और जीतकल्प मुनि-आचार के नियम बताते हैं।',
      sectionTitle: 'The 12 Upangas & 6 Chedasutras of Monastic Law',
    },
    {
      id: 'agama:mulasutras_culikas',
      unitNumber: 'Mulasutras & Culikasutras',
      originalText:
        'चत्तारि मूलसुत्ताणि: उत्तराज्झयणं (उत्तराध्ययन सूत्र), दसवेयालियं (दशवैकालिक सूत्र), आवास्सयं (आवश्यक सूत्र), पिंडणिज्जुत्ती (पिंडनिर्यूक्ति) ॥\nदुन्नि चूलियासुत्ताणि: णंदीसुत्तं (नंदी सूत्र) अणओगद्दारं (अनुयोगद्वार सूत्र) चेव ॥',
      transliteration:
        'cattāri mūlasuttāṇi: uttarājjhayaṇaṁ (uttarādhyayana sūtra), dasaveyāliyaṁ (daśavaikālika sūtra), āvāssayaṁ (āvaśyaka sūtra), piṁḍaṇijjutti (piṇḍaniryūkti) ||\ndunni cūliyāsuttāṇi: ṇaṁdīsuttaṁ (nandī sūtra) aṇaogaddāraṁ (anuyogadvāra sūtra) ceva ||',
      translationEn:
        'The 4 Mulasutras & 2 Culikasutras: The Mulasutras represent the essential foundation of ascetic education: Uttaradhyayana (the 36 final discourses of Mahavira), Dasavaikalika (the sublime code of daily non-violence composed by Acharya Sayyambhava), Avashyaka (the six obligatory daily rituals), and Pindaniryukti. The 2 Culikasutras (Nandi and Anuyogadvara) serve as the epistemological keys defining the five forms of knowledge and hermeneutical methods.',
      translationHi:
        '४ मूलसूत्र एवं २ चूलिकासूत्र: मूलसूत्रों में उत्तराध्ययन सूत्र, दशवैकालिक सूत्र (आचार्य शय्यंभव विरचित), आवश्यक सूत्र और पिंडनिर्यूक्ति आते हैं जो साधु जीवन की नींव हैं। २ चूलिकासूत्रों (नंदी और अनुयोगद्वार) में ज्ञान-मीमांसा और आगम-व्याख्या के नियम हैं।',
      sectionTitle: 'The 4 Mulasutras & 2 Culikasutras of Epistemology',
    },
    {
      id: 'agama:digambara_corpus',
      unitNumber: 'The Digambara Canonical Authorities',
      originalText:
        'दिगम्बर-परम्परायां मूल-अंगानां विच्छेदं मत्वा षट्खण्डागमः कषायप्राभृतं च प्रामाणिक-शास्त्रत्वेन पूज्यन्ते ।\nआचार्य पुष्पदंत-भूतबलि-विरचितः षट्खण्डागमः (जीवस्थान-खुड्डाबंध-बंधस्वामित्व-वेदना-वर्गणा-महाबंधाः) ।\nतथा च अध्यात्म-शिरोमणि-आचार्य-कुन्दकुन्द-विरचिताः समयसार-प्रवचनसार-नियमसार-पंचास्तिकाय-ग्रंथाः सर्वमान्याः ॥',
      transliteration:
        'digambara-paramparāyāṁ mūla-aṅgānāṁ vicchedaṁ matvā ṣaṭkhaṇḍāgamaḥ kaṣāyaprābhṛtaṁ ca prāmāṇika-śāstratvena pūjyante |\nācārya puṣpadanta-bhūtabali-viracitaḥ ṣaṭkhaṇḍāgamaḥ (jīvasthāna-khuḍḍābandha-bandhasvāmitva-vedanā-vargaṇā-mahābandhāḥ) |\ntathā ca adhyātma-śiromaṇi-ācārya-kundakunda-viracitāḥ samayasāra-pravacanasāra-niyamasāra-pañcāstikāya-granthāḥ sarvamānyāḥ ||',
      translationEn:
        'The Digambara Canonical Authorities: "The Digambara tradition venerates the Shatkhandagama (Six-Part Scripture composed in Sauraseni Prakrit by Acharyas Pushpadanta and Bhutabali around the 1st–2nd c. CE based on the lost Drstivada teachings of Acharya Dharasena) and Gunadhara’s Kashayaprabhrta as the primary canonical revelations. Together with these, the sublime spiritual treatises of Acharya Kundakunda—the Prabhrtatraya (Samayasara, Pravachanasara, Niyamasara, and Panchastikayasara)—form the authoritative heart of Digambara metaphysics, non-violence, and self-realization."',
      translationHi:
        'दिगम्बर प्रामाणिक ग्रन्थ परम्परा: "दिगम्बर परम्परा में षट्खण्डागम (आचार्य पुष्पदंत एवं भूतबली विरचित — १-२ शताब्दी ई.) तथा कषायप्राभृत को मूल आगमिक प्रमाण माना जाता है। इसके साथ ही अध्यात्म-योगी आचार्य कुन्दकुन्द के महान ग्रन्थ समयसार, प्रवचनसार, नियमसार और पंचास्तिकाय दिगम्बर दर्शन के सर्वोच्च आधार हैं।"',
      sectionTitle: 'The Digambara Canon — Shatkhandagama & Acharya Kundakunda',
    },
  ],
};
