# 🕉️ Ujjain Explorer (अवन्तिका दर्शन)

A modern, high-performance tour guide and pilgrimage web application for **Ujjain (Avantika), Madhya Pradesh** — the eternal city of Mahakaleshwar Jyotirlinga, sacred Shipra River, Emperor Vikramaditya, and ancient Hindu astronomy. Features interactive maps, dynamic itinerary planning, OpenStreetMap auto-discovery, weather-adaptive pilgrimage routing, and Yatri gamification.

---

### **[Backend Architecture](./BACKEND.md)** · **[Contribution Guidelines](./CONTRIBUTING.md)** · **[Changelog](./CHANGELOG.md)**

---

[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg?style=flat-square)](./CHANGELOG.md)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-FF6F00?style=flat-square&logo=progressive-web-apps&logoColor=white)](#)

---

## ✨ Core Features

* **🕉️ Sacred Pilgrimage Circuits & Darshan:** Direct access to curated circuits for Shri Mahakaleshwar Jyotirlinga, Kal Bhairav, Maa Harsiddhi Shaktipeeth, Ram Ghat, Mangalnath, and Sandipani Ashram.
* **⚡ Route Sequence Optimization (OSRM Trip API):** Solves the Traveling Salesperson Problem (TSP) on the fly for active pilgrimage stops, ordering them by the shortest physical travel distance.
* **🤖 Avantika AI Itinerary Planning (Gemini 1.5 Flash):** Tailors custom multi-day itineraries based on travel pace (Relaxed vs. Adventure), accessibility needs, and cultural interests with localized explanations.
* **🌧️ Weather-Adaptive Routing (Open-Meteo):** Real-time Ujjain weather tracking. Automatically detects outdoor spots (Shipra Ghats, open observatories) during rain and recommends swapping them with indoor temple halls and museums.
* **⛶ Interactive Map UI/UX:** Full-screen Leaflet integration centered on Ujjain (`23.1828° N, 75.7682° E`) with customizable pin badges (`①`, `②`, `③`), category filtering, and turn-by-turn routing polylines.
* **🏆 Persistent Gamification & Yatri Levels:** Tracks XP (`+50 XP` per stop, `+10 XP` per saved spot) and ranks users with titles such as *Navin Yatri* (नविन यात्री), *Avantika Darshak* (अवन्तिका दर्शनार्थी), *Mahakal Sevak* (महाकाल सेवक), and *Simhastha Legend* (सिंहस्थ सम्राट).
* **🌲 OpenStreetMap (OSRM & Overpass) Live Sourcing:** Queries live tourist destinations (Temples, Ghats, Heritage, Malwi Food, Ashrams) with negative filtering against non-tourist locations.
* **🍲 Authentic Malwi Culinary Guide:** Curated spots for Dal Bafla, Ujjaini Poha-Jalebi, Bhutta Kees, Garadu chaat, and Kesar Rabdi.
* **📱 Progressive Web App (PWA) Support:** Service worker caching, offline capability, mobile app layout, and installable manifest.
* **🌐 Multilingual Localization:** Full translation support for Hindi, Sanskrit (संस्कृतम्), English, Marathi, Gujarati, and other Indian regional languages.

---

## 🛠️ Local Setup Guide

Follow these steps to run Ujjain Explorer locally on your development machine.

### 📋 Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (v18.0 or higher) & **npm**
- **Git**
- **Docker & Docker Compose** (Recommended for instant Postgres + Redis setup), OR:
  - **PostgreSQL** database (v14+ with PostGIS extension enabled)
  - **Redis** server (optional, used for Overpass API rate-limit caching)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Chotu98270/Ujjain-Explorer.git
cd Ujjain-Explorer
```

---

### 2️⃣ Environment Variables Setup

#### **Frontend (`.env`)**
Create a `.env` file in the root project directory (or copy `.env.example`):

```bash
cp .env.example .env
```

```env
# API URL pointing to the local Node/Express server
VITE_API_BASE_URL=http://localhost:3001/api
```

#### **Backend (`backend/.env`)**
Create a `.env` file inside the `backend/` directory (or copy `backend/.env.example`):

```bash
cp backend/.env.example backend/.env
```

```env
# Database connection string (PostgreSQL with PostGIS)
DATABASE_URL="postgresql://postgres:password@localhost:5432/Ujjain_Explorer?schema=public"

# Server Port
PORT=3001

# Secret key for JWT signing
JWT_SECRET="ujjain_explorer_super_secret_key"

# Redis connection URL (optional for caching)
REDIS_URL="redis://127.0.0.1:6379"

# Google Gemini API Key for AI Itinerary Generation (optional)
GEMINI_API_KEY=""
```

---

### 3️⃣ Start Database Services (via Docker)

If you use Docker, start PostgreSQL (with PostGIS) and Redis with one command:

```bash
docker-compose up -d
```

---

### 4️⃣ Install Dependencies & Seed Database

Install both frontend and backend dependencies, generate Prisma client, and seed initial Ujjain places:

```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed database with Ujjain temples, ghats, and itineraries
npm run seed

cd ..
```

---

### 5️⃣ Run the Application

Start both the frontend and backend servers concurrently:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173 (or http://localhost:5050)
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/api/health

---

## 🏛️ Project Structure

```
Ujjain-Explorer/
├── backend/
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── config/         # JWT and application configuration
│   │   ├── controllers/    # Place, Itinerary, User, Weather, and Event controllers
│   │   ├── middleware/     # Auth and rate limiting middleware
│   │   ├── routes/         # Express API route declarations
│   │   ├── services/       # Cache (Redis) & Overpass (OSM) services
│   │   ├── app.ts          # Express server entry point
│   │   └── seed.ts         # Database seed script for Ujjain
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── components/         # Reusable UI components (Navbar, Cards, Status)
│   ├── data/               # Design tokens, Ujjain datasets, API clients, translations
│   ├── hooks/              # Custom React hooks (geolocation)
│   ├── screens/            # Home, Explore, Map, Plan, Profile, Auth screens
│   ├── utils/              # Distance and geolocation helper utilities
│   ├── App.jsx             # Main React application router
│   └── main.jsx            # React root mount
├── public/                 # Static assets, icons, and PWA manifest
├── docker-compose.yml      # Multi-container Postgres + PostGIS + Redis setup
├── package.json
└── vite.config.js
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Please check the [Contributing Guidelines](./CONTRIBUTING.md).

## 📄 License

This project is licensed under the [ISC License](./package.json).
