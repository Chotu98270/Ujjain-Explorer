export interface UjjainPlace {
  id: number;
  name: string;
  name_mr?: string | null;
  emoji: string;
  category: string;
  rating: number;
  distance: string;
  latitude: number;
  longitude: number;
  image?: string;
  photos?: string[];
  entryFee: string;
  estYear: string;
  visitTime: string;
  hours: string;
  phone: string;
  address: string;
  accessible: boolean;
  guidedTours: boolean;
  tag: string;
  tagColor: string;
  bgColor: string;
  description: string;
  description_mr?: string | null;
  darshanTimings?: string;
  dressCode?: string;
  significance?: string;
  rituals?: string;
  bestTimeToVisit?: string;
  isSaved?: boolean;
}

export const UJJAIN_PLACES: UjjainPlace[] = [
  {
    id: 1,
    name: "Shri Mahakaleshwar Jyotirlinga",
    name_mr: "श्री महाकालेश्वर ज्योतिर्लिंग",
    emoji: "🕉️",
    category: "Temple",
    rating: 4.9,
    distance: "0.8 km",
    latitude: 23.1828,
    longitude: 75.7682,
    image: "/images/places/mahakaleshwar.jpg",
    photos: ["/images/places/mahakaleshwar.jpg"],
    entryFee: "Free (Special VIP queue ₹250)",
    estYear: "Ancient (Pre-historic)",
    visitTime: "2–3h",
    hours: "4:00 AM – 11:00 PM (Daily)",
    phone: "+91 734 255 0010",
    address: "Mahakal Marg, Jaisinghpura, Ujjain",
    accessible: true,
    guidedTours: true,
    tag: "Must Visit · Jyotirlinga",
    tagColor: "saffron",
    bgColor: "#FDF2EC",
    description: "One of the 12 sacred Jyotirlingas of Lord Shiva. The presiding deity is Dakshinmukhi (south-facing), unique among all Jyotirlingas. World-renowned for its mystical 4:00 AM Bhasma Aarti and the sprawling Mahakal Lok Corridor.",
    description_mr: "भगवान शिव के १२ द्वादश ज्योतिर्लिंगों में से एक अत्यंत पावन धाम। यह एकमात्र दक्षिणमुखी ज्योतिर्लिंग है। यहाँ की प्रातःकालीन भस्म आरती और भव्य महाकाल लोक कॉरिडोर विश्वभर में प्रसिद्ध हैं।"
  },
  {
    id: 2,
    name: "Kal Bhairav Temple",
    name_mr: "काल भैरव मंदिर",
    emoji: "🔱",
    category: "Temple",
    rating: 4.8,
    distance: "4.5 km",
    latitude: 23.2104,
    longitude: 75.7876,
    image: "/images/places/kal_bhairav.jpg",
    photos: ["/images/places/kal_bhairav.jpg"],
    entryFee: "Free",
    estYear: "9th Century AD",
    visitTime: "1–2h",
    hours: "5:00 AM – 10:00 PM (Daily)",
    phone: "+91 734 255 1200",
    address: "Jail Road, Bhairavgarh, Ujjain",
    accessible: true,
    guidedTours: false,
    tag: "Guardian Deity",
    tagColor: "amber",
    bgColor: "#FDF6EA",
    description: "Considered the Kotwal (guardian deity) of Ujjain. Situated on the banks of Shipra river, this ancient temple is famous for the age-old tantric ritual where liquor is offered to the deity and visibly consumed.",
    description_mr: "उज्जैन के नगर कोतवाल माने जाने वाले काल भैरव का अति प्राचीन मंदिर। शिप्रा तट के पास स्थित इस मंदिर में भगवान को मदिरा का भोग लगाने की आश्चर्यजनक परंपरा सदियों से चली आ रही है।"
  },
  {
    id: 3,
    name: "Maa Harsiddhi Temple",
    name_mr: "माँ हरसिद्धि माता शक्तिपीठ",
    emoji: "🛕",
    category: "Temple",
    rating: 4.8,
    distance: "1.1 km",
    latitude: 23.1812,
    longitude: 75.7663,
    image: "/images/places/harsiddhi.jpg",
    photos: ["/images/places/harsiddhi.jpg"],
    entryFee: "Free",
    estYear: "Ancient / Maratha Period",
    visitTime: "1h",
    hours: "5:00 AM – 11:00 PM (Daily)",
    phone: "+91 734 255 3344",
    address: "Harsiddhi Marg, Near Mahakal Lok, Ujjain",
    accessible: true,
    guidedTours: false,
    tag: "Shaktipeeth",
    tagColor: "terracotta",
    bgColor: "#F8ECEC",
    description: "One of the 51 sacred Shaktipeeths where the elbow of Goddess Sati fell. Built by Emperor Vikramaditya, the temple courtyard features two towering monolithic 50-foot lamp pillars (Deepstambhas) lit during evening aarti.",
    description_mr: "५१ पावन शक्तिपीठों में से एक, जहाँ माता सती की कोहनी गिरी थी। राजा विक्रमादित्य की आराध्य देवी के इस मंदिर में स्थित दो गगनचुंबी दीपस्तंभ संध्या आरती में हजारों दीपों से जगमगा उठते हैं।"
  },
  {
    id: 4,
    name: "Ram Ghat & Shipra River",
    name_mr: "राम घाट एवं शिप्रा महाआरती",
    emoji: "🌊",
    category: "Nature",
    rating: 4.7,
    distance: "1.4 km",
    latitude: 23.1843,
    longitude: 75.7601,
    image: "/images/places/ram_ghat.jpg",
    photos: ["/images/places/ram_ghat.jpg"],
    entryFee: "Free (Boating ₹100)",
    estYear: "Ancient",
    visitTime: "1–2h",
    hours: "Open 24 Hours (Aarti: 7:00 PM)",
    phone: "—",
    address: "Ram Ghat, Shipra River Bank, Ujjain",
    accessible: true,
    guidedTours: false,
    tag: "Simhastha Ghat",
    tagColor: "indigo",
    bgColor: "#E8F3F7",
    description: "The ancient spiritual riverbank of Ujjain and the primary bathing ghat for the Simhastha Kumbh Mahaparva. Pilgrims take holy dips and gather at sunset for the grand Shipra Maha Aarti and floating diya ceremonies.",
    description_mr: "पवित्र मोक्षदायिनी शिप्रा नदी का सबसे प्रमुख व प्राचीन घाट। यहाँ सिंहस्थ कुंभ का मुख्य शाही स्नान आयोजित होता है। शाम को होने वाली शिप्रा महाआरती और दीपदान का दृश्य अत्यंत दिव्य होता है।"
  },
  {
    id: 5,
    name: "Vedh Shala (Jantar Mantar)",
    name_mr: "वेधशाला (जंतर मंतर)",
    emoji: "🔭",
    category: "Heritage",
    rating: 4.5,
    distance: "2.3 km",
    latitude: 23.1722,
    longitude: 75.7694,
    image: "/images/places/vedh_shala.jpg",
    photos: ["/images/places/vedh_shala.jpg"],
    entryFee: "₹25 (Students ₹10)",
    estYear: "1719 AD",
    visitTime: "1–2h",
    hours: "9:00 AM – 6:00 PM (Daily)",
    phone: "+91 734 255 1980",
    address: "Chintaman Road, Jaisinghpura, Ujjain",
    accessible: true,
    guidedTours: true,
    tag: "Ancient Astronomy",
    tagColor: "terracotta",
    bgColor: "#F8ECEC",
    description: "Constructed in 1719 by Maharaja Sawai Jai Singh of Jaipur. Ujjain was historically recognized as India's Greenwich (the prime meridian of ancient Hindu astronomy). The observatory still accurately calculates planetary positions and solar time.",
    description_mr: "जयपुर के महाराजा सवाई जय सिंह द्वारा १७१९ में निर्मित भारत की सबसे प्राचीन वेधशाला। उज्जैन को भारतीय खगोल गणनाओं की शून्य रेखा (Prime Meridian) माना जाता था।"
  },
  {
    id: 6,
    name: "Maharshi Sandipani Ashram",
    name_mr: "महर्षि सांदीपनि आश्रम",
    emoji: "📜",
    category: "Wellness",
    rating: 4.6,
    distance: "5.2 km",
    latitude: 23.2125,
    longitude: 75.7928,
    image: "/images/places/sandipani.jpg",
    photos: ["/images/places/sandipani.jpg"],
    entryFee: "Free",
    estYear: "Ancient (Dvapara Yuga)",
    visitTime: "1h",
    hours: "6:00 AM – 8:00 PM (Daily)",
    phone: "+91 734 258 0212",
    address: "Mangalnath Marg, Ujjain",
    accessible: true,
    guidedTours: true,
    tag: "Krishna Gurukul",
    tagColor: "sage",
    bgColor: "#EBF5EE",
    description: "The legendary Vedic Gurukul where Lord Krishna, his brother Balram, and friend Sudama stayed to learn 64 arts (Kalas) and 14 Vidhyas in 64 days. Contains the ancient Gomti Kund and footprints of Lord Krishna.",
    description_mr: "वह पवित्र गुरुकुल जहाँ द्वापर युग में भगवान श्री कृष्ण, बलराम और सुदामा ने महर्षि सांदीपनि से ६४ कलाओं की शिक्षा प्राप्त की थी। यहाँ ऐतिहासिक गोमती कुंड स्थित है।"
  },
  {
    id: 7,
    name: "Mangalnath Temple",
    name_mr: "मंगलनाथ मंदिर",
    emoji: "🪐",
    category: "Temple",
    rating: 4.7,
    distance: "6.0 km",
    latitude: 23.2173,
    longitude: 75.7745,
    image: "/images/places/mangalnath.jpg",
    photos: ["/images/places/mangalnath.jpg"],
    entryFee: "Free",
    estYear: "Ancient",
    visitTime: "1–2h",
    hours: "5:00 AM – 9:00 PM (Daily)",
    phone: "+91 734 258 0150",
    address: "Mangalnath Marg, Near Shipra Bank, Ujjain",
    accessible: true,
    guidedTours: false,
    tag: "Birthplace of Mars",
    tagColor: "amber",
    bgColor: "#FDF6EA",
    description: "According to the Matsya Purana, Mangalnath is the geographical birthplace of planet Mars (Bhauma / Mangal Graha). Perched atop a hill overlooking the Shipra river, it is India’s foremost pilgrimage for Mangal Dosh Nivaran poojas.",
    description_mr: "मत्स्य पुराण के अनुसार यह पावन स्थल मंगल ग्रह की जन्मभूमि माना जाता है। यहाँ शिप्रा नदी के शांत तट पर श्रद्धालु मंगल दोष निवारण और भात पूजा हेतु देश-विदेश से आते हैं।"
  },
  {
    id: 8,
    name: "Bhartrihari Caves & Gadkalika",
    name_mr: "भर्तृहरि गुफा एवं माँ गढ़कालिका",
    emoji: "⛰️",
    category: "Heritage",
    rating: 4.5,
    distance: "4.8 km",
    latitude: 23.2081,
    longitude: 75.7869,
    image: "/images/places/bhartrihari.jpg",
    photos: ["/images/places/bhartrihari.jpg"],
    entryFee: "Free",
    estYear: "1st Century BC",
    visitTime: "1–1.5h",
    hours: "6:00 AM – 8:00 PM (Daily)",
    phone: "—",
    address: "Near Gadhkalika Temple, Shipra Bank, Ujjain",
    accessible: false,
    guidedTours: false,
    tag: "Yogi Tapobhoomi",
    tagColor: "terracotta",
    bgColor: "#F8ECEC",
    description: "Ancient natural caves on the bank of the Shipra where King Bhartrihari, elder brother of Emperor Vikramaditya, renounced his throne and performed deep austerities, authoring the timeless classics Vairagya Shatakam and Shringara Shatakam.",
    description_mr: "राजा विक्रमादित्य के भ्राता राजा भर्तृहरि की पावन तपोस्थली। यहाँ गुफा में बैठकर उन्होंने वैराग्य शतक और नीति शतक की रचना की थी। पास ही महाकवि कालिदास की आराध्य माँ गढ़कालिका का मंदिर है।"
  },
  {
    id: 9,
    name: "Chintaman Ganesh Temple",
    name_mr: "चिंतामन गणेश मंदिर",
    emoji: "🐘",
    category: "Temple",
    rating: 4.7,
    distance: "6.5 km",
    latitude: 23.1607,
    longitude: 75.7278,
    image: "/images/places/chintaman_ganesh.jpg",
    photos: ["/images/places/chintaman_ganesh.jpg"],
    entryFee: "Free",
    estYear: "Paramara / Vikramaditya Period",
    visitTime: "1h",
    hours: "6:00 AM – 9:00 PM (Daily)",
    phone: "+91 734 251 1122",
    address: "Fatehabad Railway Line Road, Ujjain",
    accessible: true,
    guidedTours: false,
    tag: "Ancient Swayambhu",
    tagColor: "amber",
    bgColor: "#FDF6EA",
    description: "The largest and most revered Ganesha shrine in Ujjain. The idols of Chintaman (reliever of worries), Ichhamand (fulfiller of desires), and Siddhivinayak (bestower of success) are enshrined together.",
    description_mr: "उज्जैन का सर्वाधिक लोकप्रिय व प्राचीन गणेश मंदिर। यहाँ चिंतामन, इच्छामन और सिद्धिविनायक तीनों स्वरूप एक साथ विराजमान हैं जो भक्तों की समस्त चिंताओं का निवारण करते हैं।"
  },
  {
    id: 10,
    name: "Tower Chowk & Sarafa Food Strip",
    name_mr: "टॉवर चौक एवं सराफा मालवी स्वाद",
    emoji: "🍲",
    category: "Food",
    rating: 4.8,
    distance: "1.8 km",
    latitude: 23.1818,
    longitude: 75.7788,
    image: "/images/places/sarafa_bazaar.jpg",
    photos: ["/images/places/sarafa_bazaar.jpg"],
    entryFee: "—",
    estYear: "Historic Market",
    visitTime: "1–2h",
    hours: "7:00 AM – 11:30 PM (Daily)",
    phone: "—",
    address: "Freeganj & Sarafa Bazaar, Ujjain",
    accessible: true,
    guidedTours: false,
    tag: "Malwi Delicacies",
    tagColor: "amber",
    bgColor: "#FDF6EA",
    description: "The vibrant culinary center of Ujjain. Indulge in authentic Malwi Dal Bafla with pure ghee, piping hot Ujjaini Poha Jalebi, spiced Bhutta Kees, Garadu chaat, and rich Kesar Rabdi.",
    description_mr: "उज्जैन का प्रसिद्ध खान-पान केंद्र। यहाँ शुद्ध घी का पारंपरिक मालवी दाल-बाफला, गरमा-गरम पोहा-जलेबी, भुट्टे का कीस, गराडू और मलाईदार केसर रबड़ी का बेजोड़ स्वाद मिलता है।"
  },
  {
    id: 11,
    name: "Kaliadeh Palace & Surya Kunda",
    name_mr: "कालियादेह महल एवं सूर्य कुंड",
    emoji: "🏰",
    category: "Heritage",
    rating: 4.4,
    distance: "8.5 km",
    latitude: 23.2592,
    longitude: 75.7891,
    image: "/images/places/kaliadeh_palace.jpg",
    photos: ["/images/places/kaliadeh_palace.jpg"],
    entryFee: "Free",
    estYear: "1458 AD",
    visitTime: "1–2h",
    hours: "8:00 AM – 6:30 PM (Daily)",
    phone: "—",
    address: "Island on River Shipra, Ujjain Outskirts",
    accessible: false,
    guidedTours: false,
    tag: "River Island Palace",
    tagColor: "terracotta",
    bgColor: "#F8ECEC",
    description: "A serene historic palace situated on an island in the Shipra river. Constructed in 1458 AD by the Sultan of Mandu, it features Persian architectural arches, natural waterways, and the ancient Sun Temple (Surya Kunda).",
    description_mr: "शिप्रा नदी के बीच स्थित १४५८ ईस्वी का सुंदर ऐतिहासिक जलमहल। यहाँ प्राचीन सूर्य मंदिर और नदी की प्राकृतिक जलधाराओं से निर्मित जलकुंड स्थित हैं।"
  },
  {
    id: 12,
    name: "Vikram Kirti Mandir & Scindia Museum",
    name_mr: "विक्रम कीर्ति मंदिर एवं पुरातत्व संग्रहालय",
    emoji: "🏛️",
    category: "Heritage",
    rating: 4.6,
    distance: "1.9 km",
    latitude: 23.1831,
    longitude: 75.7725,
    image: "/images/places/vikram_kirti.jpg",
    photos: ["/images/places/vikram_kirti.jpg"],
    entryFee: "₹20",
    estYear: "1965 AD",
    visitTime: "1–2h",
    hours: "10:30 AM – 5:30 PM (Tue–Sun)",
    phone: "+91 734 251 5440",
    address: "Kothi Road, Near Vikram University, Ujjain",
    accessible: true,
    guidedTours: true,
    tag: "Museum & History",
    tagColor: "terracotta",
    bgColor: "#F8ECEC",
    description: "Erected to celebrate the glory of legendary Emperor Vikramaditya of Ujjain. Houses the Scindia Oriental Research Institute with over 18,000 rare palm-leaf and bark manuscripts, ancient coins, and stone sculptures.",
    description_mr: "चक्रवर्ती सम्राट विक्रमादित्य के गौरवशाली इतिहास को समर्पित संग्रहालय। यहाँ १८,००० से अधिक दुर्लभ हस्तलिखित ताड़पत्र पाण्डुलिपियाँ, प्राचीन सिक्के और मूर्तियां सुरक्षित हैं।"
  }
];

