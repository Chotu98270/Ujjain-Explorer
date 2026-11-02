# 🕉️ Ujjain Explorer (अवन्तिका दर्शन)

A modern, high-performance tour guide and pilgrimage web application for **Ujjain (Avantika), Madhya Pradesh** — the eternal city of Mahakaleshwar Jyotirlinga, sacred Shipra River, Emperor Vikramaditya, and ancient Hindu astronomy. Features interactive maps, dynamic itinerary planning, OpenStreetMap auto-discovery, weather-adaptive pilgrimage routing, and Yatri gamification.

---

### **[Backend Architecture & API Specs](./BACKEND.md)**

---

[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg?style=flat-square)](#)
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

## 🚀 Production Deployment Guide

Ujjain Explorer can be deployed using multiple flexible hosting architectures:

1. **Decoupled Architecture (Recommended for Serverless & Cloud)**: Frontend on **Vercel / Netlify**, Backend on **Render / Railway**, Database on **Supabase / Neon**.
2. **Unified Single-Server Architecture**: Node.js/Express serves both the compiled React frontend and the `/api` backend from a single instance on **Render, Railway, or VPS**.
3. **Containerized Architecture**: Multi-container Docker deployment using `docker-compose.prod.yml`.
4. **Self-Hosted Linux VPS**: Ubuntu with **Nginx Reverse Proxy + PM2 + Certbot SSL**.

---

### ⚙️ Production Environment Variables Checklist

#### **Frontend Variables (Vercel / Netlify / Vite Build)**
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Full URL to the deployed backend API | `https://api.ujjain-explorer.com/api` or `https://backend.onrender.com/api` |
| `VITE_GOOGLE_MAPS_API_KEY` | *(Optional)* Google Maps API key for address geocoding | `AIzaSy...` |

#### **Backend Variables (Render / Railway / VPS / Docker)**
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `NODE_ENV` | Yes | Set to `production` to activate static serving and security policies | `production` |
| `PORT` | Yes | Port Express listens on (auto-assigned by Render/Railway) | `3001` or `8080` |
| `DATABASE_URL` | Yes | PostgreSQL connection string (PostGIS extension enabled) | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | Yes | Strong random secret string for signing user auth tokens | `a_secure_random_64_char_string` |
| `CLIENT_ORIGINS` | Yes | Comma-separated allowed frontend origins for CORS | `https://ujjain-explorer.vercel.app,https://mycustomdomain.com` |
| `REDIS_URL` | No | Redis connection URL for caching (falls back to in-memory cache if omitted) | `redis://default:token@host:6379` |
| `GEMINI_API_KEY` | No | Google Gemini API Key for dynamic AI itinerary synthesis | `AIzaSy...` |

---

### Method 1: Decoupled Cloud Deployment (Vercel + Render / Railway)

#### **Step 1: Deploy Database (Supabase or Neon)**
1. Create a free PostgreSQL database on [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
2. Enable PostGIS extension in the SQL editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS postgis;
   ```
3. Copy the pooled or direct `DATABASE_URL` connection string.

#### **Step 2: Deploy Backend (Render or Railway)**
1. Log in to [Render](https://render.com/) or [Railway](https://railway.app/) and create a new **Web Service**.
2. Connect your GitHub repository: `https://github.com/Chotu98270/Ujjain-Explorer`.
3. Configure the build and run settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node` (v20+)
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npx prisma migrate deploy && npm start
     ```
4. In the **Environment Variables** tab, add:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `<your_postgres_connection_string>`
   - `JWT_SECRET` = `<your_strong_secret>`
   - `CLIENT_ORIGINS` = `https://<your-vercel-frontend-domain>.vercel.app`
   - `GEMINI_API_KEY` = `<your_gemini_api_key>` (optional)
5. *(Optional initial data seed)* Run one-off seed in Render Shell / Railway CLI:
   ```bash
   npm run seed
   ```
6. Copy your deployed backend URL: `https://<backend-app-name>.onrender.com`.

#### **Step 3: Deploy Frontend (Vercel)**
1. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import `Chotu98270/Ujjain-Explorer`.
3. Configure build settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://<backend-app-name>.onrender.com/api`
5. Click **Deploy**. Vercel will use the included [`vercel.json`](./vercel.json) for client-side SPA routing.

---

### Method 2: Unified Fullstack Single-Service Deployment

You can deploy the complete fullstack application (Vite SPA + Express API) on a single Node service (e.g., Render Web Service, Railway, Fly.io, or Heroku). Express will serve the pre-built React frontend from `dist/` and handle all `/api/*` requests on the same port:

1. Connect the repository root `./` to your cloud provider.
2. Set configuration:
   - **Build Command:**
     ```bash
     npm run build:all
     ```
     *(This runs backend dependencies installation, Prisma client generation, TypeScript compilation, and Vite React build)*
   - **Start Command:**
     ```bash
     npm start
     ```
     *(This runs Prisma migrations and starts the production Express server)*
3. Add environment variables:
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = `<postgres_connection_string>`
   - `JWT_SECRET` = `<your_secret>`

---

### Method 3: Dockerized Deployment (Single Command)

A production-ready [`Dockerfile`](./Dockerfile) and [`docker-compose.prod.yml`](./docker-compose.prod.yml) are included. To launch the web app, PostgreSQL (with PostGIS), and Redis in production:

```bash
# Set your environment variables
export JWT_SECRET="your_production_secret"
export GEMINI_API_KEY="your_api_key"

# Build and start all containers in detached mode
docker compose -f docker-compose.prod.yml up -d --build
```

To run database migrations or seed data inside the container:
```bash
docker exec -it ujjain_explorer_app npx --prefix backend prisma migrate deploy
docker exec -it ujjain_explorer_app npm --prefix backend run seed
```

---

### Method 4: Self-Hosted Linux VPS (Ubuntu + Nginx + PM2)

#### **1. Server Setup**
```bash
# Update server & install Node.js 20 & Nginx
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm install -g pm2
```

#### **2. Clone & Build Application**
```bash
cd /var/www
sudo git clone https://github.com/Chotu98270/Ujjain-Explorer.git
cd Ujjain-Explorer
sudo chown -R $USER:$USER .

# Configure environment files (.env and backend/.env)
cp .env.example .env
cp backend/.env.example backend/.env
# Edit credentials with: nano backend/.env

# Build backend and frontend
npm run build:all
```

#### **3. Start with PM2 Process Manager**
```bash
pm2 start "npm start" --name "ujjain-explorer"
pm2 save
pm2 startup
```

#### **4. Configure Nginx Reverse Proxy**
Create `/etc/nginx/sites-available/ujjain-explorer`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and configure SSL:
```bash
sudo ln -s /etc/nginx/sites-available/ujjain-explorer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install free Let's Encrypt SSL certificate
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

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
├── Dockerfile              # Multi-stage production Dockerfile
├── docker-compose.yml      # Local Postgres + PostGIS + Redis setup
├── docker-compose.prod.yml # Production multi-container fullstack setup
├── package.json            # Root build orchestration scripts
├── vercel.json             # Vercel SPA routing configuration
└── vite.config.js
```

---

## 📄 License

This project is licensed under the [ISC License](./package.json).
