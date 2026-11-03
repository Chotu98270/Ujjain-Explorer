import ThemeSwitcher from "./ThemeSwitcher";

export default function AppHeader({
  onOpenSettings,
  userLanguage,
  weatherData,
  onWeatherToggle,
  onNavigateHome
}) {
  const isHindi = userLanguage === "Hindi" || userLanguage === "Sanskrit";

  return (
    <header
      className="w-full border-b select-none transition-colors duration-300 z-40 flex-shrink-0"
      style={{
        background: "rgba(14, 14, 16, 0.95)",
        borderColor: "rgba(255, 153, 51, 0.2)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 h-13 flex items-center justify-between py-2">
        {/* Brand Logo & Name */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF9933] to-[#D4AF37] p-0.5 flex items-center justify-center shadow-sm shadow-[#FF9933]/30">
            <span className="text-base">🕉️</span>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-[#F5F5F7] tracking-tight flex items-center gap-1 group-hover:text-[#FF9933] transition-colors">
              <span>{isHindi ? "अवन्तिका दर्शन" : "Ujjain Explorer"}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FF9933]/20 text-[#FF9933] font-mono font-bold">12 Jyotirlinga</span>
            </div>
            <div className="text-[9px] text-[#A1A1AF] hidden sm:block">
              {isHindi ? "महाकाल नगरी उज्जैन यात्रा मार्गदर्शिका" : "Sacred Pilgrimage & City Guide"}
            </div>
          </div>
        </div>

        {/* Right Actions: Weather Pill, Theme Switcher & ⋮ Three-Dot Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Weather Pill */}
          {weatherData && (
            <button
              onClick={onWeatherToggle}
              className="flex items-center gap-1 py-1 px-2.5 rounded-xl bg-[#1E1E26] border border-[#2E2E3C] text-[11px] font-bold text-[#F5F5F7] hover:border-[#FF9933] transition-colors"
              title="Click to toggle simulated weather"
            >
              <span>{weatherData.weather === "Rainy" ? "🌧️" : "☀️"}</span>
              <span>{weatherData.temp || 32}°C</span>
            </button>
          )}

          {/* Theme Switcher */}
          <div className="hidden sm:block">
            <ThemeSwitcher variant="header" userLanguage={userLanguage} />
          </div>

          {/* ⋮ Three-Dot Menu Button (Single Unified Entry for Language, Profile & Settings) */}
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-[#2A180E] to-[#1E1E26] border border-[#FF9933]/50 hover:border-[#FF9933] text-[#FF9933] flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm shadow-[#FF9933]/20"
            title="Open Menu: Languages, Profile & Settings"
          >
            <span className="text-xl font-black leading-none select-none">⋮</span>
          </button>
        </div>
      </div>
    </header>
  );
}
