// ==============================================================================
// Daily Duas Library (Categorized, Authentic Citations, Arabic, Urdu & English)
// Milestone M4: Islamic Services & Tools
// Sources: Hisn al-Muslim (Fortress of the Muslim), Sahih al-Bukhari, Sahih Muslim
// ==============================================================================

import { DailyDuaItem } from './types';

export const DUA_CATEGORIES = [
  'All Duas',
  'Morning & Evening',
  'Food & Drink',
  'Travel & Journey',
  'Home & Family',
  'Sleep & Waking',
  'Mosque & Prayer',
  'Forgiveness & Repentance',
  'Protection & Refuge',
  'Health & Healing',
  'Gratitude & Praise',
];

export const DAILY_DUAS: DailyDuaItem[] = [
  // 1. Morning & Evening
  {
    id: 'dua-morning-1',
    category: 'Morning & Evening',
    categoryArabic: 'أذكار الصباح والمساء',
    title: 'Morning Supplication of Praise and Sovereignty',
    arabicTitle: 'دعاء الصباح',
    arabicText: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Asbahnaa wa asbahal-mulku lillaahi, wal-hamdu lillaahi, laa ilaaha illal-laahu wahdahoo laa shareeka lahoo, lahul-mulku wa lahul-hamdu, wa Huwa \'alaa kulli shay\'in Qadeer.',
    englishTranslation: 'We have reached the morning and with it all sovereignty belongs to Allah, all praise is for Allah. There is none worthy of worship except Allah alone, without partner. To Him belongs all kingdom and to Him belongs all praise, and He has power over all things.',
    urduTranslation: 'ہم نے صبح کی اور اللہ کے سارے ملک نے صبح کی، اور تمام تعریفیں اللہ ہی کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف، اور وہ ہر چیز پر قادر ہے۔',
    context: 'Recited upon awakening each morning to begin the day in recognition of divine sovereignty.',
    reference: 'Sahih Muslim, Book 48, Hadith 2723; Hisn al-Muslim 68',
  },
  {
    id: 'dua-evening-1',
    category: 'Morning & Evening',
    categoryArabic: 'أذكار الصباح والمساء',
    title: 'Evening Supplication of Peace and Surrender',
    arabicTitle: 'دعاء المساء',
    arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَا إِلٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'Amsaynaa wa amsal-mulku lillaahi, wal-hamdu lillaahi, laa ilaaha illal-laahu wahdahoo laa shareeka lahoo, lahul-mulku wa lahul-hamdu, wa Huwa \'alaa kulli shay\'in Qadeer.',
    englishTranslation: 'We have reached the evening and with it all sovereignty belongs to Allah, all praise is for Allah. There is none worthy of worship except Allah alone, without partner. To Him belongs all kingdom and to Him belongs all praise, and He has power over all things.',
    urduTranslation: 'ہم نے شام کی اور اللہ کے سارے ملک نے شام کی، اور تمام تعریفیں اللہ ہی کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کی تعریف، اور وہ ہر چیز پر قادر ہے۔',
    context: 'Recited at dusk/sunset to commit the night into Allah\'s protection.',
    reference: 'Sahih Muslim, Book 48, Hadith 2723; Hisn al-Muslim 68',
  },

  // 2. Food & Drink
  {
    id: 'dua-food-before',
    category: 'Food & Drink',
    categoryArabic: 'الطعام والشراب',
    title: 'Before Eating Food',
    arabicTitle: 'الدعاء قبل الطعام',
    arabicText: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ (أَوْ: بِسْمِ اللهِ وَعَلَىٰ بَرَكَةِ اللهِ)',
    transliteration: 'Bismillaahir-Rahmaanir-Raheem (or: Bismillaahi wa \'alaa barakatil-laah).',
    englishTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful (or: In the name of Allah and upon the blessings of Allah).',
    urduTranslation: 'اللہ کے نام کے ساتھ جو بڑا مہربان نہایت رحم والا ہے (یا: اللہ کے نام کے ساتھ اور اللہ کی برکت پر)۔',
    context: 'Recited before taking the first morsel of food or sip of drink.',
    reference: 'Sahih al-Bukhari 5376; Abu Dawud 3767; Hisn al-Muslim 181',
  },
  {
    id: 'dua-food-after',
    category: 'Food & Drink',
    categoryArabic: 'الطعام والشراب',
    title: 'After Finishing Food',
    arabicTitle: 'الدعاء بعد الفراغ من الطعام',
    arabicText: 'الْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Al-hamdu lillaahil-lazee at\'amanaa wa saqaanaa wa ja\'alanaa muslimeen.',
    englishTranslation: 'All praise is for Allah who has fed us, given us drink, and made us among the Muslims.',
    urduTranslation: 'تمام تعریفیں اللہ ہی کے لیے ہیں جس نے ہمیں کھلایا، پلایا اور ہمیں مسلمانوں میں سے بنایا۔',
    context: 'Recited immediately upon completing a meal in gratitude for sustenance.',
    reference: 'Sunan Abi Dawud 3850; Jami` at-Tirmidhi 3457; Hisn al-Muslim 184',
  },

  // 3. Travel & Journey
  {
    id: 'dua-travel',
    category: 'Travel & Journey',
    categoryArabic: 'السفر والترحال',
    title: 'Supplication for Embarking on a Journey',
    arabicTitle: 'دعاء ركوب الدابة والسفر',
    arabicText: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: 'Subhaanal-lazee sakh-khara lanaa haazaa wa maa kunnaa lahoo muqrineen, wa innaa ilaa Rabbinaa lamunqaliboon.',
    englishTranslation: 'Glory be to Him who has placed this transport at our service, whereas we could not have accomplished this by ourselves. And truly, unto our Lord is our eventual return.',
    urduTranslation: 'پاک ہے وہ ذات جس نے ہمارے لیے اس سواری کو تابع کیا حالانکہ ہم اسے قابو میں لانے والے نہ تھے، اور بے شک ہم اپنے رب ہی کی طرف لوٹنے والے ہیں۔',
    context: 'Recited upon boarding a vehicle, car, plane, train, or mount.',
    reference: 'Surah Az-Zukhruf 43:13-14; Sahih Muslim 1342; Hisn al-Muslim 208',
  },

  // 4. Home & Family
  {
    id: 'dua-home-enter',
    category: 'Home & Family',
    categoryArabic: 'المنزل والأسرة',
    title: 'Upon Entering the Home',
    arabicTitle: 'دعاء دخول المنزل',
    arabicText: 'بِسْمِ اللهِ وَلَجْنَا، وَبِسْمِ اللهِ خَرَجْنَا، وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillaahi walajnaa, wa bismillaahi kharajnaa, wa \'alaa Rabbinaa tawakkalnaa.',
    englishTranslation: 'In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.',
    urduTranslation: 'اللہ کے نام کے ساتھ ہم داخل ہوئے، اور اللہ ہی کے نام کے ساتھ ہم نکلے، اور اپنے رب پر ہی ہم نے بھروسہ کیا۔',
    context: 'Recited when stepping through the threshold of one\'s home, followed by greeting the household with Salam.',
    reference: 'Sunan Abi Dawud 5096; Hisn al-Muslim 20',
  },
  {
    id: 'dua-home-exit',
    category: 'Home & Family',
    categoryArabic: 'المنزل والأسرة',
    title: 'Upon Leaving the Home',
    arabicTitle: 'دعاء الخروج من المنزل',
    arabicText: 'بِسْمِ اللهِ، تَوَكَّلْتُ عَلَى اللهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ',
    transliteration: 'Bismillaahi, tawakkaltu \'alal-laah, wa laa hawla wa laa quwwata illaa billaah.',
    englishTranslation: 'In the name of Allah, I place my trust in Allah; there is no power or might except with Allah.',
    urduTranslation: 'اللہ کے نام کے ساتھ، میں نے اللہ پر بھروسہ کیا، اور گناہ سے بچنے اور نیکی کرنے کی طاقت اللہ کی توفیق کے بغیر نہیں۔',
    context: 'Recited upon departing the home; angels respond: "You are guided, defended and protected."',
    reference: 'Sunan Abi Dawud 5095; Jami` at-Tirmidhi 3426; Hisn al-Muslim 16',
  },

  // 5. Sleep & Waking
  {
    id: 'dua-sleep-before',
    category: 'Sleep & Waking',
    categoryArabic: 'النوم والاستيقاظ',
    title: 'Before Going to Sleep',
    arabicTitle: 'دعاء النوم',
    arabicText: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismikallaahumma amootu wa ahyaa.',
    englishTranslation: 'In Your name, O Allah, I die and I live.',
    urduTranslation: 'اے اللہ! تیرے نام کے ساتھ ہی میں مرتا (سوتا) ہوں اور جیتا (جاگتا) ہوں۔',
    context: 'Recited as one lies down on the right side in bed.',
    reference: 'Sahih al-Bukhari 6312; Sahih Muslim 2711; Hisn al-Muslim 100',
  },
  {
    id: 'dua-sleep-wake',
    category: 'Sleep & Waking',
    categoryArabic: 'النوم والاستيقاظ',
    title: 'Upon Awakening from Sleep',
    arabicTitle: 'دعاء الاستيقاظ من النوم',
    arabicText: 'الْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Al-hamdu lillaahil-lazee ahyaanaa ba\'da maa amaatanaa wa ilayhin-nushoor.',
    englishTranslation: 'All praise is for Allah who gave us life after having caused us to die, and unto Him is the resurrection.',
    urduTranslation: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں موت (نیند) کے بعد زندگی بخشی اور اسی کی طرف سب کو اٹھ کر جانا ہے۔',
    context: 'First words uttered upon waking up in the morning.',
    reference: 'Sahih al-Bukhari 6312; Sahih Muslim 2711; Hisn al-Muslim 1',
  },

  // 6. Mosque & Prayer
  {
    id: 'dua-mosque-enter',
    category: 'Mosque & Prayer',
    categoryArabic: 'المسجد والصلاة',
    title: 'Entering the Mosque',
    arabicTitle: 'دعاء دخول المسجد',
    arabicText: 'اللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allaahummaf-tah lee abwaaba rahmatik.',
    englishTranslation: 'O Allah, open for me the gates of Your mercy.',
    urduTranslation: 'اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔',
    context: 'Recited stepping with the right foot into the Masjid.',
    reference: 'Sahih Muslim 713; Hisn al-Muslim 22',
  },
  {
    id: 'dua-mosque-exit',
    category: 'Mosque & Prayer',
    categoryArabic: 'المسجد والصلاة',
    title: 'Leaving the Mosque',
    arabicTitle: 'دعاء الخروج من المسجد',
    arabicText: 'اللّٰهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allaahumma innee as\'aluka min fadlik.',
    englishTranslation: 'O Allah, truly I ask You of Your bounty.',
    urduTranslation: 'اے اللہ! میں تجھ سے تیرے فضل کا سوال کرتا ہوں۔',
    context: 'Recited stepping with the left foot out of the Masjid.',
    reference: 'Sahih Muslim 713; Hisn al-Muslim 23',
  },

  // 7. Forgiveness & Repentance
  {
    id: 'dua-sayyidul-istighfar',
    category: 'Forgiveness & Repentance',
    categoryArabic: 'الاستغفار والتوبة',
    title: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
    arabicTitle: 'سيد الاستغفار',
    arabicText: 'اللّٰهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allaahumma Anta Rabbee laa ilaaha illaa Anta, khalaqtanee wa ana \'abduk, wa ana \'alaa \'ahdika wa wa\'dika mastata\'t, a\'oozu bika min sharri maa sana\'t, aboo\'u laka bini\'matika \'alayya, wa aboo\'u bizambee, faghfir lee fa-innahoo laa yaghfiruz-zunooba illaa Ant.',
    englishTranslation: 'O Allah! You are my Lord; there is none worthy of worship except You. You created me and I am Your servant, and I uphold Your covenant and promise as much as I am able. I seek refuge in You from the evil of what I have done. I acknowledge before You Your blessing upon me, and I confess my sin to You, so forgive me, for indeed none forgives sins except You.',
    urduTranslation: 'اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی استطاعت کے مطابق تیرے عہد اور وعدے پر قائم ہوں، میں اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، میں اپنے اوپر تیری نعمت کا اعتراف کرتا ہوں اور اپنے گناہ کا اقرار کرتا ہوں، پس مجھے بخش دے، کیوں کہ تیرے سوا گناہوں کو کوئی نہیں بخش سکتا۔',
    context: 'The greatest supplication for forgiveness. Prophet Muhammad (PBUH) stated whoever recites it with conviction by day and dies will be among the people of Paradise.',
    reference: 'Sahih al-Bukhari 6306; Hisn al-Muslim 79',
  },

  // 8. Protection & Refuge
  {
    id: 'dua-protection-evil',
    category: 'Protection & Refuge',
    categoryArabic: 'الحفظ والتحصين',
    title: 'Comprehensive Protection from Harm',
    arabicTitle: 'دعاء الحماية من كل شر وضر',
    arabicText: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ',
    transliteration: 'Bismillaahil-lazee laa yadurru ma\'as-mihee shay\'un fil-ardi wa laa fis-samaaa\'i wa Huwas-Samee\'ul-\'Aleem.',
    englishTranslation: 'In the name of Allah, with whose Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.',
    urduTranslation: 'اللہ کے نام سے جس کے نام کی برکت سے زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی اور وہی سب کچھ سننے والا، جاننے والا ہے۔',
    context: 'Recited 3 times every morning and evening for complete divine protection from unexpected calamity.',
    reference: 'Sunan Abi Dawud 5088; Jami` at-Tirmidhi 3388; Hisn al-Muslim 86',
  },

  // 9. Health & Healing
  {
    id: 'dua-healing-pain',
    category: 'Health & Healing',
    categoryArabic: 'المرض والصحة',
    title: 'Supplication for Relief from Physical Pain',
    arabicTitle: 'دعاء عند الإحساس بالألم',
    arabicText: 'بِسْمِ اللهِ (ثَلَاثًا)، أَعُوذُ بِاللهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (سَبْعَ مَرَّاتٍ)',
    transliteration: 'Bismillaah (3 times), A\'oozu billaahi wa qudratihee min sharri maa ajidu wa uhaazir (7 times).',
    englishTranslation: 'In the name of Allah (say 3 times). I seek refuge in Allah and in His power from the evil of what I find and what I fear (say 7 times).',
    urduTranslation: 'اللہ کے نام کے ساتھ (۳ بار)۔ میں اللہ کی اور اس کی قدرت کی پناہ مانگتا ہوں اس تکلیف کے شر سے جو میں محسوس کرتا ہوں اور جس سے ڈرتا ہوں (۷ بار)۔',
    context: 'Place your hand on the spot where you feel pain in your body and recite.',
    reference: 'Sahih Muslim 2202; Hisn al-Muslim 243',
  },

  // 10. Gratitude & Praise
  {
    id: 'dua-gratitude-parents',
    category: 'Gratitude & Praise',
    categoryArabic: 'الحمد والشكر',
    title: 'Quranic Supplication for Parents',
    arabicTitle: 'دعاء للوالدين من القرآن الكريم',
    arabicText: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-hamhumaa kamaa rabbayaanee sagheeraa.',
    englishTranslation: 'My Lord, have mercy upon them both even as they nourished and cared for me when I was small.',
    urduTranslation: 'اے میرے رب! ان دونوں (والدین) پر رحم فرما جس طرح انہوں نے بچپن میں مجھے پالا اور پرورش کی۔',
    context: 'Supplication of filial piety and lifelong gratitude commanded by the Almighty.',
    reference: 'Surah Al-Isra 17:24',
  },
];
