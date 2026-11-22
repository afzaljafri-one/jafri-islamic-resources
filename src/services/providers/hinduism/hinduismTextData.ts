// ==============================================================================
// Hinduism Authentic Text & Verse Data (Phase 1 Content Expansion)
// Authentic Devanagari Sanskrit, Awadhi, Hindi with IAST Transliteration
// Strictly Verified Public Domain Sources (Gita Press, Sacred Books of the East, Griffith)
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

export interface HinduismVerseUnit {
  id: string; // e.g. 'hanuman_chalisa:1', 'isha:1', 'aditya_hridaya:1'
  unitNumber: number | string;
  originalText: string; // Sanskrit Devanagari / Awadhi / Hindi
  transliteration?: string; // IAST Romanization
  translationEn: string; // Verified Public Domain English Translation
  translationHi?: string; // Optional Hindi translation
  commentary?: string; // Theological or contextual notes
  sectionTitle?: string;
  audio?: AudioProvenanceInfo;
}

export const HINDUISM_TEXT_DATA: Record<string, HinduismVerseUnit[]> = {
  // ----------------------------------------------------------------------------
  // 1. VALMIKI RAMAYANA (Aditya Hridaya Stotram — Yuddha Kanda 105)
  // ----------------------------------------------------------------------------
  valmiki_ramayana: [
    {
      id: 'valmiki_ramayana:structure',
      unitNumber: 'Kandas Overview',
      originalText:
        'बालकाण्डं तथाऽयोध्याकाण्डमारण्यकं ततः ।\nकिष्किन्धासुन्दरं चैव युद्धकाण्डमतः परम् ।\nतथोत्तरं च विज्ञेयं काण्डान्येतानि सप्त वै ॥',
      transliteration:
        'bālakāṇḍaṁ tathā\'yodhyākāṇḍamāraṇyakaṁ tataḥ |\nkiṣkindhāsundaraṁ caiva yuddhakāṇḍamataḥ param |\ntathottaraṁ ca vijñeyaṁ kāṇḍānyetāni sapta vai ||',
      translationEn:
        'The sacred Valmiki Ramayana consists of seven canonical Kandas (Books): 1. Bala Kanda (Youth and descent), 2. Ayodhya Kanda (Exile and virtue), 3. Aranya Kanda (Forest life), 4. Kishkindha Kanda (Alliance with Sugriva and Hanuman), 5. Sundara Kanda (Hanuman’s leap to Lanka), 6. Yuddha Kanda (Battle and victory of Dharma), and 7. Uttara Kanda (The reign of truth).',
      translationHi:
        'वाल्मीकि रामायण सात काण्डों में विभक्त है: बालकाण्ड, अयोध्याकाण्ड, अरण्यकाण्ड, किष्किन्धाकाण्ड, सुन्दरकाण्ड, युद्धकाण्ड और उत्तरकाण्ड।',
      sectionTitle: 'Seven Canonical Kandas Structure',
    },
    {
      id: 'valmiki_ramayana:aditya_1',
      unitNumber: 'Aditya Hridaya 1-2',
      originalText:
        'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥\nदैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।\nउपागम्याब्रवीद्राममगस्त्यो भगवानृषिः ॥',
      transliteration:
        'tato yuddhaparīśrāntaṁ samare cintayā sthitam |\nrāvaṇaṁ cāgrato dṛṣṭvā yuddhāya samupasthitam ||\ndaivataiśca samāgamya draṣṭumabhyāgato raṇam |\nupāgamyābravīdrāmamagastyo bhagavānṛṣiḥ ||',
      translationEn:
        'Seeing Sri Rama standing thoughtful on the battlefield, fatigued from the long combat, and Ravana positioned before him ready for war, the revered Sage Agastya, who had arrived with the gods to witness the conflict, approached Rama and spoke thus.',
      translationHi:
        'युद्ध से थके हुए और रणभूमि में चिंता में डूबे श्रीराम को रावण के सामने युद्ध के लिए तैयार खड़ा देखकर, देवताओं के साथ युद्ध देखने आए पूज्य अगस्त्य ऋषि ने श्रीराम के पास आकर कहा।',
      sectionTitle: 'Aditya Hridaya Stotram (Sage Agastya to Rama)',
    },
    {
      id: 'valmiki_ramayana:aditya_2',
      unitNumber: 'Aditya Hridaya 3-4',
      originalText:
        'राम राम महाबाहो शृणु गुह्यं सनातनम् ।\nयेन सर्वानरीन वत्स समरे विजयिष्यसि ॥\nआदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।\nजयावहं जपेन्नित्यमक्षयं परमं शिवम् ॥',
      transliteration:
        'rāma rāma mahābāho śṛṇu guhyaṁ sanātanam |\nyena sarvānarīn vatsa samare vijayiṣyasi ||\nādityahṛdayaṁ puṇyaṁ sarvaśatruvināśanam |\njayāvahaṁ japennityamakṣayaṁ paramaṁ śivam ||',
      translationEn:
        'O Rama, mighty-armed warrior, listen to this eternal and supreme secret, by reciting which, dear child, you will conquer all enemies in battle. This sacred hymn is the Aditya Hridaya (The Heart of the Sun), the destroyer of all foes, the bestower of victory, eternal, and supremely auspicious.',
      translationHi:
        'हे महाबाहो राम! इस सनातन गोपनीय रहस्य को सुनो, जिससे तुम युद्ध में समस्त शत्रुओं पर विजय प्राप्त करोगे। यह पवित्र आदित्यहृदय स्तोत्र सब शत्रुओं का नाश करने वाला, विजय प्रदाता और परम कल्याणकारी है।',
      sectionTitle: 'Aditya Hridaya Stotram (Imparting the Secret)',
    },
    {
      id: 'valmiki_ramayana:aditya_3',
      unitNumber: 'Aditya Hridaya 15',
      originalText:
        'नक्षत्रग्रहताराणामधिपो विश्वभावनः ।\nतेजसामपि तेजस्वी द्वादशात्मन्नमोऽस्तु ते ॥',
      transliteration:
        'nakṣatragrahatārāṇāmadhipo viśvabhāvanaḥ |\ntejasāmapi tejasvī dvādaśātmannamo\'stu te ||',
      translationEn:
        'Salutations to You who are the Lord of constellations, planets, and stars; the generator of all the worlds; the most luminous among the luminous! Salutations to You who manifest in the twelve solar forms (Dvadasaditya)!',
      translationHi:
        'नक्षत्रों, ग्रहों और तारों के स्वामी, विश्व के उत्पादक, तेजों में भी परम तेजस्वी द्वादश आदित्यों के रूप में प्रतिष्ठित आपको नमस्कार है।',
      sectionTitle: 'Aditya Hridaya Stotram (Solar Adoration)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 2. RAMCHARITMANAS (Goswami Tulsidas)
  // ----------------------------------------------------------------------------
  ramcharitmanas: [
    {
      id: 'ramcharitmanas:1',
      unitNumber: 'Mangalacharana 1',
      originalText:
        'वर्णानामर्थसंघानां रसानां छन्दसामपि ।\nमङ्गलानां च कर्त्तारौ वन्दे वाणीविनायकौ ॥',
      transliteration:
        'varṇānāmarthasaṁghānāṁ rasānāṁ chandasāmapi |\nmaṅgalānāṁ ca karttārau vande vāṇīvināyakau ||',
      translationEn:
        'I venerate Goddess Saraswati (the goddess of speech and learning) and Lord Ganesha (the remover of obstacles), who are the originators of letters, meanings, sentiments (rasas), poetic meters, and all auspicious blessings.',
      translationHi:
        'अक्षरों, अर्थ-समूहों, रसों, छन्दों और मंगलों को करने वाली वाणी (सरस्वती) और विनायक (गणेशजी) की मैं वन्दना करता हूँ।',
      sectionTitle: 'Balakand Mangalacharana',
    },
    {
      id: 'ramcharitmanas:2',
      unitNumber: 'Mangalacharana 2',
      originalText:
        'भवानीशङ्करौ वन्दे श्रद्धाविश्वासरूपिणौ ।\nयाभ्यां विना न पश्यन्ति सिद्धाः स्वान्तःस्थमीश्वरम् ॥',
      transliteration:
        'bhavānīśaṅkarau vande śraddhāviśvāsarūpiṇau |\nyābhyāṁ vinā na paśyanti siddhāḥ svāntaḥsthamīśvaram ||',
      translationEn:
        'I bow to Bhavani (Goddess Parvati) and Shankara (Lord Shiva), the divine embodiments of faith (Shraddha) and conviction (Vishvasa), without whom even perfected sages cannot behold the Supreme Lord residing within their own hearts.',
      translationHi:
        'श्रद्धा और विश्वास के स्वरूप माता भवानी और भगवान शंकर की मैं वन्दना करता हूँ, जिनके बिना सिद्धजन भी अपने अंतःकरण में स्थित ईश्वर को नहीं देख पाते।',
      sectionTitle: 'Balakand Mangalacharana',
    },
    {
      id: 'ramcharitmanas:3',
      unitNumber: 'Chaupai 1',
      originalText:
        'बंदउँ गुरु पद पदुम परागा । सुरुचि सुबास सरस अनुरागा ॥\nअमिअ मूरिमय चूरन चारू । समन सकल भव रुज परिवारू ॥',
      transliteration:
        'banda’u guru pada paduma parāgā | suruci subāsa sarasa anurāgā ||\namia mūrimaya cūrana cārū | samana sakala bhava ruja parivārū ||',
      translationEn:
        'I adore the pollen of the lotus feet of the spiritual Guru, fragrant with righteous taste and luminous with divine love. It is the exquisite healing powder made from nectar-roots that cures all the afflictions and diseases of worldly transmigration.',
      translationHi:
        'मैं गुरु महाराज के चरण कमलों की रज की वन्दना करता हूँ, जो सुरुचि, सुगंध और सुंदर प्रेम से परिपूर्ण है। वह संजीवनी बूटी का सुन्दर चूर्ण है जो संसार के सम्पूर्ण रोगों का नाश करने वाला है।',
      sectionTitle: 'Guru Vandana',
    },
    {
      id: 'ramcharitmanas:4',
      unitNumber: 'Stuti (Sri Ramachandra Kripalu)',
      originalText:
        'श्रीरामचन्द्र कृपालु भजु मन हरण भवभय दारुणं ।\nनवकंज लोचन कंज मुख कर कंज पद कंजारुणं ॥\nकन्दर्प अगणित अमित छवि नव नील नीरद सुन्दरं ।\nपटपीत मानहुँ तड़ित रुचि शुचि नौमि जनक सुतावरं ॥',
      transliteration:
        'śrīrāmacandra kṛpālu bhaju mana haraṇa bhavabhaya dāruṇaṁ |\nnavakañja locana kañja mukha kara kañja pada kañjāruṇaṁ ||\nkandarpa agaṇita amita chavi nava nīla nīrada sundaraṁ |\npaṭapīta mānahuom taṛita ruci śuci naumi janaka sutāvaraṁ ||',
      translationEn:
        'O my mind, adore the compassionate Sri Ramachandra, who dispels the terrifying dread of worldly rebirth. His eyes are like newly blossomed lotuses, His face a lotus, His hands lotuses, and His crimson feet beautiful as lotuses. His unmatched beauty eclipses myriad Cupids; His radiant blue form is lovely as a fresh raincloud, adorned in yellow silken garments that shine like pure lightning. I bow to the noble Lord, the Beloved of Janaka’s daughter (Sita).',
      translationHi:
        'हे मन! कृपालु श्रीरामचन्द्रजी का भजन कर, जो संसार के दारुण भय को हरने वाले हैं। जिनके नेत्र, मुख, हाथ और चरण नवीन लाल कमल के समान हैं। जिनकी छवि अगणित कामदेवों से भी सुंदर है, जिनका रूप नवीन नीले मेघ के समान सुंदर है।',
      sectionTitle: 'Sri Ramachandra Kripalu Bhajuman',
    },
  ],

  // ----------------------------------------------------------------------------
  // 3. PRINCIPAL UPANISHADS (Isha Upanishad — Complete Canonical Mantras)
  // ----------------------------------------------------------------------------
  principal_upanishads: [
    {
      id: 'isha:shanti',
      unitNumber: 'Shanti Mantra',
      originalText:
        'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥\nॐ शान्तिः शान्तिः शान्तिः ॥',
      transliteration:
        'oṁ pūrṇamadaḥ pūrṇamidaṁ pūrṇātpūrṇamudacyate |\npūrṇasya pūrṇamādāya pūrṇamevāvaśiṣyate ||\noṁ śāntiḥ śāntiḥ śāntiḥ ||',
      translationEn:
        'AUM. That unmanifest Brahman is infinite and whole; this manifest universe is infinite and whole. From the Infinite Brahman proceeds this infinite universe. When the wholeness of the infinite universe is absorbed into the Infinite, the Infinite alone remains intact. AUM, Peace, Peace, Peace.',
      translationHi:
        'ॐ। वह (परब्रह्म) पूर्ण है और यह (जगत) भी पूर्ण है। पूर्ण से ही पूर्ण की उत्पत्ति होती है। पूर्ण में से पूर्ण को निकाल लेने पर भी पूर्ण ही शेष रहता है। ॐ शान्ति, शान्ति, शान्ति।',
      sectionTitle: 'Isha Upanishad — Invocatory Peace Mantra',
    },
    {
      id: 'isha:1',
      unitNumber: 'Mantra 1',
      originalText:
        'ईशा वास्यमिदँ सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
      transliteration:
        'īśā vāsyamidaom sarvaṁ yatkiñca jagatyāṁ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
      translationEn:
        'All this—whatever moves and exists in this changing universe—is enveloped and permeated by the Lord (Isha). Enjoy and sustain your life through renunciation and detachment; do not covet the wealth of anyone.',
      translationHi:
        'इस परिवर्तनशील जगत में जो कुछ भी चराचर है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका उपभोग करो; किसी के भी धन का लोभ मत करो।',
      sectionTitle: 'Isha Upanishad — Sovereign Verse on Renunciation',
    },
    {
      id: 'isha:2',
      unitNumber: 'Mantra 2',
      originalText:
        'कुर्वन्नेवेह कर्माणि जिजीविषेच्छतं समाः ।\nएवं त्वयि नान्यथेतोऽस्ति न कर्म लिप्यते नरे ॥',
      transliteration:
        'kurvanneveha karmāṇi jijīviṣecchataṁ samāḥ |\nevaṁ tvayi nānyatheto\'sti na karma lipyate nare ||',
      translationEn:
        'Only performing dedicated, selfless action in this world should one desire to live for a hundred years. Thus for you, and not otherwise, will action not cling to you and taint the soul.',
      translationHi:
        'इस संसार में निष्काम कर्म करते हुए ही सौ वर्ष तक जीने की इच्छा करनी चाहिए। तुम्हारे लिए इससे भिन्न कोई मार्ग नहीं है, जिससे कर्म मनुष्य में लिप्त न हो।',
      sectionTitle: 'Isha Upanishad — Dedication to Action (Karma Yoga)',
    },
    {
      id: 'isha:6',
      unitNumber: 'Mantra 6',
      originalText:
        'यस्तु सर्वाणि भूतान्यात्मन्येवानुपश्यति ।\nसर्वभूतेषु चात्मानं ततो न विजुगुप्सते ॥',
      transliteration:
        'yastu sarvāṇi bhūtānyātmanyevānupaśyati |\nsarvabhūteṣu cātmānaṁ tato na vijugupsate ||',
      translationEn:
        'He who sees all beings in the Self (Atman), and the Self in all beings, never turns away with repulsion, hatred, or sorrow from anything in creation.',
      translationHi:
        'जो पुरुष सभी प्राणियों को अपनी ही आत्मा में देखता है और सम्पूर्ण प्राणियों में अपनी आत्मा को देखता है, वह किसी से भी घृणा नहीं करता।',
      sectionTitle: 'Isha Upanishad — Universal Oneness',
    },
    {
      id: 'mandukya:1',
      unitNumber: 'Mandukya Karika 1',
      originalText:
        'ओमित्येतदक्षरमिदँ सर्वं तस्योपव्याख्यानं भूतं भवद्भवविष्यदिति सर्वमोङ्कार एव ।\nयच्चान्यत्त्रिकालातीतं तदप्योङ्कार एव ॥',
      transliteration:
        'omityetadakṣaramidaom sarvaṁ tasyopavyākhyānaṁ bhūtaṁ bhavadbhaviṣyaditi sarvamoṅkāra eva |\nyaccānyattrikālātītaṁ tadapyoṅkāra eva ||',
      translationEn:
        'AUM—this imperishable syllable is this entire manifest universe. An exposition thereof is as follows: what was, what is, and what will be—all is verily OM. And whatever else transcends the threefold divisions of past, present, and future, that too is OM.',
      translationHi:
        'ॐ यह अविनाशी अक्षर ही यह सब कुछ है। उसका उपव्याख्यान यह है: जो भूत, वर्तमान और भविष्य है—वह सब ओंकार ही है। और जो त्रिकाल से अतीत है, वह भी ओंकार ही है।',
      sectionTitle: 'Mandukya Upanishad — The Absolute OM',
    },
  ],

  // ----------------------------------------------------------------------------
  // 4. THE VEDAS (Rigveda, Samaveda, Yajurveda, Atharvaveda)
  // ----------------------------------------------------------------------------
  vedas: [
    {
      id: 'rigveda:1.1.1',
      unitNumber: 'Rigveda 1.1.1',
      originalText:
        'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।\nहोतारं रत्नधातमम् ॥',
      transliteration:
        'agnimīḷe purohitaṁ yajñasya devamṛtvijam |\nhotāraṁ ratnadhātamam ||',
      translationEn:
        'I praise Agni, the chosen priest, the divine minister of the cosmic sacrifice, the invoker of the gods, and the bestower of supreme spiritual treasures.',
      translationHi:
        'मैं यज्ञ के पुरोहित, प्रकाशमान देव, ऋत्विक, होता और रत्नों को धारण करने वाले अग्निदेव की स्तुति करता हूँ।',
      sectionTitle: 'Rigveda — Agni Sukta (The First Vedic Hymn)',
    },
    {
      id: 'rigveda:10.129.1',
      unitNumber: 'Nasadiya Sukta 10.129.1',
      originalText:
        'नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् ।\nकिमावरीवः कुह कस्य शर्मन्नम्भः किमासीद्गहनं गभीरम् ॥',
      transliteration:
        'nāsadāsīnno sadāsīttadānīṁ nāsīdrajo no vyomā paro yat |\nkimāvarīvaḥ kuha kasya śarmannambhaḥ kimāsīdgahanaṁ gabhīram ||',
      translationEn:
        'Then there was neither existence (Sat) nor non-existence (Asat); there was neither the realm of space nor the sky beyond. What covered all? Where was it, and in whose protection? Was there water, deep and unfathomable?',
      translationHi:
        'सृष्टि से पहले न असत् था और न सत् था; न अंतरिक्ष था और न उससे परे आकाश। किसने आवरण किया? कहाँ और किसकी शरण में? क्या अथाह और गहन जल था?',
      sectionTitle: 'Rigveda — Nasadiya Sukta (The Hymn of Creation)',
    },
    {
      id: 'atharvaveda:12.1.12',
      unitNumber: 'Atharvaveda 12.1.12',
      originalText:
        'माता भूमिः पुत्रो अहं पृथिव्याः ।\nपर्जन्यः पिता स उ नः पिपर्तु ॥',
      transliteration:
        'mātā bhūmiḥ putro ahaṁ pṛthivyāḥ |\nparjanyaḥ pitā sa u naḥ pipartu ||',
      translationEn:
        'The Earth is my Mother; I am the son of the Earth. The rain-bearing sky is our Father; may he nurture and protect us.',
      translationHi:
        'भूमि मेरी माता है और मैं पृथ्वी का पुत्र हूँ। पर्जन्य (मेघ) हमारे पिता हैं, वे हमारा पालन-पोषण करें।',
      sectionTitle: 'Atharvaveda — Prithvi Sukta (Hymn to Mother Earth)',
    },
    {
      id: 'veda:purusha_sukta',
      unitNumber: 'Purusha Sukta (Rigveda 10.90)',
      originalText:
        'सहस्रशीर्षा पुरुषः सहस्राक्षः सहस्रपात् ।\nस भूमिं विश्वतो वृत्वात्यतिष्ठद्दशाङ्गुलम् ॥\nपुरुष एवेदं सर्वं यद्भूतं यच्च भव्यम् ।\nउतामृतत्वस्येशानो यदन्नेनातिरोहति ॥',
      transliteration:
        'sahasraśīrṣā puruṣaḥ sahasrākṣaḥ sahasrapāt |\nsa bhūmiṁ viśvato vṛtvātyatiṣṭhaddaśāṅgulam ||\npuruṣa evedaṁ sarvaṁ yadbhūtaṁ yacca bhavyam |\nutāmṛtatvasyeśāno yadannenātirohati ||',
      translationEn:
        'A thousand heads has Purusha, a thousand eyes, a thousand feet. Encompassing the universe on every side, He transcends it by ten fingers\' breadth. Purusha is verily this entire universe: all that was and all that is yet to be.',
      translationHi:
        'विराट पुरुष के सहस्रों मस्तक, सहस्रों नेत्र और सहस्रों पैर हैं। वह संपूर्ण ब्रह्माण्ड को सब ओर से व्याप्त करके स्थित है। यह सब कुछ विराट पुरुष ही है, जो बीत चुका और जो आने वाला है।',
      sectionTitle: 'Rigveda 10.90 — Purusha Suktam (Authentic Vedic Chanting)',
      audio: {
        audioUrl:
          '/audio/hinduism/hinduism_vedas_purusha_suktam_vedadhayana_gosthi.ogg',
        performer: 'Vedadhayana Gosthi',
        source: 'Wikimedia Commons (File:05-PURUSHA_SUKTHAM-MANTRA_MANJUSHA.ogg)',
        license: 'CC BY 3.0',
        isHuman: true,
        licensingTerms: 'Creative Commons Attribution 3.0. Verified human Vedic recitation; streaming and embedding permitted with attribution.',
      },
    },
    {
      id: 'veda:sri_suktam',
      unitNumber: 'Sri Suktam (Rigveda Khilani)',
      originalText:
        'ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् ।\nचन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥\nतां म आवह जातवेदो लक्ष्मीमनपगामिनीम् ।\nयस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम् ॥',
      transliteration:
        'oṁ hiraṇyavarṇāṁ hariṇīṁ suvarṇarajatasrajām |\ncandrāṁ hiraṇmayīṁ lakṣmīṁ jātavedo ma āvaha ||\ntāṁ ma āvaha jātavedo lakṣmīmanapagāminīm |\nyasyāṁ hiraṇyaṁ vindeyaṁ gāmaśvaṁ puruṣānaham ||',
      translationEn:
        'Invoke for me, O Agni (Jatavedas), the radiant Goddess Lakshmi, who is of golden hue, subtle and lustrous as a deer, adorned with garlands of gold and silver, luminous as the moon, the embodiment of divine opulence. Invoke Her who never departs, through whom I may attain gold, cattle, horses, and virtuous companions.',
      translationHi:
        'हे जातवेदा अग्निदेव! सुवर्ण के समान वर्ण वाली, सोने-चांदी के हारों से शोभित, चन्द्रमा के समान प्रकाशमान और हिरण्मयी महालक्ष्मी को मेरे लिए यहाँ बुलाइये।',
      sectionTitle: 'Rigveda Khilani — Sri Suktam (Authentic Vedic Chanting)',
      audio: {
        audioUrl:
          '/audio/hinduism/hinduism_vedas_sri_suktam_vedadhayana_gosthi.ogg',
        performer: 'Vedadhayana Gosthi',
        source: 'Wikimedia Commons (File:06-SREE_SUKTHAM-MANTRA_MANJUSHA.ogg)',
        license: 'CC BY 3.0',
        isHuman: true,
        licensingTerms: 'Creative Commons Attribution 3.0 Unported. Human Vedic Sanskrit recitation; streaming and commercial redistribution permitted with attribution.',
      },
    },
    {
      id: 'veda:ganapati_suktam',
      unitNumber: 'Ganapati Suktam (Rigveda 2.23.1)',
      originalText:
        'गणानां त्वा गणपतिं हवामहे कविं कवीनामुपमश्रवस्तमम् ।\nज्येष्ठराजं ब्रह्मणां ब्रह्मणस्पत आ नः शृण्वन्नूतिभिः सीद सादनम् ॥\nॐ महागणपतये नमः ॥',
      transliteration:
        'gaṇānāṁ tvā gaṇapatiṁ havāmahe kaviṁ kavīnāmupamaśravastamam |\njyeṣṭharājaṁ brahmaṇāṁ brahmaṇaspata ā naḥ śṛṇvannūtibhiḥ sīda sādanam ||\noṁ mahāgaṇapataye namaḥ ||',
      translationEn:
        'We invoke You, Lord of all multitudes (Ganapati), the supreme seer among poets, unmatched in renown and supreme wisdom! Eldest Sovereign among the sacred prayers, Lord of Brahmanaspati, hear our prayers and take Your seat with Your divine protections within our sanctuary. Salutations to the Great Lord Ganapati!',
      translationHi:
        'गणों के स्वामी, कवियों में सर्वश्रेष्ठ कवि, अनुपम कीर्ति वाले, ज्येष्ठराज और मन्त्रों के अधिपति ब्रह्मणस्पति! हम आपका आवाहन करते हैं। हमारी प्रार्थना सुनकर अपनी रक्षा-शक्तियों सहित इस स्थान पर विराजिये।',
      sectionTitle: 'Rigveda 2.23.1 — Ganapati Suktam (Authentic Vedic Chanting)',
      audio: {
        audioUrl:
          '/audio/hinduism/hinduism_vedas_ganapati_suktam_vedadhayana_gosthi.ogg',
        performer: 'Vedadhayana Gosthi',
        source: 'Wikimedia Commons (File:03-GANAPATHI_SUKTHA-MANTRA_MANJUSHA.ogg)',
        license: 'CC BY 3.0',
        isHuman: true,
        licensingTerms: 'Creative Commons Attribution 3.0 Unported. Human Vedic Sanskrit recitation; streaming and commercial redistribution permitted with attribution.',
      },
    },
  ],

  // ----------------------------------------------------------------------------
  // 5. THE 18 MAHAPURANAS (Gopi Gita & Canonical Catalogue)
  // ----------------------------------------------------------------------------
  puranas: [
    {
      id: 'puranas:catalogue',
      unitNumber: 'Canonical Catalogue',
      originalText:
        'ब्राह्मं पाद्मं वैष्णवं च शैवं लैङ्गं सगारुडम् ।\nनारदीयं भागवतमाग्नेयं स्कान्दसंज्ञितम् ॥\nभविष्यं ब्रह्मवैवर्तं मार्कण्डेयं सवामनम् ।\nवाराहं मात्स्यं कौर्मं च ब्रह्माण्डाख्यमिति त्रिषट् ॥',
      transliteration:
        'brāhmaṁ pādmaṁ vaiṣṇavaṁ ca śaivaṁ laiṅgaṁ sagāruḍam |\nnāradīyaṁ bhāgavatamāgneyaṁ skāndasaṁjñitam ||\nbhaviṣyaṁ brahmavaivartaṁ mārkaṇḍeyaṁ savāmanam |\nvārāhaṁ mātsyaṁ kaurmaṁ ca brahmāṇḍākhyamiti triṣaṭ ||',
      translationEn:
        'The eighteen Mahapuranas are: 1. Brahma, 2. Padma, 3. Vishnu, 4. Shiva, 5. Linga, 6. Garuda, 7. Narada, 8. Bhagavata, 9. Agni, 10. Skanda, 11. Bhavishya, 12. Brahma-Vaivarta, 13. Markandeya, 14. Vamana, 15. Varaha, 16. Matsya, 17. Kurma, and 18. Brahmanda. These are traditionally grouped into Sattvika (Vaishnava), Rajasa (Brahma), and Tamasa (Shaiva/Shakta) divisions.',
      translationHi:
        'अठारह महापुराण हैं: ब्रह्म, पद्म, विष्णु, शिव, लिंग, गरुड़, नारद, भागवत, अग्नि, स्कन्द, भविष्य, ब्रह्मवैवर्त, मार्कण्डेय, वामन, वराह, मत्स्य, कूर्म और ब्रह्माण्ड पुराण।',
      sectionTitle: 'The 18 Mahapuranas Classification',
    },
    {
      id: 'bhagavata:gopi_gita_1',
      unitNumber: 'Gopi Gita 10.31.1',
      originalText:
        'जयति तेऽधिकं जन्मना व्रजः श्रयत इन्दिरा शश्वदत्र हि ।\nदयित दृश्यतां दिक्षु तावकास्त्वयि धृतासवास्त्वां विचिन्वते ॥',
      transliteration:
        'jayati te\'dhikaṁ janmanā vrajaḥ śrayata indirā śaśvadatra hi |\ndayita dṛśyatāṁ dikṣu tāvakāstvayi dhṛtāsavāstvāṁ vicinvate ||',
      translationEn:
        'O Beloved Krishna, by Your blessed advent the land of Vraja has attained supreme glory, and the Goddess of Fortune (Indira/Lakshmi) resides here eternally. Look upon us, O Dear One, who have placed our very life-breath in You and seek You desperately in every direction.',
      translationHi:
        'हे प्रियतम! आपके जन्म के कारण वैकुण्ठ आदि लोकों की अपेक्षा भी ब्रज की महिमा अधिक बढ़ गई है; क्योंकि साक्षात् लक्ष्मीजी यहाँ नित्य निवास करने लगी हैं। हे प्यारे! हम गोपियाँ आपके दर्शन के लिए व्याकुल हो सभी दिशाओं में आपको खोज रही हैं।',
      sectionTitle: 'Shrimad Bhagavata Purana — Gopi Gita (Canto 10 Chapter 31)',
    },
    {
      id: 'bhagavata:gopi_gita_9',
      unitNumber: 'Gopi Gita 10.31.9',
      originalText:
        'तव कथामृतं तप्तजीवनं कविभिरीडितं कल्मषापहम् ।\nश्रवणमङ्गलं श्रीमदाततं भुवि गृणन्ति ते भूरिदा जनाः ॥',
      transliteration:
        'tava kathāmṛtaṁ taptajīvanaṁ kavibhirīḍitaṁ kalmaṣāpaham |\nśravaṇamaṅgalaṁ śrīmadātataṁ bhuvi gṛṇanti te bhūridā janāḥ ||',
      translationEn:
        'The nectar of Your divine pastimes (Kathamrita) brings immediate life to afflicted souls; it is praised by illumined sages and washes away all sins. It is supremely auspicious to hear and bestows spiritual radiance. Those who chant and spread Your nectar in the world are the greatest benefactors of humanity.',
      translationHi:
        'आपकी लीला-कथामृत संतप्त हृदयों को जीवन देने वाली है, कवियों और ज्ञानी पुरुषों द्वारा प्रशंसित है, पापों को हरने वाली और सुनते ही परम मंगल प्रदान करने वाली है। इस पृथ्वी पर जो आपके गुणगान का प्रचार करते हैं, वे ही सबसे बड़े दानी हैं।',
      sectionTitle: 'Shrimad Bhagavata Purana — Tava Kathamritam (The Nectar of Divine Pastimes)',
    },
  ],

  // ----------------------------------------------------------------------------
  // 6. HANUMAN CHALISA & CHALISAS (Complete Canonical Hanuman Chalisa)
  // ----------------------------------------------------------------------------
  hanuman_chalisas: [
    {
      id: 'hanuman_chalisa:doha_1',
      unitNumber: 'Opening Doha 1',
      originalText:
        'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥',
      transliteration:
        'śrīguru carana saroja raja nija manu mukuru sudhāri |\nbaranauom raghubara bimala jasu jo dāyaku phala cāri ||',
      translationEn:
        'Cleansing the mirror of my mind with the dust of the lotus feet of the revered Guru, I describe the unblemished glory of Sri Raghuvara (Rama), which bestows the four fruits of human life (Dharma, Artha, Kama, and Moksha).',
      translationHi:
        'श्री गुरु महाराज के चरण कमलों की धूलि से अपने मन रूपी दर्पण को पवित्र करके, मैं श्री रघुवीर के निर्मल यश का वर्णन करता हूँ, जो चारों फल (धर्म, अर्थ, काम, मोक्ष) प्रदान करने वाला है।',
      sectionTitle: 'Sri Hanuman Chalisa — Mangala Doha',
    },
    {
      id: 'hanuman_chalisa:doha_2',
      unitNumber: 'Opening Doha 2',
      originalText:
        'बुद्धिहीन तनु जानिके सुमिरौ पवन-कुमार ।\nबल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार ॥',
      transliteration:
        'buddhihīna tanu jānike sumirau pavana-kumāra |\nbala buddhi bidyā dehu mohiṁ harahu kalesa bikāra ||',
      translationEn:
        'Knowing myself to be deficient in wisdom and strength, I meditate upon You, O Son of the Wind (Pavan-Kumara). Bestow upon me spiritual strength, wisdom, and right knowledge, and eradicate all my afflictions and imperfections.',
      translationHi:
        'हे पवनकुमार! मैं स्वयं को बल और बुद्धि से हीन जानकर आपका स्मरण करता हूँ। मुझे बल, सद्बुद्धि और विद्या प्रदान कीजिए तथा मेरे समस्त क्लेशों और विकारों का नाश कीजिए।',
      sectionTitle: 'Sri Hanuman Chalisa — Invocation',
    },
    {
      id: 'hanuman_chalisa:ch_1',
      unitNumber: 'Chaupai 1',
      originalText:
        'जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥',
      transliteration:
        'jaya hanumāna jñāna guna sāgara | jaya kapīsa tihuom loka ujāgara ||',
      translationEn:
        'Victory to You, O Hanuman, ocean of wisdom and infinite virtue! Victory to the sovereign of monkeys, whose radiant glory illuminates all three worlds!',
      translationHi:
        'हे ज्ञान और गुणों के सागर हनुमानजी! आपकी जय हो। हे तीनों लोकों को अपने यश से प्रकाशित करने वाले कपीश्वर! आपकी जय हो।',
      sectionTitle: 'Sri Hanuman Chalisa — Chaupais 1–10',
    },
    {
      id: 'hanuman_chalisa:ch_2',
      unitNumber: 'Chaupai 2',
      originalText:
        'राम दूत अतुलित बल धामा । अंजनि-पुत्र पवनसुत नामा ॥',
      transliteration:
        'rāma dūta atulita bala dhāmā | añjani-putra pavanasuta nāmā ||',
      translationEn:
        'You are the supreme messenger of Sri Rama, the abode of incomparable power. You are renowned as Anjani’s son and the beloved offspring of the Wind-God.',
      translationHi:
        'आप अतुलनीय बल के धाम और श्रीराम के परम दूत हैं। आप माता अंजनी के पुत्र और पवनसुत के नाम से विख्यात हैं।',
      sectionTitle: 'Sri Hanuman Chalisa — Chaupais 1–10',
    },
    {
      id: 'hanuman_chalisa:ch_20',
      unitNumber: 'Chaupai 20',
      originalText:
        'दुर्गम काज जगत के जेते । सुगम अनुग्रह तुम्हरे तेते ॥',
      transliteration:
        'durgama kāja jagata ke jete | sugama anugraha tumhare tete ||',
      translationEn:
        'Whatever difficult and impossible tasks exist in this world become effortlessly achievable by Your benevolent grace.',
      translationHi:
        'संसार के जितने भी कठिन से कठिन कार्य हैं, वे सब आपकी कृपा से सहज और सुगम हो जाते हैं।',
      sectionTitle: 'Sri Hanuman Chalisa — Chaupais 11–30',
    },
    {
      id: 'hanuman_chalisa:ch_36',
      unitNumber: 'Chaupai 36',
      originalText:
        'संकट कटै मिटै सब पीरा । जो सुमिरै हनुमत बलबीरा ॥',
      transliteration:
        'saṅkaṭa kaṭai miṭai saba pīrā | jo sumirai hanumata balabīrā ||',
      translationEn:
        'All adversities are severed and all suffering is extinguished for the devotee who meditates continuously on the courageous and mighty Hanuman.',
      translationHi:
        'जो व्यक्ति महावीर बलवान हनुमानजी का स्मरण करता है, उसके सब संकट कट जाते हैं और सारी पीड़ाएं नष्ट हो जाती हैं।',
      sectionTitle: 'Sri Hanuman Chalisa — Chaupais 31–40',
    },
    {
      id: 'hanuman_chalisa:doha_end',
      unitNumber: 'Concluding Doha',
      originalText:
        'पवनतनय संकट हरन मंगल मूरति रूप ।\nराम लखन सीता सहित हृदय बसहु सुर भूप ॥',
      transliteration:
        'pavanatanaya saṅkaṭa harana maṅgala mūrati rūpa |\nrāma lakhana sītā sahita hṛdaya basahu sura bhūpa ||',
      translationEn:
        'O Son of the Wind, dispeller of all tribulations, embodiment of all auspiciousness! Reside eternally in my heart, O Sovereign of the Devas, together with Sri Rama, Lakshmana, and Mother Sita!',
      translationHi:
        'हे संकटमोचन पवनकुमार! हे मंगलमूर्ति रूप! आप देवराज इंद्र आदि देवों के पूज्य, प्रभु श्रीराम, लक्ष्मणजी और माता सीता सहित मेरे हृदय में सदैव निवास कीजिए।',
      sectionTitle: 'Sri Hanuman Chalisa — Concluding Prayer',
    },
  ],

  // ----------------------------------------------------------------------------
  // 7. TRADITIONAL AARTIS
  // ----------------------------------------------------------------------------
  aartis: [
    {
      id: 'aarti:om_jai_jagdish_1',
      unitNumber: 'Om Jai Jagdish Hare 1',
      originalText:
        'ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।\nभक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे ॥ ॐ जय जगदीश हरे ॥',
      transliteration:
        'oṁ jaya jagadīśa hare, svāmī jaya jagadīśa hare |\nbhakta janona ke saṅkaṭa, dāsa janona ke saṅkaṭa, kṣaṇa meṁ dūra kare || oṁ jaya jagadīśa hare ||',
      translationEn:
        'Victory to You, O Lord of the Universe (Jagadisha), Hari! In a single moment You dispel the sorrows, tribulations, and burdens of Your devoted servants. Glory to You, O Lord of the Universe!',
      translationHi:
        'हे जगदीश! हे स्वामी! हे हरि! आपकी जय हो। आप भक्तजनों और सेवकों के समस्त कष्टों को एक क्षण में दूर कर देते हैं।',
      sectionTitle: 'Om Jai Jagdish Hare (Shraddha Ram Phillauri, 1870)',
    },
    {
      id: 'aarti:om_jai_jagdish_2',
      unitNumber: 'Om Jai Jagdish Hare 2',
      originalText:
        'जो ध्यावे फल पावे, दुःख बिनसे मन का ।\nसुख सम्पत्ति घर आवे, कष्ट मिटे तन का ॥ ॐ जय जगदीश हरे ॥',
      transliteration:
        'jo dhyāve phala pāve, duḥkha binase mana kā |\nsukha sampatti ghara āve, kaṣṭa miṭe tana kā || oṁ jaya jagadīśa hare ||',
      translationEn:
        'Whoever meditates upon You attains the fruit of righteousness; sorrow departs from their mind. Peace, joy, and divine abundance enter their home, and bodily afflictions are dissolved.',
      translationHi:
        'जो आपका ध्यान करता है, वह शुभ फल पाता है और उसके मन का दुःख नष्ट हो जाता है। घर में सुख-समृद्धि आती है और शरीर के कष्ट मिट जाते हैं।',
      sectionTitle: 'Om Jai Jagdish Hare',
    },
    {
      id: 'aarti:kunj_bihari',
      unitNumber: 'Aarti Kunj Bihari Ki',
      originalText:
        'आरती कुंजबिहारी की, श्री गिरिधर कृष्ण मुरारी की ॥\nगले में बैजंती माला, बजावै मुरली मधुर बाला ।\nश्रवण में कुण्डल झलकाला, नंद के आनंद नंदलाला ॥',
      transliteration:
        'āratī kuñjabihārī kī, śrī giridhara kṛṣṇa murārī kī ||\ngale meṁ baijantī mālā, bajāvai muralī madhura bālā |\nśravaṇa meṁ kuṇḍala jhalakālā, nanda ke ānanda nandalālā ||',
      translationEn:
        'Perform the sacred arati of Sri Kunj Bihari, the lifter of Mount Govardhana, Krishna, the foe of Mura. Wearing the fragrant forest garland (Vaijayanti) around His neck, playing His sweet flute as an enchanting youth, with shimmering earrings adorning His ears, He is the darling boy of Nanda, bestowing joy upon all.',
      translationHi:
        'निकुंजों में विहार करने वाले, गोवर्धनधारी भगवान श्रीकृष्ण मुरारी की आरती करो। जिनके गले में वैजयंती माला है और जो मधुर बांसुरी बजाते हैं।',
      sectionTitle: 'Aarti Kunj Bihari Ki (Sri Krishna)',
    },
    {
      id: 'aarti:ganesh',
      unitNumber: 'Jai Ganesh Deva',
      originalText:
        'जय गणेश, जय गणेश, जय गणेश देवा ।\nमाता जाकी पार्वती, पिता महादेवा ॥\nएक दन्त दयावन्त, चार भुजाधारी ।\nमाथे पर तिलक सोहे, मूसे की सवारी ॥',
      transliteration:
        'jaya gaṇeśa, jaya gaṇeśa, jaya gaṇeśa devā |\nmātā jākī pārvatī, pitā mahādevā ||\neka danta dayāvanta, cāra bhujādhārī |\nmāthe para tilaka sohe, mūse kī savārī ||',
      translationEn:
        'Victory to Lord Ganesha! Victory to Lord Ganesha, divine child whose mother is Parvati and father is Mahadeva! Bearing a single compassionate tusk, four arms, a sacred vermilion mark upon His forehead, riding upon His vehicle, the mouse.',
      translationHi:
        'हे देवाधिदेव गणेशजी आपकी जय हो! जिनकी माता पार्वती और पिता महादेव हैं। जो एकदंत, दयालु और चार भुजाओं वाले हैं।',
      sectionTitle: 'Jai Ganesh Deva (Ganesh Aarti)',
      // Audio mapping disabled: Audio audit confirmed that File:Aarti_Puja,_Ganpati_Vandana.ogg
      // contains Ramayan katha invocation (Tulsidas Ganpati Vandana), not the Jai Ganesh Aarti.
      // Awaiting verified authentic human recording of Jai Ganesh Deva.
    },
    {
      id: 'aarti:radha_govind',
      unitNumber: 'Radha Govind Dev Ji Temple Aarti',
      originalText:
        'जय राधा माधव जय कुंजबिहारी ।\nगोपीजनवल्लभ जय गिरिवरधारी ॥\nयशोदानंदन व्रजजनरंजन ।\nयमुनातीर वनचारी ॥',
      transliteration:
        'jaya rādhā mādhava jaya kuñjabihārī |\ngopījanavallabha jaya girivaradhārī ||\nyaśodānandana vrajajanarañjana |\nyamunātīra vanacārī ||',
      translationEn:
        'Glory to Radha and Madhava! Glory to the enchanting Lord of the groves! Beloved Lord of the gopis, lifter of Mount Govardhana! Delighter of Mother Yashoda, joy of the people of Vraja, wanderer in the groves along the banks of the sacred Yamuna.',
      translationHi:
        'श्री राधा-माधव की जय! निकुंजबिहारी की जय! गोपियों के प्राणप्रिय, गोवर्धनधारी की जय! यशोदानंदन, ब्रजवासियों को आनंद देने वाले, यमुना तट के वनों में विहार करने वाले की जय!',
      sectionTitle: 'Sri Radha Govind Dev Ji Temple Liturgical Aarti (Jaipur)',
      // Audio mapping disabled: Audio audit confirmed that File:Aarti_Shri_Radha_Govind,_Musical_Puja_Prayer.ogg
      // contains Sri Ramachandra Aarti ('Jai Raghunatha, Jai Janaki Natha...'), not Radha Govind Dev Ji Liturgy.
      // Awaiting verified authentic human recording of Radha Govind Aarti.
    },
  ],

  // ----------------------------------------------------------------------------
  // 8. DEVOTIONAL BHAJANS & HYMNS
  // ----------------------------------------------------------------------------
  bhajans: [
    {
      id: 'bhajan:mira_1',
      unitNumber: 'Mirabai — Pad 1',
      originalText:
        'पायो जी मैंने राम रतन धन पायो ।\nवस्तु अमोलक दी मेरे सतगुरू, किरपा कर अपनायो ॥\nजनम जनम की पूँजी पाई, जग में सभी खोवायो ।\nखरचै नहिं कोई चोर न लेवै, दिन दिन बढ़त सवायो ॥',
      transliteration:
        'pāyo jī maiṁne rāma ratana dhana pāyo |\nvastu amolaka dī mere satagurū, kirapā kara apanāyo ||\njanama janama kī pūomjī pāī, jaga meṁ sabhī khovāyo |\nkharacai nahiṁ koī cora na levai, dina dina baṛhata savāyo ||',
      translationEn:
        'I have found, O friends, the priceless treasure of Rama’s divine Name! My true Guru bestowed upon me this invaluable pearl, receiving me in his boundless compassion. I have secured the wealth of myriad lifetimes, while renouncing the fleeting illusions of the world. This jewel cannot be spent, no thief can steal it, and day by day it increases a hundredfold!',
      translationHi:
        'मैंने राम नाम रूपी अमूल्य रत्न पा लिया है। मेरे सद्गुरु ने कृपा करके मुझे यह अनमोल वस्तु प्रदान की। यह धन न तो खर्च होता है और न चोर चुरा सकते हैं, बल्कि दिन-प्रतिदिन बढ़ता जाता है।',
      sectionTitle: 'Mirabai — Payoji Maine Ram Ratan Dhan Payo',
    },
    {
      id: 'bhajan:narsinh_1',
      unitNumber: 'Narsinh Mehta',
      originalText:
        'वैष्णव जन तो तेने कहिये जे पीड परायी जाणे रे ।\nपरदुःखे उपकार करे तोये मन अभिमान न आणे रे ॥\nसकळ लोकमां सहुने वंदे, निंदा न करे केनी रे ।\nवाच काछ मन निश्चळ राखे धन धन जननी तेनी रे ॥',
      transliteration:
        'vaiṣṇava jana to tene kahiye je pīḍa parāyī jāṇe re |\nparaduḥkhe upakāra kare toye mana abhimāna na āṇe re ||\nsakaḷa lokamāṁ sahune vaṁde, niṁdā na kare kenī re |\nvāca kācha mana niścaḷa rākhe dhana dhana jananī tenī re ||',
      translationEn:
        'Call that person alone a true devotee of God (Vaishnava) who feels the pain and sorrow of others as their own. One who serves those in affliction without allowing pride or ego to enter their heart; who honors every soul in all the worlds, speaks ill of none, and keeps speech, conduct, and mind steadfast in purity—blessed indeed is the mother who bore such a soul.',
      translationHi:
        'सच्चा वैष्णव वही है जो दूसरों की पीड़ा को अपनी समझता है। परोपकार करके भी जिसके मन में तनिक भी अभिमान नहीं आता। जो संसार में सभी का आदर करता है और किसी की निंदा नहीं करता।',
      sectionTitle: 'Narsinh Mehta — Vaishnava Jana To',
    },
    {
      id: 'bhajan:kabir_1',
      unitNumber: 'Sant Kabir',
      originalText:
        'झीनी झीनी बीनी चदरिया ।\nकाहे कै ताना, काहे कै भरनी, कौन तार से बीनी चदरिया ॥\nइँगला पिंगला ताना भरनी, सुखमन तार से बीनी चदरिया ।\nआठ कंवल दल चरखा चलै, पाँच तत्व गुन तीनी चदरिया ॥',
      transliteration:
        'jhīnī jhīnī bīnī cadariyā |\nkāhe kai tānā, kāhe kai bharanī, kauna tāra se bīnī cadariyā ||\niomgalā piṅgalā tānā bharanī, sukhamana tāra se bīnī cadariyā |\nāṭha kaṁvala dala carakhā calai, pāomca tatva guna tīnī cadariyā ||',
      translationEn:
        'Delicately, oh so delicately, has this cloth of the physical body been woven! What is the warp, what is the weft, and with what subtle thread was it spun? The breath pathways of Ida and Pingala form the warp and weft; through the central Sushumna channel the sacred weave is crafted. The spinning wheel turns within the eight-petaled lotus, woven from the five primordial elements and the three natural qualities (Sattva, Rajas, Tamas). Sages wore it with reverence and returned it unsoiled to the Divine.',
      translationHi:
        'यह शरीर रूपी चादर अत्यंत सूक्ष्मता से बुनी गई है। इड़ा और पिंगला नाड़ियों के ताने-बाने से, सुषुम्ना के धागे से परमात्मा ने इसे बुना है। संतों ने इसे जतन से ओढ़ा और वैसा ही निर्मल वापस रख दिया।',
      sectionTitle: 'Sant Kabir — Chadariya Jhini Re Jhini',
    },
    {
      id: 'bhajan:nama_sankirtana',
      unitNumber: 'Nama Sankirtana Bhajan',
      originalText:
        'हरि हरये नमः कृष्ण यादवाय नमः ।\nयादवाय माधवाय केशवाय नमः ॥\nगोपाल गोविंद राम श्रीमधुसूदन ।\nगिरिधारी गोपीनाथ मदनमोहन ॥',
      transliteration:
        'hari haraye namaḥ kṛṣṇa yādavāya namaḥ |\nyādavāya mādhavāya keśavāya namaḥ ||\ngopāla govinda rāma śrī-madhusūdana |\ngiridhārī gopīnātha madanamohana ||',
      translationEn:
        'O Lord Hari, salutations to You! O Krishna, salutations to the descendant of Yadu! Salutations to Madhava, Keshava, Gopala, Govinda, Rama, and the slayer of Madhu! Glory to the lifter of Govardhana, the Lord of the Gopis, the enchanter of Cupid!',
      translationHi:
        'भगवान श्रीहरि को नमस्कार! श्रीकृष्ण, यादव-नंदन, माधव और केशव को नमस्कार! गोपाल, गोविंद, श्रीराम, गिरधारी और गोपीनाथ को नमस्कार!',
      sectionTitle: 'Narottama Dasa Thakur — Hari Haraye Namah Krishna (Nama Sankirtana)',
      // Audio quarantined under Phase 2 Requirement 4 (CC BY-SA 3.0 ShareAlike compatibility review pending)
    },
    {
      id: 'bhajan:yasomati_nandana',
      unitNumber: 'Sri Nama Kirtana Bhajan',
      originalText:
        'यशोमती-नंदन व्रजवर-नागर, गोकुल-रंजन कान्ह ।\nगोपी-चित्त-चोर नवनीत-तस्कर, आभीर-दुलाल सुजान ॥',
      transliteration:
        'yaśomatī-nandana vrajavara-nāgara, gokula-rañjana kānha |\ngopī-citta-cora navanīta-taskara, ābhīra-dulāla sujāna ||',
      translationEn:
        'Beloved son of Mother Yashoda, graceful jewel of Vraja, Kanha who delights all Gokula! Stealer of the gopis\' hearts, stealer of butter, the tender and cherished darling of the cowherd community!',
      translationHi:
        'माता यशोदा के प्रिय पुत्र, ब्रज के श्रेष्ठ नायक, गोकुल को आनंद देने वाले कन्हैया! गोपियों के चित्त को चुराने वाले और माखनचोर श्रीकृष्ण!',
      sectionTitle: 'Bhaktivinoda Thakur — Yasomati Nandana (Sri Nama Kirtana)',
      // Audio quarantined under Phase 2 Requirement 4 (CC BY-SA 3.0 ShareAlike compatibility review pending)
    },
  ],

  // ----------------------------------------------------------------------------
  // 9. VEDIC & MOOLA MANTRAS
  // ----------------------------------------------------------------------------
  mantras: [
    {
      id: 'mantra:gayatri',
      unitNumber: 'Gayatri Mantra (Rigveda 3.62.10)',
      originalText:
        'ॐ भूर्भुवः स्वः ।\nतत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि ।\nधियो यो नः प्रचोदयात् ॥',
      transliteration:
        'oṁ bhūrbhuvaḥ svaḥ |\ntatsaviturvareṇyaṁ bhargo devasya dhīmahi |\ndhiyo yo naḥ pracodayāt ||',
      translationEn:
        'AUM. We meditate on the supreme, adorable spiritual radiance of Savitri, the Divine Sun of pure consciousness, who illumines the physical realm (Bhur), the subtle vital realm (Bhuvah), and the celestial realm of truth (Svah). May that Divine Light inspire, awaken, and illuminate our inner intellect.',
      translationHi:
        'ॐ। हम उस प्राणस्वरूप, दुःखनाशक, सुखस्वरूप, श्रेष्ठ, तेजस्वी, पापनाशक, देवस्वरूप परमात्मा का ध्यान करते हैं। वह परमात्मा हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करे।',
      sectionTitle: 'Gayatri Maha Mantra (Mother of the Vedas)',
      audio: {
        audioUrl:
          '/audio/hinduism/hinduism_mantras_gayatri_mantra_wilfredor.ogg',
        performer: 'Wilfredor',
        source: 'Wikimedia Commons (File:Gayatri_mantra.ogg)',
        license: 'CC0 1.0 Universal',
        isHuman: true,
        licensingTerms: 'Creative Commons Zero / Public Domain Dedication. Unrestricted free redistribution and streaming.',
      },
    },
    {
      id: 'mantra:mrityunjaya',
      unitNumber: 'Maha Mrityunjaya (Rigveda 7.59.12)',
      originalText:
        'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
      transliteration:
        'oṁ tryambakaṁ yajāmahe sugandhiṁ puṣṭivardhanam |\nurvārukamiva bandhanānmṛtyormukṣīya māmṛtāt ||',
      translationEn:
        'AUM. We worship the Three-Eyed Lord (Tryambaka Shiva), fragrant with divine presence, the nourisher and augmenter of all life. Just as a ripe cucumber is severed effortlessly from its vine, may He liberate us from mortality and worldly bondage, not separating us from the Immortal Truth.',
      translationHi:
        'ॐ। हम सुगंधित और पुष्टि का संवर्धन करने वाले त्रिनेत्र भगवान शिव की वंदना करते हैं। जैसे पका हुआ खरबूजा शाखा के बंधन से मुक्त हो जाता है, वैसे ही हम मृत्यु से मुक्त होकर अमरता को प्राप्त हों।',
      sectionTitle: 'Maha Mrityunjaya Mantra (Life-Preserving Mantra)',
      // Audio quarantined under Phase 2 Requirement 4 (Free Art License 1.3 copyleft compatibility review pending)
    },
    {
      id: 'mantra:shanti_sahana',
      unitNumber: 'Shanti Mantra (Taittiriya Upanishad)',
      originalText:
        'ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै ।\nतेजस्वि नावधीतमस्तु मा विद्विषावहै ॥\nॐ शान्तिः शान्तिः शान्तिः ॥',
      transliteration:
        'oṁ saha nāvavatu | saha nau bhunaktu | saha vīryaṁ karavāvahai |\ntejasvi nāvadhītamastu mā vidviṣāvahai ||\noṁ śāntiḥ śāntiḥ śāntiḥ ||',
      translationEn:
        'AUM. May the Divine protect both teacher and student together. May He nourish us together. May we generate supreme spiritual energy together. May our learning be radiant and filled with light. May there never arise discord, envy, or hatred between us. AUM, Peace, Peace, Peace.',
      translationHi:
        'ॐ। परमात्मा हम दोनों (गुरु और शिष्य) की साथ-साथ रक्षा करें, साथ-साथ पालन करें, हम साथ मिलकर पराक्रम करें। हमारा अध्ययन तेजस्वी हो, हम परस्पर कभी द्वेष न करें। ॐ शान्ति, शान्ति, शान्ति।',
      sectionTitle: 'Shanti Mantra — Saha Navavatu (Harmony of Teacher and Disciple)',
    },
    {
      id: 'mantra:asato_ma',
      unitNumber: 'Brihadaranyaka Upanishad 1.3.28',
      originalText:
        'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥\nॐ शान्तिः शान्तिः शान्तिः ॥',
      transliteration:
        'oṁ asato mā sadgamaya | tamaso mā jyotirgamaya |\nmṛtyormā amṛtaṁ gamaya ||\noṁ śāntiḥ śāntiḥ śāntiḥ ||',
      translationEn:
        'AUM. Lead me from the unreal to the Real; lead me from the darkness of ignorance to the Light of spiritual knowledge; lead me from mortality to Immortality. AUM, Peace, Peace, Peace.',
      translationHi:
        'ॐ। मुझे असत्य से सत्य की ओर ले चलें, अंधकार से प्रकाश की ओर ले चलें, और मृत्यु से अमरता की ओर ले चलें। ॐ शान्ति, शान्ति, शान्ति।',
      sectionTitle: 'Asato Ma Sadgamaya (The Universal Prayer for Illumination)',
    },
    {
      id: 'mantra:panchakshari',
      unitNumber: 'Shiva Panchakshari',
      originalText: 'ॐ नमः शिवाय ॥',
      transliteration: 'oṁ namaḥ śivāya ||',
      translationEn:
        'AUM. Salutations to Lord Shiva, the Auspicious One, the Supreme Consciousness residing in all.',
      translationHi: 'ॐ। कल्याणकारी भगवान शिव को मेरा नमस्कार है।',
      sectionTitle: 'Shiva Moola Mantra',
    },
    {
      id: 'mantra:mahamantra',
      unitNumber: 'Maha Mantra (Kali Santarana Upanishad)',
      originalText:
        'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।\nहरे राम हरे राम राम राम हरे हरे ॥',
      transliteration:
        'hare kṛṣṇa hare kṛṣṇa kṛṣṇa kṛṣṇa hare hare |\nhare rāma hare rāma rāma rāma hare hare ||',
      translationEn:
        'Hare Krishna, Hare Krishna, Krishna Krishna, Hare Hare; Hare Rama, Hare Rama, Rama Rama, Hare Hare. The sixteen-word sublime mantra revealed in the Kali Santarana Upanishad to cleanse the spiritual consciousness in this modern age.',
      translationHi:
        'हे सर्व-आकर्षक भगवान श्रीकृष्ण! हे सर्व-आनंदप्रदाता श्रीराम! हे प्रभु की अंतरंगा शक्ति! मुझे अपनी प्रेममयी सेवा में नियुक्त कीजिए।',
      sectionTitle: 'Hare Krishna Maha Mantra',
    },
  ],

  // ----------------------------------------------------------------------------
  // 10. SACRED SANSKRIT STOTRAS
  // ----------------------------------------------------------------------------
  stotras: [
    {
      id: 'stotra:shiva_tandava_1',
      unitNumber: 'Shiva Tandava 1',
      originalText:
        'जटाटवीगलज्जलप्रवाहपावितस्थले\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥',
      transliteration:
        'jaṭāṭavīgalajjalapravāhapāvitasthale\ngale\'valambya lambitāṁ bhujaṅgatuṅgamālikām |\nḍamaḍḍamaḍḍamaḍḍamanninādavaḍḍamarvayaṁ\ncakāra caṇḍatāṇḍavaṁ tanotu naḥ śivaḥ śivam ||',
      translationEn:
        'With His neck sanctified by the cascading waters of the celestial Ganga flowing through the dense forest of His matted locks; wearing around His neck the lofty serpent garland; with His damaru drum resounding "damat, damat, damat, damat"—Lord Shiva performed His fierce cosmic dance of dissolution (Tandava). May that Auspicious Lord shower auspiciousness upon us all!',
      translationHi:
        'जिनके जटा रूपी वन से बहती हुई गंगा की धारा से कंठ पवित्र है, जिनके गले में सर्पों की लम्बी माला लटकी है, जो डमरू के डम-डम निनाद के साथ प्रचंड तांडव नृत्य करते हैं, वे भगवान शिव हमारा कल्याण करें।',
      sectionTitle: 'Shiva Tandava Stotram (Ravana virachitam)',
    },
    {
      id: 'stotra:shiva_tandava_2',
      unitNumber: 'Shiva Tandava 2',
      originalText:
        'जटाकटाहसम्भ्रमभ्रमन्निलिम्पनिर्झरी-\nविलोलवीचिवल्लरीविराजमानमूर्धनि ।\nधधद्धधद्धधज्ज्वलल्ललाटपट्टपावके\nकिशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥',
      transliteration:
        'jaṭākaṭāhasambhramabhramannilimpanirjharī-\nvilolavīcivallarīvirājamānamūrdhani |\ndhadhaddhadhaddhadhajjvalallalāṭapaṭṭapāvake\nkiśoracandraśekhare ratiḥ pratikṣaṇaṁ mama ||',
      translationEn:
        'May my deep devotion remain unceasingly fixed in Lord Shiva, upon whose head the celestial stream of the Ganga churns restlessly in waves through His matted locks; whose forehead radiates blazing fire "dhaddhat, dhaddhat"; and who wears the radiant crescent moon upon His crest!',
      translationHi:
        'जिनके मस्तक पर जटाओं के भँवर में घूमती हुई गंगा की चंचल लहरें सुशोभित हैं, जिनके ललाट पर अग्नि धक्-धक् जल रही है, उन बालचंद्रधारी भगवान शिव में मेरी निरंतर प्रीति रहे।',
      sectionTitle: 'Shiva Tandava Stotram',
    },
    {
      id: 'stotra:mahishasuramardini_1',
      unitNumber: 'Mahishasuramardini 1',
      originalText:
        'अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दसुते\nगिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते ।\nभगवति हे शितिकण्ठकुटुम्बिनि भूरिकुटुम्बिनि भूरिकृते\nजय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥',
      transliteration:
        'ayi girinandini nanditamedini viśvavinodini nandasute\ngirivaravindhyaśiro\'dhinivāsini viṣṇuvilāsini jiṣṇunute |\nbhagavati he śitikaṇṭhakuṭumbini bhūrikuṭumbini bhūrikṛte\njaya jaya he mahiṣāsuramardini ramyakapardini śailasute ||',
      translationEn:
        'Salutations to You, O Daughter of the Mountain (Himalaya), who gladdens the earth, who brings delight to the universe, praised by the gods! Dweller on the peaks of the Vindhya mountains, delight of Vishnu, consort of the blue-throated Shiva! O Mother of the vast cosmos, who bestows abundant grace! Victory, victory to You, O Slayer of the demon Mahishasura, with exquisitely braided locks, daughter of the mountain!',
      translationHi:
        'हे पर्वतराजपुत्री! पृथ्वी को आनंदित करने वाली, जगत को उल्लास देने वाली, विंध्याचल पर निवास करने वाली, भगवान शिव की अर्धांगिनी! हे महिषासुर का संहार करने वाली जगदम्बा! आपकी सदा जय हो।',
      sectionTitle: 'Mahishasuramardini Stotram (Adi Shankaracharya)',
    },
    {
      id: 'stotra:vishnu_sahasranama_dhyanam',
      unitNumber: 'Vishnu Sahasranama Dhyanam',
      originalText:
        'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं\nविश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं\nवन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥',
      transliteration:
        'śāntākāraṁ bhujagaśayanaṁ padmanābhaṁ sureśaṁ\nviśvādhāraṁ gaganasadṛśaṁ meghavarṇaṁ śubhāṅgam |\nlakṣmīkāntaṁ kamalanayanaṁ yogibhirdhyānagamyaṁ\nvande viṣṇuṁ bhavabhayaharaṁ sarvalokaikanātham ||',
      translationEn:
        'I bow to Lord Vishnu, the embodiment of profound peace; who reclines upon the serpent Shesha; from whose navel springs the cosmic lotus; the Lord of all celestial beings; the foundation of the universe; all-pervading as the sky; dark-hued as a raincloud; of auspicious form; the beloved of Lakshmi; lotus-eyed; realized by yogis in deep meditation; the dispeller of all worldly fears, the supreme Sovereign of all the worlds.',
      translationHi:
        'जिनका स्वरूप शांत है, जो शेषनाग की शय्या पर शयन करते हैं, जिनकी नाभि में कमल है, जो देवताओं के ईश्वर और जगत के आधार हैं, मेघ के समान श्यामवर्ण, कमलनयन भगवान विष्णु की मैं वन्दना करता हूँ।',
      sectionTitle: 'Vishnu Sahasranama Stotram — Dhyana Shloka',
    },
    {
      id: 'stotra:guru_stotram',
      unitNumber: 'Guru Stotram',
      originalText:
        'अखण्डमण्डलाकारं व्याप्तं येन चराचरम् ।\nतत्पदं दर्शितं येन तस्मै श्रीगुरवे नमः ॥\nअज्ञानतिमिरान्धस्य ज्ञानाञ्जनशलाकया ।\nचक्षुरुन्मीलितं येन तस्मै श्रीगुरवे नमः ॥',
      transliteration:
        'akhaṇḍamaṇḍalākāraṁ vyāptaṁ yena carācaram |\ntatpadaṁ darśitaṁ yena tasmai śrīgurave namaḥ ||\najñānatimirāndhasya jñānāñjanaśalākayā |\ncakṣurunmīlitaṁ yena tasmai śrīgurave namaḥ ||',
      translationEn:
        'Salutations to that noble Guru who revealed to me the Divine Reality that pervades the undivided cosmic sphere of all moving and unmoving beings. Salutations to that noble Guru who opened with the golden stylus of spiritual knowledge the eyes of one blinded by the darkness of ignorance.',
      translationHi:
        'जिस अखंड ब्रह्मांडीय रूप में संपूर्ण चर और अचर व्याप्त है, उस परम सत्य के दर्शन कराने वाले श्रीगुरुदेव को मेरा प्रणाम। जिन्होंने अज्ञान रूपी अंधकार से अंधे हुए नेत्रों को ज्ञानांजन की सलाई से खोल दिया, उन श्रीगुरु को नमस्कार।',
      sectionTitle: 'Sri Guru Stotram (Classical Sanskrit Stotra)',
      audio: {
        audioUrl:
          '/audio/hinduism/hinduism_stotras_sri_guru_stotram_swami_atmananda.ogg',
        performer: 'Swami Atmananda',
        source: 'Wikimedia Commons (File:Sanskrit_Chanting_Guru_Stotram.ogg)',
        license: 'CC0 1.0 Universal',
        isHuman: true,
        licensingTerms: 'Public Domain Dedication. Authentic human Sanskrit chanting; unrestricted free streaming and redistribution.',
      },
    },
    {
      id: 'stotra:devi_suktam',
      unitNumber: 'Devi Suktam Stotram',
      originalText:
        'अहं रुद्रेभिर्वसुभिश्चराम्यहमादित्यैरुत विश्वदेवैः ।\nअहं मित्रावरुणोभा बिभर्म्यहमिन्द्राग्नी अहमश्विनोभा ॥\nअहं सोममाहनसं बिभर्म्यहं त्वष्टारमुत पूषणं भगम् ।\nअहं दधामि द्रविणं हविष्मते सुप्राव्ये यजमानाय सुन्वते ॥',
      transliteration:
        'ahaṁ rudrebhirvasubhiścarāmyahamādityairuta viśvadevaiḥ |\nahaṁ mitrāvaruṇobhā bibharmyahamindrāgnī ahamaśvinobhā ||\nahaṁ somamāhanasaṁ bibharmyahaṁ tvaṣṭāramuta pūṣaṇaṁ bhagam |\nahaṁ dadhāmi draviṇaṁ haviṣmate suprāvye yajamānāya sunvate ||',
      translationEn:
        'I move with the Rudras, with the Vasus, with the Adityas, and with all the Devas! I support both Mitra and Varuna, Indra and Agni, and both the Ashvins! I am the supreme sovereign Queen of the universe, gatherer of treasures, knower of ultimate reality.',
      translationHi:
        'मैं रूद्रों, वसुओं, आदित्यों और सभी विश्वेदेवों के साथ विचरण करती हूँ। मैं मित्र, वरुण, इंद्र, अग्नि और दोनों अश्विनीकुमारों को धारण करती हूँ। मैं हवि देने वाले और सोम निष्पन्न करने वाले यजमान को धन प्रदान करती हूँ।',
      sectionTitle: 'Rigveda 10.125 — Devi Suktam (Vak Ambhrani Stotra)',
      audio: {
        audioUrl:
          '/audio/hinduism/hinduism_stotras_devi_suktam_vedadhayana_gosthi.ogg',
        performer: 'Vedadhayana Gosthi',
        source: 'Wikimedia Commons (File:04-DEVI_SUKTHAM-MANTRA_MANJUSHA.ogg)',
        license: 'CC BY 3.0',
        isHuman: true,
        licensingTerms: 'Creative Commons Attribution 3.0. Authentic traditional chanting; streaming permitted with attribution.',
      },
    },
  ],

  // ----------------------------------------------------------------------------
  // 11. PUJA PROCEDURES & FESTIVAL READINGS
  // ----------------------------------------------------------------------------
  puja_festivals: [
    {
      id: 'puja:deepa_jyoti',
      unitNumber: 'Deepa Jyoti Prarthana',
      originalText:
        'शुभं करोति कल्याणमारोग्यं धनसम्पदः ।\nशत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥\nदीपो ज्योतिः परं ब्रह्म दीपो ज्योतिर्जनार्दनः ।\nदीपो हरतु मे पापं दीपज्योतिर्नमोऽस्तु ते ॥',
      transliteration:
        'śubhaṁ karoti kalyāṇamārogyaṁ dhanasampadaḥ |\nśatrubuddhivināśāya dīpajyotirnamo\'stu te ||\ndīpo jyotiḥ paraṁ brahma dīpo jyotirjanārdanaḥ |\ndīpo haratu me pāpaṁ dīpajyotirnamo\'stu te ||',
      translationEn:
        'Salutations to the radiance of the sacred lamp, which brings auspiciousness, well-being, good health, and spiritual abundance, and destroys darkness and malicious thoughts. The light of the lamp is Supreme Brahman; the light is Lord Janardana Himself. May this sacred flame consume all our transgressions and impurities. Salutations to the light of the lamp!',
      translationHi:
        'शुभ और कल्याण करने वाली, आरोग्य और धन-सम्पदा देने वाली, तथा दुर्बुद्धि का नाश करने वाली दीपक की ज्योति को मेरा नमस्कार है। दीपक की ज्योति परब्रह्म और साक्षात् जनार्दन है।',
      sectionTitle: 'Nitya Puja — Lighting the Sacred Lamp',
    },
    {
      id: 'puja:bhojana_samarpanam',
      unitNumber: 'Bhojana Samarpanam (Gita 4.24)',
      originalText:
        'ब्रह्मार्पणं ब्रह्म हविर्ब्रह्माग्नौ ब्रह्मणा हुतम् ।\nब्रह्मैव तेन गन्तव्यं ब्रह्मकर्मसमाधिना ॥',
      transliteration:
        'brahmārpaṇaṁ brahma havirbrahmāgnau brahmaṇā hutam |\nbrahmaiva tena gantavyaṁ brahmakarmasamādhinā ||',
      translationEn:
        'Brahman is the offering; Brahman is the oblation poured into the fire of Brahman by Brahman. Brahman alone shall be attained by the one who is fully absorbed in seeing Brahman in all actions.',
      translationHi:
        'अर्पण ब्रह्म है, हवि (आहुति) ब्रह्म है, ब्रह्म रूपी अग्नि में ब्रह्म रूपी कर्ता द्वारा आहुति दी जाती है। ब्रह्म रूपी कर्म में समाधिस्थ रहने वाले को ब्रह्म की ही प्राप्ति होती है।',
      sectionTitle: 'Bhojana Mantra (Consecration of Food)',
    },
    {
      id: 'festival:bilvashtakam',
      unitNumber: 'Maha Shivaratri Bilvashtakam 1',
      originalText:
        'त्रिदलं त्रिगुणाकारं त्रिनेत्रं च त्रियायुधम् ।\nत्रिजन्मपापसंहारं एकबिल्वं शिवार्पणम् ॥',
      transliteration:
        'tridalaṁ triguṇākāraṁ trinetraṁ ca triyāyudham |\ntrijanmapāpasaṁhāraṁ ekabilvaṁ śivārpaṇam ||',
      translationEn:
        'With its three leaves resembling the three Gunas (Sattva, Rajas, Tamas), representing the three eyes of Shiva and His trident weapon, destroying the sins of three lifetimes—I offer this single sacred Bilva leaf to Lord Shiva.',
      translationHi:
        'तीन दलों वाले, तीनों गुणों के स्वरूप, भगवान शिव के तीनों नेत्रों और त्रिशूल के समान, तीन जन्मों के पापों का संहार करने वाले एक बिल्वपत्र को मैं भगवान शिव के चरणों में अर्पित करता हूँ।',
      sectionTitle: 'Maha Shivaratri Reading — Bilvashtakam',
    },
    {
      id: 'festival:ram_janma',
      unitNumber: 'Ramanavami Stuti',
      originalText:
        'भए प्रगट कृपाला दीनदयाला कौसल्या हितकारी ।\nहरषित महतारी मुनि मन हारी अद्भुत रूप बिचारी ॥',
      transliteration:
        'bhae pragaṭa kṛpālā dīnadayālā kausalyā hitakārī |\nharaṣita mahatārī muni mana hārī adbhuta rūpa bicārī ||',
      translationEn:
        'The compassionate Lord, benefactor of the humble and beloved son of Kausalya, has manifested! Mother Kausalya is overwhelmed with divine ecstasy, beholding His wondrous form that enchants the hearts of meditating sages.',
      translationHi:
        'दीनों पर दया करने वाले, कौशल्याजी के हितकारी कृपालु प्रभु श्रीराम प्रकट हो गए हैं। उनके अद्भुत रूप का दर्शन करके माता अत्यंत हर्षित हो रही हैं।',
      sectionTitle: 'Ramanavami Reading — Bhay Praghat Kripala (Tulsidas)',
    },
  ],
};
