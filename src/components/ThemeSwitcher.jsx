import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme, THEMES, THEME_DETAILS } from "../context/ThemeContext";

export default function ThemeSwitcher({ variant = "header", userLanguage = "English" }) {
  const { theme, isAuto, setTheme, toggleAuto, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click or touch outside
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleDocumentClick);
      document.addEventListener("touchstart", handleDocumentClick, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("touchstart", handleDocumentClick);
    };
  }, [isOpen]);

  const themesList = [
    {
      id: THEMES.MAHAKAL,
      icon: "🌑",
      badge: "🔱",
      name: "Mahakal Mystique",
      nameHi: "महाकाल मिस्टीक",
      sub: "Spiritual Royal Dark",
      color: "#FF9933",
      bg: "#18181D"
    },
    {
      id: THEMES.SHIPRA,
      icon: "🌅",
      badge: "🪔",
      name: "Shipra Dawn",
      nameHi: "शिप्रा उषाकाल",
      sub: "Serene Traditional Light",
      color: "#1B4F72",
      bg: "#FAF9F6"
    },
    {
      id: THEMES.KUMBH,
      icon: "🎪",
      badge: "🚩",
      name: "Kumbh Vibrant",
      nameHi: "कुम्भ महोत्सव",
      sub: "Festive Modern Mela",
      color: "#5B2C6F",
      bg: "#FFFFFF"
    }
  ];

  // Inline Segmented Controller for Settings / Profile screen
  if (variant === "full") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {themesList.map((t) => {
            const isSelected = theme === t.id && !isAuto;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                style={{
                  padding: "12px 8px",
                  borderRadius: 14,
                  border: isSelected ? `2px solid ${t.color}` : "1.5px solid var(--border-subtle, #333)",
                  background: isSelected ? "var(--bg-elevated, #2A2A36)" : "var(--bg-card, #22222B)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected ? `0 4px 14px ${t.color}33` : "none",
                }}
              >
                <div style={{ fontSize: 22 }}>{t.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main, #fff)", textAlign: "center" }}>
                  {userLanguage === "Hindi" || userLanguage === "Sanskrit" ? t.nameHi : t.name}
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted, #888)", textAlign: "center", lineHeight: 1.1 }}>
                  {t.sub}
                </div>
              </button>
            );
          })}
        </div>

        {/* Auto Kāla Chakra Mode Toggle */}
        <div
          onClick={toggleAuto}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderRadius: 12,
            background: isAuto ? "rgba(255,153,51,0.12)" : "var(--bg-card, #22222B)",
            border: isAuto ? "1.5px solid #FF9933" : "1px solid var(--border-subtle, #333)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>⌛</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-main, #fff)" }}>
                {userLanguage === "Hindi" ? "काल चक्र (स्वचालित समय चक्र)" : "Kāla Chakra (Auto Diurnal Engine)"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text-sub, #aaa)" }}>
                {userLanguage === "Hindi" ? "सूर्योदय व महाकाल आरती के अनुसार स्वतः परिवर्तन" : "Auto-switches with Ujjain's sacred solar & temple hours"}
              </div>
            </div>
          </div>
          <div
            style={{
              width: 38,
              height: 20,
              borderRadius: 20,
              background: isAuto ? "#FF9933" : "var(--border-subtle, #555)",
              position: "relative",
              transition: "background 0.2s ease",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#fff",
                position: "absolute",
                top: 2,
                left: isAuto ? 20 : 2,
                transition: "left 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Header Pill Variant (Accessible on all screens with smooth sliding down)
  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block", zIndex: 90 }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(0, 0, 0, 0.35)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          borderRadius: 20,
          padding: "5px 11px",
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          transition: "all 0.15s ease",
        }}
        title="Switch Visual Theme"
      >
        <span style={{ fontSize: 13 }}>{themeConfig.icon}</span>
        <span style={{ maxWidth: 94, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {isAuto ? "⌛ काल चक्र" : (userLanguage === "Hindi" ? themeConfig.labelHi : themeConfig.label)}
        </span>
        <span
          style={{
            fontSize: 9,
            opacity: 0.8,
            display: "inline-block",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>

      {/* Dimmed Backdrop to prevent miss-clicks and ensure smooth outside-tap dismissal */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 85,
            background: "rgba(0, 0, 0, 0.4)",
            animation: "fadeInBackdrop 0.15s ease-out forwards",
          }}
        />
      )}

      {/* Dropdown Popup with Slide-Down Animation */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 236,
            background: "var(--bg-surface, #18181D)",
            border: "1.5px solid var(--border-color, rgba(212,175,55,0.35))",
            borderRadius: 18,
            padding: 8,
            boxShadow: "0 16px 40px rgba(0,0,0,0.65)",
            backdropFilter: "blur(24px)",
            animation: "slideDownTheme 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            zIndex: 95,
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted, #888)", padding: "4px 8px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>
            {userLanguage === "Hindi" ? "थीम चयन (Themes)" : "Sacred Themes"}
          </div>

          {themesList.map((t) => {
            const isSelected = theme === t.id && !isAuto;
            return (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 12,
                  border: "none",
                  background: isSelected ? "var(--bg-elevated, #2A2A36)" : "transparent",
                  color: isSelected ? t.color : "var(--text-main, #F5F5F7)",
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 3,
                  transition: "background 0.15s ease",
                }}
              >
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: isSelected ? 700 : 500 }}>
                    {userLanguage === "Hindi" || userLanguage === "Sanskrit" ? t.nameHi : t.name}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--text-sub, #888)" }}>{t.sub}</div>
                </div>
                {isSelected && <span style={{ color: t.color, fontSize: 14, fontWeight: 700 }}>✓</span>}
              </button>
            );
          })}

          <div style={{ height: 1, background: "var(--border-subtle, #2E2E3C)", margin: "4px 0" }} />

          {/* Kāla Chakra Auto Option */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAuto();
              setIsOpen(false);
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 12,
              border: "none",
              background: isAuto ? "rgba(255,153,51,0.15)" : "transparent",
              color: isAuto ? "#FF9933" : "var(--text-main, #F5F5F7)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 16 }}>⌛</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: isAuto ? 700 : 500 }}>
                {userLanguage === "Hindi" ? "काल चक्र (Auto Engine)" : "Kāla Chakra (Auto Engine)"}
              </div>
              <div style={{ fontSize: 9, color: "var(--text-sub, #888)" }}>
                {userLanguage === "Hindi" ? "समय अनुसार स्वतः परिवर्तन" : "Diurnal solar & temple synchronization"}
              </div>
            </div>
            {isAuto && <span style={{ color: "#FF9933", fontSize: 14, fontWeight: 700 }}>✓</span>}
          </button>
        </div>
      )}
    </div>
  );
}
