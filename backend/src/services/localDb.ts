import fs from 'fs';
import path from 'path';

export interface LocalUser {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  password: string;
  xp: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalSavedPlace {
  id: number;
  userId: number;
  placeId: number;
  createdAt: string;
}

export interface LocalItineraryStop {
  id: number;
  itineraryDayId: number;
  time: string;
  name: string;
  name_mr?: string;
  desc: string;
  desc_mr?: string;
  dotColor: string;
  tags: any[];
  done: boolean;
  order: number;
}

export interface LocalItineraryDay {
  id: number;
  userId: number;
  day: number;
  label: string;
  stops: LocalItineraryStop[];
}

export interface DatabaseSchema {
  users: LocalUser[];
  savedPlaces: LocalSavedPlace[];
  itineraries: LocalItineraryDay[];
  nextIds: {
    user: number;
    savedPlace: number;
    itineraryDay: number;
    itineraryStop: number;
  };
}

const DB_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DB_DIR, 'ujjain_db.json');

const INITIAL_DB: DatabaseSchema = {
  users: [],
  savedPlaces: [],
  itineraries: [],
  nextIds: {
    user: 1,
    savedPlace: 1,
    itineraryDay: 1,
    itineraryStop: 1,
  },
};

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      savedPlaces: parsed.savedPlaces || [],
      itineraries: parsed.itineraries || [],
      nextIds: parsed.nextIds || { user: 1, savedPlace: 1, itineraryDay: 1, itineraryStop: 1 },
    };
  } catch (err) {
    console.warn('[LocalDB] Database read error, using in-memory state:', err);
    return INITIAL_DB;
  }
}

let dbMemory: DatabaseSchema = ensureDbFile();

function persistDb(): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbMemory, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LocalDB] Failed to persist database:', err);
  }
}

