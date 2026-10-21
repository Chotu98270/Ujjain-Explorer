import { useState, useEffect } from "react";
import StatusBar from "../components/StatusBar";
import PlaceCard from "../components/PlaceCard";
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

  if (loading) {
    return (
      <div style={{ background: "#FAF6EE", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#D9531E", fontWeight: 600 }}>
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
    <div style={{ background: "#FAF6EE", height: "100%", overflowY: "auto", paddingBottom: 80 }}>
      <StatusBar light={true} />

      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #D9531E 0%, #9E2A2B 100%)",
          padding: "20px 20px 28px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute", top: -20, right: -30,
            width: 160, height: 160, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -40, left: -20,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 4, letterSpacing: 0.5 }}>
            {t.greeting}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.1, fontFamily: 'Mukta' }}>
            {t.heroTitle} <span style={{ color: "#FF9933" }}>{t.heroSpan}</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
            {t.heroSub}
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              marginTop: 16,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: "5px 12px",
              fontSize: 12,
              color: "#fff",
            }}
          >
            {weatherData?.weather === "Sunny" ? "☀️" : "🌧️"} {weatherData?.temp}°C · {t.weather} ({weatherData?.weather === "Sunny" ? (userLanguage === "Marathi" ? "उष्ण" : userLanguage === "Hindi" ? "धूप" : userLanguage === "Gujarati" ? "તડકો" : "Sunny") : (userLanguage === "Marathi" ? "पाऊस" : userLanguage === "Hindi" ? "बारिश" : userLanguage === "Gujarati" ? "વરસાદ" : "Rainy")})
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ background: "#FBF8F3", paddingBottom: 10 }}>
        <div
          onClick={onSearchClick}
          style={{
            margin: "-16px 16px 0",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #EDE8DF",
            padding: "11px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            position: "relative",
            zIndex: 2,
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 16, color: "#6B5B52" }}>🔍</span>
          <span style={{ fontSize: 13, color: "#6B5B52", flex: 1 }}>
            {t.searchPlaceholder}
          </span>
          <span 
            onClick={(e) => {
              e.stopPropagation();
              onSearchClick({ showFilters: true });
            }}
            style={{ fontSize: 16, color: "#8B3A2A" }}
          >
            ⚙️
          </span>
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, padding: "12px 16px 8px", overflowX: "auto" }}>
        {categories.map((cat) => (
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
              fontWeight: 500,
              whiteSpace: "nowrap",
              flexShrink: 0,
              border: "none",
              cursor: "pointer",
              background: activeCategory === cat ? "#8B3A2A" : "#EDE8DF",
              color: activeCategory === cat ? "#fff" : "#6B5B52",
            }}
          >
            {userLanguage === "Marathi" ? (translations.Marathi[cat.toLowerCase()] || cat) : cat}
          </button>
        ))}
      </div>

      {/* Avantika Mahakal Vichar Widget */}
      <div style={{ padding: "8px 16px 16px" }}>
        <div 
          style={{ 
            background: "linear-gradient(135deg, #D9531E 0%, #C88617 100%)", borderRadius: 12, padding: "12px 16px",
            border: "2px solid #D4AF37", boxShadow: "4px 4px 0 rgba(0,0,0,0.1)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 1 }}>
              {userLanguage === "Hindi" ? "महाकाल संदेश · अवन्तिका विचार" : "Mahakal Sandesh · Avantika"} 🕉️
            </div>
            <div style={{ fontSize: 14 }}>🔱</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4, fontStyle: "italic" }}>
            "आकाशे तारकं लिङ्गं पाताले हाटकेश्वरम् । भूलोके च महाकालो लिङ्गत्रय नमोऽस्तु ते ॥"
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>
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
            padding: "8px 16px 10px",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1412" }}>{t.popularSpots}</div>
          <div onClick={onSearchClick} style={{ fontSize: 12, color: "#D9531E", cursor: "pointer", fontWeight: 600 }}>{t.seeAll}</div>
        </div>

        <div style={{ display: "flex", gap: 10, padding: "0 16px 16px", overflowX: "auto" }}>
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} onClick={onPlaceSelect} userLocation={userLocation} />
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
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1C1412" }}>{t.nearbyEvents}</div>
          <div 
            onClick={() => setShowAllEvents(!showAllEvents)}
            style={{ fontSize: 12, color: "#8B3A2A", cursor: "pointer" }}
          >
            {showAllEvents ? t.showLess : t.more}
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          gap: 8, 
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
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #EDE8DF",
                padding: "10px 12px",
                cursor: "pointer",
                marginBottom: showAllEvents ? 8 : 0
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: ev.color === "terracotta" ? "#8B3A2A" : "#3D3680",
                  marginBottom: 3,
                }}
              >
                {ev.date}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1C1412" }}>{ev.name}</div>
              <div style={{ fontSize: 11, color: "#6B5B52", marginTop: 2 }}>{ev.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎭 EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div 
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            backdropFilter: "blur(4px)"
          }}
        >
          <div style={{ background: "#fff", width: "100%", maxWidth: 340, borderRadius: 24, padding: 24, boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: selectedEvent.color === "terracotta" ? "#8B3A2A" : "#3D3680", textTransform: "uppercase" }}>
                {selectedEvent.date}
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                style={{ background: "#EDE8DF", border: "none", width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 12, fontWeight: "bold" }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1C1412", marginBottom: 10, fontFamily: "Mukta" }}>
              {selectedEvent.name}
            </div>
            <div style={{ fontSize: 13, color: "#6B5B52", lineHeight: 1.5, marginBottom: 20 }}>
              {selectedEvent.desc}
            </div>
            <button 
              onClick={() => setSelectedEvent(null)}
              style={{
                width: "100%", padding: "12px", borderRadius: 12, border: "none",
                background: selectedEvent.color === "terracotta" ? "#8B3A2A" : "#3D3680",
                color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13
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
