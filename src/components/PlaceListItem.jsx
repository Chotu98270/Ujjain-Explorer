import { memo } from "react";
import { tagColorMap, categoryColors } from "../data/tokens";
import { calculateDistance, formatDistance } from "../utils/location";

const PlaceListItem = memo(function PlaceListItem({ place, onClick, userLocation, userLanguage }) {
  const catStyle = categoryColors[place.category] || categoryColors.default;
  const tagStyle = tagColorMap[place.tagColor] || tagColorMap.terracotta;

  const dynamicDistance = userLocation
    ? calculateDistance(userLocation.latitude, userLocation.longitude, place.latitude, place.longitude)
    : null;

  return (
    <div
      onClick={() => onClick(place)}
      className="flex gap-3 p-3 rounded-xl sm:rounded-2xl border border-[var(--border-subtle,#2E2E3C)] bg-[var(--bg-card,#22222B)] hover:bg-[var(--bg-elevated,#2A2A36)] hover:border-[var(--border-color,rgba(212,175,55,0.3))] transition-all cursor-pointer"
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          flexShrink: 0,
          background: place.bgColor || "var(--bg-elevated, #2A2A36)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        }}
      >
        {place.image ? (
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallbackSpan = e.currentTarget.nextElementSibling;
              if (fallbackSpan) fallbackSpan.style.display = "flex";
            }}
          />
        ) : null}
        <span
          style={{
            display: place.image ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {place.emoji || "📍"}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-main, #F5F5F7)" }}>
          {["Hindi", "Marathi", "Sanskrit", "Gujarati"].includes(userLanguage) && place.name_mr ? place.name_mr : place.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-sub, #A1A1AF)",
            marginTop: 2,
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {(userLanguage === "Marathi" || userLanguage === "Hindi") && place.description_mr ? place.description_mr : place.description}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: "var(--accent-secondary, #D4AF37)" }}>
            ⭐ {place.rating?.toFixed(1) || "4.8"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted, #888)",
              padding: "2px 7px",
              background: "var(--bg-elevated, #2A2A36)",
              borderRadius: 8,
            }}
          >
            {formatDistance(dynamicDistance)}
          </div>
          {(place.tag === "Open Now" || 
            (userLanguage === "Marathi" && place.tag === "उघडले आहे") || 
            (userLanguage === "Hindi" && place.tag === "खुला है") || 
            (userLanguage === "Gujarati" && place.tag === "ખુલ્લું છે")) && (
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 7px",
                background: tagStyle.bg,
                color: tagStyle.color,
                borderRadius: 8,
              }}
            >
              {userLanguage === "Marathi" ? "उघडले आहे" :
               userLanguage === "Hindi" ? "खुला है" :
               userLanguage === "Gujarati" ? "ખુલ્લું છે" :
               "Open now"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default PlaceListItem;
