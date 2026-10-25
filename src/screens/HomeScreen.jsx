import { useState, useEffect } from "react";
import StatusBar from "../components/StatusBar";
import PlaceCard from "../components/PlaceCard";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { categories } from "../data/puneData";
import { fetchPlaces, fetchEvents } from "../data/api";
import { translations } from "../data/translations";

export default function HomeScreen({ onPlaceSelect, onSearchClick, userLocation, userLanguage, weatherData, onWeatherToggle }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [places, setPlaces] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const t = translations[userLanguage] || translations.English;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [placesData, eventsData] = await Promise.all([
          fetchPlaces({ category: activeCategory }),
          fetchEvents()
        ]);
        setPlaces(placesData.slice(0, 4));
        setEvents(eventsData);
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCategory]);

  if (loading && places.length === 0) {
    return (
      <div style={{ background: "var(--bg-primary, #0E0E10)", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--accent-primary, #FF9933)", fontWeight: 600 }}>
          {userLanguage === "Hindi" ? "उज्जैन दर्शन लोड हो रहा है..." :
           userLanguage === "Sanskrit" ? "अवन्तिका दर्शनम् प्रस्तूयते..." :
           userLanguage === "Marathi" ? "उज्जैन लोड होत आहे..." :
           userLanguage === "Gujarati" ? "ઉજ્જૈન દર્શન લોડ થઈ રહ્યું છે..." :
           "Loading Ujjain Explorer..."}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary, #0E0E10)", minHeight: "100%", height: "100%", overflowY: "auto", paddingBottom: 84, transition: "background 0.3s ease" }}>
      <StatusBar light={true} />

      {/* Hero with Flagship Aesthetics & Integrated Theme Switcher */}
      <div
        style={{
          background: "var(--hero-gradient, linear-gradient(135deg, #1C0F08 0%, #0E0E10 100%))",
          borderBottom: "1px solid var(--hero-border, rgba(255,153,51,0.25))",
          padding: "16px 20px 24px",
          position: "relative",
          zIndex: 30,
          transition: "background 0.3s ease",
        }}
      >
        {/* Decorative ambient aura clipped within this layer */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute", top: -20, right: -30,
              width: 160, height: 160, borderRadius: "50%",
              background: "rgba(255,153,51,0.08)",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -40, left: -20,
              width: 120, height: 120, borderRadius: "50%",
              background: "rgba(212,175,55,0.06)",
            }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 10 }}>
          {/* Top Bar with Greeting & Flagship Theme Switcher */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: 0.5, textTransform: "uppercase" }}>
              {t.greeting}
            </div>
            <ThemeSwitcher variant="header" userLanguage={userLanguage} />
          </div>

          <div style={{ fontSize: 30, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, fontFamily: "var(--font-heading)" }}>
            {t.heroTitle} <span style={{ color: "var(--accent-primary, #FF9933)" }}>{t.heroSpan}</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
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

      {/* Themed Search Bar */}
      <div style={{ background: "transparent", padding: "0 16px 6px", position: "relative", zIndex: 25 }}>
        <div
          onClick={onSearchClick}
          style={{
            marginTop: -16,
            background: "var(--bg-card, #22222B)",
            borderRadius: 14,
            border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "relative",
            cursor: "pointer",
            boxShadow: "var(--card-shadow, 0 6px 20px rgba(0,0,0,0.5))",
            height: 46,
            boxSizing: "border-box",
          }}
        >
          <span style={{ fontSize: 16, color: "var(--accent-primary, #FF9933)", flexShrink: 0 }}>🔍</span>
          <span style={{ fontSize: 13, color: "var(--text-sub, #A1A1AF)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {t.searchPlaceholder}
          </span>
          <span 
            onClick={(e) => {
              e.stopPropagation();
              onSearchClick({ showFilters: true });
            }}
            style={{ fontSize: 16, color: "var(--accent-primary, #FF9933)", flexShrink: 0 }}
          >
            ⚙️
          </span>
        </div>
      </div>

      {/* Themed Category Pills */}
      <div style={{ display: "flex", gap: 8, padding: "14px 16px 8px", overflowX: "auto" }}>
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
                padding: "7px 14px",
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

      {/* Avantika Mahakal Vichar Banner */}
      <div style={{ padding: "8px 16px 14px" }}>
        <div 
          style={{ 
            background: "linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(212,175,55,0.12) 100%)",
            borderRadius: 14,
            padding: "12px 16px",
            border: "1px solid var(--accent-secondary, #D4AF37)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent-primary, #FF9933)", textTransform: "uppercase", letterSpacing: 1 }}>
              {userLanguage === "Hindi" ? "महाकाल संदेश · अवन्तिका विचार" : "Mahakal Sandesh · Avantika Lore"} 🕉️
            </div>
            <div style={{ fontSize: 14 }}>🔱</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginTop: 4, fontStyle: "italic", lineHeight: 1.4 }}>
            "आकाशे तारकं लिङ्गं पाताले हाटकेश्वरम् । भूलोके च महाकालो लिङ्गत्रय नमोऽस्तु ते ॥"
          </div>
          <div style={{ fontSize: 10, color: "var(--text-sub, #A1A1AF)", marginTop: 4 }}>
            {userLanguage === "Hindi" 
              ? "महाकाल ज्योतिर्लिंग पृथ्वी लोक का अधिपति है — जय श्री महाकाल!" 
              : "Reverence to Lord Mahakal, the supreme guardian of Earth at Avantika!"}
          </div>
        </div>
      </div>

      {/* Popular Spots */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "6px 16px 10px",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
            {t.popularSpots}
          </div>
          <div onClick={onSearchClick} style={{ fontSize: 12, color: "var(--accent-primary, #FF9933)", cursor: "pointer", fontWeight: 600 }}>
            {t.seeAll}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "0 16px 16px", overflowX: "auto" }}>
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} onClick={onPlaceSelect} userLocation={userLocation} userLanguage={userLanguage} />
          ))}
        </div>
      </div>

      {/* Nearby Events */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "4px 16px 10px",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
            {t.nearbyEvents}
          </div>
          <div 
            onClick={() => setShowAllEvents(!showAllEvents)}
            style={{ fontSize: 12, color: "var(--accent-primary, #FF9933)", cursor: "pointer", fontWeight: 600 }}
          >
            {showAllEvents ? t.showLess : t.more}
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          gap: 10, 
          padding: "0 16px 20px", 
          flexDirection: showAllEvents ? "column" : "row",
          overflowX: showAllEvents ? "visible" : "auto"
        }}>
          {(showAllEvents ? events : events.slice(0, 2)).map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              style={{
                flex: showAllEvents ? "none" : 1,
                minWidth: showAllEvents ? "auto" : 160,
                background: "var(--bg-card, #22222B)",
                borderRadius: 14,
                border: "1px solid var(--border-color, rgba(212,175,55,0.2))",
                padding: "11px 13px",
                cursor: "pointer",
                marginBottom: showAllEvents ? 8 : 0,
                boxShadow: "var(--card-shadow, 0 4px 12px rgba(0,0,0,0.3))",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--accent-primary, #FF9933)",
                  marginBottom: 3,
                }}
              >
                {ev.date}
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>{ev.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-sub, #A1A1AF)", marginTop: 2 }}>{ev.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎭 THEMED EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div 
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            backdropFilter: "blur(8px)"
          }}
        >
          <div
            style={{
              background: "var(--bg-surface, #18181D)",
              border: "1px solid var(--border-color, rgba(212,175,55,0.3))",
              width: "100%", maxWidth: 340, borderRadius: 24, padding: 24,
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-primary, #FF9933)", textTransform: "uppercase" }}>
                {selectedEvent.date}
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{ background: "var(--bg-elevated, #2A2A36)", color: "var(--text-main, #fff)", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main, #F5F5F7)", marginBottom: 10, fontFamily: "var(--font-heading)" }}>
              {selectedEvent.name}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-sub, #A1A1AF)", lineHeight: 1.5, marginBottom: 20 }}>
              {selectedEvent.desc}
            </div>
            <button 
              onClick={() => setSelectedEvent(null)}
              style={{
                width: "100%", padding: "12px", borderRadius: 12, border: "none",
                background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
                color: "var(--cta-text, #0E0E10)", fontWeight: 700, cursor: "pointer", fontSize: 13
              }}
            >
              {userLanguage === "Marathi" ? "बंद करा" :
               userLanguage === "Hindi" ? "बंद करें" :
               userLanguage === "Gujarati" ? "બંધ કરો" :
               "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
