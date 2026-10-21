# 📜 Changelog

All notable changes to **Ujjain Explorer (Avantika Darshan)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-21

### 🕉️ Ujjain (Avantika) Edition Launch

- **Complete Rebranding & Cultural Design System**:
  - Vedic saffron, Tilak crimson, Shipra teal, and temple sandstone design palette.
  - Dedicated brand assets, title, and Progressive Web App manifest.
- **Geographic & Spatial Realignment**:
  - Center map viewport on Ujjain (`23.1828° N, 75.7682° E`).
  - OpenStreetMap Overpass bounding box configured for Ujjain pilgrimage and metropolitan belt (`23.10, 75.70, 23.25, 75.88`).
  - Open-Meteo live weather calibrated for Ujjain with rainfall alerts and automated indoor darshan swaps.
- **Authentic Datasets & Pilgrimage Circuits**:
  - Seeded Mahakaleshwar Jyotirlinga, Kal Bhairav, Maa Harsiddhi Shaktipeeth, Ram Ghat, Mangalnath, Sandipani Ashram, Vedh Shala, Bhartrihari Caves, and Malwi culinary strip.
  - Added real-world Ujjain festivals: Shri Mahakal Shahi Sawari, Maha Shivratri Mahotsav, Shipra Deepotsav, and Simhastha Kumbh Snan.
- **Avantika AI Travel Planner**:
  - Integrated Google Gemini 1.5 Flash prompt engine customized for sacred circuits, Bhasma Aarti timing, and historical insights.
- **Yatri Gamification**:
  - Upgraded rank progression: *Navin Yatri* (नविन यात्री) ➔ *Avantika Darshak* (अवन्तिका दर्शनार्थी) ➔ *Mahakal Sevak* (महाकाल सेवक) ➔ *Simhastha Legend* (सिंहस्थ सम्राट).
- **Multilingual Localization**:
  - Enhanced support for Hindi, Sanskrit, English, Marathi, Gujarati, and other regional languages.

---

---

## [1.1.0] - 2026-10-06

### 🙏 Special Thanks & Contributor Acknowledgements

A heartfelt thank you to all the contributors whose dedication, creativity, and code made **Release v1.1.0** possible!

- **Sanika Darekar ([@sanikadarekar](https://github.com/sanikadarekar))**:
  - **PR #62**: Established robust open-source foundations by creating [`CONTRIBUTING.md`](./CONTRIBUTING.md) with comprehensive development workflows, PR review checklists, and commit standards.
  - Added multi-container `docker-compose.yml` for zero-configuration local PostgreSQL (with PostGIS) and Redis orchestration.
  - Synchronized and updated [`BACKEND.md`](./BACKEND.md) documentation to perfectly align with Prisma schema models and live REST API endpoints.
  - Provided root-level `.env.example` templates and streamlined the local setup instructions.

- **Sourav Suman ([@LEVELING2108](https://github.com/LEVELING2108))**:
  - Implemented live OpenStreetMap (Overpass API) viewport discovery with strict category categorization and word-boundary negative keyword filtering.
  - Added dual node and way spatial centroid processing for accurate heritage structures, parks, and forts.
  - Security hardening: isolated user bookmarks, sanitized Overpass query strings, and added rate limiting.
  - Performance optimizations: code-splitting, backend Gzip compression, and graceful Redis degradation.

- **OpenStreetMap & Overpass Community**:
  - For open geospatial data powering authentic Pune heritage, nature, temple, food, and wellness discovery.

---

### 🚀 What's New & Changed in v1.1.0

#### 🐳 DevOps & Contributor Experience
- **Docker Compose Orchestration**: Spin up PostgreSQL 14 (PostGIS) and Redis with a single command: `docker compose up -d`.
- **Contribution Guidelines**: Added [`CONTRIBUTING.md`](./CONTRIBUTING.md) detailing PR workflows, Git conventions, code styles, and local testing instructions.
- **Environment Templates**: Added root `.env.example` and synchronized `backend/.env.example`.
- **Documentation Overhaul**: Updated `README.md` and `BACKEND.md` with complete architecture maps, service port tables, and API endpoint specs.

#### 🗺️ Map & OpenStreetMap Data Engine
- **Live Viewport Sourcing**: Dynamic Overpass API querying when panning/zooming across Pune.
- **Dual Node & Way Centroids**: Accurately computes geographic centers for large areas such as Shaniwar Wada, Saras Baug, and Sinhagad Fort.
- **Strict Tourist Filtering**: Rejects non-tourist locations (banks, clinics, schools, apartments, generic offices) using word-boundary matching.

#### 🔒 Security & Reliability
- **Isolated User Bookmarks**: Enforced user-specific data isolation for saved spots with authenticated and guest handling.
- **Query Sanitization**: Prevented Overpass query injection with regex escaping.
- **Graceful Redis Degradation**: In-memory fallback and safe operation when Redis is offline.

#### ⚡ Performance & Polish
- **Frontend Code Splitting**: Vite chunk optimization with lazy loading for all primary screens.
- **Gzip & Compression**: Express backend compression and layered in-memory cache.
- **In-App Contributor Recognition**: Interactive Contributor Acknowledgements & Release Notes modal in the Profile screen.

---

## [1.0.0] - 2026-06-30

### Initial Release
- Interactive Leaflet map with Pune tourist spots.
- Dynamic itinerary builder with OSRM TSP route sequence optimization.
- Punekar gamification (levels, badges, and XP tracking).
- Multilingual localization support (English, Marathi, Hindi, Gujarati).
- PWA support with service worker caching.
