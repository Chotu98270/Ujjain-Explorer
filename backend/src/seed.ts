import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const places = [
  // ── TEMPLE & JYOTIRLINGA ──────────────────────────────────
  {
    name: "Shri Mahakaleshwar Jyotirlinga",
    name_mr: "श्री महाकालेश्वर ज्योतिर्लिंग",
    emoji: "🕉️",
    category: "Temple",
    rating: 4.9,
    latitude: 23.1828,
    longitude: 75.7682,
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
    description_mr: "भगवान शिव के १२ द्वादश ज्योतिर्लिंगों में से एक अत्यंत पावन धाम। यह एकमात्र दक्षिणमुखी ज्योतिर्लिंग है। यहाँ की प्रातःकालीन भस्म आरती और भव्य महाकाल लोक कॉरिडोर विश्वभर में प्रसिद्ध हैं।",
    distance: "0.8 km",
  },
  {
    name: "Kal Bhairav Temple",
    name_mr: "काल भैरव मंदिर",
    emoji: "🔱",
    category: "Temple",
    rating: 4.8,
    latitude: 23.2104,
    longitude: 75.7876,
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
    description_mr: "उज्जैन के नगर कोतवाल माने जाने वाले काल भैरव का अति प्राचीन मंदिर। शिप्रा तट के पास स्थित इस मंदिर में भगवान को मदिरा का भोग लगाने की आश्चर्यजनक परंपरा सदियों से चली आ रही है।",
    distance: "4.5 km",
  },
  {
    name: "Maa Harsiddhi Temple",
    name_mr: "माँ हरसिद्धि माता शक्तिपीठ",
    emoji: "🛕",
    category: "Temple",
    rating: 4.8,
    latitude: 23.1812,
    longitude: 75.7663,
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
    description_mr: "५१ पावन शक्तिपीठों में से एक, जहाँ माता सती की कोहनी गिरी थी। राजा विक्रमादित्य की आराध्य देवी के इस मंदिर में स्थित दो गगनचुंबी दीपस्तंभ संध्या आरती में हजारों दीपों से जगमगा उठते हैं।",
    distance: "1.1 km",
  },
  {
    name: "Mangalnath Temple",
    name_mr: "मंगलनाथ मंदिर",
    emoji: "🪐",
    category: "Temple",
    rating: 4.7,
    latitude: 23.2173,
    longitude: 75.7745,
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
    description_mr: "मत्स्य पुराण के अनुसार यह पावन स्थल मंगल ग्रह की जन्मभूमि माना जाता है। यहाँ शिप्रा नदी के शांत तट पर श्रद्धालु मंगल दोष निवारण और भात पूजा हेतु देश-विदेश से आते हैं।",
    distance: "6.0 km",
  },
  {
    name: "Chintaman Ganesh Temple",
    name_mr: "चिंतामन गणेश मंदिर",
    emoji: "🐘",
    category: "Temple",
    rating: 4.7,
    latitude: 23.1607,
    longitude: 75.7278,
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
    description_mr: "उज्जैन का सर्वाधिक लोकप्रिय व प्राचीन गणेश मंदिर। यहाँ चिंतामन, इच्छामन और सिद्धिविनायक तीनों स्वरूप एक साथ विराजमान हैं जो भक्तों की समस्त चिंताओं का निवारण करते हैं।",
    distance: "6.5 km",
  },

  // ── HERITAGE ──────────────────────────────────────────────
  {
    name: "Vedh Shala (Jantar Mantar)",
    name_mr: "वेधशाला (जंतर मंतर)",
    emoji: "🔭",
    category: "Heritage",
    rating: 4.5,
    latitude: 23.1722,
    longitude: 75.7694,
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
    description_mr: "जयपुर के महाराजा सवाई जय सिंह द्वारा १७१९ में निर्मित भारत की सबसे प्राचीन वेधशाला। उज्जैन को भारतीय खगोल गणनाओं की शून्य रेखा (Prime Meridian) माना जाता था।",
    distance: "2.3 km",
  },
  {
    name: "Bhartrihari Caves & Gadkalika",
    name_mr: "भर्तृहरि गुफा एवं माँ गढ़कालिका",
    emoji: "⛰️",
    category: "Heritage",
    rating: 4.5,
    latitude: 23.2081,
    longitude: 75.7869,
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
    description_mr: "राजा विक्रमादित्य के भ्राता राजा भर्तृहरि की पावन तपोस्थली। यहाँ गुफा में बैठकर उन्होंने वैराग्य शतक और नीति शतक की रचना की थी। पास ही महाकवि कालिदास की आराध्य माँ गढ़कालिका का मंदिर है।",
    distance: "4.8 km",
  },
  {
    name: "Kaliadeh Palace & Surya Kunda",
    name_mr: "कालियादेह महल एवं सूर्य कुंड",
    emoji: "🏰",
    category: "Heritage",
    rating: 4.4,
    latitude: 23.2592,
    longitude: 75.7891,
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
    description_mr: "शिप्रा नदी के बीच स्थित १४५८ ईस्वी का सुंदर ऐतिहासिक जलमहल। यहाँ प्राचीन सूर्य मंदिर और नदी की प्राकृतिक जलधाराओं से निर्मित जलकुंड स्थित हैं।",
    distance: "8.5 km",
  },
  {
    name: "Vikram Kirti Mandir & Scindia Museum",
    name_mr: "विक्रम कीर्ति मंदिर एवं पुरातत्व संग्रहालय",
    emoji: "🏛️",
    category: "Heritage",
    rating: 4.6,
    latitude: 23.1831,
    longitude: 75.7725,
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
    description_mr: "चक्रवर्ती सम्राट विक्रमादित्य के गौरवशाली इतिहास को समर्पित संग्रहालय। यहाँ १८,००० से अधिक दुर्लभ हस्तलिखित ताड़पत्र पाण्डुलिपियाँ, प्राचीन सिक्के और मूर्तियां सुरक्षित हैं।",
    distance: "1.9 km",
  },

  // ── NATURE & GHATS ────────────────────────────────────────
  {
    name: "Ram Ghat & Shipra River",
    name_mr: "राम घाट एवं शिप्रा महाआरती",
    emoji: "🌊",
    category: "Nature",
    rating: 4.7,
    latitude: 23.1843,
    longitude: 75.7601,
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
    description_mr: "पवित्र मोक्षदायिनी शिप्रा नदी का सबसे प्रमुख व प्राचीन घाट। यहाँ सिंहस्थ कुंभ का मुख्य शाही स्नान आयोजित होता है। शाम को होने वाली शिप्रा महाआरती और दीपदान का दृश्य अत्यंत दिव्य होता है।",
    distance: "1.4 km",
  },

  // ── WELLNESS & ASHRAMS ────────────────────────────────────
  {
    name: "Maharshi Sandipani Ashram",
    name_mr: "महर्षि सांदीपनि आश्रम",
    emoji: "📜",
    category: "Wellness",
    rating: 4.6,
    latitude: 23.2125,
    longitude: 75.7928,
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
    description_mr: "वह पवित्र गुरुकुल जहाँ द्वापर युग में भगवान श्री कृष्ण, बलराम और सुदामा ने महर्षि सांदीपनि से ६४ कलाओं की शिक्षा प्राप्त की थी। यहाँ ऐतिहासिक गोमती कुंड स्थित है।",
    distance: "5.2 km",
  },

  // ── FOOD & CULINARY ───────────────────────────────────────
  {
    name: "Tower Chowk & Sarafa Food Strip",
    name_mr: "टॉवर चौक एवं सराफा मालवी स्वाद",
    emoji: "🍲",
    category: "Food",
    rating: 4.8,
    latitude: 23.1818,
    longitude: 75.7788,
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
    description_mr: "उज्जैन का प्रसिद्ध खान-पान केंद्र। यहाँ शुद्ध घी का पारंपरिक मालवी दाल-बाफला, गरमा-गरम पोहा-जलेबी, भुट्टे का कीस, गराडू और मलाईदार केसर रबड़ी का बेजोड़ स्वाद मिलता है।",
    distance: "1.8 km",
  }
];

