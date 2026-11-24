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
  // 1. VALMIKI RAMAYANA (Seven Canonical Kandas & Aditya Hridaya Stotram)
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
      id: 'valmiki_ramayana:bala_kanda',
      unitNumber: 'Kanda 1 — Bala Kanda',
      originalText:
        'तपःस्वाध्यायनिरतं तपस्वी वाग्विदां वरम् ।\nनारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम् ॥\nको न्वस्मिन् साम्प्रतं लोके गुणवान् कश्च वीर्यवान् ।\nधर्मज्ञश्च कृतज्ञश्च सत्यवाक्यो दृढव्रतः ॥',
      transliteration:
        'tapaḥsvādhyāyanirataṁ tapasvī vāgvidāṁ varam |\nnāradaṁ paripapraccha vālmīkirmunipuṅgavam ||\nko nvasmin sāmprataṁ loke guṇavān kaśca vīryavān |\ndharmajñaśca kṛtajñaśca satyavākyo dṛḍhavrataḥ ||',
      translationEn:
        'The ascetic Valmiki inquired of the eminent sage Narada, devoted to penance and Vedic study, the foremost among the eloquent: "Who in this present world is truly endowed with noble virtues, who is valiant, knower of righteousness, grateful, truthful in speech, and firm in his vows?" Narada replied that such an ideal being exists in Sri Rama of the Ikshvaku dynasty.',
      translationHi:
        'तपस्या और स्वाध्याय में निरन्तर लगे रहने वाले महर्षि वाल्मीकि ने मुनिश्रेष्ठ नारदजी से पूछा: "इस समय संसार में गुणवान, पराक्रमी, धर्मज्ञ, कृतज्ञ, सत्यवादी और दृढप्रतिज्ञ कौन पुरुष है?" नारदजी ने उत्तर दिया कि इक्ष्वाकु वंश में उत्पन्न श्रीराम ही ऐसे आदर्श पुरुष हैं।',
      sectionTitle: 'Bala Kanda (1.1.1–4) — The Sixteen Virtues of Sri Rama',
    },
    {
      id: 'valmiki_ramayana:ayodhya_kanda',
      unitNumber: 'Kanda 2 — Ayodhya Kanda',
      originalText:
        'अहं हि वचनाद्राज्ञः पतेयमपि पावके ।\nभक्षयेयं विषं तीक्ष्णं पतेयमपि चार्णवे ॥\nनियुक्तो गुरुणा पित्रा नृपेण च हितेन च ।\nतद्ब्रूहि वचनं देवि राज्ञा यदभिनन्दितम् ॥',
      transliteration:
        'ahaṁ hi vacanādrājñaḥ pateyamapi pāvake |\nbhakṣayeyaṁ viṣaṁ tīkṣṇaṁ pateyamapi cārṇave ||\nniyukto guruṇā pitrā nṛpeṇa ca hitena ca |\ntadbrūhi vacanaṁ devi rājñā yadabhinanditam ||',
      translationEn:
        'Sri Rama addressed Mother Kaikeyi: "At the command of my father the King, I am ready to leap into fire, consume deadly poison, or plunge into the ocean. He is my preceptor, my father, my sovereign, and my supreme benefactor. Tell me without hesitation, O Queen, whatever the King desires of me, and I shall fulfill it completely."',
      translationHi:
        'श्रीराम ने माता कैकेयी से कहा: "महाराज की आज्ञा से मैं अग्नि में कूद सकता हूँ, तीक्ष्ण विष खा सकता हूँ अथवा समुद्र में गिर सकता हूँ। वे मेरे गुरु, पिता, राजा और हितैषी हैं। हे देवि! राजा को जो भी अभीष्ट है, वह कहिए; मैं उसका पूर्ण पालन करूँगा।"',
      sectionTitle: 'Ayodhya Kanda (2.18.28–30) — Unwavering Adherence to Truth (Pitru-Vakya)',
    },
    {
      id: 'valmiki_ramayana:aranya_kanda',
      unitNumber: 'Kanda 3 — Aranya Kanda',
      originalText:
        'अप्यहं जीवितं जह्यां त्वां वा सीते सलक्ष्मणाम् ।\nन तु प्रतिज्ञां संश्रुत्य ब्राह्मणेभ्यो विशेषतः ॥',
      transliteration:
        'apyahaṁ jīvitaṁ jahyāṁ tvāṁ vā sīte salakṣmaṇām |\nna tu pratijñāṁ saṁśrutya brāhmaṇebhyo viśeṣataḥ ||',
      translationEn:
        'Rama said to Sita in the Dandaka forest: "I might abandon even my life, or you, O Sita, along with Lakshmana, but having once given my solemn word to protect the sages who practice penance in the wilderness, I can never break that sacred pledge."',
      translationHi:
        'दण्डकारण्य में श्रीराम ने सीताजी से कहा: "हे सीते! मैं अपने प्राण त्याग सकता हूँ, अथवा लक्ष्मण सहित तुम्हें भी छोड़ सकता हूँ, किन्तु ऋषियों और मुनियों को दिया गया रक्षा का वचन मैं कभी नहीं तोड़ सकता।"',
      sectionTitle: 'Aranya Kanda (3.10.19) — Sacred Pledge to Protect the Hermits',
    },
    {
      id: 'valmiki_ramayana:kishkindha_kanda',
      unitNumber: 'Kanda 4 — Kishkindha Kanda',
      originalText:
        'नानृग्वेदविनीतस्य नायजुर्वेदधारिणः ।\nनासामवेदविदुषः शक्यमेवं विभाषितुम् ॥\nनूनं व्याकरणं कृत्स्नमनेन बहुधा श्रुतम् ।\nबहु व्याहरतानेन न किञ्चिदपशब्दितम् ॥',
      transliteration:
        'nānṛgvedavinītasya nāyajurvedadhāriṇaḥ |\nnāsāmavedaviduṣaḥ śakyamevaṁ vibhāṣitum ||\nnūnaṁ vyākaraṇaṁ kṛtsnamanena bahudhā śrutam |\nbahu vyāharatānena na kiñcidapaśabditam ||',
      translationEn:
        'Upon first meeting Hanuman, Sri Rama turned to Lakshmana in admiration: "None who is not thoroughly versed in the Rigveda, none who has not mastered the Yajurveda, none who is not skilled in the Samaveda could speak with such flawless eloquence. Verily, the entire science of grammar has been mastered by him; though he spoke at length, not a single flawed or ungrammatical word escaped his lips."',
      translationHi:
        'हनुमानजी के वचन सुनकर श्रीराम ने लक्ष्मण से कहा: "जिसने ऋग्वेद, यजुर्वेद और सामवेद का सम्यक अध्ययन न किया हो, वह इस प्रकार मधुर और शुद्ध भाषण नहीं कर सकता। इन्होंने सम्पूर्ण व्याकरण का अनेकों बार अध्ययन किया है, क्योंकि इतनी बात कहने पर भी इनके मुख से एक भी अशुद्ध शब्द नहीं निकला।"',
      sectionTitle: 'Kishkindha Kanda (4.3.28–29) — Sri Rama Praises Hanuman’s Wisdom & Eloquence',
    },
    {
      id: 'valmiki_ramayana:sundara_kanda',
      unitNumber: 'Kanda 5 — Sundara Kanda',
      originalText:
        'ततो रावणनीतायाः सीतायाः शत्रुकर्शनः ।\nइयेष पदमन्वेष्टुं चारणाचरिते पथि ॥\nयथा राघोः प्रयुक्तः शरः श्वसनविक्रमः ।\nगच्छेत्तद्वद्गमिष्यामि लङ्कां रावणपालिताम् ॥',
      transliteration:
        'tato rāvaṇanītāyāḥ sītāyāḥ śatrukarśanaḥ |\niyeṣa padamanveṣṭuṁ cāraṇācarite pathi ||\nyathā rāghoḥ prayuktaḥ śaraḥ śvasanavikramaḥ |\ngacchettadvadgamiṣyāmi laṅkāṁ rāvaṇapālitām ||',
      translationEn:
        'Resolved to discover the whereabouts of Sita abducted by Ravana, the vanquisher of foes Hanuman prepared to leap along the aerial path traversed by celestial bards. He declared: "Even as an arrow shot from the mighty bow of Raghava speeds with the fury of the wind, so shall I speed across the ocean to Lanka ruled by Ravana."',
      translationHi:
        'शत्रुओं का दमन करने वाले वीर हनुमानजी ने रावण द्वारा हरी गई सीताजी की खोज करने के लिए आकाश मार्ग से जाने का निश्चय किया। उन्होंने कहा: "जैसे श्रीराम के धनुष से छूटा हुआ बाण वायु के वेग से जाता है, वैसे ही मैं भी रावण-रक्षित लंका की ओर वेग से जाऊँगा।"',
      sectionTitle: 'Sundara Kanda (5.1.1, 5.1.37) — Hanuman’s Epic Leap across the Ocean',
    },
    {
      id: 'valmiki_ramayana:yuddha_kanda',
      unitNumber: 'Kanda 6 — Yuddha Kanda (Aditya Hridaya)',
      originalText:
        'ततो युद्धपरिश्रान्तं समरे चिन्तया स्थितम् ।\nरावणं चाग्रतो दृष्ट्वा युद्धाय समुपस्थितम् ॥\nदैवतैश्च समागम्य द्रष्टुमभ्यागतो रणम् ।\nउपागम्याब्रवीद्राममगस्त्यो भगवानृषिः ॥\nराम राम महाबाहो शृणु गुह्यं सनातनम् ।\nयेन सर्वानरीन वत्स समरे विजयिष्यसि ॥\nआदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।\nजयावहं जपेन्नित्यमक्षयं परमं शिवम् ॥\nनक्षत्रग्रहताराणामधिपो विश्वभावनः ।\nतेजसामपि तेजस्वी द्वादशात्मन्नमोऽस्तु ते ॥',
      transliteration:
        'tato yuddhaparīśrāntaṁ samare cintayā sthitam |\nrāvaṇaṁ cāgrato dṛṣṭvā yuddhāya samupasthitam ||\ndaivataiśca samāgamya draṣṭumabhyāgato raṇam |\nupāgamyābravīdrāmamagastyo bhagavānṛṣiḥ ||\nrāma rāma mahābāho śṛṇu guhyaṁ sanātanam |\nyena sarvānarīn vatsa samare vijayiṣyasi ||\nādityahṛdayaṁ puṇyaṁ sarvaśatruvināśanam |\njayāvahaṁ japennityamakṣayaṁ paramaṁ śivam ||\nnakṣatragrahatārāṇāmadhipo viśvabhāvanaḥ |\ntejasāmapi tejasvī dvādaśātmannamo\'stu te ||',
      translationEn:
        'On the battlefield of Lanka, seeing Sri Rama weary from combat, the revered Sage Agastya approached and imparted the eternal Aditya Hridaya Stotram (The Heart of the Sun). "O mighty-armed Rama, listen to this auspicious secret by which you shall vanquish all adversaries in battle. Worship the Sun-God, the soul of the universe, who shines in twelve forms. Conquering Ravana, Dharma shall triumph."',
      translationHi:
        'रणभूमि में श्रीराम को चिंतामग्न देखकर महर्षि अगस्त्य ने उन्हें परम पवित्र आदित्यहृदय स्तोत्र का उपदेश दिया। इसके प्रभाव से श्रीराम ने महाप्रतापी रावण का संहार कर धर्म की विजय स्थापित की।',
      sectionTitle: 'Yuddha Kanda (6.105.1–15) — Sage Agastya Imparts Aditya Hridaya & Victory of Dharma',
    },
    {
      id: 'valmiki_ramayana:uttara_kanda',
      unitNumber: 'Kanda 7 — Uttara Kanda',
      originalText:
        'न पर्यदेवन्विधवा न च व्यालकृतं भयम् ।\nन व्याधिजं भयं चासीद्रामे राज्यं प्रशासति ॥\nनिर्दस्युरभवल्लोको नानर्थः कञ्चिदस्पृशत् ।\nन च स्म वृद्ध बालानां प्रेतकार्याणि कुर्वते ॥\nसर्वं मुदितमेवासीत्सर्वो धर्मपरोऽभवत् ।\nराममेवानुपश्यन्तो नाभ्यहिंसन्परस्परम् ॥',
      transliteration:
        'na paryadevanvidhavā na ca vyālakṛtaṁ bhayam |\nna vyādhijaṁ bhayaṁ cāsīdrāme rājyaṁ praśāsati ||\nnirdasyurabhavalloko nānarthaḥ kañcidaspṛśat |\nna ca sma vṛddhā bālānāṁ pretakāryāṇi kurvate ||\nsarvaṁ muditamevāsītsarvo dharmaparo\'bhavat |\nrāmamevānupaśyanto nābhyahiṁsanparasparam ||',
      translationEn:
        'While Sri Rama governed the kingdom, there were no widows to lament, nor fear from wild beasts or diseases. The world was freed from theft and violence; misfortune touched no one. Elders never had to perform funeral rites for children. All people lived in joy, devoted to Dharma, following Rama\'s supreme example and causing injury to none.',
      translationHi:
        'श्रीराम के राज्य शासन में कोई स्त्री विधवा नहीं होती थी, न हिंसक जीवों का भय था और न रोगों का। चोरी और विपत्ति का नाम न था; वृद्धों को बालकों का श्राद्ध नहीं करना पड़ता था। सभी प्रजा प्रसन्न और धर्मपरायण थी, और परस्पर किसी से वैर नहीं करती थी।',
      sectionTitle: 'Uttara Kanda (7.99.1–5) — Ramarajya: The Sovereign Ideal of Righteous Governance',
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
  // 3. PRINCIPAL UPANISHADS (The Ten Mukhya Upanishads & The Four Mahavakyas)
  // ----------------------------------------------------------------------------
  principal_upanishads: [
    {
      id: 'isha:shanti',
      unitNumber: '1. Isha — Shanti Mantra',
      originalText:
        'ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥\nॐ शान्तिः शान्तिः शान्तिः ॥',
      transliteration:
        'oṁ pūrṇamadaḥ pūrṇamidaṁ pūrṇātpūrṇamudacyate |\npūrṇasya pūrṇamādāya pūrṇamevāvaśiṣyate ||\noṁ śāntiḥ śāntiḥ śāntiḥ ||',
      translationEn:
        'AUM. That unmanifest Brahman is infinite and whole; this manifest universe is infinite and whole. From the Infinite Brahman proceeds this infinite universe. When the wholeness of the infinite universe is absorbed into the Infinite, the Infinite alone remains intact. AUM, Peace, Peace, Peace.',
      translationHi:
        'ॐ। वह (परब्रह्म) पूर्ण है और यह (जगत) भी पूर्ण है। पूर्ण से ही पूर्ण की उत्पत्ति होती है। पूर्ण में से पूर्ण को निकाल लेने पर भी पूर्ण ही शेष रहता है। ॐ शान्ति, शान्ति, शान्ति।',
      sectionTitle: 'Isha Upanishad (Shukla Yajurveda) — Invocatory Peace Mantra',
    },
    {
      id: 'isha:1',
      unitNumber: '1. Isha — Mantra 1',
      originalText:
        'ईशा वास्यमिदँ सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
      transliteration:
        'īśā vāsyamidaom sarvaṁ yatkiñca jagatyāṁ jagat |\ntena tyaktena bhuñjīthā mā gṛdhaḥ kasyasviddhanam ||',
      translationEn:
        'All this—whatever moves and exists in this changing universe—is enveloped and permeated by the Lord (Isha). Enjoy and sustain your life through renunciation and detachment; do not covet the wealth of anyone.',
      translationHi:
        'इस परिवर्तनशील जगत में जो कुछ भी चराचर है, वह सब ईश्वर से व्याप्त है। त्यागपूर्वक उसका उपभोग करो; किसी के भी धन का लोभ मत करो।',
      sectionTitle: 'Isha Upanishad (Shukla Yajurveda) — Sovereign Verse on Renunciation',
    },
    {
      id: 'kena:1',
      unitNumber: '2. Kena — Khanda 1.1–2',
      originalText:
        'केनेषितं पतति प्रेषितं मनः केन प्राणः प्रथमः प्रैति युक्तः ।\nकेनेषितां वाचमिमां वदन्ति चक्षुः श्रोत्रं क उ देवो युनक्ति ॥\nश्रोत्रस्य श्रोत्रं मनसो मनो यद्वाचो ह वाचं स उ प्राणस्य प्राणः ।\nचक्षुषश्चक्षुरतिमुच्य धीराः प्रेत्यास्माल्लोकादमृता भवन्ति ॥',
      transliteration:
        'keneṣitaṁ patati preṣitaṁ manaḥ kena prāṇaḥ prathamaḥ praiti yuktaḥ |\nkeneṣitāṁ vācamimāṁ vadanti cakṣuḥ śrotraṁ ka u devo yunakti ||\nśrotrasya śrotraṁ manaso mano yadvāco ha vācaṁ sa u prāṇasya prāṇaḥ |\ncakṣuṣaścakṣuratimucya dhīrāḥ pretyāsmāllokādamṛtā bhavanti ||',
      translationEn:
        'By whom willed and directed does the mind soar to its object? By whom enjoined does the primary life-breath (Prana) go forth? By whom prompted do mortals speak this speech? What divine power directs the eye and the ear? It is the Ear of the ear, the Mind of the mind, the Speech of speech, the Life of life, and the Eye of the eye. The wise, relinquishing false identification with senses and body, transcend mortality and become immortal.',
      translationHi:
        'किसकी इच्छा से प्रेरित होकर मन अपने विषयों पर दौड़ता है? किसके द्वारा नियुक्त होकर मुख्य प्राण गति करता है? किसके द्वारा प्रेरित होकर लोग वाणी बोलते हैं? और कौन सा देव नेत्र और कान को प्रेरित करता है? वह कानों का कान, मन का मन, वाणी की वाणी, प्राण का प्राण और आँखों की आँख है। धीर पुरुष इसमें स्थित होकर अमर हो जाते हैं।',
      sectionTitle: 'Kena Upanishad (Samaveda) — The Underlying Consciousness of the Senses',
    },
    {
      id: 'katha:1',
      unitNumber: '3. Katha — Valli 1.2.18, 1.3.3',
      originalText:
        'न जायते म्रियते वा विपश्चिन्नायं कुतश्चिन्न बभूव कश्चित् ।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥\nआत्मानँ रथिनं विद्धि शरीरँ रथमेव तु ।\nबुद्धिं तु सारथिं विद्धि मनः प्रग्रहमेव च ॥',
      transliteration:
        'na jāyate mriyate vā vipaścinnāyaṁ kutaścinna babhūva kaścit |\najo nityaḥ śāśvato\'yaṁ purāṇo na hanyate hanyamāne śarīre ||\nātmānaom rathinaṁ viddhi śarīraom rathameva tu |\nbuddhiṁ tu sārathiṁ viddhi manaḥ pragrahameva ca ||',
      translationEn:
        'Yama instructs Nachiketa: "The Knowing Self (Atman) is never born, nor does it ever die; it sprang from nothing and nothing sprang from it. It is unborn, eternal, imperishable, and ancient; it is not slain when the body is slain." "Know the Atman as the lord of the chariot, the physical body as the chariot itself; know the intellect (Buddhi) as the charioteer, and the mind as the reins."',
      translationHi:
        'यमराज ने नचिकेता को उपदेश दिया: "यह ज्ञानी आत्मा न कभी जन्म लेता है और न मरता है। यह न किसी से उत्पन्न हुआ है और न कोई इससे उत्पन्न हुआ है। यह अजन्मा, नित्य, शाश्वत और पुरातन है; शरीर के नष्ट होने पर भी यह नहीं मारा जाता।" "आत्मा को रथी, शरीर को रथ, बुद्धि को सारथी और मन को लगाम जानो।"',
      sectionTitle: 'Katha Upanishad (Krishna Yajurveda) — Immortality of the Soul & The Chariot Allegory',
    },
    {
      id: 'prashna:1',
      unitNumber: '4. Prashna — Prashna 1.3–4',
      originalText:
        'कबन्धिनः कात्यायन उपेत्य पप्रच्छ—भगवन् कुतो ह वा इमाः प्रजाः प्रजायन्त इति ॥\nतस्मै स होवाच—प्रजाकामो वै प्रजापतिः स तपोऽतप्यत स तपस्तप्त्वा स मिथुनमुत्पादयते—रयिं च प्राणं चेत्येतौ मे बहुधा प्रजाः करिष्यत इति ॥',
      transliteration:
        'kabandhinaḥ kātyāyana upetya papraccha—bhagavan kuto ha vā imāḥ prajāḥ prajāyanta iti ||\ntasmai sa hovāca—prajākāmo vai prajāpatiḥ sa tapo\'tapyata sa tapastaptvā sa mithunamutpādayate—rayiṁ ca prāṇaṁ cetyetau me bahudhā prajāḥ kariṣyata iti ||',
      translationEn:
        'Kabandhin, son of Katya, approached Sage Pippalada and asked: "Revered sir, whence are all these living beings born?" Pippalada answered: "Prajapati (the Creator Lord) practiced contemplative austerity. In that tapas, He brought forth a sacred primal pair—Rayi (matter/form) and Prana (energy/consciousness)—saying: These two shall multiply creation in diverse ways."',
      translationHi:
        'कबन्धिन कात्यायन ने महर्षि पिप्पलाद से पूछा: "भगवन! ये सभी प्रजाएँ कहाँ से उत्पन्न होती हैं?" पिप्पलाद ने उत्तर दिया: "प्रजापति ने सृष्टि की कामना से तप किया और उस तप से एक युगल उत्पन्न किया—रयि (पदार्थ/चन्द्रमा) और प्राण (ऊर्जा/सूर्य)—यह विचार करके कि ये दोनों मिलकर विविध प्रजाओं को उत्पन्न करेंगे।"',
      sectionTitle: 'Prashna Upanishad (Atharvaveda) — The Cosmic Dual Principle of Prana & Rayi',
    },
    {
      id: 'mundaka:1',
      unitNumber: '5. Mundaka — Mundaka 3.1.1, 3.1.6',
      originalText:
        'द्वा सुपर्णा सयुजा सखाया समानं वृक्षं परिषस्वजाते ।\nतयोरन्यः पिप्पलं स्वाद्वत्त्यनश्नन्नन्यो अभिचाकशीति ॥\nसत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः ।\nयेनाक्रमन्त्यृषयो ह्याप्तकामा यत्र तत् सत्यस्य परमं निधानम् ॥',
      transliteration:
        'dvā suparṇā sayujā sakhāyā samānaṁ vṛkṣaṁ pariṣasvajāte |\ntayoranyaḥ pippalaṁ svādvattyanaśnannanyo abhicākaśīti ||\nsatyameva jayate nānṛtaṁ satyena panthā vitato devayānaḥ |\nyenākramantyṛṣayo hyāptakāmā yatra tat satyasya paramaṁ nidhānam ||',
      translationEn:
        'Two birds of golden plumage, inseparable companions, cling to the same tree. One of them eats the sweet and bitter fruits of the tree, while the other looks on as the serene, unattached witness. "Truth alone triumphs, never untruth (Satyameva Jayate Nanritam). By truth the divine path is paved, by which the liberated sages, free from desire, ascend to where lies the supreme abode of Truth."',
      translationHi:
        'दो सुंदर पंखों वाले पक्षी, जो परस्पर सखा हैं, एक ही वृक्ष पर रहते हैं। उनमें से एक वृक्ष के फलों का स्वाद लेकर खाता है, जबकि दूसरा साक्षी भाव से केवल देखता रहता है। "सत्य की ही विजय होती है, असत्य की नहीं। सत्य से ही देवयान का मार्ग प्रशस्त होता है, जिससे निष्काम ऋषि सत्य के परम धाम को प्राप्त करते हैं।"',
      sectionTitle: 'Mundaka Upanishad (Atharvaveda) — The Two Birds & Satyameva Jayate',
    },
    {
      id: 'mandukya:1',
      unitNumber: '6. Mandukya — Karikas 1, 7 & Mahavakya',
      originalText:
        'ओमित्येतदक्षरमिदँ सर्वं तस्योपव्याख्यानं भूतं भवद्भवविष्यदिति सर्वमोङ्कार एव ।\nयच्चान्यत्त्रिकालातीतं तदप्योङ्कार एव ॥\nसर्वं ह्येतद् ब्रह्म अयमात्मा ब्रह्म सोऽयमात्मा चतुष्पात् ॥\nनान्तष्प्रज्ञं न बहिष्प्रज्ञं नोभयतःप्रज्ञं न प्रज्ञानघनं न प्रज्ञं नाप्रज्ञम् ।\nअदृष्टमव्यवहार्यमग्राह्यमलक्षणमचिन्त्यमव्यपदेश्यमेकात्मप्रत्ययसारं प्रपञ्चोपशमं शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः ॥',
      transliteration:
        'omityetadakṣaramidaom sarvaṁ tasyopavyākhyānaṁ bhūtaṁ bhavadbhaviṣyaditi sarvamoṅkāra eva |\nyaccānyattrikālātītaṁ tadapyoṅkāra eva ||\nsarvaṁ hyetad brahma ayamātmā brahma so\'yamātmā catuṣpāt ||\nnāntaṣprajñaṁ na bahiṣprajñaṁ nobhayataḥprajñaṁ na prajñānaghanaṁ na prajñaṁ nāprajñam |\nadṛṣṭamavyavahāryamagrāhyamalakṣaṇamacintyamavyapadeśyamekātmapratyayasāraṁ prapañcopaśamaṁ śāntaṁ śivamadvaitaṁ caturthaṁ manyante sa ātmā sa vijñeyaḥ ||',
      translationEn:
        'AUM—this imperishable syllable is all that exists. All that was, is, and will be is OM. All is Brahman; this Self is Brahman (Ayam Atma Brahma — Atharvaveda Mahavakya). The Fourth state (Turiya) is not inwardly conscious, nor outwardly conscious, nor conscious of both; it is unseen, beyond empirical dealing, incomprehensible, uninferable, unthinkable, ineffable, the essence of the single Self-awareness, the cessation of the world-appearance, peaceful, auspicious, non-dual. That is the Atman; that is to be realized.',
      translationHi:
        'ॐ यह अविनाशी अक्षर ही यह सब कुछ है। यह सब कुछ ब्रह्म ही है; "यह आत्मा ब्रह्म है" (अयम् आत्मा ब्रह्म)। जो न अन्तःप्रज्ञ है, न बहिष्प्रज्ञ है, न दोनों प्रकार का प्रज्ञ है; जो अदृष्ट, अव्यवहार्य, अग्राह्य, अचिन्त्य और अनिर्वचनीय है, वही शान्त, शिव और अद्वैत चतुर्थ पद (तुरीय) है। वही आत्मा है, वही जानने योग्य है।',
      sectionTitle: 'Mandukya Upanishad (Atharvaveda) — The Fourth State (Turiya) & Ayam Atma Brahma',
    },
    {
      id: 'taittiriya:1',
      unitNumber: '7. Taittiriya — Shiksha 1.11.1 & Ananda 2.1.1',
      originalText:
        'सत्यं वद । धर्मं चर । स्वाध्यायान्मा प्रमदः ।\nआचार्याय प्रियं धनमाहृत्य प्रजातन्तुं मा व्यवच्छेत्सीः ॥\nसत्यं ज्ञानमनन्तं ब्रह्म । यो वेद निहितं गुहायां परमे व्योमन् ।\nसोऽश्नुते सर्वान् कामान् सह । ब्रह्मणा विपश्चितेति ॥',
      transliteration:
        'satyaṁ vada | dharmaṁ cara | svādhyāyānmā pramadaḥ |\nācāryāya priyaṁ dhanamāhṛtya prajātantuṁ mā vyavacchetsīḥ ||\nsatyaṁ jñānamanantaṁ brahma | yo veda nihitaṁ guhāyāṁ parame vyoman |\nso\'śnute sarvān kāmān saha | brahmaṇā vipaściteti ||',
      translationEn:
        'Convocation injunction to students: "Speak the truth. Practice righteousness (Dharma). Do not neglect daily scriptural study (Svadhyaya)." "Brahman is Truth, Knowledge, and Infinity (Satyam Jnanam Anantam Brahma). Whoever realizes That hidden in the secret cavern of the heart and in the supreme space fulfills all desires in union with the Omniscient Brahman."',
      translationHi:
        'शिष्य को दीक्षांत उपदेश: "सत्य बोलो। धर्म का आचरण करो। स्वाध्याय में प्रमाद मत करो।" "सत्य, ज्ञान और अनन्त ही ब्रह्म है। जो पुरुष हृदय-गुहा के परम आकाश में स्थित उस ब्रह्म को जान लेता है, वह उस सर्वज्ञ ब्रह्म के साथ सम्पूर्ण कामनाओं को प्राप्त कर लेता है।"',
      sectionTitle: 'Taittiriya Upanishad (Krishna Yajurveda) — Satyam Vada Dharmam Chara & Infinite Brahman',
    },
    {
      id: 'aitareya:1',
      unitNumber: '8. Aitareya — 3.1.3 & Mahavakya',
      originalText:
        'एष ब्रह्मैष इन्द्र एष प्रजापतिरेते सर्वे देवा इमानि च पञ्चमहाभूतानि पृथिवी वायुराकाश आपो ज्योतींषि... सर्वं तत्प्रज्ञानेत्रं प्रज्ञाने प्रतिष्ठितं प्रज्ञानेत्रो लोकः प्रज्ञा प्रतिष्ठा प्रज्ञानं ब्रह्म ॥',
      transliteration:
        'eṣa brahmaiṣa indra eṣa prajāpatirete sarve devā imāni ca pañcamahābhūtāni pṛthivī vāyurākāśa āpo jyotīṁṣi... sarvaṁ tatprajñānetraṁ prajñāne pratiṣṭhitaṁ prajñānetro lokaḥ prajñā pratiṣṭhā prajñānaṁ brahma ||',
      translationEn:
        'This is Brahman, this is Indra, this is Prajapati, all these gods, and the five great cosmic elements: earth, air, space, water, and fire. All this is guided by Consciousness, grounded in Consciousness. The universe has Consciousness as its eye; Consciousness is its foundation. "Consciousness is Brahman" (Prajnanam Brahma — Rigveda Mahavakya).',
      translationHi:
        'यह ब्रह्म है, यही इन्द्र है, यही प्रजापति है, ये समस्त देवगण और पाँचों महाभूत (पृथ्वी, वायु, आकाश, जल और अग्नि) हैं। यह सम्पूर्ण जगत चेतना द्वारा ही संचालित और प्रतिष्ठित है। चेतना ही जगत का आधार है; "चेतना (प्रज्ञान) ही ब्रह्म है" (प्रज्ञानं ब्रह्म)।',
      sectionTitle: 'Aitareya Upanishad (Rigveda) — Prajnanam Brahma (Consciousness is Brahman)',
    },
    {
      id: 'chandogya:1',
      unitNumber: '9. Chandogya — 6.8.7 & Mahavakya',
      originalText:
        'स य एषोऽणिमैतदात्म्यमिदँ सर्वं तत्सत्यँ स आत्मा तत्त्वमसि श्वेतकेतो इति ।\nभूय एव मा भगवान् विज्ञापयत्विति तथा सोम्येति होवाच ॥\nसर्वं खल्विदं ब्रह्म तज्जलानिति शान्त उपासीत ॥',
      transliteration:
        'sa ya eṣo\'ṇimaitadātmyamidaom sarvaṁ tatsatyaom sa ātmā tattvamasi śvetaketo iti |\nbhūya eva mā bhagavān vijñāpayatviti tathā somyeti hovāca ||\nsarvaṁ khalvidaṁ brahma tajjalāniti śānta upāsīta ||',
      translationEn:
        'Uddalaka instructs his son Shvetaketu: "That subtlest essence—in it all that exists has its self. That is the True. That is the Atman. That Thou Art, O Shvetaketu (Tat Tvam Asi — Samaveda Mahavakya)." "All this visible universe is verily Brahman (Sarvam Khalvidam Brahma); from Him it originates, into Him it dissolves, and in Him it is sustained. Thus with a peaceful and serene mind, one should contemplate Him."',
      translationHi:
        'उद्दालक ऋषि ने अपने पुत्र श्वेतकेतु को उपदेश दिया: "वह जो सूक्ष्म तत्व है, वही इस सम्पूर्ण जगत का आत्मा है। वही सत्य है, वही आत्मा है; \'वह तुम ही हो, हे श्वेतकेतु\' (तत्त्वमसि)।" "यह सम्पूर्ण चराचर जगत निश्चय ही ब्रह्म है; उसी से यह उत्पन्न होता है, उसी में लीन होता है और उसी में चेष्टा करता है। अतः शांतचित्त होकर उसकी उपासना करनी चाहिए।"',
      sectionTitle: 'Chandogya Upanishad (Samaveda) — Tat Tvam Asi & Sarvam Khalvidam Brahma',
    },
    {
      id: 'brihadaranyaka:1',
      unitNumber: '10. Brihadaranyaka — 1.3.28, 1.4.10 & Neti Neti',
      originalText:
        'असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥\nब्रह्म वा इदमग्र आसीत् तदात्मानमेवावेत्—अहं ब्रह्मास्मीति । तस्मात्तत्सर्वमभवत् ॥\nस एष नेति नेत्यात्माऽगृह्यो न हि गृह्यतेऽशीर्यो न हि शीर्यतेऽसङ्गो न हि सज्यतेऽसितो न व्यथते न रिष्यति ॥',
      transliteration:
        'asato mā sadgamaya | tamaso mā jyotirgamaya | mṛtyormā\'mṛtaṁ gamaya ||\nbrahma vā idamagra āsīt tadātmānamevāvet—ahaṁ brahmāsmīti | tasmāttatsarvamabhavat ||\nsa eṣa neti netyātmā\'gṛhyo na hi gṛhyate\'śīryo na hi śīryate\'saṅgo na hi sajyate\'sito na vyathate na riṣyati ||',
      translationEn:
        '"Lead me from the unreal to the Real. Lead me from darkness to Light. Lead me from death to Immortality." "Brahman verily was this universe in the beginning. It knew Itself only as: \'I am Brahman\' (Aham Brahmasmi — Yajurveda Mahavakya). Therefore It became all." "That Self is described as Neti, Neti (Not this, Not this). It is imperceptible, for It cannot be perceived; un-decaying, for It never decays; unattached, for It never attaches Itself; unbound, untroubled, and uninjured."',
      translationHi:
        '"मुझे असत्य से सत्य की ओर ले चलो। मुझे अंधकार से प्रकाश की ओर ले चलो। मुझे मृत्यु से अमरता की ओर ले चलो।" "प्रारंभ में यह सब ब्रह्म ही था। उसने अपने को ही जाना कि \'मैं ब्रह्म हूँ\' (अहं ब्रह्मास्मि)। अतः वह सब कुछ हो गया।" "वह आत्मा \'नेति-नेति\' (यह नहीं, यह नहीं) है। वह अग्राह्य है क्योंकि पकड़ा नहीं जा सकता, अविनश्वर है क्योंकि नष्ट नहीं होता, असंग है क्योंकि लिप्त नहीं होता।"',
      sectionTitle: 'Brihadaranyaka Upanishad (Shukla Yajurveda) — Asato Ma Sadgamaya, Aham Brahmasmi & Neti Neti',
    },
  ],

  // ----------------------------------------------------------------------------
  // 4. THE FOUR VEDAS (Rigveda, Samaveda, Yajurveda, Atharvaveda)
  // ----------------------------------------------------------------------------
  vedas: [
    // --- RIGVEDA SAMHITA ---
    {
      id: 'rigveda:1.1.1',
      unitNumber: 'Rigveda 1.1.1–4',
      originalText:
        'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ।\nहोतारं रत्नधातमम् ॥\nअग्निः पूर्वेभिरृषिभिरीड्यो नूतनैरुत ।\nस देवाँ एह वक्षति ॥',
      transliteration:
        'agnimīḷe purohitaṁ yajñasya devamṛtvijam |\nhotāraṁ ratnadhātamam ||\nagniḥ pūrvebhirṛṣibhirīḍyo nūtanairuta |\nsa devāom eha vakṣati ||',
      translationEn:
        'I praise Agni, the chosen priest, the divine minister of the cosmic sacrifice, the invoker of the gods, and the bestower of supreme spiritual treasures. Agni, worthy of adoration by ancient and modern seers alike, bring hither the shining gods to this sacred assembly.',
      translationHi:
        'मैं यज्ञ के पुरोहित, प्रकाशमान देव, ऋत्विक, होता और रत्नों को धारण करने वाले अग्निदेव की स्तुति करता हूँ। अग्निदेव जो पूर्वकालीन और वर्तमान ऋषियों द्वारा पूजनीय हैं, वे यहाँ दिव्य देवताओं को लेकर आएं।',
      sectionTitle: 'Rigveda (Hymn 1.1) — Agni Suktam (The Primordial Vedic Invocation)',
    },
    {
      id: 'rigveda:gayatri',
      unitNumber: 'Rigveda 3.62.10 (Gayatri)',
      originalText:
        'ॐ भूर्भुवः स्वः ।\nतत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि ।\nधियो यो नः प्रचोदयात् ॥',
      transliteration:
        'oṁ bhūrbhuvaḥ svaḥ |\ntatsaviturvareṇyaṁ bhargo devasya dhīmahi |\ndhiyo yo naḥ pracodayāt ||',
      translationEn:
        'AUM, throughout the physical (Bhur), subtle (Bhuva), and celestial (Svah) spheres of reality. May we meditate upon that supreme, adorable radiance of the Divine Solar Creator (Savitr). May that Divine Light illumine, inspire, and guide our intellect and understanding toward spiritual realization.',
      translationHi:
        'ॐ। भूलोक, भुवर्लोक और स्वर्लोक में व्याप्त! हम उस सृष्टि-उत्पादक प्रकाशमान सविता देव के परम वरेण्य तेज का ध्यान करते हैं। वह परमात्मा हमारी बुद्धि को सत्कर्मों और सत्य ज्ञान की ओर प्रेरित करे।',
      sectionTitle: 'Rigveda 3.62.10 — Savitr Gayatri Mantra (The Mother of the Vedas)',
    },
    {
      id: 'rigveda:10.129.1',
      unitNumber: 'Rigveda 10.129.1–3',
      originalText:
        'नासदासीन्नो सदासीत्तदानीं नासीद्रजो नो व्योमा परो यत् ।\nकिमावरीवः कुह कस्य शर्मन्नम्भः किमासीद्गहनं गभीरम् ॥\nन मृत्युरासीदमृतं न तर्हि न रात्र्या अह्न आसीत्प्रकेतः ।\nआनीदवातं स्वधया तदेकं तस्माद्धान्यन्न परः किञ्चनास ॥',
      transliteration:
        'nāsadāsīnno sadāsīttadānīṁ nāsīdrajo no vyomā paro yat |\nkimāvarīvaḥ kuha kasya śarmannambhaḥ kimāsīdgahanaṁ gabhīram ||\nna mṛtyurāsīdamṛtaṁ na tarhi na rātryā ahna āsītpraketaḥ |\nānīdavātaṁ svadhayā tadekaṁ tasmāddhānyanna paraḥ kiñcanāsa ||',
      translationEn:
        'Then there was neither non-existence (Asat) nor existence (Sat); there was neither space nor the celestial sky beyond. What covered all? Where was it, and in whose protection? Was there water, unfathomably deep? Death was not then, nor immortality; there was no sign of night or day. That One Supreme Reality breathed breathless by Its own intrinsic nature (Svadhaya); beyond That nothing whatever existed.',
      translationHi:
        'सृष्टि से पूर्व न असत् था और न सत् था; न अंतरिक्ष था और न उससे परे आकाश। किसने सबको ढक रखा था? कहाँ और किसकी शरण में? मृत्यु नहीं थी, न अमरता थी; रात और दिन का भेद न था। वह एक परब्रह्म अपनी ही शक्ति से बिना वायु के श्वास ले रहा था; उसके अतिरिक्त परे कुछ भी न था।',
      sectionTitle: 'Rigveda 10.129 — Nasadiya Suktam (The Hymn of Creation)',
    },

    // --- SAMAVEDA SAMHITA ---
    {
      id: 'samaveda:1.1.1',
      unitNumber: 'Samaveda 1.1.1 (Saman Invocation)',
      originalText:
        'अग्न आ याहि वीतये गृणानो हव्यदातये ।\nनि होता सत्सि बर्हिषि ॥',
      transliteration:
        'agna ā yāhi vītaye gṛṇāno havyadātaye |\nni hotā satsi barhiṣi ||',
      translationEn:
        'Come, O Agni, to the sacred feast; celebrated by our songs of praise, come to partake of our divine oblations. Sit as the supreme invoker (Hota) upon the sacred grass (Barhis). [Set to the primordial musical melody of the Samaveda, the Veda of sacred chanting].',
      translationHi:
        'हे अग्निदेव! स्तुति गान से प्रसन्न होकर हमारे हव्य को स्वीकार करने के लिए यहाँ पधारिए। होता के रूप में हमारे पवित्र कुश-आसन पर विराजमान होइए। (सामवेद का आदि मन्त्र)।',
      sectionTitle: 'Samaveda (Archika 1.1.1) — Agne Ayahi Vitaye (Primordial Melodic Saman)',
    },

    // --- YAJURVEDA SAMHITA ---
    {
      id: 'yajurveda:shiva_sankalpa',
      unitNumber: 'Yajurveda (VS 34.1–3)',
      originalText:
        'येनेदं भूतं भुवनं भविष्यत् परिगृहीतममृतेन सर्वम् ।\nयेन यज्ञस्तायते सप्तहोता तन्मे मनः शिवसङ्कल्पमस्तु ॥\nयत्प्रज्ञानमुत चेतो धृतिश्च यज्ज्योतिरन्तरमृतं प्रजासु ।\nयस्मान्न ऋते किञ्चन कर्म क्रियते तन्मे मनः शिवसङ्कल्पमस्तु ॥',
      transliteration:
        'yenedaṁ bhūtaṁ bhuvanaṁ bhaviṣyat parigṛhītamamṛtena sarvam |\nyena yajñastāyate saptahotā tanme manaḥ śivasaṅkalpamastu ||\nyatprajñānamuta ceto dhṛtiśca yajjyotirantaramṛtaṁ prajāsu |\nyasmānna ṛte kiñcana karma kriyate tanme manaḥ śivasaṅkalpamastu ||',
      translationEn:
        'That immortal Mind by which all the past, present, and future is comprehended; by which the cosmic sacrifice with its seven priests is performed—may that mind of mine be filled with auspicious, noble, and benevolent resolves (Shiva Sankalpamastu). That mind which is knowledge, consciousness, and steadfast will—the immortal light residing within all beings, without which no action can be accomplished—may that mind of mine abide in auspicious divinity.',
      translationHi:
        'जिस अमर मन के द्वारा भूत, वर्तमान और भविष्य सब कुछ जाना जाता है, जिससे सात होताओं वाला यज्ञ संपन्न होता है—वह मेरा मन कल्याणकारी संकल्पों से युक्त हो (तन्मे मनः शिवसंकल्पमस्तु)। जो मन ज्ञान, चेतना और धैर्य का रूप है तथा समस्त प्राणियों के भीतर अमर ज्योति है—वह मेरा मन सदा शुभ विचारों से भरा रहे।',
      sectionTitle: 'Shukla Yajurveda (Vajasaneyi Samhita 34.1–3) — Shiva Sankalpa Suktam',
    },
    {
      id: 'yajurveda:shanti_sukta',
      unitNumber: 'Yajurveda (VS 36.17)',
      originalText:
        'द्यौः शान्तिरन्तरिक्षँ शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः ।\nवनस्पतयः शान्तिर्विश्वेदेवाः शान्तिर्ब्रह्म शान्तिः सर्वँ शान्तिः शान्तिरेव शान्तिः सा मा शान्तिरेधि ॥\nॐ शान्तिः शान्तिः शान्तिः ॥',
      transliteration:
        'dyauḥ śāntirantarikṣaom śāntiḥ pṛthivī śāntirāpaḥ śāntiroṣadhayaḥ śāntiḥ |\nvanaspatayaḥ śāntirviśvedevāḥ śāntirbrahma śāntiḥ sarvaom śāntiḥ śāntireva śāntiḥ sā mā śāntiredhi ||\noṁ śāntiḥ śāntiḥ śāntiḥ ||',
      translationEn:
        'May peace radiate through the heavenly skies; may peace pervade the atmospheric realm; may peace abide upon the earth; may the waters bring peace; may plants and herbs yield peace; may the trees and forests bestow peace; may all the cosmic powers (Vishvedevas) embody peace; may Brahman be peace; may peace be upon all creation; may peace itself be peace; may that very peace enter into me. AUM, Peace, Peace, Peace.',
      translationHi:
        'द्युलोक में शांति हो, अंतरिक्ष में शांति हो, पृथ्वी पर शांति हो, जल में शांति हो, औषधियों में शांति हो, वनस्पतियों में शांति हो, समस्त देवगणों में शांति हो, ब्रह्म में शांति हो, सर्वत्र शांति हो, शांति ही शांति हो; वह शांति मुझे प्राप्त हो। ॐ शान्ति, शान्ति, शान्ति।',
      sectionTitle: 'Shukla Yajurveda (Vajasaneyi Samhita 36.17) — Shanti Suktam (Universal Peace Prayer)',
    },

    // --- ATHARVAVEDA SAMHITA ---
    {
      id: 'atharvaveda:12.1.12',
      unitNumber: 'Atharvaveda 12.1.1–12',
      originalText:
        'सत्यं बृहदृतमुग्रं दीक्षा तपो ब्रह्म यज्ञः पृथिवीं धारयन्ति ।\nसा नो भूतस्य भव्यस्य पत्न्युरुं लोकं पृथिवी नः कृणोतु ॥\nमाता भूमिः पुत्रो अहं पृथिव्याः ।\nपर्जन्यः पिता स उ नः पिपर्तु ॥',
      transliteration:
        'satyaṁ bṛhadṛtamugraṁ dīkṣā tapo brahma yajñaḥ pṛthivīṁ dhārayanti |\nsā no bhūtasya bhavyasya patnyuruṁ lokaṁ pṛthivī naḥ kṛṇotu ||\nmātā bhūmiḥ putro ahaṁ pṛthivyāḥ |\nparjanyaḥ pitā sa u naḥ pipartu ||',
      translationEn:
        'Truth, cosmic order (Rita), mighty dedication, consecration, spiritual austerity, sacred wisdom, and selfless sacrifice uphold the Mother Earth. May She, the sovereign mistress of all that was and will be, grant us vast and unconfined space. "The Earth is my Mother; I am the son of the Earth. The rain-bearing sky is our Father; may he nurture and protect us."',
      translationHi:
        'महान सत्य, ऋत (प्राकृतिक नियम), दीक्षा, तप, ब्रह्मज्ञान और यज्ञ पृथ्वी को धारण करते हैं। भूत और भविष्य की स्वामिनी वह पृथ्वी हमें विशाल विस्तार प्रदान करे। "भूमि मेरी माता है और मैं पृथ्वी का पुत्र हूँ। पर्जन्य (मेघ) हमारे पिता हैं, वे हमारा पोषण करें।"',
      sectionTitle: 'Atharvaveda 12.1 — Bhumi Suktam / Prithvi Suktam (Ode to Mother Earth)',
    },
    {
      id: 'atharvaveda:skambha',
      unitNumber: 'Atharvaveda 10.7.1',
      originalText:
        'कस्मिन्नङ्गे तपो अस्याधि तिष्ठति कस्मिन्नङ्गमृतमस्याध्याहितम् ।\nक्व व्रतं क्व श्रद्धास्य तिष्ठति कस्मिन्नङ्गे सत्यमस्य प्रतिष्ठितम् ॥',
      transliteration:
        'kasminnaṅge tapo asyādhi tiṣṭhati kasminnaṅgamṛtamasyādhyāhitam |\nkva vrataṁ kva śraddhāsya tiṣṭhati kasminnaṅge satyamasya pratiṣṭhitam ||',
      translationEn:
        'In which cosmic limb of His does Tapas (spiritual heat) reside? In which limb is the cosmic order (Rita) established? Where abide His vows, where His faith? In which limb of the Cosmic Pillar (Skambha) is eternal Truth firmly founded? Skambha is the eternal cosmic support of all worlds—the Supreme Brahman.',
      translationHi:
        'इस विराट पुरुष (स्कम्भ) के किस अंग में तप प्रतिष्ठित है? किस अंग में ऋत समाहित है? इनके व्रत और श्रद्धा कहाँ स्थित हैं? और किस अंग में सत्य प्रतिष्ठित है? यह स्कम्भ ही सम्पूर्ण ब्रह्माण्ड का आधार स्तम्भ—परब्रह्म है।',
      sectionTitle: 'Atharvaveda 10.7.1 — Skambha Suktam (The Cosmic Pillar of Brahman)',
    },

    // --- AUTHENTIC VEDIC CHANTING AUDIO UNITS ---
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
  // 5. THE 18 MAHAPURANAS (Canonical Classification & Selected Excerpts)
  // ----------------------------------------------------------------------------
  puranas: [
    {
      id: 'puranas:catalogue',
      unitNumber: 'Canonical 18 Mahapuranas Matrix',
      originalText:
        'ब्राह्मं पाद्मं वैष्णवं च शैवं लैङ्गं सगारुडम् ।\nनारदीयं भागवतमाग्नेयं स्कान्दसंज्ञितम् ॥\nभविष्यं ब्रह्मवैवर्तं मार्कण्डेयं सवामनम् ।\nवाराहं मात्स्यं कौर्मं च ब्रह्माण्डाख्यमिति त्रिषट् ॥',
      transliteration:
        'brāhmaṁ pādmaṁ vaiṣṇavaṁ ca śaivaṁ laiṅgaṁ sagāruḍam |\nnāradīyaṁ bhāgavatamāgneyaṁ skāndasaṁjñitam ||\nbhaviṣyaṁ brahmavaivartaṁ mārkaṇḍeyaṁ savāmanam |\nvārāhaṁ mātsyaṁ kaurmaṁ ca brahmāṇḍākhyamiti triṣaṭ ||',
      translationEn:
        'The eighteen Mahapuranas composed by Maharshi Veda Vyasa comprise approximately 400,000 Sanskrit verses, classified into three groups according to the Gunas: Sattvika (Vaishnava), Rajasa (Brahma), and Tamasa (Shaiva/Shakta). Together they elucidate cosmic creation, royal lineages, moral righteousness, and metaphysical devotion.',
      translationHi:
        'महर्षि वेदव्यास द्वारा प्रणीत अठारह महापुराण लगभग ४००,००० श्लोकों में विस्तृत हैं, जिन्हें तीन गुणों (सात्त्विक, राजसिक, तामसिक) में वर्गीकृत किया गया है: ब्रह्म, पद्म, विष्णु, शिव, लिंग, गरुड़, नारद, भागवत, अग्नि, स्कन्द, भविष्य, ब्रह्मवैवर्त, मार्कण्डेय, वामन, वराह, मत्स्य, कूर्म और ब्रह्माण्ड पुराण।',
      sectionTitle: 'The 18 Mahapuranas — Canonical Classification & Overview',
    },
    {
      id: 'puranas:sattva_vaishnava',
      unitNumber: 'Sattvika / Vaishnava (6 Puranas)',
      originalText:
        '१. विष्णु पुराण (२३,००० श्लोक) — पराशर मुनि प्रणीत शुद्ध भक्ति एवं सृष्टि विवरण\n२. श्रीमद्भागवत पुराण (१८,००० श्लोक) — द्वादश स्कन्ध, कृष्ण लीला एवं नवधा भक्ति\n३. नारद पुराण (२५,००० श्लोक) — वेदाङ्ग, तीर्थ माहात्म्य एवं व्रतकथा\n४. गरुड़ पुराण (१९,००० श्लोक) — धर्म, नीति, मृत्यु पश्चात् आत्मा की गति एवं मोक्ष\n५. पद्म पुराण (५५,००० श्लोक) — पञ्च खण्ड, तीर्थ एवं भगवद्गीता माहात्म्य\n६. वराह पुराण (२४,००० श्लोक) — पृथ्वी उद्धार, वराह अवतार एवं वैष्णव आचार',
      transliteration:
        '1. Vishnu Purana (23,000 verses) — Sage Parashara; pure devotion & cosmogony\n2. Srimad Bhagavata (18,000 verses) — 12 Cantos, Krishna Lila & Navadha Bhakti\n3. Narada Purana (25,000 verses) — Vedangas, sacred pilgrimage sites & vratas\n4. Garuda Purana (19,000 verses) — Dharma, ethics, post-mortem soul transit & liberation\n5. Padma Purana (55,000 verses) — 5 sections, sacred tirthas & Gita Mahatmya\n6. Varaha Purana (24,000 verses) — Earth deliverance, Varaha Avatara & Vaishnava conduct',
      translationEn:
        'The Six Sattvika (Vaishnava) Mahapuranas emphasize the maintenance and preservation of cosmic order (Sthiti) through Lord Vishnu and His Avataras. They expound the philosophy of unalloyed devotion (Shuddha Bhakti), selfless surrender, virtuous conduct, and liberation.',
      translationHi:
        'छह सात्त्विक (वैष्णव) महापुराण भगवान विष्णु और उनके अवतारों के माध्यम से सृष्टि के संरक्षण, शुद्ध भक्ति, तीर्थ माहात्म्य और मोक्ष का प्रतिपादन करते हैं।',
      sectionTitle: 'The 6 Sattvika Mahapuranas (Vaishnava Tradition)',
    },
    {
      id: 'puranas:rajas_brahma',
      unitNumber: 'Rajasa / Brahma (6 Puranas)',
      originalText:
        '१. ब्रह्म पुराण (१०,००० श्लोक) — आदि पुराण, सूर्य एवं तीर्थ वर्णन\n२. ब्रह्माण्ड पुराण (१२,००० श्लोक) — ललिता सहस्रनाम एवं अध्यात्म रामायण\n३. ब्रह्मवैवर्त पुराण (१८,००० श्लोक) — राधा-कृष्ण गोलोक लीला एवं प्रकृति रहस्य\n४. मार्कण्डेय पुराण (९,००० श्लोक) — देवी माहात्म्य (दुर्गा सप्तशती / चण्डी पाठ)\n५. भविष्य पुराण (१४,५०० श्लोक) — सूर्य उपासना, भविष्य कथन एवं युग धर्म\n६. वामन पुराण (१०,००० श्लोक) — वामन अवतार एवं त्रिविक्रम स्वरूप',
      transliteration:
        '1. Brahma Purana (10,000 verses) — Adi Purana; Surya worship & pilgrimage\n2. Brahmanda Purana (12,000 verses) — Lalita Sahasranama & Adhyatma Ramayana\n3. Brahmavaivarta Purana (18,000 verses) — Radha-Krishna Goloka pastimes & Prakriti\n4. Markandeya Purana (9,000 verses) — Devi Mahatmya (Durga Saptashati / Chandi Path)\n5. Bhavishya Purana (14,500 verses) — Solar worship, prophecies & Dharma of the Yugas\n6. Vamana Purana (10,000 verses) — Vamana Avatara & Trivikrama manifestation',
      translationEn:
        'The Six Rajasa (Brahma / Creation) Mahapuranas expound the cosmic manifestation (Srishti), genealogy of gods and kings, sacred mother goddesses (Devi Mahatmya in Markandeya Purana), divine hymns like Lalita Sahasranama (Brahmanda Purana), and ethical duty across cosmic eras.',
      translationHi:
        'छह राजसिक महापुराण सृष्टि-रचना, देवी माहात्म्य (मार्कण्डेय पुराण), ललिता सहस्रनाम (ब्रह्माण्ड पुराण), सूर्य उपासना और युगधर्म का वर्णन करते हैं।',
      sectionTitle: 'The 6 Rajasa Mahapuranas (Brahma / Creation & Shakta Tradition)',
    },
    {
      id: 'puranas:tamas_shaiva',
      unitNumber: 'Tamasa / Shaiva (6 Puranas)',
      originalText:
        '१. शिव पुराण (२४,००० श्लोक) — रुद्र संहिता, लिंगोद्भव एवं शिव तत्त्व\n२. लिंग पुराण (११,००० श्लोक) — लिंगोपासना एवं सदाशिव स्वरूप\n३. स्कन्द पुराण (८१,१०० श्लोक) — सर्वाधिक विस्तृत महापुराण, काशी खण्ड एवं केदार खण्ड\n४. अग्नि पुराण (१५,४०० श्लोक) — ज्ञान-विज्ञान, आयुर्वेद, धनुर्वेद एवं योग का विश्वकोश\n५. मत्स्य पुराण (१४,००० श्लोक) — मत्स्य अवतार, मनु-संवाद एवं वास्तु शास्त्र\n६. कूर्म पुराण (१७,००० श्लोक) — ईश्वर गीता एवं कूर्म अवतार रहस्य',
      transliteration:
        '1. Shiva Purana (24,000 verses) — Rudra Samhita, Lingodbhava & Shiva tattva\n2. Linga Purana (11,000 verses) — Linga worship & formless Sadasiva\n3. Skanda Purana (81,100 verses) — Longest Mahapurana; Kashi Khanda & Kedara Khanda\n4. Agni Purana (15,400 verses) — Encyclopedia of Ayurveda, Dhanurveda & Yoga\n5. Matsya Purana (14,000 verses) — Matsya Avatara, Manu dialogue & Vastu Shastra\n6. Kurma Purana (17,000 verses) — Ishvara Gita & Kurma Avatara wisdom',
      translationEn:
        'The Six Tamasa (Shaiva / Transformation) Mahapuranas focus on cosmic dissolution, transformation, ascetic wisdom, and the non-dual realization of Lord Shiva. Skanda Purana is the most voluminous (over 81,000 verses), while Agni Purana serves as an ancient Sanskrit encyclopedia of arts, sciences, medicine, and temple architecture.',
      translationHi:
        'छह तामसिक (शैव) महापुराण लय, ध्यान, शिव-तत्त्व, काशी खण्ड (स्कन्द पुराण) और ज्ञान-विज्ञान के विश्वकोश (अग्नि पुराण) का प्रतिपादन करते हैं।',
      sectionTitle: 'The 6 Tamasa Mahapuranas (Shaiva & Encyclopedic Tradition)',
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
    {
      id: 'vishnu_purana:dhruva_stuti',
      unitNumber: 'Vishnu Purana 1.12 (Dhruva Stuti)',
      originalText:
        'शान्तं सर्वगतं सूक्ष्मं परं ज्योतिर्मयं शिवम् ।\nअव्ययं व्योमसंकाशं परमात्मानमव्ययम् ॥\nनमामि तमहं देवं सर्वात्मानं सनातनम् ।\nयस्मात्सर्वमिदं जातं यस्मिंश्च प्रलयं गताः ॥',
      transliteration:
        'śāntaṁ sarvagataṁ sūkṣmaṁ paraṁ jyotirmayaṁ śivam |\navyayaṁ vyomasaṅkāśaṁ paramātmānamavyayam ||\nnamāmi tamahaṁ devaṁ sarvātmānaṁ sanātanam |\nyasmātsarvamidaṁ jātaṁ yasmiṁśca pralayaṁ gatāḥ ||',
      translationEn:
        'Dhruva\'s prayer to Lord Vishnu (Vishnu Purana 1.12): "I bow to that Supreme Divine Person, peaceful, all-pervading, subtle, luminous, auspicious, imperishable, like ethereal space, the eternal Soul of all beings—from whom this entire universe is born and into whom it dissolves."',
      translationHi:
        'ध्रुव की विष्णु स्तुति (विष्णु पुराण १.१२): "मैं उन शांत, सर्वव्यापी, सूक्ष्म, परम ज्योतिर्मय, कल्याणकारी, अविनाशी, आकाश के समान व्यापक, सनातन परमात्मा को प्रणाम करता हूँ, जिनसे यह सारा संसार उत्पन्न हुआ है और जिनमें सब लीन हो जाते हैं।"',
      sectionTitle: 'Vishnu Purana 1.12 — Dhruva Stuti (Praise of the All-Pervading Lord)',
    },
    {
      id: 'markandeya:devi_mahatmya',
      unitNumber: 'Markandeya Purana 81.1, 81.55 (Devi Mahatmya)',
      originalText:
        'ॐ सावर्णिः सूर्यतनयो यो मनुः कथ्यतेऽष्टमः ।\nनिशामय तदुत्पत्तिं विस्तराद् गदतो मम ॥\nज्ञानिनामपि चेतांसि देवी भगवती हि सा ।\nबलादाकृष्य मोहाय महामाया प्रयच्छति ॥',
      transliteration:
        'oṁ sāvarṇiḥ sūryatanayo yo manuḥ kathyate\'ṣṭamaḥ |\nniśāmaya tadutpattiṁ vistarād gadato mama ||\njñānināmapi cetāṁsi devī bhagavatī hi sā |\nbalādākṛṣya mohāya mahāmāyā prayacchati ||',
      translationEn:
        'Markandeya Purana (Devi Mahatmya 81.1, 81.55): "Savarṇi, son of Surya, is proclaimed the eighth Manu; hear from me the detailed account of his origin. That Divine Goddess, Mahamaya, forcibly draws even the minds of the wise into the cosmic play of illusion and reveals the path of supreme liberation."',
      translationHi:
        'मार्कण्डेय पुराण (देवी माहात्म्य / दुर्गा सप्तशती ८१.१, ८१.५५): "सूर्यपुत्र सावर्णि जो आठवें मनु कहे जाते हैं, उनकी उत्पत्ति की कथा विस्तारपूर्वक सुनो। वे भगवती महामाया ज्ञानियों के चित्त को भी बलपूर्वक खींचकर मोह में डाल देती हैं तथा वही मोक्ष प्रदान करने वाली हैं।"',
      sectionTitle: 'Markandeya Purana — Devi Mahatmya / Chandi Path Invocation',
    },
    {
      id: 'shiva_purana:rudra_samhita',
      unitNumber: 'Shiva Purana (Rudra Samhita 1.1.1–2)',
      originalText:
        'निष्प्रपञ्चाय शान्ताय निर्विकल्पाय वेधसे ।\nसच्चिदानन्दरूपाय नमः श्रीशंकराय च ॥\nयतः प्रवृत्तमेतद्धि जगत् स्थावरजङ्गमम् ।\nतं नमामि परं देवं शंकरं शूलपाणिनम् ॥',
      transliteration:
        'niṣprapañcāya śāntāya nirvikalpāya vedhase |\nsaccidānandarūpāya namaḥ śrīśaṅkarāya ca ||\nyataḥ pravṛttametaddhi jagat sthāvarajaṅgamam |\ntaṁ namāmi paraṁ devaṁ śaṅkaraṁ śūlapāṇinam ||',
      translationEn:
        'Shiva Purana (Rudra Samhita 1.1.1–2): "Salutations to Sri Shankara, who is beyond worldly phenomena, peaceful, free of duality, the Supreme Creator, whose nature is Existence, Consciousness, and Absolute Bliss. From whom this entire animate and inanimate universe has emanated—to that Supreme God, Lord Shiva, I bow in reverence."',
      translationHi:
        'शिव पुराण (रुद्र संहिता १.१.१–२): "प्रपंच से रहित, शांत, निर्विकल्प, विधाता और सच्चिदानन्द स्वरूप श्रीशंकर को प्रणाम है। जिनसे इस समस्त चर-अचर जगत की प्रवृत्ति हुई है, उन त्रिशूलधारी देवाधिदेव शंकर को मैं प्रणाम करता हूँ।"',
      sectionTitle: 'Shiva Purana (Rudra Samhita 1.1.1–2) — Invocatory Mangalacharana',
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
