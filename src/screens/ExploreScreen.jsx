import { useState, useEffect, useMemo } from "react";
import StatusBar from "../components/StatusBar";
import PlaceListItem from "../components/PlaceListItem";
import ThemeSwitcher from "../components/ThemeSwitcher";
import { categories } from "../data/puneData";
import { fetchPlaces } from "../data/api";
import { translations } from "../data/translations";

export default function ExploreScreen({ onPlaceSelect, initialParams = {}, userLocation, userLanguage }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState(initialParams.q || "");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(initialParams.showFilters || false);
  const [sortBy, setSortBy] = useState("rating"); // 'rating' or 'name'
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const t = translations[userLanguage] || translations.English;

  // Advanced Filters
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [priceFilter, setPriceFilter] = useState("All"); // 'All', 'Free', 'Paid'
  const [onlyTopRated, setOnlyTopRated] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById('explore-scroll-container');
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowScrollTop(scrollContainer.scrollTop > 300);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById('explore-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let isCurrent = true;
    const loadPlaces = async () => {
      setLoading(true);
      try {
        // When user types in search, search across ALL categories so results are not cut off
        const queryCategory = search.trim() ? "All" : activeFilter;
        const data = await fetchPlaces({ category: queryCategory, q: search.trim() });
        if (isCurrent) {
          setPlaces(data || []);
        }
      } catch (error) {
        console.error("Failed to load explore data:", error);
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(loadPlaces, 150); // Rapid 150ms debounce
    return () => {
      isCurrent = false;
      clearTimeout(timeoutId);
    };
  }, [activeFilter, search]);

  const filteredAndSortedPlaces = useMemo(() => {
    return [...places]
      .filter((p) => {
        if (onlyAccessible && !p.accessible) return false;
        if (onlyTopRated && p.rating < 4.5) return false;
        if (priceFilter === "Free" && p.entryFee !== "Free" && p.entryFee !== "—") return false;
        if (priceFilter === "Paid" && (p.entryFee === "Free" || p.entryFee === "—")) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [places, onlyAccessible, onlyTopRated, priceFilter, sortBy]);

  return (
    <div style={{ background: "var(--bg-primary, #0E0E10)", height: "100%", display: "flex", flexDirection: "column", transition: "background 0.3s ease" }}>
      {/* Fixed Header Section */}
      <div style={{ background: "var(--bg-primary, #0E0E10)", zIndex: 10, borderBottom: "1px solid var(--border-color, rgba(212,175,55,0.2))" }}>
        <StatusBar />
        
        {/* Header Title & Switcher */}
        <div style={{ padding: "10px 16px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
              {t.exploreTitle} 🔱
            </div>
            <ThemeSwitcher variant="header" userLanguage={userLanguage} />
          </div>

          {/* Non-cutting, Full Width Search Engine Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                background: "var(--bg-card, #22222B)",
                border: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
                borderRadius: 14,
                padding: "4px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                height: 44,
                boxSizing: "border-box"
              }}
            >
              <span style={{ fontSize: 15, color: "var(--accent-primary, #FF9933)", flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "var(--text-main, #F5F5F7)",
                  width: "100%",
                  minWidth: 0,
                  fontFamily: "inherit",
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  style={{
                    background: "var(--bg-elevated, #333)",
                    border: "none",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    fontSize: 11,
                    color: "var(--text-main, #fff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <div
              onClick={() => setShowFilters(true)}
              style={{
                width: 44,
                height: 44,
                background: "var(--accent-primary, #FF9933)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255,153,51,0.3)",
                flexShrink: 0
              }}
              title="Filters"
            >
              <span style={{ fontSize: 18, color: "var(--cta-text, #0E0E10)" }}>⚙️</span>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ 
          display: "flex", gap: 6, padding: "0 16px 12px", overflowX: "auto", 
          background: "transparent", paddingBottom: 12
        }}>
          {categories.map((cat) => {
            const isSelected = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveFilter(cat);
                  if (search) setSearch(""); // Reset search when explicitly picking category
                }}
                style={{
                  padding: "5px 12px",
                  borderRadius: 16,
                  fontSize: 11,
                  fontWeight: isSelected ? 700 : 500,
                  flexShrink: 0,
                  border: isSelected ? "1px solid var(--accent-primary, #FF9933)" : "1px solid var(--border-subtle, #333)",
                  cursor: "pointer",
                  background: isSelected ? "var(--accent-primary, #FF9933)" : "var(--bg-card, #22222B)",
                  color: isSelected ? "var(--cta-text, #0E0E10)" : "var(--text-sub, #A1A1AF)",
                  transition: "all 0.15s ease",
                }}
              >
                {userLanguage === "Marathi" ? (translations.Marathi[cat.toLowerCase()] || cat) : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Search Results Area */}
      <div 
        id="explore-scroll-container"
        onScroll={(e) => setShowScrollTop(e.target.scrollTop > 300)}
        style={{ flex: 1, overflowY: "auto", paddingBottom: 80, background: "var(--bg-primary, #0E0E10)" }}
      >
        {loading ? (
          <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--accent-primary, #FF9933)", fontSize: 13, fontWeight: 600 }}>
            🔍 {userLanguage === "Hindi" ? "स्थान खोज रहे हैं..." : "Searching sacred spots..."}
          </div>
        ) : filteredAndSortedPlaces.length === 0 ? (
          <div style={{ padding: "48px 16px", textAlign: "center", color: "var(--text-sub, #A1A1AF)", fontSize: 13 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div style={{ fontWeight: 700, color: "var(--text-main, #F5F5F7)", marginBottom: 4 }}>
              {userLanguage === "Hindi" ? "कोई परिणाम नहीं मिला" : "No places found"}
            </div>
            <div>{t.noPlaces}</div>
          </div>
        ) : (
          filteredAndSortedPlaces.map((place) => (
            <PlaceListItem key={place.id || place.name} place={place} onClick={onPlaceSelect} userLocation={userLocation} userLanguage={userLanguage} />
          ))
        )}
      </div>

      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          style={{
            position: "absolute",
            bottom: 74,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "var(--accent-primary, #FF9933)",
            color: "var(--cta-text, #0E0E10)",
            border: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            cursor: "pointer",
            zIndex: 40,
          }}
        >
          ↑
        </button>
      )}

      {/* Filter Modal */}
      {showFilters && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              background: "var(--bg-surface, #18181D)",
              borderTop: "1.5px solid var(--border-color, rgba(212,175,55,0.3))",
              width: "100%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
              boxShadow: "0 -8px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-main, #F5F5F7)", fontFamily: "var(--font-heading)" }}>
                {t.filter} & {t.sort}
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                style={{ background: "none", border: "none", fontSize: 18, color: "var(--text-sub, #aaa)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent-primary, #FF9933)", marginBottom: 8 }}>
                {t.sort}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["rating", "name"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSortBy(s)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 10,
                      border: sortBy === s ? "1.5px solid var(--accent-primary, #FF9933)" : "1px solid var(--border-subtle, #333)",
                      background: sortBy === s ? "var(--bg-elevated, #2A2A36)" : "var(--bg-card, #22222B)",
                      color: "var(--text-main, #F5F5F7)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {s === "rating" ? "⭐ " + (userLanguage === "Hindi" ? "रेटिंग" : "Rating") : "🔤 " + (userLanguage === "Hindi" ? "नाम" : "Name")}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(false)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "var(--cta-bg, linear-gradient(135deg, #FF9933 0%, #D4AF37 100%))",
                color: "var(--cta-text, #0E0E10)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                marginTop: 8,
              }}
            >
              {userLanguage === "Hindi" ? "फ़िल्टर लागू करें" : "Apply Filters"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
