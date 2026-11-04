import type { CategoryId } from "./types";

/** Interface text. Story text comes from the server already written in the chosen language. */
export interface UIStrings {
  locale: string; // for dates
  greeting: (weekday: string) => string;
  country: string;
  language: string;
  unfolded: string;
  quiz: string;
  right: string;
  allSkies: string;
  categories: Record<CategoryId, string>;
  empty: string;
  colophon: string;
  loading: string;
  folding: (country: string, lang: string) => string;
  loadError: string;
  sampleNote: string;
  grownUp: string;
  kid: string;
  readingLevel: string;
  whyMatters: string;
  quickCheck: string;
  nailed: string;
  close: (answer: string) => string;
  fullStory: (source: string) => string;
  read: string;
  foldBack: string;
  prev: string;
  next: string;
}

const en: UIStrings = {
  locale: "en-US",
  greeting: (d) => `Morning! It's ${d}, and a fresh batch of planes just landed. Tap one to unfold it.`,
  country: "Country",
  language: "Language",
  unfolded: "planes unfolded",
  quiz: "Quiz",
  right: "right",
  allSkies: "All skies",
  categories: {
    nation: "Home Front", world: "Around the World", business: "Money Matters",
    technology: "Tech Talk", science: "Science Snacks", sports: "Game Time",
  },
  empty: "No planes in this section today. Try another sky.",
  colophon: "Summaries are written by AI from each source article. Tap through to read the original.",
  loading: "Planes on approach…",
  folding: (c, l) => `Folding fresh planes for ${c} in ${l}… The first visit of the day can take up to a minute.`,
  loadError: "These planes didn't make it. Try again in a little while.",
  sampleNote: "Sample flight: these are made-up stories (in English) so you can try the app. Start the server to get today's real headlines.",
  grownUp: "Grown-up",
  kid: "Explain like I'm 10",
  readingLevel: "Reading level",
  whyMatters: "Why it matters to you",
  quickCheck: "Quick check:",
  nailed: "Nailed the landing.",
  close: (a) => `Close! It was “${a}”.`,
  fullStory: (s) => `Full story at ${s} ↗`,
  read: "Read",
  foldBack: "Fold it back up",
  prev: "Previous plane",
  next: "Next plane",
};

const hi: UIStrings = {
  locale: "hi-IN",
  greeting: (d) => `सुप्रभात! आज ${d} है, और ताज़ा कागज़ी हवाई जहाज़ अभी उतरे हैं। किसी एक को खोलने के लिए टैप करें।`,
  country: "देश",
  language: "भाषा",
  unfolded: "हवाई जहाज़ खोले",
  quiz: "क्विज़",
  right: "सही",
  allSkies: "सारे आसमान",
  categories: {
    nation: "देश की खबरें", world: "दुनिया भर से", business: "पैसों की बात",
    technology: "टेक की बातें", science: "विज्ञान की झलक", sports: "खेल का समय",
  },
  empty: "आज इस हिस्से में कोई हवाई जहाज़ नहीं। दूसरा आसमान आज़माएँ।",
  colophon: "ये सारांश AI ने हर मूल लेख से लिखे हैं। असली खबर पढ़ने के लिए टैप करें।",
  loading: "हवाई जहाज़ उतर रहे हैं…",
  folding: (c, l) => `${c} के लिए ${l} में ताज़ा हवाई जहाज़ बना रहे हैं… दिन की पहली बार में एक मिनट तक लग सकता है।`,
  loadError: "ये हवाई जहाज़ नहीं पहुँचे। थोड़ी देर बाद फिर कोशिश करें।",
  sampleNote: "नमूना उड़ान: ऐप आज़माने के लिए ये काल्पनिक कहानियाँ हैं (अंग्रेज़ी में)। असली खबरों के लिए सर्वर चालू करें।",
  grownUp: "बड़ों के लिए",
  kid: "10 साल के बच्चे जैसा समझाओ",
  readingLevel: "पढ़ने का स्तर",
  whyMatters: "यह आपके लिए क्यों मायने रखता है",
  quickCheck: "छोटा सवाल:",
  nailed: "बिल्कुल सही लैंडिंग!",
  close: (a) => `करीब थे! सही जवाब “${a}” था।`,
  fullStory: (s) => `पूरी खबर ${s} पर ↗`,
  read: "पढ़ा",
  foldBack: "वापस मोड़ें",
  prev: "पिछला हवाई जहाज़",
  next: "अगला हवाई जहाज़",
};

