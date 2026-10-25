import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

export const THEMES = {
  MAHAKAL: "mahakal-mystique",
  SHIPRA: "shipra-dawn",
  KUMBH: "kumbh-vibrant",
};

export const THEME_DETAILS = {
  [THEMES.MAHAKAL]: {
    id: THEMES.MAHAKAL,
    label: "Mahakal Mystique",
    labelHi: "महाकाल मिस्टीक",
    tagline: "Spiritual & Royal Dark",
    icon: "🌑",
    badgeIcon: "🔱",
    primaryColor: "#FF9933",
    secondaryColor: "#D4AF37",
    bgColor: "#0E0E10",
    surfaceColor: "#18181D",
    fontHeading: "'Cinzel', serif",
    fontBody: "'Plus Jakarta Sans', 'Inter', sans-serif",
  },
  [THEMES.SHIPRA]: {
    id: THEMES.SHIPRA,
    label: "Shipra Dawn",
    labelHi: "शिप्रा उषाकाल",
    tagline: "Serene & Traditional Light",
    icon: "🌅",
    badgeIcon: "🪔",
    primaryColor: "#1B4F72",
    secondaryColor: "#E67E22",
    bgColor: "#FAF9F6",
    surfaceColor: "#FFFFFF",
    fontHeading: "'Cormorant Garamond', serif",
    fontBody: "'Work Sans', 'Inter', sans-serif",
  },
  [THEMES.KUMBH]: {
    id: THEMES.KUMBH,
    label: "Kumbh Vibrant",
    labelHi: "कुम्भ महोत्सव",
    tagline: "Festive & Modern Mela",
    icon: "🎪",
    badgeIcon: "🚩",
    primaryColor: "#5B2C6F",
    secondaryColor: "#E91E63",
    bgColor: "#FFFFFF",
    surfaceColor: "#F8F9FA",
    fontHeading: "'Space Grotesk', sans-serif",
    fontBody: "'DM Sans', 'Inter', sans-serif",
  },
};

export function getKalaChakraTheme() {
  const currentHour = new Date().getHours();
  if (currentHour >= 4 && currentHour < 12) {
    return THEMES.SHIPRA; // 4am - 12pm: Morning Shipra Dawn
  } else if (currentHour >= 12 && currentHour < 18) {
    return THEMES.KUMBH;  // 12pm - 6pm: Midday Kumbh Vibrant
  } else {
    return THEMES.MAHAKAL; // 6pm - 4am: Sandhya & Midnight Mahakal Mystique
  }
}

const ThemeContext = createContext({
  theme: THEMES.MAHAKAL,
  isAuto: false,
  setTheme: () => {},
  toggleAuto: () => {},
  themeConfig: THEME_DETAILS[THEMES.MAHAKAL],
});

export function ThemeProvider({ children }) {
  // Pinned to Mahakal Mystique as signature flagship look by default
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("ujjain_theme") || THEMES.MAHAKAL;
  });

  const [isAuto, setIsAutoState] = useState(() => {
    return localStorage.getItem("ujjain_theme_auto") === "true";
  });

  // Calculate and sync auto theme
  const updateAutoTheme = useCallback(() => {
    if (isAuto) {
      const calculated = getKalaChakraTheme();
      setThemeState(calculated);
    }
  }, [isAuto]);

  useEffect(() => {
    if (isAuto) {
      updateAutoTheme();
      const interval = setInterval(updateAutoTheme, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [isAuto, updateAutoTheme]);

  // Synchronize CSS attributes on root document and meta theme-color
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ujjain_theme", theme);
    localStorage.setItem("ujjain_theme_auto", isAuto ? "true" : "false");

    // Dynamic browser header bar color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === THEMES.MAHAKAL ? "#0E0E10" : (theme === THEMES.SHIPRA ? "#1B4F72" : "#5B2C6F"));
    }
  }, [theme, isAuto]);

  const setTheme = useCallback((newTheme) => {
    if (THEME_DETAILS[newTheme]) {
      setIsAutoState(false);
      setThemeState(newTheme);
    }
  }, []);

  const toggleAuto = useCallback(() => {
    setIsAutoState((prev) => {
      const next = !prev;
      if (next) {
        setThemeState(getKalaChakraTheme());
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    theme,
    isAuto,
    setTheme,
    toggleAuto,
    themeConfig: THEME_DETAILS[theme] || THEME_DETAILS[THEMES.MAHAKAL],
  }), [theme, isAuto, setTheme, toggleAuto]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
