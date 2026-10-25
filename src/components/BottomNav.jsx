import { translations } from "../data/translations";

export default function BottomNav({ activeTab, onTabChange, userLanguage }) {
  const t = translations[userLanguage] || translations.English;

  // Culturally authentic iconography system
  const tabs = [
    { id: "home", icon: "🛕", label: t.home },
    { id: "explore", icon: "🔱", label: t.explore },
    { id: "map", icon: "🪔", label: t.map },
    { id: "plan", icon: "📜", label: t.plan },
    { id: "profile", icon: "🕉️", label: t.profile },
  ];

  return (
    <div
      className="w-full flex-shrink-0 border-t transition-colors duration-300 z-50 select-none"
      style={{
        background: "var(--nav-bg, rgba(14, 14, 16, 0.94))",
        borderColor: "var(--nav-border, #2A2A36)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingTop: 8,
        paddingBottom: "max(12px, env(safe-area-inset-bottom, 12px))",
      }}
    >
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto flex justify-around items-center px-4 sm:px-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-1 relative transition-all duration-200 py-1 px-2 sm:px-4"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--nav-active, #FF9933)" : "var(--nav-inactive, #8E8E9A)",
                minWidth: 54,
                transform: isActive ? "translateY(-2px)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  filter: isActive ? "drop-shadow(0 2px 6px rgba(255,153,51,0.5))" : "none",
                  transition: "filter 0.2s ease",
                }}
              >
                {tab.icon}
              </span>
              <span style={{ letterSpacing: 0.2 }}>{tab.label}</span>

              {/* Sacred Active Indicator (Diya flame halo / River ripple) */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: -4,
                    width: 18,
                    height: 3,
                    borderRadius: 3,
                    background: "var(--nav-active, #FF9933)",
                    boxShadow: "0 0 10px var(--nav-active, #FF9933)",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