const events = [
  {
    date: "SHRAVAN SOMWAR",
    name: "Shri Mahakal Shahi Sawari",
    desc: "Grand royal palanquin procession of Baba Mahakal through old Ujjain",
    color: "saffron",
  },
  {
    date: "MAHASHIVRATRI",
    name: "Maha Shivratri Mahotsav",
    desc: "44-hour continuous darshan and Deepotsav with millions of diyas",
    color: "terracotta",
  },
  {
    date: "KARTIK PURNIMA",
    name: "Shipra Deepotsav & Kartik Mela",
    desc: "Illumination of 5 lakh clay lamps across Ram Ghat and riverbanks",
    color: "indigo",
  },
  {
    date: "KUMBH MAHAPARVA",
    name: "Simhastha Kumbh Snan",
    desc: "Holy royal bath of 13 Akharas on the banks of sacred Shipra",
    color: "amber",
  }
];

async function main() {
  console.log('Start seeding Ujjain Explorer database...');

  // Clear existing data
  await prisma.itineraryStop.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userSavedPlace.deleteMany();
  await prisma.place.deleteMany();

  // Seed Places
  for (const p of places) {
    const { latitude, longitude, ...rest } = p;
    const createdPlace = await prisma.place.create({ 
      data: { ...rest, latitude, longitude } as any 
    });

    if (latitude && longitude) {
      try {
        await prisma.$executeRaw`
          UPDATE "Place" 
          SET "location" = ST_SetSRID(ST_MakePoint(${Number(longitude)}, ${Number(latitude)}), 4326)
          WHERE id = ${createdPlace.id}
        `;
      } catch (err) {
        // Fallback if PostGIS extension is not enabled in non-spatial testing environment
      }
    }
  }

  // Seed Events
  for (const e of events) {
    await prisma.event.create({ data: e });
  }

  // Seed Default Itineraries
  const day1 = await prisma.itineraryDay.create({
    data: { day: 1, label: "Day 1 · Darshan & Ghats" }
  });
  const day2 = await prisma.itineraryDay.create({
    data: { day: 2, label: "Day 2 · Heritage & Outskirts" }
  });

  await prisma.itineraryStop.createMany({
    data: [
      {
        itineraryDayId: day1.id,
        time: "05:00 AM",
        name: "Shri Mahakaleshwar Jyotirlinga",
        name_mr: "श्री महाकालेश्वर ज्योतिर्लिंग",
        desc: "Begin your spiritual journey with the divine darshan and morning prayers at the sacred Jyotirlinga.",
        desc_mr: "पवित्र ज्योतिर्लिंग के दर्शन व प्रातःकालीन पूजन के साथ अपनी पावन यात्रा प्रारंभ करें।",
        dotColor: "#D9531E",
        tags: [{ label: "Temple", type: "temple" }, { label: "2.5h", type: "neutral" }],
        order: 0
      },
      {
        itineraryDayId: day1.id,
        time: "09:30 AM",
        name: "Maa Harsiddhi Temple",
        name_mr: "माँ हरसिद्धि माता शक्तिपीठ",
        desc: "Walk across to the sacred Shaktipeeth and marvel at the historic 50-foot monolithic deepstambhas.",
        desc_mr: "माँ हरसिद्धि के दर्शन करें और ५० फीट ऊंचे ऐतिहासिक दीपस्तंभों के दर्शन करें।",
        dotColor: "#9E2A2B",
        tags: [{ label: "Temple", type: "temple" }, { label: "1h", type: "neutral" }],
        order: 1
      },
      {
        itineraryDayId: day1.id,
        time: "06:30 PM",
        name: "Ram Ghat & Shipra River",
        name_mr: "राम घाट एवं शिप्रा महाआरती",
        desc: "Witness the mesmerizing evening Shipra Maha Aarti and float illuminated diyas on the sacred river.",
        desc_mr: "संध्या काल में शिप्रा महाआरती के दिव्य दर्शन करें और पुण्य सलिला शिप्रा में दीपदान करें।",
        dotColor: "#1B4965",
        tags: [{ label: "Nature", type: "nature" }, { label: "1.5h", type: "neutral" }],
        order: 2
      },
      {
        itineraryDayId: day2.id,
        time: "08:00 AM",
        name: "Kal Bhairav Temple",
        name_mr: "काल भैरव मंदिर",
        desc: "Visit the revered guardian Kotwal of Ujjain and witness the unique traditional liquor offering ritual.",
        desc_mr: "उज्जैन के नगर कोतवाल काल भैरव के दर्शन करें और सदियों पुरानी परंपरा के साक्षी बनें।",
        dotColor: "#D9531E",
        tags: [{ label: "Temple", type: "temple" }, { label: "1.5h", type: "neutral" }],
        order: 0
      },
      {
        itineraryDayId: day2.id,
        time: "10:30 AM",
        name: "Maharshi Sandipani Ashram",
        name_mr: "महर्षि सांदीपनि आश्रम",
        desc: "Explore the ancient Gurukul where Lord Krishna, Balram, and Sudama studied 64 arts and scriptures.",
        desc_mr: "उस तपोभूमि का दर्शन करें जहाँ भगवान श्री कृष्ण और सुदामा ने ६४ कलाओं की विद्या ग्रहण की थी।",
        dotColor: "#2E6F40",
        tags: [{ label: "Wellness", type: "nature" }, { label: "1h", type: "neutral" }],
        order: 1
      }
    ]
  });

  console.log('Seeding Ujjain finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