export const localDb = {
  findUserById(id: number): LocalUser | undefined {
    return dbMemory.users.find((u) => u.id === id);
  },

  findUserByIdentifier(identifier: string): LocalUser | undefined {
    const clean = identifier.trim().toLowerCase();
    const cleanPhone = clean.replace(/[^0-9]/g, '');
    return dbMemory.users.find((u) => {
      if (u.email && u.email.toLowerCase() === clean) return true;
      if (u.phone && (u.phone === clean || (cleanPhone.length >= 10 && u.phone.includes(cleanPhone)))) return true;
      return false;
    });
  },

  findUserByEmail(email: string): LocalUser | undefined {
    const clean = email.trim().toLowerCase();
    return dbMemory.users.find((u) => u.email && u.email.toLowerCase() === clean);
  },

  findUserByPhone(phone: string): LocalUser | undefined {
    const clean = phone.replace(/[^0-9]/g, '');
    return dbMemory.users.find((u) => u.phone && u.phone.replace(/[^0-9]/g, '') === clean);
  },

  createUser(params: { name: string; phone?: string; email?: string; password: string }): LocalUser {
    const id = dbMemory.nextIds.user++;
    const now = new Date().toISOString();
    const newUser: LocalUser = {
      id,
      name: params.name.trim(),
      phone: params.phone ? params.phone.trim() : undefined,
      email: params.email ? params.email.trim().toLowerCase() : undefined,
      password: params.password,
      xp: 150, // Welcome XP
      createdAt: now,
      updatedAt: now,
    };
    dbMemory.users.push(newUser);

    // Automatically seed an authentic Day 1 and Day 2 Ujjain Itinerary for the new pilgrim
    const day1Id = dbMemory.nextIds.itineraryDay++;
    const day2Id = dbMemory.nextIds.itineraryDay++;

    const day1: LocalItineraryDay = {
      id: day1Id,
      userId: id,
      day: 1,
      label: "Day 1 · Mahakal & Shipra",
      stops: [
        {
          id: dbMemory.nextIds.itineraryStop++,
          itineraryDayId: day1Id,
          time: "04:00 AM",
          name: "Shri Mahakaleshwar Jyotirlinga",
          name_mr: "श्री महाकालेश्वर ज्योतिर्लिंग",
          desc: "Witness the divine Bhasma Aarti of the south-facing Jyotirlinga.",
          desc_mr: "दक्षिणमुखी महाकाल ज्योतिर्लिंगाची दिव्य भस्म आरती आणि दर्शन.",
          dotColor: "#D9531E",
          tags: [{ label: "Temple", type: "temple" }],
          done: false,
          order: 1,
        },
        {
          id: dbMemory.nextIds.itineraryStop++,
          itineraryDayId: day1Id,
          time: "07:30 AM",
          name: "Ram Ghat (Shipra River)",
          name_mr: "राम घाट (शिप्रा नदी)",
          desc: "Take a sacred dip (Snan) in the holy Shipra waters and enjoy breakfast.",
          desc_mr: "पवित्र शिप्रा नदीत स्नान आणि ऐतिहासिक घाटांचे दर्शन.",
          dotColor: "#1B4965",
          tags: [{ label: "Nature", type: "nature" }],
          done: false,
          order: 2,
        },
        {
          id: dbMemory.nextIds.itineraryStop++,
          itineraryDayId: day1Id,
          time: "10:30 AM",
          name: "Harsiddhi Temple",
          name_mr: "हरसिद्धि माता मंदिर",
          desc: "Visit the 13th Shaktipeeth famous for its monumental deepstambhas.",
          desc_mr: "प्रसिद्ध ५१ शक्तिपीठांपैकी १३वे हरसिद्धि माता मंदिर.",
          dotColor: "#9E2A2B",
          tags: [{ label: "Heritage", type: "heritage" }],
          done: false,
          order: 3,
        },
      ],
    };

    const day2: LocalItineraryDay = {
      id: day2Id,
      userId: id,
      day: 2,
      label: "Day 2 · Heritage & Shrines",
      stops: [
        {
          id: dbMemory.nextIds.itineraryStop++,
          itineraryDayId: day2Id,
          time: "09:00 AM",
          name: "Kal Bhairav Temple",
          name_mr: "काल भैरव मंदिर",
          desc: "Pay reverence to the fierce protector guardian of Avantika.",
          desc_mr: "उज्जैन नगरीचे रक्षक क्षेत्रपाल श्री काल भैरव दर्शन.",
          dotColor: "#B87318",
          tags: [{ label: "Temple", type: "temple" }],
          done: false,
          order: 1,
        },
        {
          id: dbMemory.nextIds.itineraryStop++,
          itineraryDayId: day2Id,
          time: "11:30 AM",
          name: "Vedh Shala (Jantar Mantar)",
          name_mr: "वेध शाला (जंतर मंतर)",
          desc: "Explore Raja Jai Singh's astronomical observatory on the prime meridian.",
          desc_mr: "१७१९ मधील राजा जयसिंह यांची प्राचीन खगोलशास्त्रीय वेधशाळा.",
          dotColor: "#2E6F40",
          tags: [{ label: "Heritage", type: "heritage" }],
          done: false,
          order: 2,
        },
      ],
    };

    dbMemory.itineraries.push(day1, day2);
    persistDb();
    return newUser;
  },

  getUserItinerary(userId: number): LocalItineraryDay[] {
    const list = dbMemory.itineraries.filter((it) => it.userId === userId);
    return list;
  },

  addStop(userId: number, dayId: number | null, stopData: Partial<LocalItineraryStop>): LocalItineraryStop {
    let day = dbMemory.itineraries.find((d) => d.userId === userId && (dayId ? d.id === dayId : d.day === 1));
    if (!day) {
      const newDayId = dbMemory.nextIds.itineraryDay++;
      day = {
        id: newDayId,
        userId,
        day: 1,
        label: "Day 1 · Custom Plan",
        stops: [],
      };
      dbMemory.itineraries.push(day);
    }

    const newStop: LocalItineraryStop = {
      id: dbMemory.nextIds.itineraryStop++,
      itineraryDayId: day.id,
      time: stopData.time || "10:00 AM",
      name: stopData.name || "Ujjain Sight",
      name_mr: stopData.name_mr || stopData.name,
      desc: stopData.desc || "",
      desc_mr: stopData.desc_mr || stopData.desc,
      dotColor: stopData.dotColor || "#D9531E",
      tags: stopData.tags || [{ label: "Heritage", type: "heritage" }],
      done: false,
      order: day.stops.length + 1,
    };

    day.stops.push(newStop);
    persistDb();
    return newStop;
  },

  updateStopStatus(userId: number, stopId: number, done: boolean): LocalItineraryStop | null {
    for (const day of dbMemory.itineraries) {
      if (day.userId === userId) {
        const stop = day.stops.find((s) => s.id === stopId);
        if (stop) {
          stop.done = done;
          persistDb();
          return stop;
        }
      }
    }
    return null;
  },

  deleteStop(userId: number, stopId: number): boolean {
    for (const day of dbMemory.itineraries) {
      if (day.userId === userId) {
        const index = day.stops.findIndex((s) => s.id === stopId);
        if (index !== -1) {
          day.stops.splice(index, 1);
          persistDb();
          return true;
        }
      }
    }
    return false;
  },

  toggleSavePlace(userId: number, placeId: number, shouldSave: boolean): boolean {
    const existingIndex = dbMemory.savedPlaces.findIndex(
      (s) => s.userId === userId && s.placeId === placeId
    );
    if (shouldSave && existingIndex === -1) {
      dbMemory.savedPlaces.push({
        id: dbMemory.nextIds.savedPlace++,
        userId,
        placeId,
        createdAt: new Date().toISOString(),
      });
      persistDb();
      return true;
    } else if (!shouldSave && existingIndex !== -1) {
      dbMemory.savedPlaces.splice(existingIndex, 1);
      persistDb();
      return false;
    }
    return shouldSave;
  },

  getUserSavedPlaceIds(userId: number): number[] {
    return dbMemory.savedPlaces
      .filter((s) => s.userId === userId)
      .map((s) => s.placeId);
  },

  getUserStats(userId: number) {
    const user = this.findUserById(userId);
    const savedCount = dbMemory.savedPlaces.filter((s) => s.userId === userId).length;
    let completedStops = 0;
    dbMemory.itineraries
      .filter((d) => d.userId === userId)
      .forEach((d) => {
        completedStops += d.stops.filter((s) => s.done).length;
      });

    const xp = (user?.xp || 150) + completedStops * 50;
    return {
      savedCount,
      discoveredCount: 12,
      completedStops,
      totalPoints: xp,
    };
  },
};