const te: UIStrings = {
  locale: "te-IN",
  greeting: (d) => `శుభోదయం! ఈరోజు ${d}. కొత్త పేపర్ విమానాలు ఇప్పుడే వచ్చాయి. ఒకదాన్ని తెరవడానికి నొక్కండి.`,
  country: "దేశం",
  language: "భాష",
  unfolded: "విమానాలు తెరిచారు",
  quiz: "క్విజ్",
  right: "సరైనవి",
  allSkies: "అన్ని ఆకాశాలు",
  categories: {
    nation: "దేశ వార్తలు", world: "ప్రపంచం చుట్టూ", business: "డబ్బు విషయాలు",
    technology: "టెక్ కబుర్లు", science: "సైన్స్ విశేషాలు", sports: "ఆటల సమయం",
  },
  empty: "ఈ విభాగంలో ఈరోజు విమానాలు లేవు. మరో ఆకాశం ప్రయత్నించండి.",
  colophon: "ఈ సారాంశాలను AI ప్రతి మూల కథనం నుండి రాసింది. అసలు కథనం చదవడానికి నొక్కండి.",
  loading: "విమానాలు దిగుతున్నాయి…",
  folding: (c, l) => `${c} కోసం ${l}లో కొత్త విమానాలు మడుస్తున్నాం… రోజులో మొదటిసారి ఒక నిమిషం వరకు పట్టవచ్చు.`,
  loadError: "ఈ విమానాలు రాలేదు. కాసేపటి తర్వాత మళ్ళీ ప్రయత్నించండి.",
  sampleNote: "నమూనా ప్రయాణం: యాప్ ప్రయత్నించడానికి ఇవి కల్పిత కథలు (ఇంగ్లీష్‌లో). నిజమైన వార్తల కోసం సర్వర్ ప్రారంభించండి.",
  grownUp: "పెద్దవాళ్లకు",
  kid: "10 ఏళ్ల పిల్లలకు చెప్పినట్టు",
  readingLevel: "చదివే స్థాయి",
  whyMatters: "మీకు ఇది ఎందుకు ముఖ్యం",
  quickCheck: "చిన్న ప్రశ్న:",
  nailed: "సరైన ల్యాండింగ్!",
  close: (a) => `దగ్గరగా వచ్చారు! సమాధానం “${a}”.`,
  fullStory: (s) => `${s}లో పూర్తి కథనం ↗`,
  read: "చదివారు",
  foldBack: "తిరిగి మడవండి",
  prev: "మునుపటి విమానం",
  next: "తదుపరి విమానం",
};

const es: UIStrings = {
  locale: "es-ES",
  greeting: (d) => `¡Buenos días! Hoy es ${d} y acaba de aterrizar una tanda de aviones de papel. Toca uno para desplegarlo.`,
  country: "País",
  language: "Idioma",
  unfolded: "aviones abiertos",
  quiz: "Quiz",
  right: "aciertos",
  allSkies: "Todos los cielos",
  categories: {
    nation: "En casa", world: "Por el mundo", business: "Dinero",
    technology: "Tecnología", science: "Ciencia", sports: "Deportes",
  },
  empty: "Hoy no hay aviones en esta sección. Prueba otro cielo.",
  colophon: "Los resúmenes los escribe una IA a partir de cada artículo. Toca para leer el original.",
  loading: "Aviones en aproximación…",
  folding: (c, l) => `Doblando aviones nuevos para ${c} en ${l}… La primera visita del día puede tardar hasta un minuto.`,
  loadError: "Estos aviones no llegaron. Inténtalo de nuevo en un rato.",
  sampleNote: "Vuelo de prueba: son historias inventadas (en inglés) para probar la app. Inicia el servidor para ver las noticias reales.",
  grownUp: "Adulto",
  kid: "Explícamelo como si tuviera 10",
  readingLevel: "Nivel de lectura",
  whyMatters: "Por qué te importa",
  quickCheck: "Pregunta rápida:",
  nailed: "¡Aterrizaje perfecto!",
  close: (a) => `¡Casi! Era “${a}”.`,
  fullStory: (s) => `Noticia completa en ${s} ↗`,
  read: "Leído",
  foldBack: "Volver a doblar",
  prev: "Avión anterior",
  next: "Avión siguiente",
};

const fr: UIStrings = {
  locale: "fr-FR",
  greeting: (d) => `Bonjour ! Nous sommes ${d}, et une nouvelle volée d'avions en papier vient d'atterrir. Touchez-en un pour le déplier.`,
  country: "Pays",
  language: "Langue",
  unfolded: "avions dépliés",
  quiz: "Quiz",
  right: "bonnes réponses",
  allSkies: "Tous les ciels",
  categories: {
    nation: "Chez nous", world: "Autour du monde", business: "Argent",
    technology: "Tech", science: "Sciences", sports: "Sport",
  },
  empty: "Aucun avion dans cette rubrique aujourd'hui. Essayez un autre ciel.",
  colophon: "Les résumés sont rédigés par une IA à partir de chaque article. Touchez pour lire l'original.",
  loading: "Avions en approche…",
  folding: (c, l) => `On plie de nouveaux avions pour ${c} en ${l}… La première visite de la journée peut prendre une minute.`,
  loadError: "Ces avions ne sont pas arrivés. Réessayez dans un moment.",
  sampleNote: "Vol d'essai : histoires inventées (en anglais) pour tester l'app. Lancez le serveur pour les vraies infos du jour.",
  grownUp: "Adulte",
  kid: "Explique comme à un enfant de 10 ans",
  readingLevel: "Niveau de lecture",
  whyMatters: "Pourquoi ça vous concerne",
  quickCheck: "Petite question :",
  nailed: "Atterrissage parfait !",
  close: (a) => `Presque ! C'était « ${a} ».`,
  fullStory: (s) => `Article complet sur ${s} ↗`,
  read: "Lu",
  foldBack: "Replier",
  prev: "Avion précédent",
  next: "Avion suivant",
};

const TABLE: Record<string, UIStrings> = { en, hi, te, es, fr };

/** Interface strings for a language; languages without a table (e.g. ta, de) use English UI. */
export const ui = (lang: string): UIStrings => TABLE[lang] ?? en;
