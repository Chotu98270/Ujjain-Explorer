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
      className="absolute bottom-0 left-0 right-0 flex justify-around items-center border-t transition-colors duration-300"
      style={{
        background: "var(--nav-bg, rgba(14, 14, 16, 0.94))",
        borderColor: "var(--nav-border, #2A2A36)",
        backdropFilter: "blur(20px)",
        paddingTop: 10,
        paddingBottom: 16,
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 relative transition-all duration-200"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 10,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--nav-active, #FF9933)" : "var(--nav-inactive, #8E8E9A)",
              minWidth: 52,
              transform: isActive ? "translateY(-2px)" : "none",
            }}
          >
            <span
              style={{
                fontSize: 21,
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
                  bottom: -6,
                  width: 16,
                  height: 3,
                  borderRadius: 3,
                  background: "var(--nav-active, #FF9933)",
                  boxShadow: "0 0 8px var(--nav-active, #FF9933)",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
