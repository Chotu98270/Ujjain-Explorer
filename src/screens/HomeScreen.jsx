import { useState, useEffect } from "react";
import StatusBar from "../components/StatusBar";
import PlaceCard from "../components/PlaceCard";
import ThemeSwitcher from "../components/ThemeSwitcher";
import MahakalBookingModal from "../components/MahakalBookingModal";
import { categories, places as fallbackPlaces, events as fallbackEvents, getDynamicUjjainEvents } from "../data/puneData";
import { fetchPlaces, fetchEvents } from "../data/api";
import { translations } from "../data/translations";

export default function HomeScreen({ onPlaceSelect, onSearchClick, userLocation, userLanguage, weatherData, onWeatherToggle }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [places, setPlaces] = useState(() => (fallbackPlaces || []).slice(0, 4));
  const [events, setEvents] = useState(() => fallbackEvents || []);
  const [loading, setLoading] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventCategory, setEventCategory] = useState("All");
  const [eventTimeframe, setEventTimeframe] = useState("all");
  const [simulatedTime, setSimulatedTime] = useState("live");
  const [bookingNotice, setBookingNotice] = useState(null);
  const [isMahakalModalOpen, setIsMahakalModalOpen] = useState(false);
  const [mahakalModalTab, setMahakalModalTab] = useState("bhasma");

  const openMahakalMenu = (tab = "bhasma") => {
    setMahakalModalTab(tab);
    setIsMahakalModalOpen(true);
  };

  const t = translations[userLanguage] || translations.English;

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const simDate = simulatedTime === "january" 
          ? "2027-01-10T12:00:00" 
          : simulatedTime === "march"
          ? "2027-03-10T12:00:00"
          : undefined;

        const [placesData, eventsData] = await Promise.all([
          fetchPlaces({ category: activeCategory }),
          fetchEvents(simDate ? { simDate } : {})
        ]);
        if (isMounted) {
          if (Array.isArray(placesData) && placesData.length > 0) {
            setPlaces(placesData.slice(0, 4));
          }
          if (Array.isArray(eventsData) && eventsData.length > 0) {
            setEvents(eventsData);
          } else if (getDynamicUjjainEvents) {
            setEvents(getDynamicUjjainEvents(simDate ? new Date(simDate) : new Date()));
          }
        }
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, [activeCategory, simulatedTime]);

  return (
    <div style={{ background: "var(--bg-primary, #0E0E10)", minHeight: "100%", height: "100%", overflowY: "auto", paddingBottom: 84, transition: "background 0.3s ease" }}>
      <StatusBar light={true} />

      {/* Hero with Flagship Aesthetics & Integrated Theme Switcher */}
      <div
        style={{
          background: "var(--hero-gradient, linear-gradient(135deg, #1C0F08 0%, #0E0E10 100%))",
          borderBottom: "1px solid var(--hero-border, rgba(255,153,51,0.25))",
          padding: "20px 16px 34px",
          position: "relative",
          zIndex: 10,
          transition: "background 0.3s ease",
        }}
        className="w-full"
      >
        {/* Decorative ambient aura clipped within this layer */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: -20, right: -30,
              width: 180, height: 180, borderRadius: "50%",
              background: "rgba(255,153,51,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -40, left: -20,
              width: 140, height: 140, borderRadius: "50%",
              background: "rgba(212,175,55,0.06)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-1 sm:px-4 relative z-10">
          {/* Top Bar with Greeting, Mahakal Menu Button & Flagship Theme Switcher */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: 0.5, textTransform: "uppercase" }}>
              {t.greeting}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => openMahakalMenu("bhasma")}
                style={{
                  background: "linear-gradient(135deg, rgba(255,153,51,0.25) 0%, rgba(212,175,55,0.2) 100%)",
                  border: "1px solid var(--accent-primary, #FF9933)",
                  color: "#FFFFFF",
                  padding: "5px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  boxShadow: "0 2px 10px rgba(255,153,51,0.25)",
                  whiteSpace: "nowrap",
                }}
              >
                <span>🔱</span>
                <span>{userLanguage === "Hindi" || userLanguage === "Sanskrit" ? "महाकाल मेन्यू" : "Mahakal Menu"}</span>
              </button>
              <ThemeSwitcher variant="header" userLanguage={userLanguage} />
            </div>
          </div>

          <div style={{ fontSize: 32, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, fontFamily: "var(--font-heading)" }}>
            {t.heroTitle} <span style={{ color: "var(--accent-primary, #FF9933)" }}>{t.heroSpan}</span>
          </div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
            {t.heroSub}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 14,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 12,
              color: "#FFFFFF",
            }}
          >
            {weatherData?.weather === "Sunny" ? "☀️" : "🌧️"} {weatherData?.temp}°C · {t.weather} ({weatherData?.weather === "Sunny" ? (userLanguage === "Marathi" ? "उष्ण" : userLanguage === "Hindi" ? "धूप" : userLanguage === "Gujarati" ? "તડકો" : "Sunny") : (userLanguage === "Marathi" ? "पाऊस" : userLanguage === "Hindi" ? "बारिश" : userLanguage === "Gujarati" ? "વરસાદ" : "Rainy")})
          </div>
        </div>
      </div>

      {/* Themed Search Bar - Full-width wrapper with centered content */}
      <div className="w-full px-4 sm:px-6 relative z-40" style={{ marginTop: -22 }}>
        <div className="max-w-6xl mx-auto">
          <div
            onClick={onSearchClick}
            style={{
              background: "var(--bg-card, #22222B)",
              borderRadius: 14,
              border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              boxShadow: "var(--card-shadow, 0 8px 24px rgba(0,0,0,0.45))",
              minHeight: 52,
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <span style={{ fontSize: 18, color: "var(--accent-primary, #FF9933)", flexShrink: 0 }}>🔍</span>
            <span style={{ fontSize: 14, color: "var(--text-sub, #A1A1AF)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: "20px" }}>
              {t.searchPlaceholder}
            </span>
            <span 
              onClick={(e) => {
                e.stopPropagation();
                onSearchClick({ showFilters: true });
              }}
              style={{ fontSize: 18, color: "var(--accent-primary, #FF9933)", flexShrink: 0, padding: "2px" }}
            >
              ⚙️
            </span>
          </div>
        </div>
      </div>

      {/* Themed Category Pills */}
      <div className="w-full px-4 sm:px-6 pt-4 pb-2">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto scroll-touch">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "7px 15px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  border: isSelected ? "1px solid var(--accent-primary, #FF9933)" : "1px solid var(--border-subtle, #2E2E3C)",
                  cursor: "pointer",
                  background: isSelected ? "var(--accent-primary, #FF9933)" : "var(--bg-card, #22222B)",
                  color: isSelected ? "var(--cta-text, #0E0E10)" : "var(--text-sub, #A1A1AF)",
                  boxShadow: isSelected ? "0 2px 10px rgba(255,153,51,0.3)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                {userLanguage === "Marathi" ? (translations.Marathi[cat.toLowerCase()] || cat) : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔱 Shri Mahakal Darshan & Booking Menu */}
      <div className="w-full px-4 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto">
          {/* Section Header with Quick Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 800, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
                <span>🔱</span>
                <span>{userLanguage === "Hindi" || userLanguage === "Sanskrit" ? "श्री महाकाल दर्शन एवं बुकिंग मेन्यू" : "Shri Mahakal Darshan & Booking Menu"}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 2 }}>
                {userLanguage === "Hindi"
                  ? "भस्म आरती स्लॉट बुकिंग, ₹250 वीआईपी शीघ्र दर्शन, दैनिक ५ आरती एवं गर्भगृह नियम"
                  : "Bhasma Aarti slot booking, ₹250 VIP Sheegra pass, 5 daily aartis & temple rules"}
              </div>
            </div>
            <button
              onClick={() => openMahakalMenu("passes")}
              style={{
                fontSize: 11,
                color: "var(--accent-primary, #FF9933)",
                background: "rgba(255,153,51,0.12)",
                border: "1px solid rgba(255,153,51,0.25)",
                borderRadius: 14,
                padding: "4px 10px",
                cursor: "pointer",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              🎟️ {userLanguage === "Hindi" ? "मेरे पास" : "My Passes"}
            </button>
          </div>

          {/* 4 Interactive Booking & Seva Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Card 1: Bhasma Aarti Booking */}
            <div
              onClick={() => openMahakalMenu("bhasma")}
              className="rounded-2xl p-4 border border-[var(--border-color,rgba(212,175,55,0.25))] bg-[var(--bg-card,#22222B)] shadow-[var(--card-shadow,0_4px_12px_rgba(0,0,0,0.3))] cursor-pointer hover:border-[var(--accent-primary)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              style={{
                background: "linear-gradient(145deg, rgba(42, 20, 8, 0.45) 0%, var(--bg-card, #22222B) 100%)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: "rgba(255,153,51,0.2)", color: "#FF9933" }}>
                    🔴 04:00 AM RITUAL
                  </span>
                  <span style={{ fontSize: 18 }}>🕉️</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                  {userLanguage === "Hindi" ? "भस्म आरती बुकिंग" : "Bhasma Aarti Booking"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4 }}>
                  {userLanguage === "Hindi"
                    ? "प्रातः 4 बजे विश्वप्रसिद्ध दिव्य भस्म आरती दर्शन हेतु ऑनलाइन कोटा स्लॉट आरक्षित करें।"
                    : "Advance online slot reservation for the world-famous 4 AM sacred cow-dung ash ritual."}
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed rgba(212,175,55,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#34D399", fontWeight: 700 }}>Free Token</span>
                <span style={{ fontSize: 11, color: "var(--accent-primary, #FF9933)", fontWeight: 700 }}>Book Slot →</span>
              </div>
            </div>

            {/* Card 2: VIP / Sheegra Darshan Booking */}
            <div
              onClick={() => openMahakalMenu("vip")}
              className="rounded-2xl p-4 border border-[var(--border-color,rgba(212,175,55,0.25))] bg-[var(--bg-card,#22222B)] shadow-[var(--card-shadow,0_4px_12px_rgba(0,0,0,0.3))] cursor-pointer hover:border-[var(--accent-primary)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              style={{
                background: "linear-gradient(145deg, rgba(212, 175, 55, 0.15) 0%, var(--bg-card, #22222B) 100%)",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: "rgba(212,175,55,0.25)", color: "#D4AF37" }}>
                    ⚡ FAST-TRACK GATE 4
                  </span>
                  <span style={{ fontSize: 18 }}>⚡</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                  {userLanguage === "Hindi" ? "VIP शीघ्र दर्शन (₹250)" : "VIP Sheegra Darshan (₹250)"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4 }}>
                  {userLanguage === "Hindi"
                    ? "गेट नंबर 4 से सीधी प्राथमिकता प्रवेश कतार। सामान्य कतार से बचकर सुगम दर्शन प्राप्त करें।"
                    : "Priority express lane via Gate No. 4 (Bada Ganesh side). Skip general waiting queues."}
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed rgba(212,175,55,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#34D399", fontWeight: 700 }}>₹250 / Person</span>
                <span style={{ fontSize: 11, color: "var(--accent-primary, #FF9933)", fontWeight: 700 }}>Book VIP →</span>
              </div>
            </div>

            {/* Card 3: Daily Aarti Schedule */}
            <div
              onClick={() => openMahakalMenu("aarti")}
              className="rounded-2xl p-4 border border-[var(--border-color,rgba(212,175,55,0.2))] bg-[var(--bg-card,#22222B)] shadow-[var(--card-shadow,0_4px_12px_rgba(0,0,0,0.3))] cursor-pointer hover:border-[var(--accent-primary)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: "rgba(52, 211, 153, 0.15)", color: "#34D399" }}>
                    ⏰ 5 DAILY AARTIS
                  </span>
                  <span style={{ fontSize: 18 }}>🪔</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                  {userLanguage === "Hindi" ? "दैनिक आरती समय" : "Daily Aarti Schedule"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4 }}>
                  {userLanguage === "Hindi"
                    ? "भस्म (4 AM), दद्योदक (7:30 AM), भोग (10:30 AM), संध्या (7 PM), शयन (10:30 PM)।"
                    : "Complete timetable of 5 daily aartis, sanctum open hours and official live webcast."}
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed rgba(212,175,55,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)" }}>Live Timings</span>
                <span style={{ fontSize: 11, color: "var(--accent-primary, #FF9933)", fontWeight: 700 }}>View →</span>
              </div>
            </div>

            {/* Card 4: Dress Code & Protocol */}
            <div
              onClick={() => openMahakalMenu("rules")}
              className="rounded-2xl p-4 border border-[var(--border-color,rgba(212,175,55,0.2))] bg-[var(--bg-card,#22222B)] shadow-[var(--card-shadow,0_4px_12px_rgba(0,0,0,0.3))] cursor-pointer hover:border-[var(--accent-primary)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6, background: "rgba(244, 63, 94, 0.15)", color: "#FB7185" }}>
                    👗 DRESS CODE & RULES
                  </span>
                  <span style={{ fontSize: 18 }}>📜</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", fontFamily: "var(--font-heading)" }}>
                  {userLanguage === "Hindi" ? "नियम व वेशभूषा" : "Rules & Guidelines"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4 }}>
                  {userLanguage === "Hindi"
                    ? "गर्भगृह सोला/धोती नियम, डिजिटल फ्री लॉकर, व्हीलचेयर एवं महाकाल लोक सहायता।"
                    : "Traditional unstitched Dhoti/Solah dress code, cloakrooms, senior battery carts."}
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px dashed rgba(212,175,55,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)" }}>Temple Protocol</span>
                <span style={{ fontSize: 11, color: "var(--accent-primary, #FF9933)", fontWeight: 700 }}>Read →</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avantika Mahakal Vichar Banner */}
      <div className="w-full px-4 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div 
            style={{ 
              background: "linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(212,175,55,0.12) 100%)",
              borderRadius: 14,
              padding: "14px 18px",
              border: "1px solid var(--accent-secondary, #D4AF37)",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-primary, #FF9933)", textTransform: "uppercase", letterSpacing: 1 }}>
                {userLanguage === "Hindi" ? "महाकाल संदेश · अवन्तिका विचार" : "Mahakal Sandesh · Avantika Lore"} 🕉️
              </div>
              <div style={{ fontSize: 16 }}>🔱</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>
              "आकाशे तारकं लिङ्गं पाताले हाटकेश्वरम् । भूलोके च महाकालो लिङ्गत्रय नमोऽस्तु ते ॥"
            </div>
            <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4 }}>
              {userLanguage === "Hindi" 
                ? "महाकाल ज्योतिर्लिंग पृथ्वी लोक का अधिपति है — जय श्री महाकाल!" 
                : "Reverence to Lord Mahakal, the supreme guardian of Earth at Avantika!"}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Spots */}
      <div className="w-full px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
              {t.popularSpots}
            </div>
            <div onClick={onSearchClick} style={{ fontSize: 12, color: "var(--accent-primary, #FF9933)", cursor: "pointer", fontWeight: 600 }}>
              {t.seeAll}
            </div>
          </div>

          <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-2 scroll-touch">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} onClick={onPlaceSelect} userLocation={userLocation} userLanguage={userLanguage} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events & Celebrity Concerts */}
      <div className="w-full px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
                {t.nearbyEvents}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 2 }}>
                Live artist concerts, comedy specials & Ujjain cultural festivals
              </div>
            </div>
            <div 
              onClick={() => setShowAllEvents(!showAllEvents)}
              style={{ fontSize: 12, color: "var(--accent-primary, #FF9933)", cursor: "pointer", fontWeight: 600 }}
            >
              {showAllEvents ? t.showLess : t.more}
            </div>
          </div>

          {/* ⏰ Dynamic Time-Engine Controls (Live Auto-Roller + Month Simulator) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
            {/* Timeframe Filter Pills */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto" }} className="scroll-touch">
              {[
                { id: "all", label: "🗓️ All Upcoming" },
                { id: "this_month", label: "⚡ This Month" },
                { id: "next_month", label: "🌟 Next Month" },
                { id: "upcoming", label: "⏳ Later Months" },
              ].map((pill) => {
                const active = eventTimeframe === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setEventTimeframe(pill.id)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 16,
                      fontSize: 10,
                      fontWeight: active ? 700 : 500,
                      border: active ? "1px solid var(--accent-primary, #FF9933)" : "1px solid var(--border-color, rgba(212,175,55,0.2))",
                      background: active ? "rgba(255,153,51,0.2)" : "var(--bg-card, #22222B)",
                      color: active ? "var(--accent-primary, #FF9933)" : "var(--text-sub, #A1A1AF)",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Live Auto-Roll / Month Simulator Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}>
              <span style={{ color: "var(--text-sub, #A1A1AF)", whiteSpace: "nowrap" }}>Time Engine:</span>
              <select
                value={simulatedTime}
                onChange={(e) => setSimulatedTime(e.target.value)}
                style={{
                  background: "var(--bg-card, #22222B)",
                  color: "var(--accent-primary, #FF9933)",
                  border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
                  borderRadius: 8,
                  padding: "4px 8px",
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="live">🔴 Live Auto-Roll (Real Time)</option>
                <option value="january">❄️ Preview If January 2027</option>
                <option value="march">🌸 Preview If March 2027</option>
              </select>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10, marginBottom: 8 }} className="scroll-touch">
            {[
              { id: "All", label: "All Categories" },
              { id: "Concerts", label: "🎵 Celebrity Concerts" },
              { id: "Comedy", label: "🎤 Standup & Comedy" },
              { id: "Festivals", label: "🕉️ Festivals" },
            ].map((pill) => {
              const active = eventCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setEventCategory(pill.id)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: active ? 700 : 500,
                    border: active ? "1px solid var(--accent-primary, #FF9933)" : "1px solid var(--border-color, rgba(212,175,55,0.2))",
                    background: active ? "rgba(255,153,51,0.18)" : "var(--bg-card, #22222B)",
                    color: active ? "var(--accent-primary, #FF9933)" : "var(--text-sub, #A1A1AF)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease"
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Events List / Grid */}
          {(() => {
            const filteredEvents = events.filter((ev) => {
              // Timeframe filter
              if (eventTimeframe !== "all" && ev.timeframe && ev.timeframe !== eventTimeframe) {
                return false;
              }
              // Category filter
              if (eventCategory === "All") return true;
              if (eventCategory === "Concerts") {
                const cat = (ev.category || "").toLowerCase();
                return cat.includes("concert") || cat.includes("classical");
              }
              if (eventCategory === "Comedy") {
                const cat = (ev.category || "").toLowerCase();
                return cat.includes("comedy");
              }
              if (eventCategory === "Festivals") {
                const cat = (ev.category || "").toLowerCase();
                return cat.includes("festival");
              }
              return true;
            });

            const displayList = showAllEvents ? filteredEvents : filteredEvents.slice(0, 4);

            return (
              <div className={`flex sm:grid ${showAllEvents ? "flex-col sm:grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2 md:grid-cols-4"} gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-6 scroll-touch`}>
                {displayList.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => { setSelectedEvent(ev); setBookingNotice(null); }}
                    className="w-[220px] sm:w-auto flex-shrink-0 sm:flex-shrink rounded-2xl p-3.5 sm:p-4 border border-[var(--border-color,rgba(212,175,55,0.2))] bg-[var(--bg-card,#22222B)] shadow-[var(--card-shadow,0_4px_12px_rgba(0,0,0,0.3))] cursor-pointer hover:border-[var(--accent-primary)] hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Badge & Date row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            padding: "2px 7px",
                            borderRadius: 6,
                            background: ev.category?.toLowerCase().includes("concert") 
                              ? "rgba(255, 153, 51, 0.2)" 
                              : ev.category?.toLowerCase().includes("comedy") 
                              ? "rgba(244, 63, 94, 0.2)" 
                              : "rgba(16, 185, 129, 0.2)",
                            color: ev.category?.toLowerCase().includes("concert")
                              ? "#FF9933"
                              : ev.category?.toLowerCase().includes("comedy")
                              ? "#FB7185"
                              : "#34D399",
                            letterSpacing: "0.4px"
                          }}
                        >
                          {ev.badge || ev.category?.toUpperCase() || "EVENT"}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--accent-primary, #FF9933)",
                            letterSpacing: "0.4px",
                          }}
                        >
                          {ev.date}
                        </span>
                      </div>

                      {/* Dynamic Countdown Chip */}
                      {ev.countdown && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 6, background: "rgba(255, 153, 51, 0.12)", color: "var(--accent-primary, #FF9933)", fontSize: 9, fontWeight: 700, marginBottom: 6, width: "fit-content" }}>
                          <span>⏳</span>
                          <span>{ev.countdown}</span>
                        </div>
                      )}

                      {/* Performing Artist (if present) */}
                      {ev.artist && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-primary, #FF9933)", marginBottom: 2, display: "flex", alignItems: "center", gap: 4 }}>
                          <span>🎙️</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.artist}</span>
                        </div>
                      )}

                      {/* Event Title */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)", lineHeight: 1.3 }}>
                        {ev.name}
                      </div>

                      {/* Venue Snippet */}
                      {ev.venue && (
                        <div style={{ fontSize: 10, color: "var(--text-sub, #A1A1AF)", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                          <span>📍</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.venue}</span>
                        </div>
                      )}

                      {/* Description Snippet */}
                      <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {ev.desc}
                      </div>
                    </div>

                    {/* Bottom Ticket / Booking hint */}
                    {ev.ticket && (
                      <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px dashed var(--border-color, rgba(212,175,55,0.2))", fontSize: 10, color: "#34D399", fontWeight: 600 }}>
                        🎟️ {ev.ticket}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* 🎭 THEMED EVENT & CELEBRITY CONCERT DETAILS MODAL */}
      {selectedEvent && (
        <div 
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            backdropFilter: "blur(10px)"
          }}
        >
          <div
            style={{
              background: "var(--bg-surface, #18181D)",
              border: "1px solid var(--border-color, rgba(212,175,55,0.35))",
              width: "100%", maxWidth: 380, borderRadius: 24, padding: 22,
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: 8,
                  background: selectedEvent.category?.toLowerCase().includes("concert")
                    ? "rgba(255, 153, 51, 0.2)"
                    : selectedEvent.category?.toLowerCase().includes("comedy")
                    ? "rgba(244, 63, 94, 0.2)"
                    : "rgba(16, 185, 129, 0.2)",
                  color: selectedEvent.category?.toLowerCase().includes("concert")
                    ? "#FF9933"
                    : selectedEvent.category?.toLowerCase().includes("comedy")
                    ? "#FB7185"
                    : "#34D399",
                }}
              >
                {selectedEvent.badge || selectedEvent.category?.toUpperCase() || "EVENT"}
              </span>
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{ background: "var(--bg-elevated, #2A2A36)", color: "var(--text-main, #fff)", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 13, fontWeight: "bold" }}
              >
                ✕
              </button>
            </div>

            {/* Event Name */}
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main, #F5F5F7)", marginBottom: 10, fontFamily: "var(--font-heading)", lineHeight: 1.3 }}>
              {selectedEvent.name}
            </div>

            {/* Featured Artist Block */}
            {selectedEvent.artist && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  background: "rgba(255, 153, 51, 0.1)",
                  borderRadius: 12,
                  border: "1px solid rgba(255, 153, 51, 0.25)",
                  marginBottom: 12
                }}
              >
                <span style={{ fontSize: 20 }}>🎙️</span>
                <div>
                  <div style={{ fontSize: 10, color: "var(--accent-primary, #FF9933)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                    Performing Artist
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
                    {selectedEvent.artist}
                  </div>
                </div>
              </div>
            )}

            {/* Key Event Details */}
            <div style={{ background: "var(--bg-card, #22222B)", borderRadius: 14, padding: "12px 14px", marginBottom: 14, border: "1px solid var(--border-color, rgba(212,175,55,0.15))" }}>
              {selectedEvent.countdown && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--accent-primary, #FF9933)", fontWeight: 700, marginBottom: 8 }}>
                  <span style={{ fontSize: 14 }}>⏳</span>
                  <span>{selectedEvent.countdown} {selectedEvent.monthName ? `· Scheduled for ${selectedEvent.monthName}` : ""}</span>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-main, #F5F5F7)", marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>📅</span>
                <div>
                  <strong>{selectedEvent.date}</strong>
                  {selectedEvent.time && <span style={{ color: "var(--text-sub, #A1A1AF)" }}> · {selectedEvent.time}</span>}
                </div>
              </div>

              {selectedEvent.venue && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--text-sub, #A1A1AF)", marginBottom: selectedEvent.ticket ? 8 : 0 }}>
                  <span style={{ fontSize: 14 }}>📍</span>
                  <span style={{ lineHeight: 1.4 }}>{selectedEvent.venue}</span>
                </div>
              )}

              {selectedEvent.ticket && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#34D399", fontWeight: 700 }}>
                  <span style={{ fontSize: 14 }}>🎟️</span>
                  <span>{selectedEvent.ticket}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ fontSize: 13, color: "var(--text-sub, #A1A1AF)", lineHeight: 1.5, marginBottom: 16 }}>
              {selectedEvent.desc}
            </div>

            {/* Booking Notice / Alert */}
            {bookingNotice && (
              <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: "#34D399", lineHeight: 1.4 }}>
                {bookingNotice}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button 
                onClick={() => setBookingNotice(`🎟️ Ticket Info: Available via official booking partner (${selectedEvent.ticket || "Official Venue Desk"}). Open partner platform for live seat selection.`)}
                style={{
                  width: "100%", padding: "12px", borderRadius: 12, border: "none",
                  background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
                  color: "var(--cta-text, #0E0E10)", fontWeight: 700, cursor: "pointer", fontSize: 13
                }}
              >
                🎟️ Book Passes / Get Info
              </button>

              <button 
                onClick={() => setSelectedEvent(null)}
                style={{
                  width: "100%", padding: "10px", borderRadius: 12,
                  border: "1px solid var(--border-color, rgba(212,175,55,0.2))",
                  background: "transparent",
                  color: "var(--text-sub, #A1A1AF)", fontWeight: 600, cursor: "pointer", fontSize: 12
                }}
              >
                {userLanguage === "Marathi" ? "बंद करा" :
                 userLanguage === "Hindi" ? "बंद करें" :
                 userLanguage === "Gujarati" ? "બંધ કરો" :
                 "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔱 Shree Mahakal Darshan & Aarti Booking Modal */}
      <MahakalBookingModal
        isOpen={isMahakalModalOpen}
        onClose={() => setIsMahakalModalOpen(false)}
        initialTab={mahakalModalTab}
        userLanguage={userLanguage}
      />
    </div>
  );
}