export interface UjjainEventItem {
  id: number;
  date: string;
  name: string;
  artist?: string;
  category: string;
  badge: string;
  venue: string;
  time: string;
  ticket: string;
  desc: string;
  color: string;
  daysLeft: number;
  timeframe: 'this_month' | 'next_month' | 'upcoming';
  monthName: string;
  year: number;
  countdown: string;
}

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function calculateDateMeta(baseDate: Date, targetDate: Date) {
  const day = String(targetDate.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[targetDate.getMonth()];
  const year = targetDate.getFullYear();
  const fullMonth = FULL_MONTH_NAMES[targetDate.getMonth()];

  const diffTime = targetDate.getTime() - baseDate.getTime();
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let timeframe: 'this_month' | 'next_month' | 'upcoming' = 'upcoming';
  if (targetDate.getMonth() === baseDate.getMonth() && targetDate.getFullYear() === baseDate.getFullYear()) {
    timeframe = 'this_month';
  } else if (
    (targetDate.getMonth() === (baseDate.getMonth() + 1) % 12) &&
    (targetDate.getFullYear() === baseDate.getFullYear() || (baseDate.getMonth() === 11 && targetDate.getFullYear() === baseDate.getFullYear() + 1))
  ) {
    timeframe = 'next_month';
  }

  let countdown = '';
  if (daysLeft === 0) countdown = 'Today!';
  else if (daysLeft === 1) countdown = 'Tomorrow';
  else if (daysLeft <= 7) countdown = `In ${daysLeft} days`;
  else if (timeframe === 'this_month') countdown = `This Month (${fullMonth})`;
  else if (timeframe === 'next_month') countdown = `Next Month (${fullMonth})`;
  else countdown = `Coming in ${fullMonth} ${year}`;

  return {
    date: `${month} ${day}, ${year}`,
    daysLeft,
    timeframe,
    monthName: fullMonth,
    year,
    countdown
  };
}

function getSeasonalDate(baseDate: Date, targetMonth: number, targetDay: number): Date {
  const year = baseDate.getFullYear();
  let candidate = new Date(year, targetMonth, targetDay);
  if (candidate.getTime() < baseDate.getTime()) {
    candidate = new Date(year + 1, targetMonth, targetDay);
  }
  return candidate;
}

export const getDynamicUjjainEvents = (baseDate: Date = new Date()): UjjainEventItem[] => {
  const createRelativeEvent = (
    id: number,
    daysAhead: number,
    name: string,
    artist: string,
    category: string,
    badge: string,
    venue: string,
    time: string,
    ticket: string,
    desc: string,
    color: string
  ): UjjainEventItem => {
    const targetDate = new Date(baseDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    const meta = calculateDateMeta(baseDate, targetDate);
    return {
      id,
      name,
      artist,
      category,
      badge,
      venue,
      time,
      ticket,
      desc,
      color,
      ...meta
    };
  };

  const createSeasonalEvent = (
    id: number,
    targetMonth: number,
    targetDay: number,
    name: string,
    artist: string,
    category: string,
    badge: string,
    venue: string,
    time: string,
    ticket: string,
    desc: string,
    color: string
  ): UjjainEventItem => {
    const targetDate = getSeasonalDate(baseDate, targetMonth, targetDay);
    const meta = calculateDateMeta(baseDate, targetDate);
    return {
      id,
      name,
      artist,
      category,
      badge,
      venue,
      time,
      ticket,
      desc,
      color,
      ...meta
    };
  };

  const eventList: UjjainEventItem[] = [
    createRelativeEvent(
      1,
      8,
      "Hansraj Raghuwanshi (Babaji) - Jai Shri Mahakal Night",
      "Hansraj Raghuwanshi",
      "Celebrity Concert",
      "⚡ LIVE BHAJAN ROCK",
      "Shipra Riverfront Cultural Arena, Ram Ghat, Ujjain",
      "07:30 PM Onwards",
      "Open to All · Free Entry",
      "Youth devotional sensation Hansraj Raghuwanshi singing live by the sacred Shipra River, featuring viral anthems 'Mera Bhola Hai Bhandari' and 'Shiv Kailash'.",
      "amber"
    ),
    createRelativeEvent(
      2,
      14,
      "All India Kalidas Classical Sangeet Samaroh",
      "Pt. Hariprasad Chaurasia & Kaushiki Chakraborty",
      "Classical Concert",
      "🎻 CLASSICAL",
      "Kalidas Sanskrit Academy, Kothi Road, Ujjain",
      "06:00 PM Onwards",
      "Free Cultural Invitation",
      "Sublime jugalbandi of classical bansuri and Indian classical vocals in honor of Mahakavi Kalidas under the starry skies of Avantika.",
      "cyan"
    ),
    createRelativeEvent(
      3,
      26,
      "Kailash Kher & Kailasa - Shivoham Live Tour",
      "Kailash Kher & Kailasa",
      "Celebrity Concert",
      "🕉️ SUFI ROCK",
      "Vikram Kirti Mandir Open Amphitheatre, Ujjain",
      "07:00 PM Onwards",
      "Free Entry / VIP Passes Available",
      "An electrifying night of spiritual euphoria and Sufi-rock celebration dedicated to Lord Shiva and Baba Mahakal by Kailash Kher and band.",
      "saffron"
    ),
    createRelativeEvent(
      4,
      50,
      "Arijit Singh Live Symphony - Ujjain",
      "Arijit Singh",
      "Celebrity Concert",
      "🔥 MEGA CONCERT",
      "Polytechnic Grounds, Dewas Road, Ujjain",
      "06:30 PM Onwards",
      "₹999 onwards · BookMyShow",
      "Bollywood melody king Arijit Singh performing live in Ujjain with a 40-piece grand symphonic orchestra. Experience iconic hits, soulful melodies, and acoustic specials.",
      "indigo"
    ),
    createRelativeEvent(
      5,
      72,
      "Zakir Khan - Live Standup Special",
      "Zakir Khan",
      "Standup Comedy",
      "🎤 COMEDY SPECIAL",
      "Vikram University Golden Jubilee Auditorium, Ujjain",
      "07:00 PM Onwards",
      "₹499 onwards · BookMyShow",
      "India's beloved comedian and storyteller Zakir Khan arrives in Ujjain for an evening of laughter, relatable tales, and heartwarming shayari.",
      "rose"
    ),
    createRelativeEvent(
      6,
      90,
      "B Praak - The Heartbreak & Symphony Arena Tour",
      "B Praak",
      "Celebrity Concert",
      "🎵 LIVE SYMPHONY",
      "Government Engineering College Grounds, Sanwer Road, Ujjain",
      "06:30 PM Onwards",
      "₹799 onwards · Insider.in",
      "National Award-winning powerhouse B Praak live with high-energy orchestral arrangements of Teri Mitti, Filhaal, and Bollywood blockbusters.",
      "terracotta"
    ),
    createRelativeEvent(
      7,
      112,
      "Jubin Nautiyal - Live in Ujjain",
      "Jubin Nautiyal",
      "Celebrity Concert",
      "⭐ CELEBRITY NIGHT",
      "Kothi Palace Grounds, Ujjain",
      "07:00 PM Onwards",
      "₹899 onwards · BookMyShow",
      "Heartfelt romantic and devotional concert featuring Lut Gaye, Raataan Lambiyan, and Shiva stuti in an unforgettable open-air concert.",
      "indigo"
    ),
    createSeasonalEvent(
      8,
      10, // November
      15,
      "Shipra Deepotsav & Kartik Mela",
      "Local Folk & Malwi Troupe",
      "Festival",
      "🪔 KARTIK MELA",
      "Ram Ghat & Narsing Ghat, Ujjain",
      "06:00 PM Onwards",
      "Open Cultural Mela",
      "Illumination of 5 lakh clay lamps across Ram Ghat accompanied by Malwi folk music, crafts, and festive street food.",
      "indigo"
    ),
    createSeasonalEvent(
      9,
      1, // February
      26,
      "Maha Shivratri Mahotsav & Deepotsav",
      "Temple Sangeet Yatris",
      "Festival",
      "✨ DEEPOTSAV",
      "Mahakal Lok & Shipra Ghats, Ujjain",
      "Continuous 44 Hours",
      "Open to All Yatris",
      "44-hour continuous darshan, mega Deepotsav with millions of earthen lamps lighting up the banks of sacred Shipra.",
      "terracotta"
    ),
    createSeasonalEvent(
      10,
      6, // July
      20,
      "Shri Mahakal Shahi Sawari",
      "Traditional Ujjain Nagada & Dhwaj Toli",
      "Festival",
      "🚩 MAHALPALKI",
      "Mahakaleshwar Temple to Ram Ghat",
      "04:00 PM Onwards",
      "Public Pilgrimage",
      "Grand royal palanquin procession of Baba Mahakal through old Ujjain with state police guard of honor and thousands of devotees.",
      "saffron"
    ),
    createSeasonalEvent(
      11,
      3, // April
      22,
      "Simhastha Kumbh Snan",
      "13 Sacred Akharas & Sadhus",
      "Festival",
      "🔱 SIMHASTHA",
      "Shipra River All Ghats, Ujjain",
      "Brahma Muhurat Onwards",
      "Sacred Snan",
      "Holy royal bath of 13 Akharas on the banks of sacred Shipra, the world's largest spiritual gathering in Avantika.",
      "amber"
    )
  ];

  // Always return sorted chronologically by daysLeft
  return eventList.sort((a, b) => a.daysLeft - b.daysLeft);
};

export const UJJAIN_EVENTS = getDynamicUjjainEvents();

export const UJJAIN_ITINERARY = [
  {
    id: 1,
    day: 1,
    label: "Day 1 · Darshan & Ghats",
    userId: 1,
    stops: [
      {
        id: 1,
        time: "05:00 AM",
        name: "Shri Mahakaleshwar Jyotirlinga",
        name_mr: "श्री महाकालेश्वर ज्योतिर्लिंग",
        desc: "Begin your spiritual journey with the divine darshan at the sacred Jyotirlinga.",
        desc_mr: "पवित्र ज्योतिर्लिंग के दर्शन व प्रातःकालीन पूजन के साथ अपनी पावन यात्रा प्रारंभ करें।",
        dotColor: "#D9531E",
        tags: [{ label: "Temple", type: "temple" }],
        done: false,
        order: 0
      },
      {
        id: 2,
        time: "09:30 AM",
        name: "Maa Harsiddhi Temple",
        name_mr: "माँ हरसिद्धि माता शक्तिपीठ",
        desc: "Pay a visit to the celebrated Shaktipeeth with its 50-foot lamp pillars.",
        desc_mr: "माँ हरसिद्धि के दर्शन करें और ५० फीट ऊंचे ऐतिहासिक दीपस्तंभों के दर्शन करें।",
        dotColor: "#9E2A2B",
        tags: [{ label: "Temple", type: "temple" }],
        done: false,
        order: 1
      },
      {
        id: 3,
        time: "12:00 PM",
        name: "Tower Chowk & Sarafa Food Strip",
        name_mr: "टॉवर चौक - मालवी दाल बाफला",
        desc: "Relish authentic Ujjaini Dal Bafla served with pure desi ghee.",
        desc_mr: "शुद्ध देसी घी में बना पारंपरिक मालवी दाल-बाफला और मिष्ठान का आनंद लें।",
        dotColor: "#C88617",
        tags: [{ label: "Food", type: "food" }],
        done: false,
        order: 2
      },
      {
        id: 4,
        time: "06:30 PM",
        name: "Ram Ghat & Shipra River",
        name_mr: "राम घाट एवं शिप्रा महाआरती",
        desc: "Witness the mesmerizing evening Shipra Maha Aarti.",
        desc_mr: "संध्या काल में शिप्रा महाआरती के दिव्य दर्शन करें।",
        dotColor: "#1B4965",
        tags: [{ label: "Nature", type: "nature" }],
        done: false,
        order: 3
      }
    ]
  },
  {
    id: 2,
    day: 2,
    label: "Day 2 · Heritage & Outskirts",
    userId: 1,
    stops: [
      {
        id: 5,
        time: "08:00 AM",
        name: "Kal Bhairav Temple",
        name_mr: "काल भैरव मंदिर",
        desc: "Visit the revered guardian Kotwal of Ujjain.",
        desc_mr: "उज्जैन के नगर कोतवाल काल भैरव के दर्शन करें।",
        dotColor: "#D9531E",
        tags: [{ label: "Temple", type: "temple" }],
        done: false,
        order: 0
      },
      {
        id: 6,
        time: "10:30 AM",
        name: "Maharshi Sandipani Ashram",
        name_mr: "महर्षि सांदीपनि आश्रम",
        desc: "Ancient Gurukul where Lord Krishna learned 64 arts.",
        desc_mr: "भगवान श्री कृष्ण की पावन शिक्षास्थली।",
        dotColor: "#2E6F40",
        tags: [{ label: "Wellness", type: "nature" }],
        done: false,
        order: 1
      }
    ]
  }
];
