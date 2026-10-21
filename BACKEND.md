# Ujjain Explorer (Avantika Darshan) — Backend Tech Stack & API Design

## Implemented Stack

### Runtime & Framework
- Runtime: **Node.js 20+**
- Framework: **Express.js**
- Language: **TypeScript**

### Database & Caching
- Relational DB: **PostgreSQL**
- ORM: **Prisma**
- Geolocation: **PostGIS** extension for nearby calculations and spatial bounding
- Cache Store: **Redis** (used for endpoint output caching and Overpass OSM discovery throttling)

### Authentication & Routing
- Security: **JWT + bcryptjs** password hashing
- Maps/Routing: **OpenStreetMap (Overpass API) + OSRM (Open Source Routing Machine)**
- AI: **Google Gemini 1.5 Flash** for dynamic pilgrimage itinerary synthesis
- Weather: **Open-Meteo API** (Ujjain `23.1765° N, 75.7885° E`)

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Active database schema
│   └── migrations/         # PostgreSQL schema migration scripts
├── src/
│   ├── middleware/
│   │   ├── auth.ts         # JWT bearer token verification
│   │   └── rateLimit.ts    # Rate limiting for auth, generation, and API
│   ├── routes/
│   │   ├── userRoutes.ts      # /api/user routes
│   │   ├── placeRoutes.ts     # /api/places routes
│   │   ├── itineraryRoutes.ts # /api/itinerary routes
│   │   ├── eventRoutes.ts     # /api/events routes
│   │   └── weatherRoutes.ts   # /api/weather routes
│   ├── controllers/
│   │   ├── userController.ts      # Registration, login, profile stats
│   │   ├── placeController.ts     # Nearby places, bookmark saves, live bounds
│   │   ├── itineraryController.ts # Stops, completions, TSP optimizer, Gemini synthesis, weather adaptation
│   │   ├── eventController.ts     # Ujjain festivals & cultural events
│   │   └── weatherController.ts   # Open-Meteo live weather & simulation
│   ├── services/
│   │   ├── cacheService.ts        # Redis client connection & caching utility
│   │   └── overpassService.ts     # OSM Overpass API caller + negative filtering
│   ├── app.ts              # Express initialization
│   └── seed.ts             # Ujjain database seeding script
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Active API Endpoints

All protected endpoints require an `Authorization` header containing `Bearer <JWT_TOKEN>`.

### 🔑 Authentication (`/api/user`)
- `POST   /api/user/register`  
  Registers a new user, hashes password, awards +150 sign-up XP, and pre-seeds standard Day 1 & Day 2 Ujjain travel itineraries.
- `POST   /api/user/login`  
  Verifies credentials, returning user profile details and JWT token.
- `GET    /api/user/me` (Protected)  
  Fetches the authenticated user profile.
- `GET    /api/user/stats` (Protected)  
  Computes user progress: counts of saved spots, completed stops, levels, and persistent XP.

### 🛕 Places (`/api/places`)
- `GET    /api/places`  
  Fetches spots (supports `?category=Temple|Heritage|Nature|Food|Wellness`, search `?q=`, `?isSaved=true`, `?bbox=south,west,north,east`, and `?live=true`).
- `GET    /api/places/:id`  
  Fetches individual place details.
- `PATCH  /api/places/:id/save` (Protected)  
  Toggles saved/bookmarked state in `UserSavedPlace`. Increments user XP by `+10 XP` on a new bookmark.

### 📅 Itineraries & Stops (`/api/itinerary`)
- `GET    /api/itinerary` (Protected)  
  Fetches the authenticated user's itinerary days and stops.
- `POST   /api/itinerary/stops` (Protected)  
  Adds a new custom stop to the active day.
- `PATCH  /api/itinerary/stops/:id` (Protected)  
  Toggles stop checkbox status. Checking off a stop increments user XP by `+50 XP`.
- `DELETE /api/itinerary/stops/:id` (Protected)  
  Deletes the specified itinerary stop.
- `POST   /api/itinerary/optimize` (Protected)  
  Solves the Traveling Salesperson Problem (TSP) for active day stops using the OSRM Trip API (starting at the first stop). Updates stop `order` fields in the database.
- `POST   /api/itinerary/generate` (Protected)  
  Generates a custom multi-day pilgrimage itinerary using Gemini 1.5 Flash (with rating-based fallback) based on duration, pace, accessibility, and category interests.
- `POST   /api/itinerary/adapt-weather` (Protected)  
  Analyzes itinerary stops for outdoor attractions (open ghats, outdoor observatories) and swaps them with indoor spiritual and cultural spots during rainy weather, followed by OSRM sequence re-optimization.

### 🎭 Events (`/api/events`)
- `GET    /api/events`  
  Fetches curated Ujjain cultural events and annual festivals (Shri Mahakal Sawari, Mahashivratri, Simhastha Kumbh, Kartik Deepotsav).

### ☀️ Weather (`/api/weather`)
- `GET    /api/weather`  
  Fetches live Ujjain weather and temperature from Open-Meteo API, mapped to 'Sunny' or 'Rainy' conditions.
- `POST   /api/weather/toggle`  
  Developer and testing endpoint to toggle weather override in cache.

---

## Active Prisma Database Schema

```prisma
model Place {
  id             Int              @id @default(autoincrement())
  name           String
  name_mr        String?
  emoji          String
  category       String
  rating         Float
  distance       String
  entryFee       String
  estYear        String
  visitTime      String
  hours          String
  phone          String
  address        String
  accessible     Boolean
  guidedTours    Boolean
  tag            String
  tagColor       String
  bgColor        String
  description    String
  description_mr String?
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  isSaved        Boolean          @default(false)
  osmId          String?          @unique
  latitude       Float?
  longitude      Float?
  location       Unsupported("geometry(Point, 4326)")?
  savedBy        UserSavedPlace[]
}

model Event {
  id        Int      @id @default(autoincrement())
  date      String
  name      String
  desc      String
  color     String
  createdAt DateTime @default(now())
}

model User {
  id            Int              @id @default(autoincrement())
  name          String
  email         String           @unique
  password      String
  xp            Int              @default(0)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  itineraryDays ItineraryDay[]
  savedPlaces   UserSavedPlace[]
}

model UserSavedPlace {
  id        Int      @id @default(autoincrement())
  userId    Int
  placeId   Int
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  place     Place    @relation(fields: [placeId], references: [id], onDelete: Cascade)

  @@unique([userId, placeId])
}

model ItineraryDay {
  id      Int             @id @default(autoincrement())
  day     Int
  label   String
  userId  Int?
  user    User?           @relation(fields: [userId], references: [id], onDelete: Cascade)
  stops   ItineraryStop[]
}

model ItineraryStop {
  id             Int          @id @default(autoincrement())
  time           String
  name           String
  name_mr        String?
  desc           String
  desc_mr        String?
  dotColor       String
  itineraryDayId Int
  tags           Json
  done           Boolean      @default(false)
  order          Int          @default(0)
  itineraryDay   ItineraryDay @relation(fields: [itineraryDayId], references: [id], onDelete: Cascade)
}
```

---

## Redis Caching & Throttling
- **Cache Invalidation**: On place updates, the backend invalidates cached JSON listings using standard wildcards (`places:*`).
- **Discovery Throttling**: Background OSM fetches for queries/categories are throttled using a Redis cooldown key (e.g. `places:discovery:cooldown:cat:<category>`) set for **300 seconds (5 minutes)**. Subsequent requests during cooldown return cache hits, avoiding Overpass rate limits.
